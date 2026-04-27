import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ensureSupabase, isSupabaseConfigured } from '../lib/supabase';
import { portfolioProjects, portfolioProjectDetails } from '../data/portfolioData';
import { servicesMenu, servicePageContent } from '../data/servicesData';

// Static fallbacks
const staticTeam = [
  { id: '1', name: 'James Wilson', role: 'CEO & Founder', avatar: 'JW', bio: '' },
  { id: '2', name: 'Maria Kowalski', role: 'CTO & Co-Founder', avatar: 'MK', bio: '' },
  { id: '3', name: 'David Chen', role: 'Engineering Lead', avatar: 'DC', bio: '' },
  { id: '4', name: 'Elena Ortiz', role: 'Head of Design', avatar: 'EO', bio: '' },
  { id: '5', name: 'Sam Okoro', role: 'Senior Full-Stack Developer', avatar: 'SO', bio: '' },
  { id: '6', name: 'Priya Sharma', role: 'Product Manager', avatar: 'PS', bio: '' },
  { id: '7', name: 'Tom Brennan', role: 'DevOps & Infrastructure', avatar: 'TB', bio: '' },
  { id: '8', name: 'Zoe Williams', role: 'Client Success Lead', avatar: 'ZW', bio: '' },
];

const staticTestimonials = [
  { id: '1', name: 'Sarah Johnson', role: 'CEO, TechStart', text: 'Exceptional work from start to finish. They delivered our web app on time and exceeded our expectations. Highly recommend!', avatar: 'SJ' },
  { id: '2', name: 'Michael Chen', role: 'Founder, InnovateLab', text: 'The team understood our vision perfectly. The mobile app they built has transformed our user engagement. Five stars!', avatar: 'MC' },
  { id: '3', name: 'Emma Roberts', role: 'Director, ScaleUp', text: 'Professional, responsive, and results-driven. Our digital presence has grown significantly since working with them.', avatar: 'ER' },
];

const staticBlog = [
  { id: '1', title: 'Building Scalable React Applications in 2025', excerpt: 'Discover the latest patterns and best practices...', category: 'Web Development', date: '2025-03-01' },
  { id: '2', title: 'The Future of Mobile App Development', excerpt: 'Exploring cross-platform frameworks...', category: 'Mobile', date: '2025-02-28' },
  { id: '3', title: 'UI/UX Trends That Define Modern Design', excerpt: 'From micro-interactions to dark mode...', category: 'Design', date: '2025-02-25' },
  { id: '4', title: 'Optimizing Your Development Workflow', excerpt: 'Tips and tools to streamline...', category: 'DevOps', date: '2025-02-22' },
  { id: '5', title: 'Understanding API Design Best Practices', excerpt: 'REST, GraphQL, or tRPC?...', category: 'Backend', date: '2025-02-18' },
  { id: '6', title: 'Getting Started with Cloud Deployment', excerpt: 'Deploy to AWS, Azure, or Vercel...', category: 'Cloud', date: '2025-02-15' },
];

