# Shortlisted

> Get your resume rewritten, matched to real jobs, and a cover letter — in minutes.

---

## Tech stack

- **Next.js 14** — React framework with built-in API routes
- **Anthropic Claude** — resume rewriting, job matching, cover letter generation
- **Stripe** — payment processing
- **Vercel** — hosting (recommended)

---

## Local setup

### 1. Install Node.js

Download and install from **https://nodejs.org** — choose the "LTS" version.

Verify it worked by opening Terminal (Mac) or Command Prompt (Windows) and typing:
```
node -v
```
You should see something like `v20.11.0`.

---

### 2. Get the project running

Open Terminal, navigate to this folder, and run:

```bash
npm install
```

This installs all dependencies (takes ~30 seconds).

Then start the development server:

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. You should see Shortlisted.

---

### 3. Set up your API keys

Copy the example env file:
```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in your keys:

#### Anthropic API key
1. Go to **https://console.anthropic.com**
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy it into `ANTHROPIC_API_KEY=`

#### Stripe keys
1. Go to **https://dashboard.stripe.com**
2. Sign up / log in
3. In the top bar, make sure you're in **Test mode** (toggle says "Test")
4. Go to **Developers → API Keys**
5. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=`
6. Copy **Secret key** → `STRIPE_SECRET_KEY=`

#### Stripe products
You need to create 3 products in Stripe:

1. Go to **https://dashboard.stripe.com/products**
2. Click **Add product** and create:
   - **Resume Rewrite** — $5 one-time
   - **Build from Scratch** — $10 one-time
   - **Human Review** — $30 one-time
3. After creating each product, click into it and copy the **Price ID** (starts with `price_`)
4. Paste into `.env.local`:
   ```
   STRIPE_PRICE_REWRITE=price_xxx
   STRIPE_PRICE_SCRATCH=price_xxx
   STRIPE_PRICE_HUMAN=price_xxx
   ```

After filling in all keys, restart the dev server:
```bash
# Press Ctrl+C to stop, then:
npm run dev
```

---

### 4. Test payments locally

Stripe payments won't redirect back to your app unless Stripe can reach it. For local testing, use the **Stripe CLI**:

1. Install it: **https://stripe.com/docs/stripe-cli**
2. Log in: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Copy the webhook signing secret it shows you → paste into `STRIPE_WEBHOOK_SECRET=`

When testing payments, use Stripe's test card:
- Card number: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits

---

## Deploying to Vercel (free)

### 1. Push to GitHub

1. Go to **https://github.com/new** and create a new repository called `shortlisted`
2. Follow GitHub's instructions to push your code

### 2. Deploy on Vercel

1. Go to **https://vercel.com** and sign up with your GitHub account
2. Click **Add New Project**
3. Import your `shortlisted` repository
4. Click **Deploy** — Vercel detects Next.js automatically

### 3. Add environment variables on Vercel

1. In your Vercel project, go to **Settings → Environment Variables**
2. Add every variable from your `.env.local` file
3. For `NEXT_PUBLIC_APP_URL`, set it to your Vercel URL (e.g. `https://shortlisted.vercel.app`)
4. Redeploy for the variables to take effect

### 4. Add your webhook in Stripe

Once deployed, tell Stripe where to send payment events:
1. Go to **https://dashboard.stripe.com/webhooks**
2. Click **Add endpoint**
3. URL: `https://your-app.vercel.app/api/stripe/webhook`
4. Select event: `checkout.session.completed`
5. Copy the **Signing secret** → update `STRIPE_WEBHOOK_SECRET` in Vercel env vars

### 5. Add a custom domain (optional)

1. Buy a domain (e.g. shortlisted.com) on Namecheap, GoDaddy, etc.
2. In Vercel: **Settings → Domains → Add**
3. Follow Vercel's DNS instructions

---

## Going live with Stripe

When you're ready to take real payments:
1. In Stripe dashboard, switch from **Test mode** to **Live mode**
2. Create new products in Live mode (same as before)
3. Update your Vercel environment variables with the live keys and price IDs
4. Update the webhook endpoint in Live mode too

---

## Project structure

```
shortlisted/
├── app/
│   ├── layout.js              # HTML shell, metadata
│   ├── page.js                # The full app (your React component)
│   ├── success/
│   │   └── page.js            # Post-payment redirect page
│   └── api/
│       ├── anthropic/
│       │   └── route.js       # Secure Anthropic proxy (key stays server-side)
│       └── stripe/
│           ├── checkout/
│           │   └── route.js   # Creates Stripe checkout sessions
│           └── webhook/
│               └── route.js   # Handles post-payment events
├── .env.local                 # Your secret keys (never commit this)
├── .env.example               # Safe template to commit
├── .gitignore
├── next.config.js
└── package.json
```

---

## Common issues

**Blank white screen?**
Usually a JavaScript error. Open your browser's DevTools (F12 → Console) to see what's wrong.

**Payment not redirecting back?**
Make sure `NEXT_PUBLIC_APP_URL` matches where your app is running exactly (no trailing slash).

**API calls failing?**
Check that `ANTHROPIC_API_KEY` is set correctly in `.env.local` and you've restarted the dev server after changing it.
 
 
