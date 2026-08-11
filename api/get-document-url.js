// POST /api/get-document-url
// Body: { path }
// Returns a short-lived signed URL for a file in the intake-documents bucket.
// Uses the Supabase SERVICE ROLE key (server-side only) so the bucket itself
// can stay locked down to anon INSERT-only — this is the one place documents
// become readable, and only for people with a valid dashboard access token.

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = 'intake-documents';
const EXPIRES_IN_SECONDS = 60 * 10; // 10 minutes — long enough to view/download, short-lived by design

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers['x-access-token'];
  if (!process.env.DASHBOARD_ACCESS_TOKEN || token !== process.env.DASHBOARD_ACCESS_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { path } = req.body || {};
  if (!path) {
    return res.status(400).json({ error: 'Missing path' });
  }

  const { data, error } = await supabase
    .storage
    .from(BUCKET)
    .createSignedUrl(path, EXPIRES_IN_SECONDS);

  if (error) {
    console.error('get-document-url error:', error);
    return res.status(500).json({ error: 'Could not generate document link.' });
  }

  return res.status(200).json({ url: data.signedUrl });
};
