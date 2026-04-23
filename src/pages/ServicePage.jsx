import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../components/Icons';
import { useTheme } from '../context/ThemeContext';
import { servicesMenu, servicePageContent, subServicePageContent } from '../data/servicesData';
import Seo from '../components/Seo';
import { truncateMeta } from '../config/seo';
import './ServicePage.css';

const serviceThemes = {
  'app-development': {
    heroBg: 'linear-gradient(135deg, #0f172a 0%, #134e4a 50%, #0f172a 100%)',
    heroBgLight: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 45%, #ecfeff 100%)',
    accent: '#7c3aed',
    icon: 'mobile',
  },
  'web-development': {
    heroBg: 'linear-gradient(135deg, #0f172a 0%, #312e81 50%, #0f172a 100%)',
    heroBgLight: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #f8fafc 100%)',
    accent: '#a78bfa',
    icon: 'globe',
  },
  'desktop-development': {
    heroBg: 'linear-gradient(135deg, #0f172a 0%, #115e59 50%, #0f172a 100%)',
    heroBgLight: 'linear-gradient(135deg, #ecfdf5 0%, #b2f5ea 45%, #f0fdfa 100%)',
    accent: '#14b8a6',
    icon: 'desktop',
  },
  'seo-services': {
    heroBg: 'linear-gradient(135deg, #0f172a 0%, #134e4a 45%, #1e1b4b 55%, #0f172a 100%)',
    heroBgLight: 'linear-gradient(135deg, #ecfeff 0%, #d1fae5 40%, #e0e7ff 55%, #f8fafc 100%)',
    accent: '#2dd4bf',
    icon: 'search',
  },
  'digital-marketing': {
    heroBg: 'linear-gradient(135deg, #0f172a 0%, #3b0764 50%, #0f172a 100%)',
    heroBgLight: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 50%, #fdf4ff 100%)',
    accent: '#c4b5fd',
    icon: 'megaphone',
  },
  'ui-ux-design': {
    heroBg: 'linear-gradient(135deg, #0f172a 0%, #312e81 50%, #0f172a 100%)',
    heroBgLight: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 40%, #ccfbf1 100%)',
    accent: '#14b8a6',
    icon: 'design',
  },
};

