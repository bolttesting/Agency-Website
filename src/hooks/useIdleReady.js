import { useState, useEffect } from 'react';

/**
 * Resolves after the main thread is likely idle (or after `timeout` ms as a cap),
 * so large optional chunks (e.g. WebGL) load after first paint and critical bundles.
 */
export function useIdleReady(options = {}) {
  const { timeout = 2000 } = options;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const win = window;
    if (typeof win.requestIdleCallback === 'function') {
      const id = win.requestIdleCallback(() => setReady(true), { timeout });
      return () => win.cancelIdleCallback(id);
    }
    const t = win.setTimeout(() => setReady(true), 350);
    return () => win.clearTimeout(t);
  }, [timeout]);

  return ready;
}
