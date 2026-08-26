// POST /api/upload-intake-doc
// Uploads one intake document to Supabase Storage using the SERVICE ROLE
// key (server-side only). This is the only thing that ever writes to the
// intake-documents bucket now — the browser never talks to Supabase
// Storage directly, so this upload no longer depends on any anon RLS
// policy on storage.objects or storage.buckets. That entire class of bug
// (missing/misconfigured anon policy, "Bucket not found", propagation
// delays) is now structurally impossible for uploads, the same way
// submit-intake.js already made it impossible for the database insert.
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = 'intake-documents';
const ALLOWED_FOLDERS = ['attestation', 'asam', 'additional'];
// Conservative cap: Vercel serverless functions have a request body limit
// around 4.5MB, and base64 inflates file size by ~33%. Staying under ~3MB
// of actual file data keeps the base64 payload safely under that ceiling.
// Most attestation/ASAM PDFs are small text-based forms well under this.
// A large multi-page scanned chart could exceed it — if that becomes a
// real problem, the next step up is a signed direct-upload URL instead.
const MAX_BYTES = 3 * 1024 * 1024;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename, contentType, base64Data, folder } = req.body || {};

  if (!filename || !base64Data || !folder) {
    return res.status(400).json({ error: 'Missing filename, folder, or file data.' });
  }

  if (!ALLOWED_FOLDERS.includes(folder)) {
    return res.status(400).json({ error: 'Invalid folder.' });
  }

  let buffer;
  try {
    buffer = Buffer.from(base64Data, 'base64');
  } catch (e) {
    return res.status(400).json({ error: 'Could not decode file data.' });
  }

  if (buffer.length > MAX_BYTES) {
    return res.status(413).json({ error: 'File is too large (3MB limit per file).' });
  }

  // Strip anything that isn't safe in a storage path.
  const safeName = filename.replace(/[^a-zA-Z0-9.\-_ ]/g, '_');
  const path = `${folder}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: contentType || 'application/octet-stream',
    });

  if (error) {
    console.error('upload-intake-doc error:', error);
    return res.status(500).json({ error: 'Could not upload file. Please try again.' });
  }

  return res.status(200).json({ ok: true, path });
};
