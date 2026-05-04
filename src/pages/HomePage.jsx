import { lazy, Suspense } from 'react'
import Hero from '../components/Hero'
import HomeServicesMarquee from '../components/HomeServicesMarquee'
import Seo from '../components/Seo'
import { useDeferBelowFold } from '../hooks/useDeferBelowFold'
import './HomeLanding.css'

const Expertise = lazy(() => import('../components/Expertise'))
const HomeBelowHero = lazy(() => import('../components/home/HomeBelowHero'))

function ExpertiseRouteFallback() {
  return (
    <section className="section expertise" id="services">
      <div className="expertise__glow expertise__glow--1" aria-hidden />
      <div className="section__inner">
        <div className="expertise__header">
          <span className="expertise__badge">What We Do</span>
          <h2 className="expertise__title">Our Expertise on Demand</h2>
          <p className="expertise__subtitle">We provide next-level services on demand.</p>
          <span className="expertise__accent-line" aria-hidden />
        </div>
        <div className="expertise__carousel-placeholder" aria-busy="true" aria-label="Loading" />
      </div>
    </section>
  )
}

export default function HomePage() {
  const loadBelowFold = useDeferBelowFold()

  return (
    <div className="home-landing">
      <Seo image="/LC.png" />
      <Hero />
      <HomeServicesMarquee />
      <Suspense fallback={<ExpertiseRouteFallback />}>
        <Expertise />
      </Suspense>
      {loadBelowFold ? (
        <Suspense fallback={null}>
          <HomeBelowHero />
        </Suspense>
      ) : null}
    </div>
  )
}
