import { useMemo, useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import { CardStack } from './ui/card-stack';

/** Reliable Unsplash hero shots for portfolio cards when local assets are missing */
const UNSPLASH_FALLBACKS = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80',
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=900&q=80',
];

function useCardStackSize() {
  const [size, setSize] = useState({ w: 520, h: 320 });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw < 400) setSize({ w: Math.max(260, vw - 36), h: 200 });
      else if (vw < 540) setSize({ w: 320, h: 210 });
      else if (vw < 720) setSize({ w: 400, h: 260 });
      else if (vw < 1000) setSize({ w: 460, h: 300 });
      else setSize({ w: 520, h: 320 });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return size;
}

export default function Clients() {
  const { portfolioDisplay } = useSiteData();
  const stackSize = useCardStackSize();

  const cardItems = useMemo(() => {
    const list = portfolioDisplay || [];
    return list.slice(0, 6).map((p, i) => ({
      id: p.id,
      title: p.name,
      description: p.description || p.tech,
      imageSrc: p.image || UNSPLASH_FALLBACKS[i % UNSPLASH_FALLBACKS.length],
      href: `/portfolio/${p.id}`,
      tag: p.type,
    }));
  }, [portfolioDisplay]);

  return (
    <section className="section portfolio-home" id="portfolio">
      <div className="portfolio-home__wrap">
        <m.div
          className="portfolio-home__top"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="portfolio-home__head">
            <h2 className="portfolio-home__title">Selected Work</h2>
            <Link to="/portfolio" className="portfolio-home__all">
              View all <span aria-hidden>→</span>
            </Link>
          </div>
        </m.div>

        <div className="portfolio-home__stack">
          <CardStack
            items={cardItems}
            initialIndex={0}
            cardWidth={stackSize.w}
            cardHeight={stackSize.h}
            overlap={stackSize.w < 400 ? 0.42 : 0.48}
            spreadDeg={52}
            autoAdvance
            intervalMs={2200}
            pauseOnHover
            showDots
            loop
          />
        </div>
      </div>
    </section>
  );
}
