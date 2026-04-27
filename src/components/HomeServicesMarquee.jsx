import ScrollBaseAnimation from './ui/scroll-text-marquee';

const LINE_A = 'Web Development — App Development — Social Media Marketing — ';
const LINE_B = 'Social Media Marketing — Web Development — App Development — ';

export default function HomeServicesMarquee() {
  return (
    <section className="home-marquee" aria-label="Core services">
      <div className="home-marquee__wrap">
        <ScrollBaseAnimation delay={500} className="home-marquee__row home-marquee__row--one">
          {LINE_A}
        </ScrollBaseAnimation>
        <ScrollBaseAnimation
          delay={500}
          className="home-marquee__row home-marquee__row--two"
          reverse
        >
          {LINE_B}
        </ScrollBaseAnimation>
      </div>
    </section>
  );
}
