import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
const FeatureCarousel = lazy(() => import('./FeatureCarousel'));

export default function Expertise() {
  const [loadCarousel, setLoadCarousel] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoadCarousel(true);
          io.disconnect();
        }
      },
      { rootMargin: '280px 0px', threshold: 0 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section expertise" id="services">
      <div className="expertise__glow expertise__glow--1" />
      <div className="section__inner">
        <m.div
          className="expertise__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="expertise__badge">What We Do</span>
          <h2 className="expertise__title">Our Expertise on Demand</h2>
          <p className="expertise__subtitle">We provide next-level services on demand.</p>
          <span className="expertise__accent-line" />
        </m.div>
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          {loadCarousel ? (
            <Suspense
              fallback={(
                <div
                  className="expertise__carousel-placeholder"
                  aria-busy="true"
                  aria-label="Loading"
                />
              )}
            >
              <FeatureCarousel />
            </Suspense>
          ) : (
            <div className="expertise__carousel-placeholder" aria-hidden />
          )}
        </m.div>
      </div>
    </section>
  );
}
