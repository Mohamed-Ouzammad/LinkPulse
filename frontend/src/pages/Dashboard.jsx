import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const THEMES = [
  { color: '#6C5CE7', label: 'Violet' },
  { color: '#E17055', label: 'Corail' },
  { color: '#2D3436', label: 'Sombre' },
  { color: '#00B894', label: 'Vert' },
];

export default function Dashboard() {
  const { token, profile, logout, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('stats');
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState(null);
  const [themeColor, setThemeColor] = useState('#6C5CE7');
  const [newLink, setNewLink] = useState({ title: '', url: '', emoji: '🔗' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [profileEdit, setProfileEdit] = useState({ full_name: '', bio: '', avatar_color: '#6C5CE7' });

  useEffect(() => {
    if (profile) setProfileEdit({ full_name: profile.full_name || '', bio: profile.bio || '', avatar_color: profile.avatar_color || '#6C5CE7' });
  }, [profile]);

  useEffect(() => { loadLinks(); loadStats(); }, []);

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const loadLinks = async () => {
    const res = await fetch(`${API}/api/links`, { headers });
    const data = await res.json();
    setLinks(Array.isArray(data) ? data : []);
  };

  const loadStats = async () => {
    const res = await fetch(`${API}/api/analytics/stats`, { headers });
    const data = await res.json();
    setStats(data);
  };

  const addLink = async () => {
    if (!newLink.title || !newLink.url) return;
    await fetch(`${API}/api/links`, { method: 'POST', headers, body: JSON.stringify(newLink) });
    setNewLink({ title: '', url: '', emoji: '🔗' });
    setShowAddForm(false);
    loadLinks();
    loadStats();
  };

  const deleteLink = async (id) => {
    await fetch(`${API}/api/links/${id}`, { method: 'DELETE', headers });
    loadLinks();
    loadStats();
  };

  const toggleLink = async (link) => {
    await fetch(`${API}/api/links/${link.id}`, { method: 'PUT', headers, body: JSON.stringify({ ...link, active: !link.active }) });
    loadLinks();
  };

  const saveProfile = async () => {
    await fetch(`${API}/api/profile/me`, { method: 'PUT', headers, body: JSON.stringify(profileEdit) });
    fetchProfile();
    alert('Profil mis à jour !');
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // Prepare chart data
  const barData = stats?.byDay
    ? Object.entries(stats.byDay).slice(-7).map(([date, clicks]) => ({ date: date.slice(5), clicks }))
    : [];

  const pieData = stats?.bySource
    ? Object.entries(stats.bySource).map(([name, value]) => ({ name, value }))
    : [];

  const PIE_COLORS = ['#6C5CE7', '#00CEC9', '#FDCB6E', '#E17055'];

  const sidebarItems = [
    { key: 'stats', icon: '📊', label: 'Dashboard' },
    { key: 'editor', icon: '✏️', label: 'Éditeur' },
    { key: 'profile', icon: '👤', label: 'Mon profil' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', flexShrink: 0, background: '#fff', borderRight: '1px solid rgba(0,0,0,0.08)', padding: '0 12px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 8px 12px', fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Link<span style={{ color: '#6C5CE7' }}>Pulse</span>
        </div>

        {sidebarItems.map(item => (
          <div
            key={item.key}
            onClick={() => setTab(item.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: '10px',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginBottom: '4px',
              background: tab === item.key ? 'rgba(108,92,231,0.1)' : 'transparent',
              color: tab === item.key ? '#6C5CE7' : '#6B6B80',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            {item.label}
          </div>
        ))}

        <div
          onClick={() => window.open(`/${profile?.username}`, '_blank')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginBottom: '4px', color: '#6B6B80' }}
        >
          <span style={{ fontSize: '16px' }}>🌐</span>
          Ma page publique
        </div>

        <div style={{ marginTop: 'auto', paddingBottom: '16px' }}>
          <div
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', color: '#6B6B80' }}
          >
            <span>⬅️</span> Déconnexion
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', background: '#F8F8FC' }}>

        {/* ── STATS TAB ── */}
        {tab === 'stats' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Bonjour, {profile?.full_name?.split(' ')[0]} 👋</h2>
              <p style={{ color: '#6B6B80', fontSize: '14px', marginTop: '4px' }}>Statistiques des 7 derniers jours</p>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Clics totaux', val: stats?.totalClicks ?? '…', change: '' },
                { label: 'Liens actifs', val: links.filter(l => l.active).length, change: '' },
                { label: 'Meilleur lien', val: stats?.linkStats?.[0]?.title?.slice(0,10) ?? '…', change: '' },
                { label: 'Sources', val: pieData.length, change: '' },
              ].map(card => (
                <div key={card.label} style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', padding: '20px 22px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: '#A0A0B8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>{card.label}</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 700, letterSpacing: '-1px' }}>{card.val}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px', marginBottom: '28px' }}>
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', padding: '22px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#A0A0B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Clics par jour</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={barData}>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#A0A0B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#A0A0B8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '13px' }} />
                    <Bar dataKey="clicks" fill="#6C5CE7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', padding: '22px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#A0A0B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Sources de trafic</h4>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                        {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Legend iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p style={{ color: '#A0A0B8', fontSize: '13px', textAlign: 'center', paddingTop: '40px' }}>Aucun clic encore</p>}
              </div>
            </div>

            {/* Links table */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Performance des liens</h4>
              </div>
              {(stats?.linkStats || []).map(link => (
                <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(108,92,231,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    {link.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.title}</div>
                    <div style={{ fontSize: '12px', color: '#A0A0B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.url}</div>
                  </div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, color: '#6C5CE7' }}>{link.clicks}</div>
                </div>
              ))}
              {(!stats?.linkStats || stats.linkStats.length === 0) && (
                <p style={{ textAlign: 'center', padding: '32px', color: '#A0A0B8', fontSize: '14px' }}>Aucun lien encore. Ajoutez-en dans l'éditeur !</p>
              )}
            </div>
          </div>
        )}

        {/* ── EDITOR TAB ── */}
        {tab === 'editor' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Éditeur de liens</h2>
              <p style={{ color: '#6B6B80', fontSize: '14px', marginTop: '4px' }}>Gérez et réorganisez vos liens</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Left: links list */}
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#A0A0B8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>Mes liens</p>
                  {links.map(link => (
                    <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', borderRadius: '10px', padding: '12px 14px', marginBottom: '8px', border: '1px solid rgba(0,0,0,0.08)' }}>
                      <span style={{ fontSize: '18px' }}>{link.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{link.title}</div>
                        <div style={{ fontSize: '11px', color: '#A0A0B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.url}</div>
                      </div>
                      <button
                        onClick={() => toggleLink(link)}
                        style={{ padding: '4px 10px', borderRadius: '50px', border: 'none', fontSize: '11px', fontWeight: 500, background: link.active ? 'rgba(0,184,148,0.1)' : 'rgba(0,0,0,0.06)', color: link.active ? '#00B894' : '#A0A0B8' }}
                      >
                        {link.active ? 'Actif' : 'Inactif'}
                      </button>
                      <button
                        onClick={() => deleteLink(link.id)}
                        style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#A0A0B8', padding: '4px' }}
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>

                {showAddForm ? (
                  <div style={{ background: 'rgba(108,92,231,0.05)', borderRadius: '10px', padding: '16px', border: '1px dashed rgba(108,92,231,0.25)' }}>
                    {[
                      { key: 'emoji', placeholder: 'Emoji (ex: 🔗)' },
                      { key: 'title', placeholder: 'Titre du lien' },
                      { key: 'url', placeholder: 'https://...' },
                    ].map(f => (
                      <input
                        key={f.key}
                        placeholder={f.placeholder}
                        value={newLink[f.key]}
                        onChange={e => setNewLink({ ...newLink, [f.key]: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', background: '#fff', fontSize: '13px', marginBottom: '8px', outline: 'none' }}
                      />
                    ))}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: '8px', borderRadius: '50px', border: '1px solid rgba(0,0,0,0.08)', background: 'transparent', fontSize: '13px', fontWeight: 500, color: '#6B6B80' }}>Annuler</button>
                      <button onClick={addLink} style={{ flex: 1, padding: '8px', borderRadius: '50px', border: 'none', background: '#6C5CE7', color: '#fff', fontSize: '13px', fontWeight: 500 }}>Ajouter</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddForm(true)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px dashed rgba(108,92,231,0.3)', background: 'rgba(108,92,231,0.03)', color: '#6C5CE7', fontSize: '14px', fontWeight: 500 }}
                  >
                    + Ajouter un lien
                  </button>
                )}
              </div>

              {/* Right: phone preview */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '32px' }}>
                <div style={{ width: '240px', background: '#fff', borderRadius: '32px', border: '2px solid rgba(0,0,0,0.08)', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
                  <div style={{ background: '#0A0A0F', height: '8px' }}></div>
                  <div style={{ padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: profileEdit.avatar_color || '#6C5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
                      {(profile?.full_name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{profile?.full_name}</div>
                    <div style={{ fontSize: '11px', color: '#6B6B80', textAlign: 'center', marginBottom: '14px' }}>{profile?.bio || 'Ma bio...'}</div>
                    {links.filter(l => l.active).slice(0, 5).map(link => (
                      <div key={link.id} style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: '#F8F8FC', border: '1px solid rgba(0,0,0,0.08)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500 }}>
                        <span>{link.emoji}</span>
                        <span>{link.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === 'profile' && (
          <div style={{ maxWidth: '520px' }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Mon profil</h2>
              <p style={{ color: '#6B6B80', fontSize: '14px', marginTop: '4px' }}>Personnalisez votre page publique</p>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', padding: '28px' }}>
              {[
                { label: 'Nom complet', key: 'full_name', type: 'text' },
                { label: 'Bio', key: 'bio', type: 'text' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#6B6B80', marginBottom: '6px' }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={profileEdit[f.key]}
                    onChange={e => setProfileEdit({ ...profileEdit, [f.key]: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', background: '#F8F8FC', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#6B6B80', marginBottom: '10px' }}>Couleur du profil</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {THEMES.map(t => (
                    <div
                      key={t.color}
                      onClick={() => setProfileEdit({ ...profileEdit, avatar_color: t.color })}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', background: t.color, cursor: 'pointer', border: profileEdit.avatar_color === t.color ? '3px solid #0A0A0F' : '3px solid transparent', transition: 'all 0.15s' }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#6B6B80', marginBottom: '6px' }}>Votre URL publique</label>
                <div style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', background: '#F0EEFF', fontSize: '14px', color: '#6C5CE7', fontWeight: 500 }}>
                  linkpulse.io/{profile?.username}
                </div>
              </div>

              <button
                onClick={saveProfile}
                style={{ width: '100%', padding: '13px', borderRadius: '50px', border: 'none', background: '#6C5CE7', color: '#fff', fontSize: '15px', fontWeight: 500 }}
              >
                Sauvegarder les modifications
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
