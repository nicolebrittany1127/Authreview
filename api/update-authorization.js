// GET /api/list-authorizations
// Returns the authorization records this user is allowed to see, plus who
// they are so the dashboard can render the right controls.
//
// Auth: per-user Supabase login (see api/_auth.js). Admins see every
// record; billers see the ones assigned to them plus anything unclaimed,
// so they can still pick up new intakes from the queue.

const { admin, requireUser } = require('./_auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await requireUser(req, res);
  if (!user) return;

  const { data, error } = await admin
    .from('authorizations')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('list-authorizations error:', error);
    return res.status(500).json({ error: 'Could not load records.' });
  }

  const records = user.role === 'admin'
    ? data
    : data.filter(r => !r.assigned_biller_id || r.assigned_biller_id === user.id);

  return res.status(200).json({
    records,
    user: { id: user.id, name: user.name, role: user.role },
  });
};
