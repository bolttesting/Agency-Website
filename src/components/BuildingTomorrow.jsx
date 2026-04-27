import { m } from 'framer-motion';
import { HoverEffect } from './ui/card-hover-effect';

const offerings = [
  {
    icon: 'desktop',
    title: 'Web Applications',
    description: 'Custom web apps built for scale, performance, and SEO — from marketing sites to complex platforms.',
    link: '/services/web-development',
  },
  {
    icon: 'mobile',
    title: 'Mobile Applications',
    description: 'Native and cross-platform apps for iOS and Android that feel fast, polished, and on-brand.',
    link: '/services/app-development',
  },
  {
    icon: 'bot',
    title: 'AI Solutions',
    description: 'Practical AI integrations and automation that support your product without the hype.',
    link: '/services/digital-marketing',
  },
  {
    icon: 'design',
    title: 'UI/UX Design',
    description: 'Research-led interfaces, design systems, and prototypes your engineers can ship with confidence.',
    link: '/services/ui-ux-design',
  },
  {
    icon: 'gear',
    title: 'Custom Software',
    description: 'Desktop, internal tools, and specialized builds when off-the-shelf products are not enough.',
    link: '/services/desktop-development',
  },
  {
    icon: 'trending',
    title: 'Digital Marketing',
    description: 'SEO, content, and campaigns that connect your product story to the right audiences.',
    link: '/services/seo-services',
  },
];

export default function BuildingTomorrow() {
  return (
    <section className="section building">
      <div className="building__glow" />
      <div className="section__inner">
        <m.div
          className="building__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="building__badge">What We Build</span>
          <h2 className="building__title">Building Tomorrow, one line of code at a time</h2>
          <p className="building__subtitle">Comprehensive solutions for modern businesses.</p>
          <span className="building__accent-line" />
        </m.div>
        <div className="building__cards-shell">
          <HoverEffect items={offerings} />
        </div>
      </div>
    </section>
  );
}
