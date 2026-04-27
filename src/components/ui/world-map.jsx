import { useRef, useState, useMemo, useId } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import DottedMap from 'dotted-map';
import './world-map.css';

function projectPoint(lat, lng) {
  const x = (lng + 180) * (800 / 360);
  const y = (90 - lat) * (400 / 180);
  return { x, y };
}

function createCurvedPath(start, end) {
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - 50;
  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
}

/**
 * Dotted world map with animated great-arc-style curves between points.
 * Ported for Vite/React (no next/image, no next-themes).
 */
export function WorldMap({
  dots = [],
  lineColor = '#14b8a6',
  mapDotColor = 'rgba(20, 184, 166, 0.28)',
  backgroundColor = '#050508',
  showLabels = true,
  animationDuration = 2,
  loop = true,
  className = '',
}) {
  const svgRef = useRef(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const reactId = useId().replace(/:/g, '');
  const gradId = `wm-grad-${reactId}`;
  const glowId = `wm-glow-${reactId}`;

  const map = useMemo(() => new DottedMap({ height: 100, grid: 'diagonal' }), []);

  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.22,
        color: mapDotColor,
        shape: 'circle',
        backgroundColor,
      }),
    [map, mapDotColor, backgroundColor],
  );

  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`;

  const staggerDelay = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime = 2;
  const fullCycleDuration = totalAnimationTime + pauseTime;

  return (
    <div
      className={`world-map ${className}`.trim()}
      style={{ backgroundColor }}
      role="img"
      aria-label="Stylised world map showing dotted connections between office locations"
    >
      <img
        src={dataUri}
        alt=""
        role="presentation"
        width={1056}
        height={495}
        className="world-map__base"
        draggable={false}
        decoding="async"
      />

      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="world-map__svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feMorphology operator="dilate" radius="0.5" />
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          const pathD = createCurvedPath(startPoint, endPoint);
          const startTime = (i * staggerDelay) / fullCycleDuration;
          const endTime = (i * staggerDelay + animationDuration) / fullCycleDuration;
          const resetTime = totalAnimationTime / fullCycleDuration;

          return (
            <g key={`path-group-${i}`}>
              <m.path
                d={pathD}
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth="1.15"
                initial={{ pathLength: 0 }}
                animate={
                  loop
                    ? { pathLength: [0, 0, 1, 1, 0] }
                    : { pathLength: 1 }
                }
                transition={
                  loop
                    ? {
                        duration: fullCycleDuration,
                        times: [0, startTime, endTime, resetTime, 1],
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatDelay: 0,
                      }
                    : {
                        duration: animationDuration,
                        delay: i * staggerDelay,
                        ease: 'easeInOut',
                      }
                }
              />

            </g>
          );
        })}

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);

          return (
            <g key={`points-group-${i}`}>
              <g>
                <g
                  className="world-map__point"
                  onPointerEnter={() => setHoveredLocation(dot.start.label || `Location ${i}`)}
                  onPointerLeave={() => setHoveredLocation(null)}
                >
                  <circle
                    cx={startPoint.x}
                    cy={startPoint.y}
                    r="3"
                    fill={lineColor}
                    filter={`url(#${glowId})`}
                  />
                  <circle cx={startPoint.x} cy={startPoint.y} r="3" fill={lineColor} opacity="0.5">
                    <animate attributeName="r" from="3" to="12" dur="2s" begin="0s" repeatCount="indefinite" />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="2s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>

                {showLabels && dot.start.label ? (
                  <m.g
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 * i + 0.3, duration: 0.5 }}
                    style={{ pointerEvents: 'none' }}
                  >
                    <foreignObject x={startPoint.x - 52} y={startPoint.y - 38} width="104" height="34">
                      <div xmlns="http://www.w3.org/1999/xhtml" className="world-map__label">
                        <span>{dot.start.label}</span>
                      </div>
                    </foreignObject>
                  </m.g>
                ) : null}
              </g>

              <g>
                <g
                  className="world-map__point"
                  onPointerEnter={() => setHoveredLocation(dot.end.label || `Destination ${i}`)}
                  onPointerLeave={() => setHoveredLocation(null)}
                >
                  <circle
                    cx={endPoint.x}
                    cy={endPoint.y}
                    r="3"
                    fill={lineColor}
                    filter={`url(#${glowId})`}
                  />
                  <circle cx={endPoint.x} cy={endPoint.y} r="3" fill={lineColor} opacity="0.5">
                    <animate attributeName="r" from="3" to="12" dur="2s" begin="0.5s" repeatCount="indefinite" />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="2s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>

                {showLabels && dot.end.label ? (
                  <m.g
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 * i + 0.5, duration: 0.5 }}
                    style={{ pointerEvents: 'none' }}
                  >
                    <foreignObject x={endPoint.x - 52} y={endPoint.y - 38} width="104" height="34">
                      <div xmlns="http://www.w3.org/1999/xhtml" className="world-map__label">
                        <span>{dot.end.label}</span>
                      </div>
                    </foreignObject>
                  </m.g>
                ) : null}
              </g>
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {hoveredLocation ? (
          <m.div
            key={hoveredLocation}
            className="world-map__tooltip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {hoveredLocation}
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
