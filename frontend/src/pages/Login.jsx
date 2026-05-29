import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.08)', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(108,92,231,0.14)' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px' }}>Bon retour 👋</h2>
          <p style={{ color: '#6B6B80', fontSize: '14px', marginBottom: '28px' }}>Connectez-vous à votre compte LinkPulse</p>

          {error && (
            <div style={{ background: '#FFF0F0', border: '1px solid #FFB3B3', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: '#CC0000' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Adresse e-mail', key: 'email', type: 'email', placeholder: 'vous@exemple.com' },
              { label: 'Mot de passe', key: 'password', type: 'password', placeholder: '••••••••' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#6B6B80', marginBottom: '6px' }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', background: '#F8F8FC', fontSize: '14px', color: '#0A0A0F', outline: 'none' }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: '50px', border: 'none', background: '#6C5CE7', color: '#fff', fontSize: '15px', fontWeight: 500, marginTop: '8px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#6B6B80' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: '#6C5CE7', fontWeight: 500 }}>Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
