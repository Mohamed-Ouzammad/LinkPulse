import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
  { icon: '🔗', color: 'rgba(108,92,231,0.1)', title: 'Tous vos liens, un seul endroit', desc: 'Ajoutez, réorganisez et personnalisez vos liens en quelques secondes.' },
  { icon: '📊', color: 'rgba(0,206,201,0.1)', title: 'Analytics en temps réel', desc: 'Suivez vos clics, vos sources de trafic et les pics d\'audience jour par jour.' },
  { icon: '🎨', color: 'rgba(253,203,110,0.2)', title: 'Thèmes & personnalisation', desc: 'Choisissez parmi des thèmes ou créez votre propre palette de couleurs.' },
];

export default function Landing() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <div style={{
        textAlign: 'center', padding: '80px 32px 64px',
        background: 'linear-gradient(160deg, #F0EEFF 0%, #E8FFFE 100%)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}>
        <div style={{
          display: 'inline-block', marginBottom: '20px',
          padding: '6px 16px', borderRadius: '50px',
          background: 'rgba(108,92,231,0.1)', color: '#6C5CE7',
          fontSize: '13px', fontWeight: 500, letterSpacing: '0.4px',
        }}>
          ✦ Votre page de liens, réinventée
        </div>

        <h1 style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-2px', marginBottom: '18px' }}>
          Une page.<br />
          <span style={{ color: '#6C5CE7' }}>Des milliers de clics.</span>
        </h1>

        <p style={{ fontSize: '18px', color: '#6B6B80', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.6 }}>
          Créez votre bio page en 2 minutes, partagez tous vos liens, et analysez chaque clic en temps réel.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{
            padding: '14px 28px', borderRadius: '50px', fontSize: '16px', fontWeight: 500,
            background: '#6C5CE7', color: '#fff', display: 'inline-block',
            boxShadow: '0 4px 20px rgba(108,92,231,0.3)',
          }}>
            Créer ma page gratuitement
          </Link>
          <a href="/demo" style={{
            padding: '14px 28px', borderRadius: '50px', fontSize: '16px', fontWeight: 500,
            background: '#fff', color: '#0A0A0F', display: 'inline-block',
            border: '1px solid rgba(0,0,0,0.08)',
          }}>
            Voir un exemple →
          </a>
        </div>
      </div>

      {/* Features */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px',
        padding: '56px 32px', maxWidth: '900px', margin: '0 auto',
      }}>
        {features.map((f) => (
          <div key={f.title} style={{
            background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)',
            padding: '28px 24px',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px', marginBottom: '16px',
              background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px',
            }}>{f.icon}</div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{f.title}</h3>
            <p style={{ fontSize: '14px', color: '#6B6B80', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA bottom */}
      <div style={{ textAlign: 'center', padding: '40px 32px 80px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>Prêt à vous lancer ?</h2>
        <p style={{ color: '#6B6B80', marginBottom: '28px' }}>Gratuit pour toujours. Pas de carte bancaire.</p>
        <Link to="/register" style={{
          padding: '14px 32px', borderRadius: '50px', fontSize: '16px', fontWeight: 500,
          background: '#6C5CE7', color: '#fff', display: 'inline-block',
        }}>
          Créer mon compte gratuitement
        </Link>
      </div>
    </div>
  );
}
