import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import Icon from '../Icons';
import './card-hover-effect.css';

export type HoverEffectItem = {
  title: string;
  description: string;
  /** In-app path (e.g. `/services/web-development`) */
  link: string;
  icon?: string;
};

type HoverEffectProps = {
  items: HoverEffectItem[];
  className?: string;
};

/**
 * Aceternity-style card hover: shared layoutId highlight slides between cells.
 * Uses site tokens + framer-motion (no Tailwind).
 */
export function HoverEffect({ items, className = '' }: HoverEffectProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const layoutId = `che-${useId().replace(/:/g, '')}`;

  return (
    <div
      className={`card-hover-effect ${className}`.trim()}
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((item, i) => (
        <Link
          key={item.title}
          to={item.link}
          className="card-hover-effect__cell"
          onMouseEnter={() => setHovered(i)}
        >
          {hovered === i ? (
            <m.div
              layoutId={layoutId}
              className="card-hover-effect__highlight"
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            />
          ) : null}
          <div className="card-hover-effect__inner">
            {item.icon ? (
              <span className="card-hover-effect__icon">
                <Icon name={item.icon} size={26} />
              </span>
            ) : null}
            <h3 className="card-hover-effect__title">{item.title}</h3>
            <p className="card-hover-effect__desc">{item.description}</p>
            <span className="card-hover-effect__cta">
              Explore
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
