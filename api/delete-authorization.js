// DELETE /api/delete-authorization
// Body: { id }
// Permanently removes a record from the database. This does NOT delete the
// underlying files in Supabase Storage (attestation/ASAM/additional docs) —
// those remain in the intake-documents bucket. Irreversible on the DB row;
// the dashboard should confirm with the user before calling this.

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers['x-access-token'];
  if (!process.env.DASHBOARD_ACCESS_TOKEN || token !== process.env.DASHBOARD_ACCESS_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.body || {};
  if (!id) {
    return res.status(400).json({ error: 'Missing record id' });
  }

  const { error } = await supabase
    .from('authorizations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('delete-authorization error:', error);
    return res.status(500).json({ error: 'Could not delete record.' });
  }

  return res.status(200).json({ ok: true });
};
