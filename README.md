# YPIT AF Referral Leaderboard

## Deploy to Vercel in 5 steps

### Step 1 — Run the Supabase SQL
Go to your Supabase project → SQL Editor → run this:

```sql
create table referrals (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  submitter text not null,
  created_at timestamp with time zone default now()
);
```

### Step 2 — Push to GitHub
Create a new GitHub repo and push this entire folder to it.

```bash
git init
git add .
git commit -m "YPIT AF Leaderboard"
git remote add origin https://github.com/YOUR_USERNAME/ypit-leaderboard.git
git push -u origin main
```

### Step 3 — Deploy on Vercel
- Go to vercel.com → New Project → Import your GitHub repo
- Vercel will auto-detect the settings

### Step 4 — Add Environment Variables
In Vercel → your project → Settings → Environment Variables, add:

| Name | Value |
|------|-------|
| SUPABASE_URL | https://derkbuaqaawygwesnpno.supabase.co |
| SUPABASE_SECRET_KEY | (your secret key from Supabase → Settings → API Keys) |

### Step 5 — Redeploy
After adding env vars, go to Deployments → click the three dots on the latest → Redeploy.

Your leaderboard is now live at your Vercel URL. Share it with your community.

---

## How it works
- Users enter a name and submit referral email addresses
- Each unique email = 10 points on the leaderboard
- YPIT team tab shows all submitted emails — downloadable as CSV
- Cross-reference the CSV against actual ticket buyers to verify winners

## Files
- `public/index.html` — the full frontend
- `api/referrals.js` — the backend API route (runs on Vercel serverless)
- `vercel.json` — routing config
- `package.json` — dependencies
