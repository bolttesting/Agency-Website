import { useState, useEffect, useMemo, useRef } from 'react'
import { m, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import './about-tech-stack-arc.css'

const IMG_WIDTH = 60
const IMG_HEIGHT = 85

const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

/** Stack icon images (Devicon CDN) + labels for flip back */
export const ABOUT_TECH_STACK_ITEMS = [
  { name: 'React', src: `${CDN}/react/react-original.svg` },
  { name: 'TypeScript', src: `${CDN}/typescript/typescript-original.svg` },
  { name: 'Next.js', src: `${CDN}/nextjs/nextjs-original.svg` },
  { name: 'Vue.js', src: `${CDN}/vuejs/vuejs-original.svg` },
  { name: 'Angular', src: `${CDN}/angularjs/angularjs-original.svg` },
  { name: 'Node.js', src: `${CDN}/nodejs/nodejs-original.svg` },
  { name: 'Python', src: `${CDN}/python/python-original.svg` },
  { name: 'PHP', src: `${CDN}/php/php-original.svg` },
  { name: 'MongoDB', src: `${CDN}/mongodb/mongodb-original.svg` },
  { name: 'PostgreSQL', src: `${CDN}/postgresql/postgresql-original.svg` },
  { name: 'Docker', src: `${CDN}/docker/docker-original.svg` },
  { name: 'Kubernetes', src: `${CDN}/kubernetes/kubernetes-plain.svg` },
  { name: 'AWS', src: `${CDN}/amazonwebservices/amazonwebservices-original-wordmark.svg` },
  { name: 'Azure', src: `${CDN}/azure/azure-original.svg` },
  { name: 'Google Cloud', src: `${CDN}/googlecloud/googlecloud-original.svg` },
  { name: 'Flutter', src: `${CDN}/flutter/flutter-original.svg` },
  { name: 'Figma', src: `${CDN}/figma/figma-original.svg` },
  { name: 'HTML5', src: `${CDN}/html5/html5-original.svg` },
  { name: 'CSS3', src: `${CDN}/css3/css3-original.svg` },
  { name: 'Git', src: `${CDN}/git/git-original.svg` },
]

const lerp = (start, end, t) => start * (1 - t) + end * t

function FlipCard({ src, index, label, target }) {
  return (
    <m.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: 'spring', stiffness: 40, damping: 15 }}
      className="tech-flip-card group"
      style={{
        position: 'absolute',
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: 'preserve-3d',
      }}
    >
      <m.div
        className="tech-flip-card__inner"
        style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        <div className="tech-flip-card__face tech-flip-card__face--front">
          <img src={src} alt={`${label} logo`} decoding="async" loading="lazy" />
        </div>
        <div className="tech-flip-card__face tech-flip-card__face--back">
          <span className="tech-flip-card__back-label">Tech</span>
          <span className="tech-flip-card__back-name">{label}</span>
        </div>
      </m.div>
    </m.div>
  )
}

/**
 * Scroll-scrubbed arc of tech stack icons (circle → bottom arc + shuffle).
 * Uses real page scroll over a tall track (no wheel capture).
 */
