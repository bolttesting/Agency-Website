import { useRef } from 'react';
import { m, useInView } from 'framer-motion';

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '30+', label: 'Happy Clients' },
  { value: '5+', label: 'Years Experience' },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section about" id="about" ref={ref}>
      <div className="section__inner about__inner">
        <m.div
          className="about__content"
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section__tag">About Us</span>
          <h2 className="section__title">We Code. We Ship. We Iterate.</h2>
          <p className="about__text">
            We're a team of developers and designers who believe in clean code,
            intuitive interfaces, and delivery that exceeds expectations. Every
            project starts with understanding your vision—then we build it with
            precision and care.
          </p>
          <p className="about__text">
            From MVP to scaling, we partner with startups and enterprises to
            bring digital products to life. Our stack is modern, our process is
            agile, our results speak for themselves.
          </p>
        </m.div>

        <m.div
          className="about__stats"
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, i) => (
            <m.div
              key={stat.label}
              className="about__stat"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <span className="about__stat-value">{stat.value}</span>
              <span className="about__stat-label">{stat.label}</span>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
