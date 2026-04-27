import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './ReturnToTop.css';

const SHOW_AFTER_PX = 420;

export default function ReturnToTop() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const lastRef = useRef(false);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const next = window.scrollY > SHOW_AFTER_PX;
    lastRef.current = next;
    setVisible(next);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let raf = 0;

    const read = () => {
      raf = 0;
      const next = window.scrollY > SHOW_AFTER_PX;
      if (lastRef.current !== next) {
        lastRef.current = next;
        setVisible(next);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(read);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (pathname.startsWith('/admin') || !visible) return null;

  return (
    <button type="button" className="return-top" onClick={goTop} aria-label="Back to top">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
