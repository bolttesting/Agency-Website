import { useRef } from 'react';
import { m, useInView } from 'framer-motion';

const projects = [
  {
    name: 'FinFlow',
    type: 'Web App',
    tech: 'React • Node • PostgreSQL',
    gradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(14, 165, 233, 0.1) 100%)',
  },
  {
    name: 'HealthTrack',
    type: 'Mobile App',
    tech: 'React Native • Firebase',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
  },
  {
    name: 'EcoMarket',
    type: 'E-commerce',
    tech: 'Next.js • Stripe • Sanity',
    gradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%)',
  },
  {
    name: 'DevHub',
    type: 'SaaS Platform',
    tech: 'Vue • Go • AWS',
    gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(59, 130, 246, 0.1) 100%)',
  },
];

function ProjectCard({ project, index }) {
  return (
    <m.div
      className="project-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <m.div
        className="project-card__gradient"
        style={{ background: project.gradient }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
      <div className="project-card__content">
        <span className="project-card__type">{project.type}</span>
        <h3 className="project-card__name">{project.name}</h3>
        <p className="project-card__tech">{project.tech}</p>
        <m.a
          href="#"
          className="project-card__link"
          whileHover={{ x: 5 }}
        >
          View Project →
        </m.a>
      </div>
      <div className="project-card__code-preview">
        <span>// {project.name.toLowerCase()}.jsx</span>
        <span>export default function</span>
      </div>
    </m.div>
  );
}

export default function Portfolio() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section portfolio" id="portfolio" ref={ref}>
      <div className="section__inner">
        <m.div
          className="section__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section__tag">Our Work</span>
          <h2 className="section__title">Selected Work</h2>
          <p className="section__desc">
            Projects that define our craft and push boundaries.
          </p>
        </m.div>

        <div className="portfolio__grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
