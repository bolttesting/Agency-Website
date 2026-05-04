import { useState, useEffect } from 'react';

/**
 * Delays mounting heavy below-the-fold content until the user scrolls slightly or
 * the main document has loaded and the browser is idle — reduces parse/execute
 * during the initial desktop performance trace without blocking mobile (scroll
 * often fires quickly; idle cap still loads content for crawlers / no-scroll loads).
 */
export function useDeferBelowFold(options = {}) {
  const { scrollPx = 140, idleTimeout = 4200 } = options;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (ready) return undefined;

    let cancelled = false;
    const done = () => {
      if (!cancelled) setReady(true);
    };

    const tryScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      if (y >= scrollPx) done();
    };

    tryScroll();
    window.addEventListener('scroll', tryScroll, { passive: true });

    const armIdle = () => {
      if (cancelled) return;
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(done, { timeout: idleTimeout });
      } else {
        window.setTimeout(done, Math.min(idleTimeout, 2500));
      }
    };

    if (document.readyState === 'complete') {
      armIdle();
    } else {
      window.addEventListener('load', armIdle, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('scroll', tryScroll);
    };
  }, [ready, scrollPx, idleTimeout]);

  return ready;
}
