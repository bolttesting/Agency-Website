import { useState, useEffect } from 'react';

/**
 * Fires after `window` `load`, then `requestIdleCallback` (capped by `idleTimeout`).
 * Use for decorative work (e.g. hero WebGL) so LCP and early JS stay lighter on desktop PSI.
 */
export function usePostLoadIdleReady(options = {}) {
  const { idleTimeout = 5200 } = options;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let cancelled = false;

    const arm = () => {
      if (cancelled) return;
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(
          () => {
            if (!cancelled) setReady(true);
          },
          { timeout: idleTimeout },
        );
      } else {
        window.setTimeout(() => {
          if (!cancelled) setReady(true);
        }, Math.min(idleTimeout, 900));
      }
    };

    if (document.readyState === 'complete') {
      arm();
    } else {
      window.addEventListener('load', arm, { once: true });
    }

    return () => {
      cancelled = true;
    };
  }, [idleTimeout]);

  return ready;
}