const staticSettings = {
  email: 'info@logixcontact.co.uk',
  phone: '+123-456-7890',
  address: '123 Street, City, Country',
  hours: 'Mon - Fri: 9AM - 6PM',
  whatsapp: '',
};

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [portfolio, setPortfolio] = useState([]);
  const [portfolioDetails, setPortfolioDetails] = useState({});
  const [blogPosts, setBlogPosts] = useState([]);
  const [team, setTeam] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState(staticSettings);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useSupabase, setUseSupabase] = useState(false);

  const loadContactSubmissions = useCallback(async () => {
    const client = await ensureSupabase();
    if (!client) return;
    try {
      const { data, error } = await client
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setContactSubmissions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn('Contact submissions load failed:', e);
    }
  }, []);

  const loadFromSupabase = useCallback(async (options = {}) => {
    const { withContactSubmissions = true } = options;
    // Yield to the browser so first paint can complete before the Supabase chunk competes for the main thread.
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      await new Promise((r) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(r);
        });
      });
    }
    const client = await ensureSupabase();
    if (!client) return false;
    try {
      const [portRes, blogRes, teamRes, testRes, settingsRes, svcRes, subsRes] = await Promise.all([
        client.from('portfolio').select('*').order('sort_order'),
        client.from('blog_posts').select('*').order('date', { ascending: false }),
        client.from('team_members').select('*').order('sort_order'),
        client.from('testimonials').select('*').order('sort_order'),
        client.from('site_settings').select('*').single(),
        client.from('services').select('*').order('sort_order'),
        withContactSubmissions
          ? client.from('contact_submissions').select('*').order('created_at', { ascending: false })
          : Promise.resolve({ data: null, error: null }),
      ]);

      // Use DB rows only (including empty arrays). Static fallbacks use non-UUID ids and break admin saves against Supabase.
      if (Array.isArray(portRes.data)) {
        if (portRes.data.length > 0) {
          const projects = portRes.data.map((p) => ({ ...p, id: String(p.id) }));
          setPortfolio(projects);
          const details = {};
          projects.forEach((p) => {
            if (p.details && Object.keys(p.details).length) details[p.id] = p.details;
          });
          setPortfolioDetails(details);
        } else {
          setPortfolio([]);
          setPortfolioDetails({});
        }
      } else {
        setPortfolio([]);
        setPortfolioDetails({});
      }
      if (Array.isArray(blogRes.data)) {
        setBlogPosts(blogRes.data.map((b) => ({ ...b, id: String(b.id) })));
      } else {
        setBlogPosts([]);
      }
      if (Array.isArray(teamRes.data)) {
        setTeam(teamRes.data.map((t) => ({ ...t, id: String(t.id) })));
      } else {
        setTeam([]);
      }
      if (Array.isArray(testRes.data)) {
        setTestimonials(testRes.data.map((t) => ({ ...t, id: String(t.id) })));
      } else {
        setTestimonials([]);
      }
      if (settingsRes.data) setSettings({ ...staticSettings, ...settingsRes.data });
      if (withContactSubmissions) {
        if (subsRes.data) setContactSubmissions(subsRes.data);
        else setContactSubmissions([]);
      }

      if (Array.isArray(svcRes.data) && svcRes.data.length > 0) setServices(svcRes.data);
      else setServices(servicesMenu);

      // true = Supabase load finished; do not treat “all tables empty” as failure (avoids re-applying static ids in useEffect)
      return true;
    } catch (e) {
      console.warn('Supabase load failed:', e);
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let idleId = 0;
    let timeoutId = 0;
    const run = async () => {
      setLoading(true);
      const supabaseLoadOk = await loadFromSupabase({ withContactSubmissions: false });
      if (cancelled) return;
      setUseSupabase(supabaseLoadOk);

      if (!supabaseLoadOk) {
        setPortfolio(portfolioProjects.map(p => ({ ...p, id: String(p.id) })));
        setPortfolioDetails(portfolioProjectDetails);
        setBlogPosts(staticBlog);
        setTeam(staticTeam);
        setTestimonials(staticTestimonials);
        setServices(servicesMenu);
      }
      setLoading(false);
    };

    const start = () => {
      if (cancelled) return;
      void run();
    };

    const scheduleAfterWindowLoad = () => {
      if (typeof window === 'undefined') {
        start();
        return;
      }
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(start, { timeout: 4000 });
      } else {
        timeoutId = window.setTimeout(start, 800);
      }
    };

    const onWindowLoad = () => {
      scheduleAfterWindowLoad();
    };

    if (typeof document === 'undefined' || document.readyState === 'complete') {
      scheduleAfterWindowLoad();
    } else if (typeof window !== 'undefined') {
      window.addEventListener('load', onWindowLoad, { once: true });
    } else {
      scheduleAfterWindowLoad();
    }

    return () => {
      cancelled = true;
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', onWindowLoad);
        if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loadFromSupabase]);

  /** Public site: DB projects when any exist, else original `portfolioData` (admin still uses `portfolio` only). */
  const portfolioDisplay = useMemo(
    () =>
      portfolio.length > 0 ? portfolio : portfolioProjects.map((p) => ({ ...p, id: String(p.id) })),
    [portfolio],
  );

  const portfolioDetailsDisplay = useMemo(
    () => (portfolio.length > 0 ? portfolioDetails : portfolioProjectDetails),
    [portfolio, portfolioDetails],
  );

  const mergedServicePageContent = useMemo(() => {
    if (!Array.isArray(services) || services.length === 0) return servicePageContent;
    const first = services[0];
    if (first == null || first.page_content == null) return servicePageContent;
    try {
      return Object.fromEntries(
        services.filter((s) => s != null && s.id != null).map((s) => [String(s.id), s.page_content]),
      );
    } catch (e) {
      console.warn('servicePageContent merge failed:', e);
      return servicePageContent;
    }
  }, [services]);

  const refreshAll = useCallback(
    () => loadFromSupabase({ withContactSubmissions: true }),
    [loadFromSupabase],
  );

  const value = {
    portfolio,
    portfolioDetails,
    portfolioDisplay,
    portfolioDetailsDisplay,
    blogPosts,
    team,
    testimonials,
    services: Array.isArray(services) ? services : [],
    servicePageContent: mergedServicePageContent,
    settings,
    contactSubmissions,
    loading,
    useSupabase,
    isSupabaseConfigured: isSupabaseConfigured(),
    refresh: refreshAll,
    loadContactSubmissions,
  };

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider');
  return ctx;
}
