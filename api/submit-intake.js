// POST /api/submit-intake
// Receives the facility intake form payload and inserts a new "new" status
// record. Uses the Supabase SERVICE ROLE key (server-side only) so the
// table itself can stay locked down to anon access entirely.

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const REQUIRED_FIELDS = [
  'review_type',
  'first_name',
  'last_name',
  'date_of_birth',
  'member_id',
  'facility_name',
  'admission_date',
  'level_of_care',
  'payer',
  'primary_insurance',
  'attestation_doc_url',
  'asam_doc_url',
];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};

  const missing = REQUIRED_FIELDS.filter((f) => !body[f]);
  if (missing.length) {
    return res.status(400).json({ error: `Missing required field(s): ${missing.join(', ')}` });
  }

  const { data, error } = await supabase
    .from('authorizations')
    .insert([
      {
        review_type: body.review_type,
        first_name: body.first_name,
        last_name: body.last_name,
        date_of_birth: body.date_of_birth,
        member_id: body.member_id,
        facility_name: body.facility_name,
        admission_date: body.admission_date,
        level_of_care: body.level_of_care,
        payer: body.payer,
        primary_insurance: body.primary_insurance,
        secondary_insurance: body.secondary_insurance || null,
        facility_notes: body.facility_notes || null,
        attestation_doc_url: body.attestation_doc_url,
        asam_doc_url: body.asam_doc_url,
        additional_docs_urls: Array.isArray(body.additional_docs_urls) && body.additional_docs_urls.length
          ? body.additional_docs_urls
          : null,
        status: 'new',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('submit-intake insert error:', error);
    return res.status(500).json({ error: 'Could not save intake. Please try again.' });
  }

  // Notify the billing team that a new intake has landed.
  // Swap in your preferred email provider (Resend, Postmark, etc.) here.
  try {
    await notifyBillingTeam(data);
  } catch (notifyErr) {
    // Don't fail the submission if the notification fails — the record
    // is already saved and will show up in the New Intakes queue regardless.
    console.error('notifyBillingTeam failed:', notifyErr);
  }

  return res.status(200).json({ ok: true, id: data.id });
};

async function notifyBillingTeam(record) {
  if (!process.env.RESEND_API_KEY || !process.env.BILLING_TEAM_EMAIL) return;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM_EMAIL || 'notifications@yourdomain.com',
      to: process.env.BILLING_TEAM_EMAIL,
      subject: `New intake: ${record.first_name} ${record.last_name} (${record.facility_name})`,
      text:
        `A new admission intake has been submitted.\n\n` +
        `Client: ${record.first_name} ${record.last_name}\n` +
        `Facility: ${record.facility_name}\n` +
        `Admission date: ${record.admission_date}\n` +
        `Level of care: ${record.level_of_care}\n` +
        `Payer: ${record.payer}\n\n` +
        `Open the dashboard to review and assign a biller.`,
    }),
  });
}
