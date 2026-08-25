// api/_auth.js
// Shared auth helpers for every API route.
//
// Verifies the Supabase session token sent from the dashboard, looks up the
// caller's profile (role + active flag), and exposes a service-role Supabase
// client ("admin") for routes to query with — RLS is bypassed at this layer
// on purpose, so every route MUST use requireUser/requireAdmin and, where a
// specific record is involved, canAccessRecord() to enforce who can see or
// touch what.

const { createClient } = require('@supabase/supabase-js');

const admin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Pulls the bearer token off the request, verifies it with Supabase Auth,
// and loads the caller's profile row. On any failure this sends the error
// response itself and returns null, so route handlers can just:
//   const user = await requireUser(req, res);
//   if (!user) return;
async function requireUser(req, res) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Not signed in.' });
    return null;
  }

  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData?.user) {
    res.status(401).json({ error: 'Session expired. Please log in again.' });
    return null;
  }

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('id, full_name, role, active')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    res.status(403).json({ error: 'No profile found for this account.' });
    return null;
  }

  if (!profile.active) {
    res.status(403).json({ error: 'This account has been deactivated.' });
    return null;
  }

  return { id: profile.id, name: profile.full_name, role: profile.role };
}

// Same as requireUser, but also requires the admin role. Sends its own
// 403 and returns null if the caller is signed in but not an admin.
async function requireAdmin(req, res) {
  const user = await requireUser(req, res);
  if (!user) return null;

  if (user.role !== 'admin') {
    res.status(403).json({ error: 'Admins only.' });
    return null;
  }

  return user;
}

// Row-level scoping for a single record: admins can touch anything;
// billers can only touch records assigned to them or still unclaimed.
function canAccessRecord(user, record) {
  if (user.role === 'admin') return true;
  return !record.assigned_biller_id || record.assigned_biller_id === user.id;
}

module.exports = { admin, requireUser, requireAdmin, canAccessRecord };
