import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: '64px',
      background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Link to="/" style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px', color: '#0A0A0F' }}>
        Link<span style={{ color: '#6C5CE7' }}>Pulse</span>
      </Link>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {token ? (
          <>
            <Link to="/dashboard" style={{ padding: '8px 18px', borderRadius: '50px', fontSize: '14px', fontWeight: 500, color: '#6B6B80', background: 'transparent', border: 'none' }}>
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              style={{ padding: '8px 18px', borderRadius: '50px', fontSize: '14px', fontWeight: 500, background: '#6C5CE7', color: '#fff', border: 'none' }}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ padding: '8px 18px', borderRadius: '50px', fontSize: '14px', fontWeight: 500, color: '#6B6B80', background: 'transparent', border: 'none' }}>
              Connexion
            </Link>
            <Link to="/register" style={{ padding: '8px 18px', borderRadius: '50px', fontSize: '14px', fontWeight: 500, background: '#6C5CE7', color: '#fff', borderRadius: '50px', display: 'inline-block' }}>
              Commencer gratuitement
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
