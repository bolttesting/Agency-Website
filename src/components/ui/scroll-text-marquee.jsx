import { useEffect, useRef, useState } from 'react';
import {
  m,
  useScroll,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
  wrap,
} from 'framer-motion';

/**
 * Horizontal marquee: motion follows **vertical page scroll** (scroll down → text slides).
 * Optional tiny idle drift via `baseVelocity`. Tweak `scrollSensitivity` if it feels weak/strong.
 */
export default function ScrollBaseAnimation({
  children,
  baseVelocity = 0.12,
  scrollSensitivity = 0.007,
  delay = 0,
  className,
  clasname,
}) {
  const mergedClassName = [className, clasname].filter(Boolean).join(' ');
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const [active, setActive] = useState(!delay);

  const scrollPrev = useRef(null);
  const initScroll = useRef(false);

  useEffect(() => {
    if (!delay) return undefined;
    const id = window.setTimeout(() => setActive(true), delay);
    return () => clearTimeout(id);
  }, [delay]);

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (!active || reduceMotion) return;

    const sy = scrollY.get();
    if (!initScroll.current) {
      scrollPrev.current = sy;
      initScroll.current = true;
      return;
    }

    const deltaY = sy - scrollPrev.current;
    scrollPrev.current = sy;

    // Scroll drives horizontal motion: scroll down → negative shift (left).
    // Clamp per-frame delta so wheel / trackpad spikes don’t whip the strip.
    const dampedDelta = Math.sign(deltaY) * Math.min(Math.abs(deltaY), 14);
    let move = -dampedDelta * scrollSensitivity;

    // Very slow idle drift (sign from baseVelocity)
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

  if (reduceMotion) {
    return (
      <div className={`scroll-text-marquee scroll-text-marquee--static ${mergedClassName}`.trim()}>
        <div className="scroll-text-marquee__static-inner">{children}</div>
      </div>
    );
  }

  return (
    <div className="scroll-text-marquee">
      <m.div className={mergedClassName} style={{ x, display: 'inline-block', whiteSpace: 'nowrap' }}>
        {text}
      </m.div>
    </div>
  );
}
