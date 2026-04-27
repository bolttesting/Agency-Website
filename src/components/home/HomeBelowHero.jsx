import Mission from '../Mission';
import TechStackArcSection from '../TechStackArcSection';
import BuildingTomorrow from '../BuildingTomorrow';
import CalculateCost from '../CalculateCost';
import ClientCommits from '../ClientCommits';
import Testimonials from '../Testimonials';
import Clients from '../Clients';
import Newsletter from '../Newsletter';

/**
 * Heavier home sections (motion, maps of icons, carousels) — lazy-loaded from HomePage
 * so the initial route chunk is smaller on slow 4G / mobile.
 */
export default function HomeBelowHero() {
  return (
    <>
      <Mission />
      <TechStackArcSection />
      <BuildingTomorrow />
      <CalculateCost />
      <ClientCommits />
      <Testimonials />
      <Clients />
      <Newsletter />
    </>
  );
}
