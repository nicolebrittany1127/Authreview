// POST /api/get-document-url
// Body: { path }
//
// Auth: per-user Supabase login (see api/_auth.js). Beyond checking that
// the caller is signed in, this confirms the requested file actually
// belongs to a record they're allowed to see — otherwise a biller could
// pull another biller's documents by supplying a path directly.
//
// Returns a short-lived signed URL for a file in the intake-documents
// bucket. Uses the SERVICE ROLE key (server-side only) so the bucket
// itself stays locked down to anon INSERT-only — this is the one place
// documents become readable.

const { admin, requireUser, canAccessRecord } = require('./_auth');

const BUCKET = 'intake-documents';
const EXPIRES_IN_SECONDS = 60 * 10; // 10 minutes — long enough to view/download, short-lived by design

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await requireUser(req, res);
  if (!user) return;

  const { path } = req.body || {};
  if (!path) {
    return res.status(400).json({ error: 'Missing path' });
  }

  // Find the record this document belongs to. A path can appear as the
  // attestation, the ASAM, or one of the additional documents.
  const { data: matches, error: lookupErr } = await admin
    .from('authorizations')
    .select('id, assigned_biller_id, attestation_doc_url, asam_doc_url, additional_docs_urls')
    .or(`attestation_doc_url.eq.${path},asam_doc_url.eq.${path}`);

  if (lookupErr) {
    console.error('get-document-url lookup error:', lookupErr);
    return res.status(500).json({ error: 'Could not verify document access.' });
  }

  let record = matches && matches[0];

  // Not a primary document — check the additional_docs_urls arrays.
  if (!record) {
    const { data: all, error: allErr } = await admin
      .from('authorizations')
      .select('id, assigned_biller_id, additional_docs_urls')
      .contains('additional_docs_urls', [path]);

    if (allErr) {
      console.error('get-document-url array lookup error:', allErr);
      return res.status(500).json({ error: 'Could not verify document access.' });
    }
    record = all && all[0];
  }

  if (!record) {
    return res.status(404).json({ error: 'Document not found.' });
  }

  if (!canAccessRecord(user, record)) {
    return res.status(403).json({
      error: 'This document belongs to a record assigned to another biller.',
    });
  }

  const { data, error } = await admin
    .storage
    .from(BUCKET)
    .createSignedUrl(path, EXPIRES_IN_SECONDS);

  if (error) {
    console.error('get-document-url error:', error);
    return res.status(500).json({ error: 'Could not generate document link.' });
  }

  return res.status(200).json({ url: data.signedUrl });
};
