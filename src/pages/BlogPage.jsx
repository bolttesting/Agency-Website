import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import Seo from '../components/Seo';
import { getBlogPostPath } from '../utils/blogPaths';
import './BlogPage.css';

function formatDateIsoDateOnly(value) {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

const categoryGradients = {
  'Web Development': 'linear-gradient(135deg, rgba(124, 58, 237, 0.35) 0%, rgba(167, 139, 250, 0.2) 50%, rgba(20, 184, 166, 0.15) 100%)',
  'Mobile': 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
  'Design': 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%)',
  'DevOps': 'linear-gradient(135deg, rgba(20, 184, 166, 0.3) 0%, rgba(45, 212, 191, 0.2) 100%)',
  'Backend': 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(76, 29, 149, 0.25) 100%)',
  'Cloud': 'linear-gradient(135deg, rgba(14, 165, 233, 0.3) 0%, rgba(124, 58, 237, 0.2) 100%)',
};

export default function BlogPage() {
  const { blogPosts = [] } = useSiteData();
  const visiblePosts = blogPosts.filter((p) => p.published !== false);
  return (
    <main className="blog-page">
      <Seo
        title="Blog"
        description="Articles on web development, mobile apps, UI/UX, and cloud from Logix Contact — practical insights for UK businesses and product teams."
        keywords="tech blog UK, web development articles, UI UX insights, software blog, Logix Contact"
      />
      <section className="blog-hero">
        <div className="blog-hero__glow" />
        <div className="blog-hero__content">
          <m.span
            className="blog-hero__badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Insights & Updates
          </m.span>
          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Our Blog
          </m.h1>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Thoughts on development, design, and digital innovation.
          </m.p>
        </div>
      </section>

      <section className="blog-posts">
        <div className="blog-posts__inner">
          <div className="blog-grid">
            {visiblePosts.map((post, i) => (
              <m.article
                key={post.id}
                className={`blog-card ${i === 0 ? 'blog-card--featured' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link to={getBlogPostPath(post)} className="blog-card__link">
                  <div
                    className="blog-card__image"
                    style={{
                      background: post.image
                        ? `linear-gradient(180deg, rgba(8,9,14,0.2) 0%, rgba(8,9,14,0.85) 100%), url(${post.image}) center/cover no-repeat`
                        : categoryGradients[post.category] || categoryGradients['Web Development'],
                    }}
                  >
                    <span className="blog-card__category">{post.category}</span>
                    <div className="blog-card__image-pattern" />
                  </div>
                  <div className="blog-card__content">
                    <time className="blog-card__date" dateTime={formatDateIsoDateOnly(post.date)}>
                      {post.date && !Number.isNaN(new Date(post.date).getTime())
                        ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : ''}
                    </time>
                    <h2 className="blog-card__title">{post.title}</h2>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <span className="blog-card__read">Read more</span>
                  </div>
                </Link>
              </m.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
