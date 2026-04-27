import { useParams, Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { useSiteData } from '../context/SiteDataContext';
import Seo from '../components/Seo';
import { truncateMeta } from '../config/seo';
import './PortfolioProjectPage.css';

export default function PortfolioProjectPage() {
  const { id } = useParams();
  const { portfolioDisplay, portfolioDetailsDisplay } = useSiteData();
  const projects = portfolioDisplay || [];
  const project = projects.find((p) => String(p.id) === String(id));
  const details = project ? (portfolioDetailsDisplay && portfolioDetailsDisplay[project.id]) : null;
  const sameCategory = projects.filter(
    (p) => String(p.id) !== String(id) && p.category === project?.category
  );
  const related = sameCategory.length >= 3
    ? sameCategory.slice(0, 3)
    : [...sameCategory, ...projects.filter((p) => String(p.id) !== String(id) && !sameCategory.find((s) => String(s.id) === String(p.id)))].slice(0, 3);

  if (!project) {
    return (
      <main className="portfolio-project-page">
        <Seo
          title="Project not found"
          description="This portfolio project could not be found. View our full portfolio for recent work from Logix Contact."
          noindex
        />
        <div className="portfolio-project__404">
          <h1>Project Not Found</h1>
          <Link to="/portfolio">Back to Portfolio</Link>
        </div>
      </main>
    );
  }

  const projectDesc = truncateMeta(details?.overview || project.description || '');

  return (
    <main className="portfolio-project-page">
      <Seo
        title={project.name}
        description={projectDesc || `Case study: ${project.name} — ${project.type || 'digital project'} by Logix Contact, UK product studio.`}
        keywords={`${project.name}, portfolio, ${project.tech || ''}, ${project.type || ''}, UK web agency, Logix Contact`}
        image={project.image}
      />
      <m.article
        className="portfolio-project"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="portfolio-project__hero">
          {project.image && (
            <img src={project.image} alt={`${project.name} — project hero`} className="portfolio-project__hero-img" fetchPriority="high" decoding="async" />
          )}
          <div className="portfolio-project__hero-overlay" />
          <div className="portfolio-project__hero-content">
            <span className="portfolio-project__type">{project.type}</span>
            <h1 className="portfolio-project__title">{project.name}</h1>
            <p className="portfolio-project__tech">{project.tech}</p>
          </div>
        </div>

        <div className="portfolio-project__body">
          <Link to="/portfolio" className="portfolio-project__back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Portfolio
          </Link>

          {(details?.year || details?.client || details?.duration) && (
            <div className="portfolio-project__meta">
              <span className="portfolio-project__meta-extra">
                {[details?.year, details?.client, details?.duration].filter(Boolean).join(' • ')}
              </span>
            </div>
          )}

          <p className="portfolio-project__desc">
            {details?.overview || project.description}
          </p>

          <div className="portfolio-project__actions">
            <a href={details?.liveUrl || '#'} className="portfolio-project__btn portfolio-project__btn--primary">
              View Live Project
            </a>
            <a href={details?.caseStudyUrl || '#'} className="portfolio-project__btn portfolio-project__btn--outline">
              Case Study
            </a>
          </div>

          {/* Challenge & Solution */}
          {(details?.challenge || details?.solution) && (
            <section className="portfolio-project__section">
              {details.challenge && (
                <m.div
                  className="portfolio-project__block"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h3>The Challenge</h3>
                  <p>{details.challenge}</p>
                </m.div>
              )}
              {details.solution && (
                <m.div
                  className="portfolio-project__block"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h3>Our Solution</h3>
                  <p>{details.solution}</p>
                </m.div>
              )}
            </section>
          )}

          {/* Key Features */}
          {details?.features && details.features.length > 0 && (
            <section className="portfolio-project__section">
              <h2 className="portfolio-project__section-title">Key Features</h2>
              <div className="portfolio-project__features">
                {details.features.map((feat, i) => (
                  <m.div
                    key={feat.title}
                    className="portfolio-project__feature"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <h4>{feat.title}</h4>
                    <p>{feat.desc}</p>
                  </m.div>
                ))}
              </div>
            </section>
          )}

          {/* Tech Stack */}
          {details?.techStack && details.techStack.length > 0 && (
            <section className="portfolio-project__section">
              <h2 className="portfolio-project__section-title">Technologies</h2>
              <div className="portfolio-project__tech-stack">
                {details.techStack.map((tech) => (
                  <span key={tech} className="portfolio-project__tech-badge">{tech}</span>
                ))}
              </div>
            </section>
          )}

          {/* Results */}
          {details?.results && details.results.length > 0 && (
            <section className="portfolio-project__section portfolio-project__section--stats">
              <h2 className="portfolio-project__section-title">Results</h2>
              <div className="portfolio-project__results">
                {details.results.map((r, i) => (
                  <m.div
                    key={r.label}
                    className="portfolio-project__result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="portfolio-project__result-value">{r.value}</span>
                    <span className="portfolio-project__result-label">{r.label}</span>
                  </m.div>
                ))}
              </div>
            </section>
          )}

          {/* Gallery */}
          {details?.gallery && details.gallery.length > 0 && (
            <section className="portfolio-project__section">
              <h2 className="portfolio-project__section-title">Gallery</h2>
              <div className="portfolio-project__gallery">
                {details.gallery.map((img, i) => (
                  <m.div
                    key={i}
                    className="portfolio-project__gallery-item"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <img src={img} alt={`${project.name} - screenshot ${i + 1}`} />
                  </m.div>
                ))}
              </div>
            </section>
          )}

          {/* Testimonial */}
          {details?.testimonial && (
            <m.blockquote
              className="portfolio-project__testimonial"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p>"{details.testimonial.quote}"</p>
              <cite>— {details.testimonial.author}</cite>
            </m.blockquote>
          )}
        </div>

        {related.length > 0 && (
          <div className="portfolio-project__related">
            <h3>Related Projects</h3>
            <div className="portfolio-project__related-grid">
              {related.map((p) => (
                <Link key={p.id} to={`/portfolio/${p.id}`} className="portfolio-project__related-card">
                  <div className="portfolio-project__related-preview">
                    {p.image && <img src={p.image} alt={p.name} />}
                  </div>
                  <span>{p.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </m.article>
    </main>
  );
}
