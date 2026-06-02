import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

// NOTE: Never hardcode credentials here.
// Add SUPABASE_URL and SUPABASE_SECRET_KEY in Vercel → Settings → Environment Variables

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { emails, submitter } = req.body;

    if (!emails || !submitter || !Array.isArray(emails)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const rows = emails.map(email => ({
      email: email.toLowerCase().trim(),
      submitter: submitter.trim()
    }));

    const { data, error } = await supabase
      .from('referrals')
      .upsert(rows, { onConflict: 'email', ignoreDuplicates: true })
      .select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ added: data ? data.length : 0 });
  }

  if (req.method === 'GET') {
    const { action } = req.query;

    if (action === 'leaderboard') {
      const { data, error } = await supabase
        .from('referrals')
        .select('submitter');

      if (error) return res.status(500).json({ error: error.message });

      const scores = {};
      data.forEach(row => {
        const key = row.submitter.toLowerCase();
        if (!scores[key]) scores[key] = { name: row.submitter, count: 0 };
        scores[key].count++;
      });

      const sorted = Object.values(scores).sort((a, b) => b.count - a.count);
      return res.status(200).json({ leaderboard: sorted });
    }

    if (action === 'all') {
      const { data, error } = await supabase
        .from('referrals')
        .select('email, submitter, created_at')
        .order('created_at', { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ entries: data });
    }

    return res.status(400).json({ error: 'Invalid action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
