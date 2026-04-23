import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icons';
import { unsplashImgProps } from '../utils/unsplashResponsive';
import './FeatureCarousel.css';

/** Right panel ~ full width on mobile; ~48–52% viewport on desktop (60% of ~80% content). */
const CAROUSEL_IMAGE_SIZES =
  '(max-width: 767px) 92vw, (max-width: 1023px) 88vw, 48vw';

const FEATURES = [
  {
    id: 'web',
    label: 'Web App Development',
    icon: 'globe',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200',
    description: 'Build scalable web applications with modern frameworks and best practices.',
  },
  {
    id: 'mobile',
    label: 'Mobile App Development',
    icon: 'mobile',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200',
    description: 'Native and cross-platform mobile solutions for iOS and Android.',
  },
  {
    id: 'marketing',
    label: 'Digital Marketing',
    icon: 'megaphone',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200',
    description: 'Strategic marketing to grow your online presence and reach.',
  },
  {
    id: 'ux',
    label: 'UI/UX Designing',
    icon: 'sparkles',
    image: 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?q=80&w=1200',
    description: 'User-centric interfaces that delight and convert.',
  },
  {
    id: 'game',
    label: 'Game Development',
    icon: 'gamepad',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200',
    description: 'Engaging games for web, mobile, and desktop platforms.',
  },
  {
    id: 'graphics',
    label: 'Graphics Designing',
    icon: 'palette',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200',
    description: 'Visual identity, branding, and creative assets.',
  },
  {
    id: 'seo',
    label: 'SEO Optimization',
    icon: 'search',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200',
    description: 'Improve visibility and rank higher in search results.',
  },
  {
    id: 'animation',
    label: '2D/3D Animation',
    icon: 'film',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200',
    description: 'Motion graphics and animated content for your brand.',
  },
];

const AUTO_PLAY_INTERVAL = 3000;
const ITEM_HEIGHT = 65;

function wrap(min, max, v) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

export default function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index) => {
    const diff = (index - currentIndex + FEATURES.length) % FEATURES.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index) => {
    const diff = index - currentIndex;
    const len = FEATURES.length;

    let normalizedDiff = diff;
    if (normalizedDiff > len / 2) normalizedDiff -= len;
    if (normalizedDiff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return 'active';
    if (normalizedDiff === -1) return 'prev';
    if (normalizedDiff === 1) return 'next';
    return 'hidden';
  };

  return (
    <div className="feature-carousel">
      <div className="feature-carousel__frame">
        <div className="feature-carousel__panel-left">
          <div className="feature-carousel__fade--top" />
          <div className="feature-carousel__fade--bottom" />
          <div className="feature-carousel__chips">
            {FEATURES.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(FEATURES.length / 2),
                FEATURES.length / 2,
                distance
              );

              return (
                <motion.div
                  key={feature.id}
                  style={{
                    height: ITEM_HEIGHT,
                    width: 'fit-content',
                  }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: Math.max(0.15, 1 - Math.abs(wrappedDistance) * 0.25),
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 90,
                    damping: 22,
                    mass: 1,
                  }}
                  className="feature-carousel__chip-wrap"
                >
                  <button
                    type="button"
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={
                      'feature-carousel__chip' +
                      (isActive ? ' feature-carousel__chip--active' : '')
                    }
                  >
                    <span className="feature-carousel__chip-icon">
                      <Icon name={feature.icon} size={18} />
                    </span>
                    <span className="feature-carousel__chip-label">
                      {feature.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="feature-carousel__panel-right">
          <div className="feature-carousel__stack">
            {FEATURES.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === 'active';
              const isPrev = status === 'prev';
              const isNext = status === 'next';

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? 'auto' : 'none',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className="feature-carousel__card"
                >
                  <img
                    {...unsplashImgProps(feature.image, CAROUSEL_IMAGE_SIZES)}
                    alt={`${feature.label} — ${feature.description}`}
                    className={
                      'feature-carousel__card-img ' +
                      (isActive
                        ? 'feature-carousel__card-img--active'
                        : 'feature-carousel__card-img--muted')
                    }
                    loading="lazy"
                    decoding="async"
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        key={`overlay-${feature.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="feature-carousel__card-overlay"
                      >
                        <div className="feature-carousel__card-badge">
                          {index + 1} · {feature.label}
                        </div>
                        <p className="feature-carousel__card-desc">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={
                      'feature-carousel__live ' +
                      (isActive ? '' : 'feature-carousel__live--hidden')
                    }
                  >
                    <span className="feature-carousel__live-dot" />
                    <span className="feature-carousel__live-text">
                      Live Session
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
