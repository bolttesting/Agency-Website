import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { filterSearchCatalog, useSearchCatalog } from '../hooks/useSearchCatalog';
import './NavbarSearch.css';

export default function NavbarSearch({ open, onClose }) {
  const items = useSearchCatalog();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const filtered = filterSearchCatalog(items, query);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = '';
      window.clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <m.div
            key="navbar-search-backdrop"
            className="navbar-search-backdrop"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />
          <div key="navbar-search-shell" className="navbar-search-shell">
            <m.div
              key="navbar-search-panel"
              className="navbar-search"
              role="dialog"
              aria-modal="true"
              aria-label="Search site"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
            <div className="navbar-search__head">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                className="navbar-search__input"
                placeholder="Search pages, services, blog…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                spellCheck="false"
              />
              <span className="navbar-search__hint">Esc</span>
            </div>
            <ul className="navbar-search__list">
              {filtered.length === 0 ? (
                <li className="navbar-search__empty">No results. Try another keyword.</li>
              ) : (
                filtered.map((item) => (
                  <li key={item.id} className="navbar-search__item">
                    <Link
                      to={item.to}
                      className="navbar-search__link"
                      onClick={() => {
                        onClose();
                        if (item.to.includes('#')) {
                          window.requestAnimationFrame(() => {
                            const id = item.to.split('#')[1];
                            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                          });
                        }
                      }}
                    >
                      <span className="navbar-search__title">{item.title}</span>
                      {item.hint ? <span className="navbar-search__meta">{item.hint}</span> : null}
                    </Link>
                  </li>
                ))
              )}
            </ul>
            <div className="navbar-search__foot">Navigate to a page or project. Shortcut: Ctrl/⌘ K</div>
            </m.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
