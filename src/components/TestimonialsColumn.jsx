import { m } from 'framer-motion';
import { Stars } from './Icons';
import './TestimonialsColumn.css';

function isImageUrl(value) {
  if (!value || typeof value !== 'string') return false;
  const v = value.trim();
  return v.startsWith('http') || v.startsWith('/') || v.startsWith('data:');
}

function TestimonialMarqueeCard({ t }) {
  const imgSrc = t.image && isImageUrl(t.image) ? t.image : isImageUrl(t.avatar) ? t.avatar : null;
  const initials = (t.avatar && !imgSrc ? t.avatar : t.name?.slice(0, 2)) || '?';

  return (
    <div className="tcol-card">
      <p className="tcol-card__text">{t.text}</p>
      <div className="tcol-card__stars">
        <Stars count={5} size={14} />
      </div>
      <div className="tcol-card__author">
        {imgSrc ? (
          <img className="tcol-card__photo" src={imgSrc} alt={t.name} width={40} height={40} loading="lazy" />
        ) : (
          <div className="tcol-card__avatar" aria-hidden>
            {initials}
          </div>
        )}
        <div className="tcol-card__meta">
          <div className="tcol-card__name">{t.name}</div>
          <div className="tcol-card__role">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {object} props
 * @param {Array<{ name: string, role: string, text: string, avatar?: string, image?: string }>} props.testimonials
 * @param {number} [props.duration]
 * @param {string} [props.className]
 * @param {boolean} [props.reverse] Scroll direction (second column)
 */
export function TestimonialsColumn({
  testimonials,
  duration = 42,
  className = '',
  reverse = false,
}) {
  const items = (testimonials || []).filter((t) => t?.text);
  if (!items.length) return null;

  return (
    <div className={['tcol', className].filter(Boolean).join(' ')}>
      <m.div
        className="tcol__track"
        animate={{ y: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 0,
        }}
      >
        <div className="tcol__stack">
          {items.map((t, i) => (
            <TestimonialMarqueeCard key={`m1-${i}-${t.name}`} t={t} />
          ))}
        </div>
        <div className="tcol__stack" aria-hidden="true">
          {items.map((t, i) => (
            <TestimonialMarqueeCard key={`m2-${i}-${t.name}`} t={t} />
          ))}
        </div>
      </m.div>
    </div>
  );
}

export default TestimonialsColumn;
