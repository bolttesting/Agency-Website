import { m } from 'framer-motion';
import RadialOrbitalTimeline from './RadialOrbitalTimeline';

/** Process steps as orbital timeline nodes (icons from ./Icons.jsx). */
const WORK_TIMELINE = [
  {
    id: 1,
    title: 'Project Planning',
    date: 'Phase 1',
    content:
      'Discovery workshops, scope, and success metrics so everyone agrees on what “done” looks like before design or code starts.',
    category: 'Strategy',
    icon: 'folder',
    relatedIds: [2, 8],
    status: 'completed',
    energy: 94,
  },
  {
    id: 2,
    title: 'UI/UX Design',
    date: 'Phase 2',
    content:
      'Flows, prototypes, and a cohesive UI system—validated with you early so engineering builds the right thing.',
    category: 'Design',
    icon: 'sparkles',
    relatedIds: [1, 3],
    status: 'completed',
    energy: 91,
  },
  {
    id: 3,
    title: 'Development Phase',
    date: 'Phase 3',
    content:
      'Iterative builds with reviews, feature flags where useful, and clean handoffs between design and engineering.',
    category: 'Build',
    icon: 'code',
    relatedIds: [2, 4],
    status: 'in-progress',
    energy: 88,
  },
  {
    id: 4,
    title: 'Quality Assurance',
    date: 'Phase 4',
    content:
      'Test plans across devices and browsers, regression checks, and polish passes so releases feel stable.',
    category: 'QA',
    icon: 'check',
    relatedIds: [3, 5],
    status: 'in-progress',
    energy: 85,
  },
  {
    id: 5,
    title: 'Deployment',
    date: 'Phase 5',
    content:
      'Staging, production deploys, monitoring hooks, and rollback-ready releases when traffic matters.',
    category: 'Launch',
    icon: 'cloud',
    relatedIds: [4, 6],
    status: 'pending',
    energy: 78,
  },
  {
    id: 6,
    title: 'Support & Maintenance',
    date: 'Phase 6',
    content:
      'SLAs, incident response, and small improvements so your product stays fast and dependable.',
    category: 'Ops',
    icon: 'wrench',
    relatedIds: [5, 7],
    status: 'pending',
    energy: 72,
  },
  {
    id: 7,
    title: 'Marketing & SEO',
    date: 'Phase 7',
    content:
      'Landing pages, analytics, and search-friendly structure so growth work connects to the live product.',
    category: 'Growth',
    icon: 'megaphone',
    relatedIds: [6, 8],
    status: 'pending',
    energy: 68,
  },
  {
    id: 8,
    title: 'Client Feedback',
    date: 'Ongoing',
    content:
      'Structured reviews, surveys, and roadmap input—we treat feedback as a first-class input to the next cycle.',
    category: 'Partnership',
    icon: 'users',
    relatedIds: [7, 1],
    status: 'pending',
    energy: 90,
  },
];

export default function ClientCommits() {
  return (
    <section className="section commits">
      <div className="commits__inner commits__inner--orbital">
        <m.div
          className="commits__header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="commits__title">Our Client Commits</h2>
          <p className="commits__subtitle">
            How we work—explore each phase on the orbit. Click a node for details; related steps pulse.
          </p>
        </m.div>

        <div className="commits__orbital-wrap">
          <p className="commits__orbital-hint">How We Work</p>
          <RadialOrbitalTimeline timelineData={WORK_TIMELINE} />
        </div>
      </div>
    </section>
  );
}
