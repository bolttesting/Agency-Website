import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './profile-card-testimonial-carousel.css'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function SvgGithub({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function SvgTwitter({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function SvgYoutube({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function SvgLinkedin({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const SOCIAL_CONFIG = [
  { key: 'github', Icon: SvgGithub, urlKey: 'githubUrl', label: 'GitHub' },
  { key: 'twitter', Icon: SvgTwitter, urlKey: 'twitterUrl', label: 'Twitter' },
  { key: 'youtube', Icon: SvgYoutube, urlKey: 'youtubeUrl', label: 'YouTube' },
  { key: 'linkedin', Icon: SvgLinkedin, urlKey: 'linkedinUrl', label: 'LinkedIn' },
]

/**
 * @typedef {object} ProfileCarouselItem
 * @property {string} name
 * @property {string} title
 * @property {string} description
 * @property {string} imageUrl
 * @property {string} [githubUrl]
 * @property {string} [twitterUrl]
 * @property {string} [youtubeUrl]
 * @property {string} [linkedinUrl]
 */

/**
 * Large avatar + overlapping card, prev/next + dots (reference: profile-card-testimonial-carousel).
 * @param {{ items: ProfileCarouselItem[], className?: string }} props
 */
export function ProfileCardTestimonialCarousel({ items = [], className }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!items.length) {
    return null
  }

  const handleNext = () =>
    setCurrentIndex((i) => (i + 1) % items.length)
  const handlePrevious = () =>
    setCurrentIndex((i) => (i - 1 + items.length) % items.length)

  const current = items[currentIndex]

  return (
    <div className={cn('profile-carousel', className)}>
      <div className="profile-carousel__desktop">
        <div className="profile-carousel__avatar-shell">
          <AnimatePresence mode="wait">
            <m.div
              key={current.imageUrl + currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              style={{ width: '100%', height: '100%' }}
            >
              <img src={current.imageUrl} alt={current.name} draggable={false} loading="lazy" />
            </m.div>
          </AnimatePresence>
        </div>

        <div className="profile-carousel__card">
          <AnimatePresence mode="wait">
            <m.div
              key={current.name + currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="profile-carousel__meta">
                <h2 className="profile-carousel__name">{current.name}</h2>
                <p className="profile-carousel__title-line">{current.title}</p>
              </div>
              <p className="profile-carousel__body">{current.description}</p>
              <div className="profile-carousel__social">
                {SOCIAL_CONFIG.map(({ key, Icon, urlKey, label }) => {
                  const href = current[urlKey] || '#'
                  return (
                    <a
                      key={key}
                      href={href}
                      target={href === '#' ? undefined : '_blank'}
                      rel={href === '#' ? undefined : 'noopener noreferrer'}
                      className="profile-carousel__social-link"
                      aria-label={label}
                      onClick={href === '#' ? (e) => e.preventDefault() : undefined}
                    >
                      <Icon />
                    </a>
                  )
                })}
              </div>
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="profile-carousel__mobile">
        <div className="profile-carousel__mobile-avatar">
          <AnimatePresence mode="wait">
            <m.div
              key={current.imageUrl + currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              style={{ width: '100%', height: '100%' }}
            >
              <img src={current.imageUrl} alt={current.name} draggable={false} loading="lazy" />
            </m.div>
          </AnimatePresence>
        </div>
        <div className="profile-carousel__mobile-content">
          <AnimatePresence mode="wait">
            <m.div
              key={current.name + currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <h2 className="profile-carousel__name">{current.name}</h2>
              <p className="profile-carousel__title-line">{current.title}</p>
              <p className="profile-carousel__body">{current.description}</p>
              <div className="profile-carousel__social">
                {SOCIAL_CONFIG.map(({ key, Icon, urlKey, label }) => {
                  const href = current[urlKey] || '#'
                  return (
                    <a
                      key={key}
                      href={href}
                      target={href === '#' ? undefined : '_blank'}
                      rel={href === '#' ? undefined : 'noopener noreferrer'}
                      className="profile-carousel__social-link"
                      aria-label={label}
                      onClick={href === '#' ? (e) => e.preventDefault() : undefined}
                    >
                      <Icon />
                    </a>
                  )
                })}
              </div>
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="profile-carousel__nav">
        <button
          type="button"
          onClick={handlePrevious}
          aria-label="Previous"
          className="profile-carousel__nav-btn"
        >
          <ChevronLeft size={24} strokeWidth={2} />
        </button>
        <div className="profile-carousel__dots">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={cn(
                'profile-carousel__dot',
                i === currentIndex && 'profile-carousel__dot--active',
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next"
          className="profile-carousel__nav-btn"
        >
          <ChevronRight size={24} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

/** @deprecated Use named export; alias for parity with reference */
export const TestimonialCarousel = ProfileCardTestimonialCarousel
