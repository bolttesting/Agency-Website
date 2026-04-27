import Hero from '../components/Hero'
import HomeServicesMarquee from '../components/HomeServicesMarquee'
import Expertise from '../components/Expertise'
import Mission from '../components/Mission'
import TechStackArcSection from '../components/TechStackArcSection'
import BuildingTomorrow from '../components/BuildingTomorrow'
import CalculateCost from '../components/CalculateCost'
import ClientCommits from '../components/ClientCommits'
import Testimonials from '../components/Testimonials'
import Clients from '../components/Clients'
import Newsletter from '../components/Newsletter'
import Seo from '../components/Seo'
import './HomeLanding.css'

export default function HomePage() {
  return (
    <div className="home-landing">
      <Seo image="/LC.png" />
      <Hero />
      <HomeServicesMarquee />
      <Expertise />
      <Mission />
      <TechStackArcSection />
      <BuildingTomorrow />
      <CalculateCost />
      <ClientCommits />
      <Testimonials />
      <Clients />
      <Newsletter />
    </div>
  )
}
