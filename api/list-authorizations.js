// GET /api/list-authorizations
// Returns all authorization records for the biller dashboard.
// Protected by a shared access token (see README) — swap for real
// per-user auth later if this grows beyond one billing team.

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers['x-access-token'];
  if (!process.env.DASHBOARD_ACCESS_TOKEN || token !== process.env.DASHBOARD_ACCESS_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { data, error } = await supabase
    .from('authorizations')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('list-authorizations error:', error);
    return res.status(500).json({ error: 'Could not load records.' });
  }

  return res.status(200).json({ records: data });
};
