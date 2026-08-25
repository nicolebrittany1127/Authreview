// DELETE /api/delete-authorization
// Body: { id }
//
// Auth: admin only (see api/_auth.js). Billers cannot permanently delete
// records — they discharge them instead, which keeps the history.
//
// Permanently removes a record from the database. This does NOT delete the
// underlying files in Supabase Storage (attestation/ASAM/additional docs) —
// those remain in the intake-documents bucket. Irreversible on the DB row;
// the dashboard confirms with the user before calling this.

const { admin, requireAdmin } = require('./_auth');

module.exports = async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await requireAdmin(req, res);
  if (!user) return;

  const { id } = req.body || {};
  if (!id) {
    return res.status(400).json({ error: 'Missing record id' });
  }

  // Read the row before deleting so the log records what was removed.
  const { data: existing } = await admin
    .from('authorizations')
    .select('id, first_name, last_name, facility_name, payer, status')
    .eq('id', id)
    .single();

  const { error } = await admin
    .from('authorizations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('delete-authorization error:', error);
    return res.status(500).json({ error: 'Could not delete record.' });
  }

  // Permanent deletion of a patient record is worth a durable trail.
  // Logged to the server console at minimum; extend this to write an
  // audit_log row once that table's schema is settled.
  console.log('AUDIT record_deleted', JSON.stringify({
    deleted_by: user.email,
    deleted_by_id: user.id,
    at: new Date().toISOString(),
    record: existing || { id },
  }));

  return res.status(200).json({ ok: true });
};
