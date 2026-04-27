import * as React from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import './card-stack.css';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function isExternalHref(href) {
  return href && /^https?:\/\//i.test(href);
}

function SmartLink({ href, className, ariaLabel, children }) {
  if (!href) return null;
  if (isExternalHref(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer" aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

function IconOpenExternal({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  );
}

function wrapIndex(n, len) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i, active, len, loop) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

function DefaultFanCard({ item }) {
  return (
    <div className="card-stack-default">
      <div className="card-stack-default__media">
        {item.imageSrc ? (
          <img src={item.imageSrc} alt={item.title} draggable={false} loading="lazy" />
        ) : (
          <div className="card-stack-default__placeholder">No image</div>
        )}
      </div>
      <div className="card-stack-default__overlay" aria-hidden />
      <div className="card-stack-default__body">
        {item.tag ? <span className="card-stack-default__tag">{item.tag}</span> : null}
        <div className="card-stack-default__title">{item.title}</div>
        {item.description ? <div className="card-stack-default__desc">{item.description}</div> : null}
      </div>
    </div>
  );
}

/**
 * @param {object} props
 * @param {Array<{ id: string|number, title: string, description?: string, imageSrc?: string, href?: string, tag?: string }>} props.items
 */
export function CardStack({
  items,
  initialIndex = 0,
  maxVisible = 7,
  cardWidth = 520,
  cardHeight = 320,
  overlap = 0.48,
  spreadDeg = 48,
  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,
  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,
  springStiffness = 280,
  springDamping = 28,
  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,
  showDots = true,
  className,
  onChangeIndex,
  renderCard,
}) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len));
  const [hovering, setHovering] = React.useState(false);

  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]);
  }, [active, len, items, onChangeIndex]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len) return;
    if (!canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len) return;
    if (!canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  React.useEffect(() => {
    if (!autoAdvance) return;
    if (reduceMotion) return;
    if (!len) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(
      () => {
        if (loop || active < len - 1) next();
      },
      Math.max(700, intervalMs),
    );

    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next]);

  if (!len) return null;

  const activeItem = items[active];
  const stageH = Math.max(
    400,
    Math.round(cardHeight + activeLiftPx + 110 + cardHeight * Math.max(0, activeScale - 1)),
  );

  return (
    <div
      className={cn('card-stack', className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className="card-stack__stage"
        style={{ height: stageH }}
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="region"
        aria-roledescription="carousel"
        aria-label="Project cards"
      >
        <div className="card-stack__glow-top" aria-hidden />
        <div className="card-stack__glow-bottom" aria-hidden />

        <div
          className="card-stack__perspective"
          style={{ perspective: `${perspectivePx}px` }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;
              if (!visible) return null;

              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 10;
              const z = -abs * depthPx;
              const isActive = off === 0;
              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;
              const rotateX = isActive ? 0 : tiltXDeg;
              const zIndex = 100 - abs;

              const dragProps = isActive
                ? {
                    drag: 'x',
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (_e, info) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(160, cardWidth * 0.22);
                      if (travel > threshold || v > 650) prev();
                      else if (travel < -threshold || v < -650) next();
                    },
                  }
                : {};

              return (
                <m.div
                  key={item.id}
                  className={cn(
                    'card-stack__card',
                    isActive ? 'card-stack__card--active' : 'card-stack__card--inactive',
                  )}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: 'preserve-3d',
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 40,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    scale,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  onClick={() => setActive(i)}
                  {...dragProps}
                >
                  <div
                    className="card-stack__card-inner"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {renderCard ? renderCard(item, { active: isActive }) : <DefaultFanCard item={item} />}
                  </div>
                </m.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {showDots ? (
        <div className="card-stack__nav">
          <div className="card-stack__dots">
            {items.map((it, idx) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setActive(idx)}
                className={cn('card-stack__dot', idx === active ? 'card-stack__dot--on' : '')}
                aria-label={`Go to ${it.title}`}
              />
            ))}
          </div>
          {activeItem.href ? (
            <SmartLink href={activeItem.href} className="card-stack__open" ariaLabel="Open project">
              <IconOpenExternal />
            </SmartLink>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
