const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const { requireAuth } = require('../middleware/auth');

// GET /api/links — tous les liens de l'user connecté
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', req.user.id)
    .order('position', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/links — créer un lien
router.post('/', requireAuth, async (req, res) => {
  const { title, url, emoji } = req.body;
  if (!title || !url) return res.status(400).json({ error: 'Titre et URL requis' });

  // Compter les liens existants pour attribuer la position
  const { count } = await supabase
    .from('links')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', req.user.id);

  const { data, error } = await supabase
    .from('links')
    .insert({ user_id: req.user.id, title, url, emoji: emoji || '🔗', position: count || 0 })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/links/:id — modifier un lien
router.put('/:id', requireAuth, async (req, res) => {
  const { title, url, emoji, active, position } = req.body;

  const { data, error } = await supabase
    .from('links')
    .update({ title, url, emoji, active, position })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /api/links/:id — supprimer un lien
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Lien supprimé' });
});

module.exports = router;
