import { useState, useEffect, useLayoutEffect, useRef } from 'react';

/**
 * True when `window.scrollY` is greater than `threshold` (default 10).
 * Batches reads with rAF and only re-renders when the boolean actually flips.
 */
export function useScroll(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);
  const lastRef = useRef(null);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const next = window.scrollY > threshold;
    lastRef.current = next;
    setScrolled(next);
  }, [threshold]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let raf = 0;

    const read = () => {
      raf = 0;
      const next = window.scrollY > threshold;
      if (lastRef.current !== next) {
        lastRef.current = next;
        setScrolled(next);
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
  }, [threshold]);

  return scrolled;
}
