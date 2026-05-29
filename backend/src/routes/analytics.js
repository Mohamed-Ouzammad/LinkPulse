const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const { requireAuth } = require('../middleware/auth');

// POST /api/analytics/click/:linkId — enregistrer un clic (public)
router.post('/click/:linkId', async (req, res) => {
  const { linkId } = req.params;
  const source = req.query.source || 'direct';

  // Récupérer le user_id du lien
  const { data: link } = await supabase
    .from('links')
    .select('user_id')
    .eq('id', linkId)
    .single();

  if (!link) return res.status(404).json({ error: 'Lien introuvable' });

  await supabase.from('clicks').insert({
    link_id: linkId,
    user_id: link.user_id,
    source,
  });

  res.json({ message: 'Clic enregistré' });
});

// GET /api/analytics/stats — stats globales de l'user connecté
router.get('/stats', requireAuth, async (req, res) => {
  const userId = req.user.id;

  // Total clics
  const { count: totalClicks } = await supabase
    .from('clicks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Clics des 7 derniers jours
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const { data: recentClicks } = await supabase
    .from('clicks')
    .select('clicked_at, source')
    .eq('user_id', userId)
    .gte('clicked_at', since.toISOString());

  // Clics par jour
  const byDay = {};
  (recentClicks || []).forEach((c) => {
    const day = c.clicked_at.slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  });

  // Clics par source
  const bySource = {};
  (recentClicks || []).forEach((c) => {
    bySource[c.source] = (bySource[c.source] || 0) + 1;
  });

  // Clics par lien
  const { data: links } = await supabase
    .from('links')
    .select('id, title, emoji, url')
    .eq('user_id', userId);

  const linkStats = await Promise.all(
    (links || []).map(async (link) => {
      const { count } = await supabase
        .from('clicks')
        .select('*', { count: 'exact', head: true })
        .eq('link_id', link.id);
      return { ...link, clicks: count || 0 };
    })
  );

  linkStats.sort((a, b) => b.clicks - a.clicks);

  res.json({
    totalClicks: totalClicks || 0,
    byDay,
    bySource,
    linkStats,
  });
});

module.exports = router;