export default function AboutTechStackArc({ items = ABOUT_TECH_STACK_ITEMS }) {
  const [introPhase, setIntroPhase] = useState('scatter')
  const [containerSize, setContainerSize] = useState({ width: 600, height: 600 })
  const [morphValue, setMorphValue] = useState(0)
  const [rotateValue, setRotateValue] = useState(0)
  const [parallaxValue, setParallaxValue] = useState(0)

  const trackRef = useRef(null)
  const stageRef = useRef(null)
  const TOTAL = items.length

  const { scrollYProgress: pageProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const morphProgress = useTransform(pageProgress, [0, 0.32], [0, 1])
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 })
  const scrollRotate = useTransform(pageProgress, [0.32, 1], [0, 360])
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 })

  const mouseX = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 })

  useEffect(() => {
    const a = setTimeout(() => setIntroPhase('line'), 500)
    const b = setTimeout(() => setIntroPhase('circle'), 2500)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })
    ro.observe(el)
    setContainerSize({ width: el.offsetWidth, height: el.offsetHeight })
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const u1 = smoothMorph.on('change', setMorphValue)
    const u2 = smoothScrollRotate.on('change', setRotateValue)
    const u3 = smoothMouseX.on('change', setParallaxValue)
    return () => {
      u1()
      u2()
      u3()
    }
  }, [smoothMorph, smoothScrollRotate, smoothMouseX])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width
      mouseX.set((nx * 2 - 1) * 100)
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [mouseX])

  const scatterPositions = useMemo(
    () =>
      items.map((_, i) => ({
        x: (Math.sin(i * 2.17) * 0.5) * 900,
        y: (Math.cos(i * 1.83) * 0.5) * 700,
        rotation: (Math.sin(i * 1.3) * 0.5) * 160,
        scale: 0.6,
        opacity: 0,
      })),
    [items],
  )

  const contentOpacity = useTransform(smoothMorph, [0.78, 1], [0, 1])
  const contentY = useTransform(smoothMorph, [0.78, 1], [20, 0])

  return (
    <div ref={trackRef} className="about-tech-arc">
      <div className="about-tech-arc__sticky">
        <div className="about-tech-arc__perspective">
          <div className="about-tech-arc__intro-text">
            <m.h1
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={
                introPhase === 'circle' && morphValue < 0.5
                  ? { opacity: 1 - morphValue * 2, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, filter: 'blur(10px)' }
              }
              transition={{ duration: 0.8 }}
            >
              Built on a modern tech stack
            </m.h1>
            <m.p
              initial={{ opacity: 0 }}
              animate={
                introPhase === 'circle' && morphValue < 0.5 ? { opacity: 0.5 - morphValue } : { opacity: 0 }
              }
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              Scroll to explore
            </m.p>
          </div>

          <m.div className="about-tech-arc__content" style={{ opacity: contentOpacity, y: contentY }}>
            <h2>Tools we ship with</h2>
            <p>
              From frontend frameworks to cloud and design — the technologies we use to deliver reliable products.
              Hover a card to flip and see the name.
            </p>
          </m.div>

          <div ref={stageRef} className="about-tech-arc__stage">
            {items.map((item, i) => {
              let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 }

              if (introPhase === 'scatter') {
                target = scatterPositions[i]
              } else if (introPhase === 'line') {
                const lineSpacing = 70
                const lineTotalWidth = TOTAL * lineSpacing
                const lineX = i * lineSpacing - lineTotalWidth / 2
                target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 }
              } else {
                const isMobile = containerSize.width < 768
                const minDim = Math.min(containerSize.width, containerSize.height)
                const circleRadius = Math.min(minDim * 0.35, 320)
                const circleAngle = (i / TOTAL) * 360
                const circleRad = (circleAngle * Math.PI) / 180
                const circlePos = {
                  x: Math.cos(circleRad) * circleRadius,
                  y: Math.sin(circleRad) * circleRadius,
                  rotation: circleAngle + 90,
                }

                const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5)
                const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1)
                const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25)
                const arcCenterY = arcApexY + arcRadius
                const spreadAngle = isMobile ? 100 : 130
                const startAngle = -90 - spreadAngle / 2
                const step = TOTAL > 1 ? spreadAngle / (TOTAL - 1) : 0

                const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1)
                const maxRotation = spreadAngle * 0.8
                const boundedRotation = -scrollProgress * maxRotation

                const currentArcAngle = startAngle + i * step + boundedRotation
                const arcRad = (currentArcAngle * Math.PI) / 180

                const arcPos = {
                  x: Math.cos(arcRad) * arcRadius + parallaxValue,
                  y: Math.sin(arcRad) * arcRadius + arcCenterY,
                  rotation: currentArcAngle + 90,
                  scale: isMobile ? 1.35 : 1.65,
                }

                target = {
                  x: lerp(circlePos.x, arcPos.x, morphValue),
                  y: lerp(circlePos.y, arcPos.y, morphValue),
                  rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                  scale: lerp(1, arcPos.scale, morphValue),
                  opacity: 1,
                }
              }

              return (
                <FlipCard key={item.name} src={item.src} index={i} label={item.name} target={target} />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
