import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * CSS `@keyframes` loop — runs on the compositor. No rAF, no `useScroll`, no main-thread scroll sync.
 * (Scroll-linked Framer marquees competed with the browser and caused scroll jank on desktop too.)
 */
function CssLoopMarquee({ children, className, delay, reverse }) {
  const [active, setActive] = useState(!delay);
  const merged = [
    'scroll-text-marquee',
    'scroll-text-marquee--css-loop',
    className,
    reverse ? 'scroll-text-marquee--css-loop-reverse' : '',
  ]
    .filter(Boolean)
    .join(' ');

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

export default function ScrollBaseAnimation({
  children,
  delay = 0,
  className,
  clasname,
  reverse = false,
}) {
  const mergedClassName = [className, clasname].filter(Boolean).join(' ');
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={`scroll-text-marquee scroll-text-marquee--static ${mergedClassName}`.trim()}>
        <div className="scroll-text-marquee__static-inner">{children}</div>
      </div>
    );
  }

  return (
    <CssLoopMarquee className={mergedClassName} delay={delay} reverse={reverse}>
      {children}
    </CssLoopMarquee>
  );
}
