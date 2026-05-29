const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const { requireAuth } = require('../middleware/auth');

// GET /api/profile/me — profil de l'utilisateur connecté
router.get('/me', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(404).json({ error: 'Profil introuvable' });
  res.json(data);
});

// GET /api/profile/:username — page publique (pas d'auth)
router.get('/:username', async (req, res) => {
  const { username } = req.params;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !profile) return res.status(404).json({ error: 'Profil introuvable' });

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('active', true)
    .order('position', { ascending: true });

  res.json({ profile, links: links || [] });
});

// PUT /api/profile/me — mettre à jour son profil
router.put('/me', requireAuth, async (req, res) => {
  const { full_name, bio, avatar_color } = req.body;

  const { data, error } = await supabase
    .from('profiles')
    .update({ full_name, bio, avatar_color })
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
