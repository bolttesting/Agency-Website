import { lazy, Suspense } from 'react'
import Hero from '../components/Hero'
import HomeServicesMarquee from '../components/HomeServicesMarquee'
import Expertise from '../components/Expertise'
import Seo from '../components/Seo'
import './HomeLanding.css'

const HomeBelowHero = lazy(() => import('../components/home/HomeBelowHero'))

export default function HomePage() {
  return (
    <div className="home-landing">
      <Seo image="/LC.png" />
      <Hero />
      <HomeServicesMarquee />
      <Expertise />
      <Suspense fallback={null}>
        <HomeBelowHero />
      </Suspense>
    </div>
  )
}
