import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import Seo from '../components/Seo';
import './PortfolioPage.css';

const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
];

export default function PortfolioPage() {
  const { portfolioDisplay } = useSiteData();
  const [filter, setFilter] = useState('all');

  const filteredProjects = filter === 'all'
    ? (portfolioDisplay || [])
    : (portfolioDisplay || []).filter((p) => p.category === filter);

  return (
    <main className="portfolio-page">
      <Seo
        title="Portfolio"
        description="Explore web, mobile, and digital projects delivered by Logix Contact for clients in the UK and worldwide — case studies and live work."
        keywords="web development portfolio UK, app case studies, digital agency work, Logix Contact projects"
      />
      <section className="portfolio-hero">
        <div className="portfolio-hero__glow" />
        <div className="portfolio-hero__content">
          <m.span
            className="portfolio-hero__badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Work
          </m.span>
          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Portfolio
          </m.h1>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} delivered across web, mobile, and digital platforms.
          </m.p>
        </div>
      </section>

      <section className="portfolio-main">
        <div className="portfolio-filter">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`portfolio-filter__btn ${filter === cat.id ? 'active' : ''}`}
              onClick={() => setFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, i) => (
              <m.article
                key={project.id}
                className="portfolio-card"
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3) }}
              >
                <Link to={`/portfolio/${project.id}`} className="portfolio-card__link">
                  <div className="portfolio-card__preview">
                    {project.image && (
                      <img src={project.image} alt={`${project.name} — portfolio preview`} className="portfolio-card__img" loading="lazy" decoding="async" />
                    )}
                    <span className="portfolio-card__overlay">View Project</span>
                  </div>
                  <div className="portfolio-card__content">
                    <span className="portfolio-card__type">{project.type}</span>
                    <h2 className="portfolio-card__name">{project.name}</h2>
                    <p className="portfolio-card__tech">{project.tech}</p>
                  </div>
                </Link>
              </m.article>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
