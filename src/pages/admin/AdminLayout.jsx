import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ensureSupabase, isSupabaseConfigured } from '../../lib/supabase';
import Seo from '../../components/Seo';
import './Admin.css';

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      navigate('/admin/login', { replace: true });
      queueMicrotask(() => setLoading(false));
      return undefined;
    }

    let subscription;
    let cancelled = false;

    void (async () => {
      const client = await ensureSupabase();
      if (cancelled) return;
      if (!client) {
        navigate('/admin/login', { replace: true });
        setLoading(false);
        return;
      }
      try {
        const {
          data: { session },
        } = await client.auth.getSession();
        if (cancelled) return;
        setUser(session?.user ?? null);
        setLoading(false);
        if (!session) navigate('/admin/login', { replace: true });
        const {
          data: { subscription: sub },
        } = client.auth.onAuthStateChange((_e, sessionNext) => {
          setUser(sessionNext?.user ?? null);
          if (!sessionNext) navigate('/admin/login', { replace: true });
        });
        subscription = sub;
      } catch (err) {
        console.error('Auth check failed:', err);
        setLoading(false);
        navigate('/admin/login', { replace: true });
      }
    })();

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    const client = await ensureSupabase();
    await client?.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="admin-login">
        <Seo title="Admin" description="Logix Contact admin area." noindex />
        <div className="admin-login__card">Loading...</div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="admin-login">
        <Seo title="Admin" description="Logix Contact admin area." noindex />
        <div className="admin-login__card">Redirecting to login...</div>
      </div>
    );
  }

  const navItems = [
    { to: '/admin', end: true, label: 'Dashboard' },
    { to: '/admin/portfolio', end: false, label: 'Portfolio' },
    { to: '/admin/blog', end: false, label: 'Blog' },
    { to: '/admin/team', end: false, label: 'Team' },
    { to: '/admin/testimonials', end: false, label: 'Testimonials' },
    { to: '/admin/services', end: false, label: 'Services' },
    { to: '/admin/settings', end: false, label: 'Settings' },
    { to: '/admin/contacts', end: false, label: 'Contact Submissions' },
    { to: '/admin/newsletter', end: false, label: 'Newsletter' },
  ];

  return (
    <div className="admin-layout">
      <Seo title="Admin" description="Logix Contact content management dashboard." noindex />
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">Logix<span>Contact</span> Admin</div>
        <nav className="admin-sidebar__nav-wrap" aria-label="Admin sections">
          <ul className="admin-sidebar__nav">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="admin-sidebar__logout">
          <button type="button" onClick={handleLogout} className="admin-btn admin-btn--secondary admin-sidebar__logout-btn">
            Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
