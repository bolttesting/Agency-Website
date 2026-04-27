import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import Icon from './Icons';

const services = [
  { icon: 'globe', title: 'Web Development', desc: 'High-performance, scalable web apps with modern stacks. React, Next.js, and beyond.' },
  { icon: 'mobile', title: 'App Development', desc: 'Native and cross-platform mobile apps. React Native, Flutter for iOS & Android.' },
  { icon: 'design', title: 'UI/UX Design', desc: 'User-centric interfaces. From wireframes to pixel-perfect implementation.' },
  { icon: 'zap', title: 'Digital Solutions', desc: 'APIs, integrations, cloud deployment. End-to-end technical expertise.' },
];

function ServiceCard({ item, index }) {
  return (
    <m.div
      className="service-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
    >
      <m.div
        className="service-card__icon"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <Icon name={item.icon} size={32} />
      </m.div>
      <h3 className="service-card__title">{item.title}</h3>
      <p className="service-card__desc">{item.desc}</p>
    </m.div>
  );
}

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section services" id="services" ref={ref}>
      <div className="section__inner">
        <m.div
          className="section__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section__tag">Our Services</span>
          <h2 className="section__title">What We Build</h2>
          <p className="section__desc">
            Full-stack expertise across web, mobile, and digital platforms.
          </p>
        </m.div>

        <div className="services__grid">
          {services.map((item, i) => (
            <ServiceCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
