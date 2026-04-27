import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { useScroll } from '../hooks/useScroll';
import { useTheme } from '../context/ThemeContext';
import ServicesDropdown from './ServicesDropdown';
import { servicesMenu } from '../data/servicesData';
import ButtonCrossArrow from './ui/ButtonCrossArrow';
import MenuToggleIcon from './ui/MenuToggleIcon';
import NavbarSearch from './NavbarSearch';

export default function Navbar() {
  const scrolled = useScroll(10);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navCtaVariant = theme === 'light' ? 'light' : 'dark';
  const location = useLocation();
  const isAbout = location.pathname === '/about';
  const isContact = location.pathname === '/contact';

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Portfolio', to: '/portfolio' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact Us', to: '/contact' },
  ];

  const ghostClass = (path) =>
    `navbar__ghost ${location.pathname === path ? 'navbar__ghost--active' : ''}`.trim();

  const headerClass = [
    'navbar',
    scrolled && !mobileOpen ? 'navbar--floating' : '',
    mobileOpen ? 'navbar--menu-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const ctaLabel = isContact ? 'Get in Touch' : isAbout ? 'Get a Quote' : 'Get Started';

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  return (
    <>
      <m.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        className={headerClass}
      >
        <nav className={`navbar__bar ${scrolled && !mobileOpen ? 'navbar__bar--compact' : ''}`}>
          <Link to="/" className="navbar__logo">
            Logix<span className="navbar__logo-accent">Contact</span>
          </Link>

          <div className="navbar__desktop">
            {navLinks.slice(0, 2).map((link) => (
              <Link key={link.label} to={link.to} className={ghostClass(link.to)}>
                {link.label}
              </Link>
            ))}
            <ServicesDropdown />
            {navLinks.slice(2).map((link) => (
              <Link key={link.label} to={link.to} className={ghostClass(link.to)}>
                {link.label}
              </Link>
            ))}
            <div className="navbar__desktop-actions">
              <button type="button" className="navbar__icon" aria-label="Open search" onClick={openSearch}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <button
                type="button"
                className="navbar__icon"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
              <ButtonCrossArrow to={isContact ? '/contact#contact-form' : '/contact'} variant={navCtaVariant}>
                {ctaLabel}
              </ButtonCrossArrow>
            </div>
          </div>

          <button
            type="button"
            className="navbar__menu-trigger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <MenuToggleIcon open={mobileOpen} duration={300} />
          </button>
        </nav>
      </m.header>

      <NavbarSearch open={searchOpen} onClose={closeSearch} />

      <AnimatePresence>
        {mobileOpen && (
          <>
            <m.div
              key="navbar-overlay-bg"
              className="navbar__drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden
              onClick={() => setMobileOpen(false)}
            />
            <m.div
              key="navbar-drawer"
              className="navbar__drawer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <m.div
                className="navbar__drawer-inner"
                data-slot={mobileOpen ? 'open' : 'closed'}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="navbar__drawer-toolbar">
                  <button
                    type="button"
                    className="navbar__drawer-tool"
                    onClick={() => {
                      setMobileOpen(false);
                      openSearch();
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    Search
                  </button>
                  <button type="button" className="navbar__drawer-tool" onClick={toggleTheme}>
                    {theme === 'dark' ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="4" />
                          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                        </svg>
                        Light
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                        Dark
                      </>
                    )}
                  </button>
                </div>
                <div className="navbar__drawer-links">
                  {navLinks.slice(0, 2).map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="navbar__drawer-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <details className="navbar__drawer-services">
                    <summary className="navbar__drawer-services-summary">Services</summary>
                    <div className="navbar__drawer-services-list">
                      {servicesMenu.map((svc) => (
                        <Link
                          key={svc.id}
                          to={svc.path}
                          className={`navbar__drawer-sublink${location.pathname === svc.path ? ' navbar__drawer-sublink--active' : ''}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {svc.title}
                        </Link>
                      ))}
                    </div>
                  </details>
                  {navLinks.slice(2).map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="navbar__drawer-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="navbar__drawer-footer">
                  <ButtonCrossArrow
                    to="/contact"
                    variant={navCtaVariant}
                    className="btn-cross-arrow--full"
                    onClick={() => setMobileOpen(false)}
                  >
                    {isAbout ? 'Get a Quote' : 'Get Started'}
                  </ButtonCrossArrow>
                </div>
              </m.div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
