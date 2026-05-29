-- LinkPulse — Schéma Supabase
-- À exécuter dans l'éditeur SQL de votre projet Supabase

-- Table des profils utilisateur
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text,
  bio text,
  avatar_color text default '#6C5CE7',
  created_at timestamp with time zone default now()
);

-- Table des liens
create table links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  url text not null,
  emoji text default '🔗',
  position integer default 0,
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- Table des clics (analytics)
create table clicks (
  id uuid default gen_random_uuid() primary key,
  link_id uuid references links(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  clicked_at timestamp with time zone default now(),
  source text default 'direct'
);

-- Index pour les performances
create index on links(user_id);
create index on clicks(link_id);
create index on clicks(user_id);
create index on clicks(clicked_at);

-- RLS (Row Level Security)
alter table profiles enable row level security;
alter table links enable row level security;
alter table clicks enable row level security;

-- Politiques : chaque user voit/modifie seulement ses données
create policy "Profil visible par tous" on profiles for select using (true);
create policy "Profil modifiable par son propriétaire" on profiles for update using (auth.uid() = id);

create policy "Liens visibles par tous" on links for select using (true);
create policy "Liens créés par le propriétaire" on links for insert with check (auth.uid() = user_id);
create policy "Liens modifiables par le propriétaire" on links for update using (auth.uid() = user_id);
create policy "Liens supprimables par le propriétaire" on links for delete using (auth.uid() = user_id);

create policy "Clics insérables par tous" on clicks for insert with check (true);
create policy "Clics visibles par le propriétaire" on clicks for select using (auth.uid() = user_id);
