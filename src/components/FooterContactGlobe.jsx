import { Suspense, useEffect, useState } from 'react';
import { lazyWithRetry } from '../utils/lazyWithRetry';

const PresenceGlobe = lazyWithRetry(() =>
  import('@/components/ui/cobe-globe').then((mod) => ({ default: mod.Globe })),
);

function globeEligible() {
  if (typeof window === 'undefined') return false;
  return (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !window.matchMedia('(max-width: 768px)').matches
  );
}

/** [lat, lng] — COBE convention */
const LONDON = [51.5074, -0.1278];
const DUBAI = [25.2048, 55.2708];
/** Approx. centre of Pakistan */
const PAKISTAN = [30.3753, 69.3451];

const presenceMarkers = [
  { id: 'london', location: LONDON, label: 'London' },
  { id: 'dubai', location: DUBAI, label: 'Dubai' },
  { id: 'pakistan', location: PAKISTAN, label: 'Pakistan' },
];

const presenceArcs = [
  {
    id: 'london-dubai',
    from: LONDON,
    to: DUBAI,
  },
  {
    id: 'dubai-pakistan',
    from: DUBAI,
    to: PAKISTAN,
  },
  {
    id: 'london-pakistan',
    from: LONDON,
    to: PAKISTAN,
  },
];

/**
 * COBE globe for footer “Global presence” — London, Dubai, Pakistan.
 * Hidden on small screens / reduced m.
 */
export default function FooterContactGlobe() {
  /** First paint must match desktop globe slot — avoids large CLS from null → 240px mount. */
  const [show, setShow] = useState(globeEligible);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const phone = window.matchMedia('(max-width: 768px)');
    const sync = () => setShow(!reduceMotion.matches && !phone.matches);
    sync();
    reduceMotion.addEventListener('change', sync);
    phone.addEventListener('change', sync);
    return () => {
      reduceMotion.removeEventListener('change', sync);
      phone.removeEventListener('change', sync);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="footer__globe-wrap" aria-hidden>
      <Suspense fallback={<div className="footer__globe-skeleton" aria-hidden />}>
        <PresenceGlobe
          className="footer__globe-cdn"
          markers={presenceMarkers}
          arcs={presenceArcs}
          speed={0.0025}
          markerColor={[0.06, 0.72, 0.64]}
          baseColor={[0.11, 0.11, 0.13]}
          arcColor={[0.08, 0.65, 0.58]}
          glowColor={[0.05, 0.28, 0.26]}
          dark={1}
          mapBrightness={5.5}
          markerSize={0.022}
          markerElevation={0.02}
          diffuse={1.25}
          mapSamples={12000}
          opacity={0.85}
        />
      </Suspense>
    </div>
  );
}
