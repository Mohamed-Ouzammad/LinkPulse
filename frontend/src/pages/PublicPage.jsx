import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../context/AuthContext';

export default function PublicPage() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/profile/${username}`)
      .then(r => {
        if (!r.ok) throw new Error('Introuvable');
        return r.json();
      })
      .then(d => setData(d))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  const handleClick = async (link) => {
    // Enregistrer le clic en arrière-plan
    const source = document.referrer.includes('instagram') ? 'instagram'
      : document.referrer.includes('twitter') ? 'twitter'
      : document.referrer.includes('youtube') ? 'youtube'
      : 'direct';

    fetch(`${API}/api/analytics/click/${link.id}?source=${source}`, { method: 'POST' });
    window.open(link.url.startsWith('http') ? link.url : `https://${link.url}`, '_blank');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Syne, sans-serif', color: '#6C5CE7', fontSize: '18px' }}>
        Chargement…
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Syne, sans-serif' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Page introuvable</h2>
        <p style={{ color: '#6B6B80', marginBottom: '24px' }}>L'utilisateur « {username} » n'existe pas.</p>
        <a href="/" style={{ padding: '12px 24px', borderRadius: '50px', background: '#6C5CE7', color: '#fff', fontWeight: 500 }}>
          Créer ma page
        </a>
      </div>
    );
  }

  const { profile, links } = data;
  const initials = (profile.full_name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #F0EEFF 0%, #E8FFFE 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '60px 24px 80px',
    }}>
      {/* Avatar */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: profile.avatar_color || '#6C5CE7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#fff',
        marginBottom: '14px',
      }}>
        {initials}
      </div>

      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>
        {profile.full_name}
      </h1>

      {profile.bio && (
        <p style={{ fontSize: '14px', color: '#6B6B80', marginBottom: '32px', textAlign: 'center', maxWidth: '280px', lineHeight: 1.6 }}>
          {profile.bio}
        </p>
      )}

      {/* Links */}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {links.map(link => (
          <div
            key={link.id}
            onClick={() => handleClick(link)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '15px 20px', borderRadius: '16px',
              background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
              marginBottom: '12px', cursor: 'pointer',
              boxShadow: '0 2px 16px rgba(108,92,231,0.08)',
              transition: 'all 0.18s',
              fontWeight: 500,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(108,92,231,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
              {link.emoji}
            </div>
            <span style={{ flex: 1, fontSize: '14px' }}>{link.title}</span>
            <span style={{ color: '#A0A0B8', fontSize: '14px' }}>→</span>
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <p style={{ color: '#A0A0B8', fontSize: '14px', marginTop: '16px' }}>Aucun lien pour l'instant.</p>
      )}

      {/* Footer */}
      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <a href="/" style={{ fontSize: '13px', color: '#A0A0B8', textDecoration: 'none' }}>
          Propulsé par <strong style={{ color: '#6C5CE7', fontFamily: 'Syne, sans-serif' }}>LinkPulse</strong>
        </a>
      </div>
    </div>
  );
}
