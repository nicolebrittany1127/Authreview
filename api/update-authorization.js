// PATCH /api/update-authorization
// Body: { id, ...fields to update }
//
// Auth: per-user Supabase login (see api/_auth.js). A biller may edit
// records assigned to them or still unclaimed; an admin may edit any
// record. Only admins can reassign a record to a different person.
//
// Enforces the same workflow gates regardless of what the client sends:
// Approved requires auth number + start/end dates, Denied requires a
// denial reason. These are now checked against the row in the database
// rather than a value the browser passed in.

const { admin, requireUser, canAccessRecord } = require('./_auth');

const EDITABLE_FIELDS = [
  'status',
  'assigned_biller',
  'assigned_biller_id',
  'payer_contact_date',
  'auth_number',
  'auth_start_date',
  'auth_end_date',
  'units_authorized',
  'denial_reason',
  'internal_notes',
  'discharged_at',
  'discharge_reason',
];

module.exports = async (req, res) => {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await requireUser(req, res);
  if (!user) return;

  const { id, ...updates } = req.body || {};
  if (!id) {
    return res.status(400).json({ error: 'Missing record id' });
  }

  // Load the current row: needed both for the access check and for
  // validating status changes against real stored values.
  const { data: existing, error: loadErr } = await admin
    .from('authorizations')
    .select('*')
    .eq('id', id)
    .single();

  if (loadErr || !existing) {
    return res.status(404).json({ error: 'Record not found.' });
  }

  if (!canAccessRecord(user, existing)) {
    return res.status(403).json({
      error: 'This record is assigned to another biller.',
    });
  }

  const patch = {};
  for (const field of EDITABLE_FIELDS) {
    if (updates[field] !== undefined) patch[field] = updates[field];
  }

  // Reassignment rules: only an admin can hand a record to someone else.
  // A biller may claim an unclaimed record for themselves, and nothing more.
  if (user.role !== 'admin') {
    delete patch.assigned_biller;
    if (patch.assigned_biller_id !== undefined) {
      const claimingSelf =
        patch.assigned_biller_id === user.id && !existing.assigned_biller_id;
      if (claimingSelf) {
        patch.assigned_biller = user.name;
      } else {
        delete patch.assigned_biller_id;
      }
    }
  }

  if (!Object.keys(patch).length) {
    return res.status(400).json({ error: 'Nothing to update.' });
  }

  // Workflow gates — validated against the stored row, not client input.
  const effective = (field) =>
    patch[field] !== undefined ? patch[field] : existing[field];

  if (patch.status === 'approved') {
    const needed = ['auth_number', 'auth_start_date', 'auth_end_date'];
    const missing = needed.filter((f) => !effective(f));
    if (missing.length) {
      return res.status(400).json({
        error: `Cannot mark Approved without: ${missing.join(', ')}`,
      });
    }
  }

  if (patch.status === 'denied' && !effective('denial_reason')) {
    return res.status(400).json({
      error: 'Denial reason is required to mark a record Denied.',
    });
  }

  const { data, error } = await admin
    .from('authorizations')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('update-authorization error:', error);
    return res.status(500).json({ error: 'Could not save changes.' });
  }

  return res.status(200).json({ ok: true, record: data });
};
