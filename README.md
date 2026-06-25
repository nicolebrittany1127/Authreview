# AUTH.REVIEW — Prior Authorization Review Platform

AI-powered clinical documentation reviewer for behavioral health prior authorizations.
Analyzes notes against ASAM criteria across 14 payers and 10 levels of care.

---

## What's in this project

```
authreview/
├── api/
│   └── analyze.js        ← Secure backend (hides your API key)
├── public/
│   └── index.html        ← Full frontend application
├── vercel.json           ← Vercel deployment config
├── package.json          ← Project metadata
└── README.md
```

---

## Deploy to Vercel (step-by-step)

### Step 1 — Get your Anthropic API key
1. Go to https://console.anthropic.com
2. Sign in or create an account
3. Click **API Keys** in the left sidebar
4. Click **Create Key**, give it a name like "authreview-prod"
5. **Copy the key** — it starts with `sk-ant-...`
6. Store it somewhere safe (you'll need it in Step 4)

---

### Step 2 — Create a GitHub account and upload this project
1. Go to https://github.com and create a free account
2. Click the **+** icon → **New repository**
3. Name it `authreview`, set to **Private**, click **Create repository**
4. On the next screen, click **uploading an existing file**
5. Upload ALL the files from this folder (keeping the folder structure):
   - `api/analyze.js`
   - `public/index.html`
   - `vercel.json`
   - `package.json`
   - `.gitignore`
6. Click **Commit changes**

---

### Step 3 — Connect to Vercel
1. Go to https://vercel.com and sign up with your GitHub account
2. Click **Add New → Project**
3. Find your `authreview` repository and click **Import**
4. Leave all settings as default — Vercel will auto-detect the configuration
5. **Do NOT click Deploy yet** — go to Step 4 first

---

### Step 4 — Add your API key (CRITICAL — do this before deploying)
1. On the Vercel import screen, expand **Environment Variables**
2. Add the following:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your API key from Step 1 (the `sk-ant-...` key)
3. Click **Add**
4. Now click **Deploy**

Vercel will build and deploy your app. In about 60 seconds you'll get a live URL
like `https://authreview-yourname.vercel.app`

---

### Step 5 — Test your deployment
1. Open your Vercel URL
2. Click **Load sample note** in Single Review mode
3. Make sure Sunshine Health + PHP are selected
4. Click **Analyze for authorization**
5. You should see results in 10–20 seconds

---

## Making updates later

When you want to update the app:
1. Edit the files locally
2. Go to your GitHub repository
3. Click on the file you want to update → click the pencil icon to edit
4. Paste the updated code and click **Commit changes**
5. Vercel will automatically redeploy within 30 seconds

---

## Costs

- **Vercel hosting:** Free (Hobby plan covers beta usage)
- **Anthropic API:** Pay per use
  - Each single analysis ≈ $0.003–0.008 (fraction of a cent)
  - Each batch of 8 documents ≈ $0.02–0.06
  - 1,000 analyses/month ≈ $3–8

---

## Important notes for beta

### This version is suitable for:
- Internal team testing and validation
- Demo use with de-identified/sample documents
- Feedback gathering from clinical staff

### Before using with real patient data:
- Obtain a Business Associate Agreement (BAA) with Anthropic
  → https://www.anthropic.com/contact/baa
- Add user authentication (contact a developer)
- Enable audit logging
- Complete a HIPAA risk assessment

### Adding password protection (quick beta option)
To add a simple password to your beta before full auth is built,
add this to the top of `public/index.html` inside the `<script>` tag:

```javascript
const BETA_PASSWORD = 'your-password-here';
if (localStorage.getItem('auth') !== BETA_PASSWORD) {
  const pw = prompt('Enter beta access password:');
  if (pw !== BETA_PASSWORD) { document.body.innerHTML = 'Access denied.'; }
  else { localStorage.setItem('auth', pw); }
}
```

---

## Support

If something isn't working:
1. Check Vercel logs: go to your project → **Deployments** → click the latest → **Functions** tab
2. Make sure `ANTHROPIC_API_KEY` is set correctly in Vercel Environment Variables
3. Make sure you have sufficient API credits at console.anthropic.com
