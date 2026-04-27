import { m, useReducedMotion } from 'framer-motion';
import { Stars } from './Icons';
import { useSiteData } from '../context/SiteDataContext';
import { TestimonialsColumn } from './TestimonialsColumn';

function avatarIsImageUrl(avatar) {
  if (!avatar || typeof avatar !== 'string') return false;
  const v = avatar.trim();
  return v.startsWith('http') || v.startsWith('/') || v.startsWith('data:');
}

const defaultTestimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    text: 'Exceptional work from start to finish. They delivered our web app on time and exceeded our expectations. Highly recommend!',
    avatar: 'SJ',
  },
  {
    name: 'Michael Chen',
    role: 'Founder, InnovateLab',
    text: 'The team understood our vision perfectly. The mobile app they built has transformed our user engagement. Five stars!',
    avatar: 'MC',
  },
  {
    name: 'Emma Roberts',
    role: 'Director, ScaleUp',
    text: 'Professional, responsive, and results-driven. Our digital presence has grown significantly since working with them.',
    avatar: 'ER',
  },
];

export default function Testimonials() {
  const reduceMotion = useReducedMotion();
  const { testimonials: data = [] } = useSiteData();
  const testimonials = data.length ? data : defaultTestimonials;

  return (
    <section className="section testimonials">
      <div className="testimonials__glow" />
      <div className="section__inner section__inner--testimonials">
        <m.div
          className="testimonials__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="testimonials__badge">What Clients Say</span>
          <h2 className="testimonials__title">Why Business Trust Us</h2>
          <p className="testimonials__subtitle">Client Success Stories</p>
          <span className="testimonials__accent-line" />
        </m.div>

        {reduceMotion ? (
          <div className="testimonials__grid">
            {testimonials.map((t, i) => (
              <m.div
                key={t.name}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <span className="testimonial-card__quote">"</span>
                <p className="testimonial-card__text">{t.text}</p>
                <div className="testimonial-card__stars">
                  <Stars count={5} size={16} />
                </div>
                <div className="testimonial-card__author">
                  {avatarIsImageUrl(t.avatar) ? (
                    <img
                      className="testimonial-card__avatar testimonial-card__avatar--img"
                      src={t.avatar}
                      alt=""
                      width={48}
                      height={48}
                      loading="lazy"
                    />
                  ) : (
                    <div className="testimonial-card__avatar">{t.avatar}</div>
                  )}
                  <div>
                    <span className="testimonial-card__name">{t.name}</span>
                    <span className="testimonial-card__role">{t.role}</span>
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        ) : (
          <div className="testimonials__marquee">
            <div className="testimonials__marquee-col">
              <TestimonialsColumn testimonials={testimonials} duration={36} />
            </div>
            <div className="testimonials__marquee-col">
              <TestimonialsColumn testimonials={testimonials} duration={44} reverse />
            </div>
            <div className="testimonials__marquee-col">
              <TestimonialsColumn testimonials={testimonials} duration={52} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
