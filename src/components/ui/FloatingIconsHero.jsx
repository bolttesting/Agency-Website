import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { m, useMotionValue, useSpring } from 'framer-motion'
import {
  IconGoogle,
  IconApple,
  IconMicrosoft,
  IconFigma,
  IconGitHub,
  IconSlack,
  IconNotion,
  IconVercel,
  IconStripe,
  IconDiscord,
  IconX,
  IconSpotify,
  IconDropbox,
  IconTwitch,
  IconLinear,
  IconYouTube,
} from './floating-icons-hero-icons'
import './floating-icons-hero.css'

/** Default 16-icon layout (percent positions, matches reference). */
export const DEFAULT_FLOATING_ICONS = [
  { id: 1, Icon: IconGoogle, top: '10%', left: '10%' },
  { id: 2, Icon: IconApple, top: '20%', right: '8%' },
  { id: 3, Icon: IconMicrosoft, top: '80%', left: '10%' },
  { id: 4, Icon: IconFigma, bottom: '10%', right: '10%' },
  { id: 5, Icon: IconGitHub, top: '5%', left: '30%' },
  { id: 6, Icon: IconSlack, top: '5%', right: '30%' },
  { id: 7, Icon: IconVercel, bottom: '8%', left: '25%' },
  { id: 8, Icon: IconStripe, top: '40%', left: '15%' },
  { id: 9, Icon: IconDiscord, top: '75%', right: '25%' },
  { id: 10, Icon: IconX, top: '90%', left: '70%' },
  { id: 11, Icon: IconNotion, top: '50%', right: '5%' },
  { id: 12, Icon: IconSpotify, top: '55%', left: '5%' },
  { id: 13, Icon: IconDropbox, top: '5%', left: '55%' },
  { id: 14, Icon: IconTwitch, bottom: '5%', right: '45%' },
  { id: 15, Icon: IconLinear, top: '25%', right: '20%' },
  { id: 16, Icon: IconYouTube, top: '60%', left: '30%' },
]

function FloatingIcon({ iconData, index }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })
  const floatDuration = 5 + (index % 4) * 1.25

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const distance = Math.hypot(e.clientX - cx, e.clientY - cy)
      if (distance < 150) {
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx)
        const force = (1 - distance / 150) * 50
        x.set(-Math.cos(angle) * force)
        y.set(-Math.sin(angle) * force)
      } else {
        x.set(0)
        y.set(0)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [x, y])

  const { Icon } = iconData
  const pos = {
    top: iconData.top,
    left: iconData.left,
    right: iconData.right,
    bottom: iconData.bottom,
  }

  return (
    <m.div
      ref={ref}
      className="floating-icons-hero__icon-wrap"
      style={{
        ...pos,
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <m.div
        className="floating-icons-hero__icon-inner"
        animate={{
          y: [0, -8, 0, 8, 0],
          x: [0, 6, 0, -6, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <Icon className="text-ink" aria-hidden />
      </m.div>
    </m.div>
  )
}

/**
 * Full-viewport hero with floating tool logos and cursor repulsion.
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {string} props.ctaText
 * @param {string} props.ctaHref — use `/contact` for in-app routes
 * @param {typeof DEFAULT_FLOATING_ICONS} [props.icons]
 * @param {string} [props.className]
 */
export function FloatingIconsHero({ title, subtitle, ctaText, ctaHref, icons = DEFAULT_FLOATING_ICONS, className = '' }) {
  const internal = typeof ctaHref === 'string' && ctaHref.startsWith('/')

  return (
    <section className={`floating-icons-hero ${className}`.trim()}>
      <div className="floating-icons-hero__icons-layer" aria-hidden>
        {icons.map((iconData, index) => (
          <FloatingIcon key={iconData.id} iconData={iconData} index={index} />
        ))}
      </div>

      <div className="floating-icons-hero__content">
        <h1 className="floating-icons-hero__title">{title}</h1>
        <p className="floating-icons-hero__subtitle">{subtitle}</p>
        <div className="floating-icons-hero__cta-wrap">
          {internal ? (
            <Link to={ctaHref} className="floating-icons-hero__cta">
              {ctaText}
            </Link>
          ) : (
            <a href={ctaHref} className="floating-icons-hero__cta">
              {ctaText}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

export default FloatingIconsHero
