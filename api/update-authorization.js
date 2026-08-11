// PATCH /api/update-authorization
// Body: { id, ...fields to update }
// Enforces the same gates the workflow needs regardless of what the
// client sends: Approved requires auth number + start/end dates,
// Denied requires a denial reason.

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const EDITABLE_FIELDS = [
  'status',
  'assigned_biller',
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

  const token = req.headers['x-access-token'];
  if (!process.env.DASHBOARD_ACCESS_TOKEN || token !== process.env.DASHBOARD_ACCESS_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id, ...updates } = req.body || {};
  if (!id) {
    return res.status(400).json({ error: 'Missing record id' });
  }

  const patch = {};
  for (const field of EDITABLE_FIELDS) {
    if (updates[field] !== undefined) patch[field] = updates[field];
  }

  if (patch.status === 'approved') {
    const needed = ['auth_number', 'auth_start_date', 'auth_end_date'];
    const missing = needed.filter((f) => !(patch[f] || updates.__existing?.[f]));
    if (missing.length) {
      return res.status(400).json({
        error: `Cannot mark Approved without: ${missing.join(', ')}`,
      });
    }
  }

  if (patch.status === 'denied' && !patch.denial_reason && !updates.__existing?.denial_reason) {
    return res.status(400).json({ error: 'Denial reason is required to mark a record Denied.' });
  }

  const { data, error } = await supabase
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
