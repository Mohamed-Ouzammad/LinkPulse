const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, username, full_name } = req.body;

  if (!email || !password || !username || !full_name) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  // Vérifier que le username est disponible
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (existing) {
    return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà pris' });
  }

  // Créer le compte Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) return res.status(400).json({ error: authError.message });

  // Créer le profil
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    username,
    full_name,
    bio: '',
    avatar_color: '#6C5CE7',
  });

  if (profileError) return res.status(500).json({ error: profileError.message });

  res.status(201).json({ message: 'Compte créé avec succès' });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

  res.json({
    access_token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  });
});

module.exports = router;
