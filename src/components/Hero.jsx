import { lazy, Suspense, useMemo, useSyncExternalStore } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useSiteData } from '../context/SiteDataContext';
import { useIdleReady } from '../hooks/useIdleReady';
import ButtonCrossArrow from './ui/ButtonCrossArrow';
import ButtonAnimatedGradient from './ui/ButtonAnimatedGradient';
import AvatarGroup from './ui/avatar-group';
import { AnimatedText } from './ui/animated-text';

const easeOut = [0.23, 1, 0.32, 1];
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};
const fadeUp = (reduceMotion) => ({
  hidden: { opacity: 0, transform: reduceMotion ? 'translateY(0)' : 'translateY(14px)' },
  show: {
    opacity: 1,
    transform: 'translateY(0)',
    transition: { duration: 0.5, ease: easeOut },
  },
});

const PILL_LABELS = ['Research-led UX', 'Web & mobile', 'Launch support'];

const ShaderAnimation = lazy(() => import('./ui/ShaderAnimation'));

/** WebGL hero shader is disabled ≤768px — it competes with scroll compositing on phones. */
function useWideEnoughForHeroShader() {
  const query = '(min-width: 769px)';
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onStoreChange);
      return () => mq.removeEventListener('change', onStoreChange);
    },
    () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false),
    () => false,
  );
}

/** Hero corner avatars (Unsplash); matches “Meet the team” tone */
const HERO_AVATAR_ITEMS = [
  {
    id: 1,
    name: 'James Wilson',
    designation: 'CEO & Founder',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Maria Kowalski',
    designation: 'CTO & Co-Founder',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'David Chen',
    designation: 'Engineering Lead',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Elena Ortiz',
    designation: 'Head of Design',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'Sam Okoro',
    designation: 'Senior Full-Stack Developer',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Priya Sharma',
    designation: 'Product Manager',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&auto=format&fit=crop',
  },
];

const HERO_FALLBACK_IMAGES = HERO_AVATAR_ITEMS.map((item) => item.image);

function heroAvatarsFromTeam(team) {
  const selected = (team || [])
    .filter((m) => m.show_on_home === true)
    .sort(
      (a, b) =>
        (Number(a.home_sort_order) || Number(a.sort_order) || 0) -
        (Number(b.home_sort_order) || Number(b.sort_order) || 0),
    );
  if (!selected.length) return HERO_AVATAR_ITEMS;
  return selected.map((m, i) => ({
    id: m.id,
    name: m.name,
    designation: m.role || 'Team',
    image:
      (m.photo_url && String(m.photo_url).trim()) ||
      HERO_FALLBACK_IMAGES[i % HERO_FALLBACK_IMAGES.length],
  }));
}

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const allowHeroShader = useWideEnoughForHeroShader();
  const idleReady = useIdleReady({ timeout: 2200 });
  const { theme } = useTheme();
  const { team } = useSiteData();
  const avatarItems = useMemo(() => heroAvatarsFromTeam(team), [team]);
  const ctaVariant = theme === 'light' ? 'light' : 'dark';

  return (
    <section className="hero hero--centered" id="hero">
      {!reduceMotion && allowHeroShader && idleReady && (
        <Suspense fallback={null}>
          <ShaderAnimation className="hero__shader" />
        </Suspense>
      )}
      <div className="hero__noise" aria-hidden />
      <div className="hero__glow hero__glow--1" />
      <div className="hero__glow hero__glow--2" />
      <div className="hero__glow hero__glow--3" />
      <div className="hero__grid">
        <m.div
          className="hero__content"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <m.div className="hero__badge" variants={fadeUp(reduceMotion)}>
            <span className="hero__badge-dot" />
            Full-service product studio
          </m.div>
          <m.h1
            className={`hero__title${reduceMotion ? '' : ' hero__title--animated'}`}
            variants={fadeUp(reduceMotion)}
          >
            {reduceMotion ? (
              <>
                <span className="hero__title-line">We design and build</span>
                <span className="hero__title-row">
                  <span className="hero__title-gradient">digital products</span>
                  <span className="hero__title-tail"> that scale.</span>
                </span>
              </>
            ) : (
              <>
                <span className="hero__title-line">We design and build</span>
                <span className="hero__title-row">
                  <AnimatedText
                    text="Digital Products"
                    tone="hero-gradient"
                    className="animated-text--inline"
                    duration={0.055}
                    delay={0.08}
                    startDelay={0.12}
                  />
                  <span className="hero__title-tail"> that scale.</span>
                </span>
              </>
            )}
          </m.h1>
          <m.p className="hero__desc" variants={fadeUp(reduceMotion)}>
            Strategy, product design, and engineering in one team — fewer handoffs, clearer owners, and a
            path from first workshop to stable release.
          </m.p>
          <m.ul className="hero__pills" variants={fadeUp(reduceMotion)} aria-label="Focus areas">
            {PILL_LABELS.map((label) => (
              <li key={label} className="hero__pill">
                {label}
              </li>
            ))}
          </m.ul>
          <m.div className="hero__cta" variants={fadeUp(reduceMotion)}>
            <ButtonCrossArrow to="/contact" variant={ctaVariant}>
              Plan a project
            </ButtonCrossArrow>
            <ButtonAnimatedGradient to="/services/app-development" variant={ctaVariant}>
              See capabilities
            </ButtonAnimatedGradient>
          </m.div>
          <m.p className="hero__footnote" variants={fadeUp(reduceMotion)}>
            Typical kickoff: two-week discovery · then weekly stakeholder demos
          </m.p>
        </m.div>
      </div>
      {!reduceMotion && (
        <m.div
          className="hero__scroll"
          initial={{ opacity: 0, transform: 'translateX(-50%) translateY(8px)' }}
          animate={{ opacity: 1, transform: 'translateX(-50%) translateY(0)' }}
          transition={{ delay: 1.1, duration: 0.5, ease: easeOut }}
        >
          <span className="hero__scroll-text">Scroll</span>
          <span className="hero__scroll-line" />
        </m.div>
      )}

      <div className="hero__avatar-slot">
        <m.div
          className="hero__avatar-group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.45, ease: easeOut }}
        >
          <div className="hero__avatar-group__inner" aria-label="Team members">
            <AvatarGroup items={avatarItems} maxVisible={5} size="sm" />
          </div>
        </m.div>
      </div>
    </section>
  );
}
