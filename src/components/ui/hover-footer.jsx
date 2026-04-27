/**
 * Hover footer primitives (TextHoverEffect + FooterBackgroundGradient).
 *
 * shadcn/ui convention: place shareable UI under src/components/ui.
 * This project uses Vite + React (JS) + App.css — not Tailwind/shadcn.
 * For shadcn + Tailwind + TS: run `npx shadcn@latest init` in a Next/Vite TS
 * project, add `@/lib/utils` (cn), then replace framer-motion imports with "motion/react".
 */
import { useRef, useState, useId } from 'react';
import { m } from 'framer-motion';
import './hover-footer.css';

const MotionRadialGradient = m.radialGradient;
const MotionText = m.text;

export function TextHoverEffect({
  text,
  duration,
  className = '',
  viewBox = '0 0 300 100',
}) {
  const svgRef = useRef(null);
  const uid = useId().replace(/:/g, '');
  const gid = `th-grad-${uid}`;
  const rid = `th-reveal-${uid}`;
  const mid = `th-mask-${uid}`;

  const parts = viewBox.trim().split(/\s+/).map(Number);
  const vbX = Number.isFinite(parts[0]) ? parts[0] : 0;
  const vbY = Number.isFinite(parts[1]) ? parts[1] : 0;
  const vbW = Number.isFinite(parts[2]) ? parts[2] : 300;
  const vbH = Number.isFinite(parts[3]) ? parts[3] : 100;

  const midCx = vbX + vbW / 2;
  const midCy = vbY + vbH / 2;
  const spotR = Math.max(vbW, vbH) * 0.2;
  const fontSize = Math.min(vbW * 0.09, vbH * 0.52, 56);

  const [spot, setSpot] = useState({ cx: midCx, cy: midCy });
  const [hovered, setHovered] = useState(false);

  const maskTransition = { duration: duration ?? 0, ease: 'easeOut' };

  const onPointerMove = (e) => {
    const el = svgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const cx = vbX + ((e.clientX - rect.left) / rect.width) * vbW;
    const cy = vbY + ((e.clientY - rect.top) / rect.height) * vbH;
    setSpot({ cx, cy });
  };

  const rootClass = ['text-hover-effect', className].filter(Boolean).join(' ');

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setSpot({ cx: midCx, cy: midCy });
      }}
      onMouseMove={onPointerMove}
      className={rootClass}
      role="img"
      aria-label={text}
    >
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          {hovered ? (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#80eeb4" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#737373" />
              <stop offset="100%" stopColor="#737373" />
            </>
          )}
        </linearGradient>

        <MotionRadialGradient
          id={rid}
          gradientUnits="userSpaceOnUse"
          r={spotR}
          animate={{ cx: spot.cx, cy: spot.cy }}
          initial={{ cx: midCx, cy: midCy }}
          transition={maskTransition}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </MotionRadialGradient>

        <mask id={mid} maskUnits="userSpaceOnUse" x={vbX} y={vbY} width={vbW} height={vbH}>
          <rect x={vbX} y={vbY} width={vbW} height={vbH} fill={`url(#${rid})`} />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        strokeWidth="0.3"
        className="text-hover-effect__ghost"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>

      <MotionText
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        strokeWidth="0.3"
        className="text-hover-effect__trace"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 4, ease: 'easeInOut' }}
      >
        {text}
      </MotionText>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        stroke={`url(#${gid})`}
        strokeWidth="0.3"
        mask={`url(#${mid})`}
        className="text-hover-effect__fill"
      >
        {text}
      </text>
    </svg>
  );
}

export function FooterBackgroundGradient() {
  return <div className="footer__bg-gradient" aria-hidden />;
}
