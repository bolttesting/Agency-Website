import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  m,
  useScroll,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
  useInView,
  wrap,
} from 'framer-motion';

/**
 * True on phones / tablets and coarse pointers — avoids useAnimationFrame + scroll sync (main scroll jank).
 */
function subscribeMobileOrCoarse(callback) {
  if (typeof window === 'undefined') return () => {};
  const mq1 = window.matchMedia('(max-width: 768px)');
  const mq2 = window.matchMedia('(pointer: coarse)');
  const fn = () => callback();
  mq1.addEventListener('change', fn);
  mq2.addEventListener('change', fn);
  return () => {
    mq1.removeEventListener('change', fn);
    mq2.removeEventListener('change', fn);
  };
}

function getMobileOrCoarseSnapshot() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(pointer: coarse)').matches
  );
}

function getMobileOrCoarseServerSnapshot() {
  return false;
}

function useMobileOrCoarse() {
  return useSyncExternalStore(
    subscribeMobileOrCoarse,
    getMobileOrCoarseSnapshot,
    getMobileOrCoarseServerSnapshot,
  );
}

/**
 * CSS `@keyframes` loop — compositor-friendly, no rAF, no scroll listeners.
 */
function CssLoopMarquee({ children, className, delay, reverse }) {
  const [active, setActive] = useState(!delay);
  const merged = ['scroll-text-marquee', 'scroll-text-marquee--css-loop', className, reverse ? 'scroll-text-marquee--css-loop-reverse' : ''].filter(Boolean).join(' ');

  useEffect(() => {
    if (!delay) return undefined;
    const id = window.setTimeout(() => setActive(true), delay);
    return () => clearTimeout(id);
  }, [delay]);

  if (!active) {
    return <div className={merged} aria-hidden />;
  }

  return (
    <div className={merged}>
      <div className="scroll-text-marquee__track">
        <span className="scroll-text-marquee__chunk">{children}</span>
        <span className="scroll-text-marquee__chunk" aria-hidden>
          {children}
        </span>
      </div>
    </div>
  );
}

/**
 * Full scroll-linked marquee: only mounted on large / fine-pointer viewports, and rAF is cheap when in view.
 */
function ScrollDrivenMarquee({ children, baseVelocity, scrollSensitivity, delay, className, clasname }) {
  const mergedClassName = [className, clasname].filter(Boolean).join(' ');
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const [active, setActive] = useState(!delay);
  const scrollPrev = useRef(null);
  const initScroll = useRef(false);
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { amount: 0, margin: '0px 0px 25% 0px' });

  useEffect(() => {
    if (!delay) return undefined;
    const id = window.setTimeout(() => setActive(true), delay);
    return () => clearTimeout(id);
  }, [delay]);

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (!active || !inView) return;

    const sy = scrollY.get();
    if (!initScroll.current) {
      scrollPrev.current = sy;
      initScroll.current = true;
      return;
    }

    const deltaY = sy - scrollPrev.current;
    scrollPrev.current = sy;

    const dampedDelta = Math.sign(deltaY) * Math.min(Math.abs(deltaY), 14);
    let move = -dampedDelta * scrollSensitivity;

    move += baseVelocity * 0.22 * (delta / 1000);

    const cap = 0.42;
    move = Math.max(-cap, Math.min(cap, move));

    baseX.set(baseX.get() + move);
  });

  const text = (
    <>
      <span className="scroll-text-marquee__chunk">{children}</span>
      <span className="scroll-text-marquee__chunk">{children}</span>
      <span className="scroll-text-marquee__chunk">{children}</span>
      <span className="scroll-text-marquee__chunk">{children}</span>
    </>
  );

  return (
    <div ref={rootRef} className="scroll-text-marquee">
      <m.div className={mergedClassName} style={{ x, display: 'inline-block', whiteSpace: 'nowrap' }}>
        {text}
      </m.div>
    </div>
  );
}

/**
 * Horizontal marquee: on desktop, motion follows **vertical page scroll**; on mobile/touch, uses CSS animation only
 * to avoid 60fps rAF + scroll work competing with the browser’s scroll (fixes scroll jank / “stuck” feel).
 */
export default function ScrollBaseAnimation({
  children,
  baseVelocity = 0.12,
  scrollSensitivity = 0.007,
  delay = 0,
  className,
  clasname,
  /** Second row: reverse direction for CSS loop */
  reverse = false,
}) {
  const mergedClassName = [className, clasname].filter(Boolean).join(' ');
  const reduceMotion = useReducedMotion();
  const lowPower = useMobileOrCoarse();

  if (reduceMotion) {
    return (
      <div className={`scroll-text-marquee scroll-text-marquee--static ${mergedClassName}`.trim()}>
        <div className="scroll-text-marquee__static-inner">{children}</div>
      </div>
    );
  }

  if (lowPower) {
    return (
      <CssLoopMarquee
        className={mergedClassName}
        delay={delay}
        reverse={reverse}
      >
        {children}
      </CssLoopMarquee>
    );
  }

  return (
    <ScrollDrivenMarquee
      baseVelocity={baseVelocity}
      scrollSensitivity={scrollSensitivity}
      delay={delay}
      className={className}
      clasname={clasname}
    >
      {children}
    </ScrollDrivenMarquee>
  );
}