export default function ServicePage() {
  const { slug, sub } = useParams();
  const { theme: colorTheme } = useTheme();
  const service = servicesMenu.find((s) => s.id === slug);
  const theme = serviceThemes[slug] || serviceThemes['app-development'];
  const pageContent = servicePageContent[slug] || servicePageContent['app-development'];
  const heroBg = colorTheme === 'light' ? theme.heroBgLight : theme.heroBg;

  if (!service) {
    return (
      <main className="service-page">
        <Seo
          title="Service not found"
          description="The requested service page could not be found. Explore our services from the homepage or navigation."
          noindex
        />
        <div className="service-page__404">
          <h1>Service Not Found</h1>
          <Link to="/">Go Home</Link>
        </div>
      </main>
    );
  }

  const subItem = sub ? service.items.find((i) => i.slug === sub) : null;
  const subContent = sub ? subServicePageContent?.[slug]?.[sub] : null;

  const cities = 'London, Manchester, Birmingham, Leeds, Bristol, Edinburgh, Glasgow';
  const seoTitle = subItem ? `${subItem.title} (${service.title})` : service.title;
  const seoPath = subItem ? `${service.path}/${subItem.slug}` : service.path;
  const seoDescription = truncateMeta(
    (subContent?.overview ?? (subItem ? subItem.desc : pageContent?.overview)) ||
      `${service.title} for UK businesses — design, build, and launch with Logix Contact.`,
  );
  const seoKeywords = subItem
    ? `${subItem.title}, ${service.title}, ${service.title} UK, ${subItem.title} UK, ${cities}, Logix Contact`
    : `${service.title}, ${service.title} UK, ${cities}, Logix Contact, digital agency United Kingdom, software development`;

  const processSteps = pageContent?.process || [];
  const stepItems = processSteps.map((s) => (typeof s === 'string' ? { title: s, desc: '' } : s));
  const subProcess = [
    { title: 'Discover', desc: 'Align goals, audience intent, and delivery constraints for this sub-service.' },
    { title: 'Plan', desc: 'Define scope, milestones, and quality gates with measurable outcomes.' },
    { title: 'Deliver', desc: 'Execute in focused sprints with transparent updates and feedback loops.' },
    { title: 'Optimise', desc: 'Refine based on performance and user behavior to maximize impact.' },
  ];
  const relatedSubServices = servicesMenu
    .flatMap((menu) =>
      menu.items.map((item) => ({
        ...item,
        parentTitle: menu.title,
        path: `${menu.path}/${item.slug}`,
      })),
    )
    .filter((item) => !(item.slug === sub && item.parentTitle === service.title))
    .slice(0, 8);

  return (
    <main className="service-page" style={{ '--service-accent': theme.accent }}>
      <Seo
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        path={seoPath}
      />
      {/* Hero */}
      <section className={`service-hero ${subItem ? 'service-hero--sub' : ''}`} style={{ background: heroBg }}>
        <div className="service-hero__glow" />
        <div className={`service-hero__content ${subItem ? 'service-hero__content--sub' : ''}`}>
          {subItem ? (
            <div className="sub-hero">
              <motion.div
                className="sub-hero__left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="service-hero__badge">{service.title}</span>
                <h1>{subContent?.tagline || subItem.title}</h1>
                <p className="service-hero__tagline">
                  {subContent?.overview || subItem.desc}
                </p>
                <p className="service-hero__uk">Serving UK teams across {cities}.</p>
                <div className="service-hero__cta">
                  <Link to="/contact" className="service-hero__btn service-hero__btn--primary">
                    Start This Service
                  </Link>
                  <Link to={`${service.path}`} className="service-hero__btn service-hero__btn--secondary">
                    Back to {service.title}
                  </Link>
                </div>
              </motion.div>

              <motion.div
                className="sub-hero__right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <div className="sub-hero__panel">
                  <span className="sub-hero__icon">
                    <Icon name={subItem.icon || theme.icon} size={36} />
                  </span>
                  <h3>{subItem.title}</h3>
                  <ul className="sub-hero__bullets">
                    {(subContent?.whatYouGet || []).slice(0, 4).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          ) : (
            <>
              <motion.span
                className="service-hero__badge"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {service.title}
              </motion.span>
              <motion.span
                className="service-hero__icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
              >
                <Icon name={theme.icon} size={56} />
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {pageContent?.tagline || service.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="service-hero__tagline"
              >
                {pageContent?.overview || `${service.items.length} specialized offerings to power your digital success`}
              </motion.p>
              <p className="service-hero__uk">Serving UK teams across {cities}.</p>
              <div className="service-hero__cta">
                <Link to="/contact" className="service-hero__btn service-hero__btn--primary">
                  Get a Free Quote
                </Link>
                <Link to="/portfolio" className="service-hero__btn service-hero__btn--secondary">
                  See Our Work
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Stats bar */}
      {!subItem && pageContent?.stats && pageContent.stats.length > 0 && (
        <section className="service-stats">
          <div className="service-content__inner">
            <div className="service-stats__grid">
              {pageContent.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="service-stats__item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="service-stats__value">{stat.value}</span>
                  <span className="service-stats__label">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <nav className="service-breadcrumbs" aria-label="Breadcrumb">
        <div className="service-content__inner">
          <Link to="/">Home</Link>
          <span aria-hidden> / </span>
          <Link to={service.path}>Services</Link>
          <span aria-hidden> / </span>
          <Link to={service.path}>{service.title}</Link>
          {subItem ? (
            <>
              <span aria-hidden> / </span>
              <span aria-current="page">{subItem.title}</span>
            </>
          ) : null}
        </div>
      </nav>

      <section className="service-content">
        <div className={`service-content__inner ${subItem ? 'service-content__inner--sub' : ''}`}>
          {subItem ? (
            <div className="sub-premium sub-premium--services-like">
              <section className="sub-premium__section sub-premium__section--split">
                <motion.div
                  className="sub-premium__split sub-premium__split--value"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="sub-premium__copy">
                    <span className="service-section__badge">Service Value</span>
                    <h2>Outcomes You Can Expect</h2>
                    <p>{subContent?.overview}</p>
                  </div>
                  <div className="sub-premium__snapshot">
                    <article className="sub-premium__snapshot-card">
                      <span>Delivery velocity</span>
                      <strong>Fast, milestone-led sprints</strong>
                    </article>
                    <article className="sub-premium__snapshot-card">
                      <span>Implementation quality</span>
                      <strong>Clean build standards + QA</strong>
                    </article>
                    <article className="sub-premium__snapshot-card">
                      <span>Business alignment</span>
                      <strong>Priority-driven outcomes</strong>
                    </article>
                  </div>
                </motion.div>
              </section>

              {subContent?.whatYouGet?.length ? (
                <section className="sub-premium__section sub-premium__section--deliverables">
                  <motion.div
                    className="sub-premium__header"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <span className="service-section__badge">Deliverables</span>
                    <h2>What You Get In This Service</h2>
                  </motion.div>
                  <div className="sub-premium__outcomes">
                    {subContent.whatYouGet.map((item, idx) => (
                      <motion.article
                        key={item}
                        className="sub-premium__outcome-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.06 }}
                      >
                        <span className="sub-premium__outcome-index">{idx + 1}</span>
                        <h3>{item}</h3>
                        <p>Structured to support production readiness and measurable growth.</p>
                      </motion.article>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="sub-premium__section sub-premium__section--process">
                <motion.div
                  className="sub-premium__header"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="service-section__badge">Delivery Model</span>
                  <h2>How We Deliver This Service</h2>
                </motion.div>
                <div className="sub-premium__timeline sub-premium__timeline--zigzag">
                  {subProcess.map((step, idx) => (
                    <motion.div
                      key={step.title}
                      className={`sub-premium__timeline-step ${idx % 2 ? 'sub-premium__timeline-step--right' : 'sub-premium__timeline-step--left'}`}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                    >
                      <span className="sub-premium__timeline-num">{idx + 1}</span>
                      <div>
                        <h3>{step.title}</h3>
                        <p>{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {subContent?.faqs?.length ? (
                <section className="sub-premium__section sub-premium__section--split">
                  <div className="sub-premium__split sub-premium__split--faq">
                    <motion.div
                      className="sub-premium__faq-pane"
                      initial={{ opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                    >
                      <span className="service-section__badge">FAQ</span>
                      <h2>Frequently Asked Questions</h2>
                      <div className="service-faq__list">
                        {subContent.faqs.map(([q, a]) => (
                          <details key={q} className="service-faq__item">
                            <summary>{q}</summary>
                            <p>{a}</p>
                          </details>
                        ))}
                      </div>
                    </motion.div>
                    <motion.aside
                      className="sub-premium__confidence-pane"
                      initial={{ opacity: 0, x: 14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                    >
                      <span className="service-section__badge">Confidence</span>
                      <h3>Why teams choose this engagement</h3>
                      <ul>
                        <li>Clear scope and outcomes from day one</li>
                        <li>Transparent delivery cadence and accountability</li>
                        <li>Built for long-term scalability, not quick patches</li>
                      </ul>
                      <Link to="/contact" className="service-hero__btn service-hero__btn--primary">
                        Discuss Your Requirements
                      </Link>
                    </motion.aside>
                  </div>
                </section>
              ) : null}

              <section className="sub-premium__section sub-premium__section--related">
                <motion.div
                  className="sub-premium__header"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="service-section__badge">Explore More</span>
                  <h2>Related Sub-Services</h2>
                </motion.div>
                <div className="sub-premium__related-grid">
                  {relatedSubServices.map((item) => (
                    <Link key={`${item.parentTitle}-${item.slug}`} to={item.path} className="sub-premium__related-card">
                      <span className="sub-premium__related-meta">{item.parentTitle}</span>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                      <span className="sub-premium__related-cta">View sub-service →</span>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="sub-premium__section sub-premium__section--cta">
                <motion.div
                  className="service-cta sub-premium__cta"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <h2>Plan Your {subItem.title} Roadmap</h2>
                  <p>
                    We align strategy, UX, and engineering into one clear execution plan tailored to your business goals.
                  </p>
                  <Link to="/contact" className="service-cta__btn">
                    Start Your Project
                  </Link>
                </motion.div>
              </section>
            </div>
          ) : (
            <div className="service-main-modern">
              <motion.div
                className="service-section__header"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="service-section__badge">Our Offerings</span>
                <h2>What We Offer</h2>
              </motion.div>
              <div className="service-offerings">
                {service.items.map((item, i) => (
                  <motion.div
                    key={item.title}
                    className="service-offering"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                  >
                    <span className="service-offering__icon"><Icon name={item.icon} size={28} /></span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    {item.slug ? (
                      <Link className="service-offering__link" to={`${service.path}/${item.slug}`}>
                        Learn more →
                      </Link>
                    ) : null}
                  </motion.div>
                ))}
              </div>

              {pageContent?.highlights && (
                <motion.div
                  className="service-tech"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <span className="service-section__badge">Tech Stack</span>
                  <h2>Technologies We Use</h2>
                  <div className="service-tech__grid">
                    {pageContent.highlights.map((tech, i) => (
                      <motion.span
                        key={tech}
                        className="service-tech__badge"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {stepItems.length > 0 && (
                <motion.div
                  className="service-process"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <span className="service-section__badge">Our Approach</span>
                  <h2>Our Process</h2>
                  <div className="service-process__steps">
                    {stepItems.map((step, i) => (
                      <motion.div
                        key={step.title}
                        className="service-process__step"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <span className="service-process__num">{i + 1}</span>
                        <div>
                          <strong>{step.title}</strong>
                          {step.desc && <p>{step.desc}</p>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {pageContent?.benefits && (
                <motion.div
                  className="service-benefits"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <span className="service-section__badge">Why Us</span>
                  <h2>Key Benefits</h2>
                  <div className="service-benefits__grid">
                    {pageContent.benefits.map((benefit, i) => (
                      <motion.div
                        key={benefit.title}
                        className="service-benefits__card"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -4 }}
                      >
                        <span className="service-benefits__icon"><Icon name={benefit.icon} size={32} /></span>
                        <h4>{benefit.title}</h4>
                        <p>{benefit.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="service-related">
                <span className="service-section__badge">Explore more</span>
                <h2>Related services</h2>
                <div className="service-related__grid">
                  {servicesMenu
                    .filter((s) => s.id !== service.id)
                    .slice(0, 4)
                    .map((s) => (
                      <Link key={s.id} to={s.path} className="service-related__card">
                        <Icon name={serviceThemes[s.id]?.icon || 'globe'} size={20} />
                        <span>{s.title}</span>
                        <small>{s.items.length} specialist services</small>
                      </Link>
                    ))}
                </div>
              </div>

              <motion.div
                className="service-why"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <span className="service-section__badge">Trust</span>
                <h2>Why Choose Us</h2>
                <div className="service-why__grid">
                  <div className="service-why__card">
                    <span><Icon name="check" size={28} /></span>
                    <h4>Expert Team</h4>
                    <p>Certified professionals with years of industry experience</p>
                  </div>
                  <div className="service-why__card">
                    <span><Icon name="check" size={28} /></span>
                    <h4>Proven Track Record</h4>
                    <p>Successful projects delivered across diverse industries</p>
                  </div>
                  <div className="service-why__card">
                    <span><Icon name="check" size={28} /></span>
                    <h4>End-to-End Support</h4>
                    <p>From discovery to deployment and beyond</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="service-cta"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <h2>Ready to Get Started?</h2>
                <p>Let's discuss your project and create something amazing together.</p>
                <Link to="/contact" className="service-cta__btn">
                  Get a Free Quote
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
