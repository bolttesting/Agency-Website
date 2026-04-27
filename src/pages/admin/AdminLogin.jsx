import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ensureSupabase, isSupabaseConfigured } from '../../lib/supabase';
import './Admin.css';

/** Inline layout/colors so the page is visible even if Admin.css fails to load on the edge (CDN / rewrite issues). */
const shellStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#0f0f14',
  color: '#e4e4e7',
  padding: '2rem',
  position: 'relative',
  zIndex: 10,
  boxSizing: 'border-box',
};

const cardStyle = {
  width: '100%',
  maxWidth: 400,
  background: '#14141c',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  padding: '2.5rem',
  color: '#e4e4e7',
};

const h1Style = { fontSize: '1.5rem', marginBottom: '0.25rem', color: '#fff' };

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    document.title = 'Admin login | Logix Contact';
    const meta = document.querySelector('meta[name="robots"]');
    if (meta) meta.setAttribute('content', 'noindex, nofollow');
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let cancelled = false;
    void ensureSupabase().then(() => {
      if (!cancelled) setClientReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const client = await ensureSupabase();
    if (!client) return;
    setError('');
    setLoading(true);
    try {
      const { error: err } = await client.auth.signInWithPassword({ email, password });
      if (err) throw err;
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="admin-login" style={shellStyle}>
        <div className="admin-login__card" style={cardStyle}>
          <h1 style={h1Style}>Admin Setup Required</h1>
          <p style={{ marginBottom: '0.75rem', lineHeight: 1.5 }}>
            Add <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.15rem 0.35rem', borderRadius: 4 }}>VITE_SUPABASE_URL</code> and{' '}
            <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.15rem 0.35rem', borderRadius: 4 }}>VITE_SUPABASE_ANON_KEY</code> to your environment.
          </p>
          <p style={{ marginBottom: '1rem', color: '#a1a1aa', fontSize: '0.9rem' }}>
            Locally: <code>.env</code> · Production: Vercel → Project → Settings → Environment Variables, then redeploy.
          </p>
          <a href="/" style={{ color: '#14b8a6' }}>
            ← Back to Site
          </a>
        </div>
      </div>
    );
  }

  if (!clientReady) {
    return (
      <div className="admin-login" style={shellStyle}>
        <div className="admin-login__card" style={cardStyle}>
          <p style={{ color: '#a1a1aa' }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login" style={shellStyle}>
      <div className="admin-login__card" style={cardStyle}>
        <h1 style={h1Style}>Admin Login</h1>
        <p className="admin-login__subtitle" style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Logix Contact Dashboard
        </p>
        <form onSubmit={handleSubmit}>
          <div className="admin-form__field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@example.com" />
          </div>
          <div className="admin-form__field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="admin-login__error">{error}</p>}
          <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <a href="/" className="admin-login__back">
          ← Back to Site
        </a>
      </div>
    </div>
  );
}
