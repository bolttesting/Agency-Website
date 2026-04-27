import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { m, useScroll, useTransform } from 'framer-motion'
import './about-what-we-do-stack.css'

function StackingCard({ i, title, description, image, color, progress, range, targetScale }) {
  const cardRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div
      ref={cardRef}
      className="about-wedo-stack-card"
      style={{ zIndex: i + 1 }}
    >
      <m.div
        className="about-wedo-stack-card__surface"
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
      >
        <h2 className="about-wedo-stack-card__title">{title}</h2>
        <div className="about-wedo-stack-card__row">
          <div className="about-wedo-stack-card__copy">
            <p className="about-wedo-stack-card__desc">{description}</p>
            <Link to="/#services" className="about-wedo-stack-card__link">
              See more
              <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path
                  d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
          <div className="about-wedo-stack-card__img-shell">
            <m.div className="about-wedo-stack-card__img-motion" style={{ scale: imageScale }}>
              <img src={image} alt={title} className="about-wedo-stack-card__img" loading={i < 2 ? 'eager' : 'lazy'} />
            </m.div>
          </div>
        </div>
      </m.div>
    </div>
  )
}

/**
 * Scroll-driven stacking cards for “What we do” (sticky + scale).
 * @param {object} props
 * @param {Array<{ title: string, description: string, color: string, image: string }>} props.items
 */
export default function AboutWhatWeDoStack({ items }) {
  const cardsRef = useRef(null)
  /* Progress 0→1 only while scrolling through the cards block (matches Larose-style stack) */
  const { scrollYProgress } = useScroll({
    target: cardsRef,
    offset: ['start start', 'end end'],
  })

  const n = items.length
  const step = n > 1 ? 1 / (n - 1) : 1

  return (
    <section className="about-wedo-stack about-section about-section--innovation" aria-labelledby="about-wedo-heading">
      <div className="about-section__glow" aria-hidden />
      <div className="about-wedo-stack__track">
        <div className="about-wedo-stack__intro">
          <div className="about-wedo-stack__intro-grid" aria-hidden />
          <div className="about-wedo-stack__intro-inner">
            <span className="about-wedo-stack__badge">What We Do</span>
            <h2 id="about-wedo-heading" className="about-wedo-stack__intro-title">
              Driving Digital Innovation
            </h2>
            <p className="about-wedo-stack__intro-sub">
              We are committed to delivering exceptional results that exceed your expectations. Scroll to explore our
              services.
            </p>
            <span className="about-wedo-stack__accent-line" aria-hidden />
          </div>
        </div>

        <div ref={cardsRef} className="about-wedo-stack__cards">
          {items.map((project, i) => {
            const targetScale = 1 - (n - i) * 0.05
            const rawStart = n > 1 ? i * step : 0
            const rangeStart = rawStart >= 1 ? Math.max(0, 1 - 1e-6) : rawStart
            return (
              <StackingCard
                key={project.title}
                i={i}
                title={project.title}
                description={project.description}
                image={project.image}
                color={project.color}
                progress={scrollYProgress}
                range={[rangeStart, 1]}
                targetScale={targetScale}
              />
            )
          })}
        </div>

        <m.div
          className="about-wedo-stack__footer-cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link to="/#services" className="about-btn about-btn--purple">
            Explore Services
          </Link>
        </m.div>
      </div>
    </section>
  )
}
