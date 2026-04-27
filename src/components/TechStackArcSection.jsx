import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArcGalleryHero } from './ui/arc-gallery-hero';
import './TechStackArcSection.css';

/** Tooling we ship with — Devicon / Simple Icons CDN (logos). */
export const TECH_STACK_ARC_ITEMS = [
  {
    id: 'react',
    label: 'React',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
  },
  {
    id: 'vite',
    label: 'Vite',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg',
  },
  {
    id: 'nodejs',
    label: 'Node.js',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
  },
  {
    id: 'tailwind',
    label: 'Tailwind CSS',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
  },
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  },
  {
    id: 'supabase',
    label: 'Supabase',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
  },
  {
    id: 'threejs',
    label: 'Three.js',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg',
  },
  {
    id: 'framer',
    label: 'Framer Motion',
    iconSrc: 'https://cdn.simpleicons.org/framer/0055FF',
  },
  {
    id: 'git',
    label: 'Git',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  },
];

export default function TechStackArcSection() {
  return (
    <section className="section tech-stack-arc" id="tech-stack">
      <div className="tech-stack-arc__glow" aria-hidden />
      <div className="tech-stack-arc__inner">
        <m.header
          className="tech-stack-arc__header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="tech-stack-arc__badge">Our stack</span>
          <h2 className="tech-stack-arc__title">Technologies we build with</h2>
          <p className="tech-stack-arc__lead">
            A modern, proven toolkit for fast interfaces, solid APIs, and products that scale — tuned to each
            project&apos;s needs.
          </p>
        </m.header>

        <m.div
          className="tech-stack-arc__arc-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.06 }}
        >
          <ArcGalleryHero
            items={TECH_STACK_ARC_ITEMS}
            startAngle={24}
            endAngle={156}
            radiusLg={420}
            radiusMd={300}
            radiusSm={210}
            cardSizeLg={104}
            cardSizeMd={86}
            cardSizeSm={66}
            cardTiltFactor={0.2}
          />
        </m.div>

        <m.div
          className="tech-stack-arc__footer"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <p className="tech-stack-arc__note">
            Need something specific? We integrate with your stack — talk to us about requirements.
          </p>
          <Link to="/contact" className="tech-stack-arc__cta">
            Start a conversation <span aria-hidden>→</span>
          </Link>
        </m.div>
      </div>
    </section>
  );
}
