import { useMemo } from 'react'
import { m } from 'framer-motion'
import Icon from '../components/Icons'
import Testimonials from '../components/Testimonials'
import { FloatingIconsHero } from '../components/ui/FloatingIconsHero'
import AboutWhatWeDoStack from '../components/AboutWhatWeDoStack'
import AboutTechStackArc from '../components/AboutTechStackArc'
import { ExpandingCards } from '../components/ui/ExpandingCards'
import { ProfileCardTestimonialCarousel } from '../components/ui/ProfileCardTestimonialCarousel'
import { Lightbulb, Heart, Shield, Star, Handshake, BadgeCheck } from 'lucide-react'
import { useSiteData } from '../context/SiteDataContext'
import Seo from '../components/Seo'
import './HomeLanding.css'
import './AboutPage.css'

const WHAT_WE_DO_IMAGES = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80&auto=format&fit=crop',
]

const innovationServices = [
  { icon: 'desktop', color: '#7c3aed', title: 'Web & Mobile App Development', desc: 'Building scalable and responsive applications that work seamlessly across all devices.' },
  { icon: 'design', color: '#a78bfa', title: 'UI/UX Design', desc: 'Creating intuitive and engaging user experiences that drive conversion and satisfaction.' },
  { icon: 'megaphone', color: '#14b8a6', title: 'Digital Marketing', desc: 'Strategic campaigns that amplify your brand and connect you with your target audience.' },
  { icon: 'gear', color: '#7c3aed', title: 'Software Development', desc: 'Custom software solutions tailored to your unique business requirements.' },
  { icon: 'cloud', color: '#a78bfa', title: 'Cloud Solutions', desc: 'Secure, scalable cloud infrastructure to power your digital transformation.' },
  { icon: 'wrench', color: '#14b8a6', title: 'IT Consultancy', desc: 'Expert guidance to optimize your technology stack and processes.' },
]

const processSteps = [
  { name: 'Discovery', desc: 'We learn your goals, audience, and requirements.', icon: 'search', color: '#7c3aed' },
  { name: 'Planning', desc: 'Strategy, roadmap, and milestones are defined.', icon: 'folder', color: '#a78bfa' },
  { name: 'Design', desc: 'Wireframes and UI/UX that bring ideas to life.', icon: 'design', color: '#14b8a6' },
  { name: 'Development', desc: 'Agile development with regular check-ins.', icon: 'code', color: '#7c3aed' },
  { name: 'Testing', desc: 'Rigorous QA ensures quality at every stage.', icon: 'check', color: '#14b8a6' },
  { name: 'Deployment', desc: 'Launch, monitor, and support post-go-live.', icon: 'zap', color: '#a78bfa' },
]

const timeline = [
  { year: '2018', title: 'Founded Logix Contact', desc: 'Started our journey with a small team and big ambitions.' },
  { year: '2019', title: 'Launched First Project', desc: 'Delivered our first major client project successfully.' },
  { year: '2020', title: 'Expanded Team & Services', desc: 'Grew our capabilities and team to serve more clients.' },
  { year: '2021', title: 'Achieved ISO Certification', desc: 'Formalized our quality and process standards.' },
  { year: '2022', title: 'Opened New Office', desc: 'Expanded our physical presence to new markets.' },
  { year: '2023', title: 'Received Industry Award', desc: 'Recognized for excellence in software development.' },
]

/** Portrait fallbacks when `photo_url` / `image` not set on team_members */
const TEAM_FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=960&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=960&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=960&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=960&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=960&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=960&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=960&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=960&q=80&auto=format&fit=crop',
]

const ourValueCards = [
  {
    id: 'innovation',
    title: 'Innovation',
    description: 'Constantly pushing boundaries to deliver cutting-edge solutions.',
    imgSrc:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80&auto=format&fit=crop',
    icon: <Lightbulb size={24} strokeWidth={1.75} />,
  },
  {
    id: 'client-centricity',
    title: 'Client-Centricity',
    description: 'Your success is our success. We put you at the center.',
    imgSrc:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop',
    icon: <Heart size={24} strokeWidth={1.75} />,
  },
  {
    id: 'integrity',
    title: 'Integrity',
    description: 'Honest, transparent, and ethical in everything we do.',
    imgSrc:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&auto=format&fit=crop',
    icon: <Shield size={24} strokeWidth={1.75} />,
  },
  {
    id: 'excellence',
    title: 'Excellence',
    description: 'Striving for the highest quality in every deliverable.',
    imgSrc:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80&auto=format&fit=crop',
    icon: <Star size={24} strokeWidth={1.75} />,
  },
  {
    id: 'collaboration',
    title: 'Collaboration',
    description: 'Working together to achieve extraordinary results.',
    imgSrc:
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&q=80&auto=format&fit=crop',
    icon: <Handshake size={24} strokeWidth={1.75} />,
  },
  {
    id: 'accountability',
    title: 'Accountability',
    description: 'Taking ownership and delivering on our promises.',
    imgSrc:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop',
    icon: <BadgeCheck size={24} strokeWidth={1.75} />,
  },
]

export default function AboutPage() {
  const { team: teamData = [] } = useSiteData()
  const team = teamData.length ? teamData : [
    { id: '1', name: 'James Wilson', role: 'CEO & Founder', avatar: 'JW' },
    { id: '2', name: 'Maria Kowalski', role: 'CTO & Co-Founder', avatar: 'MK' },
    { id: '3', name: 'David Chen', role: 'Engineering Lead', avatar: 'DC' },
    { id: '4', name: 'Elena Ortiz', role: 'Head of Design', avatar: 'EO' },
    { id: '5', name: 'Sam Okoro', role: 'Senior Full-Stack Developer', avatar: 'SO' },
    { id: '6', name: 'Priya Sharma', role: 'Product Manager', avatar: 'PS' },
    { id: '7', name: 'Tom Brennan', role: 'DevOps & Infrastructure', avatar: 'TB' },
    { id: '8', name: 'Zoe Williams', role: 'Client Success Lead', avatar: 'ZW' },
  ]

  const teamProfileCarouselItems = useMemo(
    () =>
      team.map((member, i) => {
        const imageUrl =
          (typeof member.photo_url === 'string' && member.photo_url.trim()) ||
          (typeof member.image === 'string' && member.image.trim()) ||
          TEAM_FALLBACK_PHOTOS[i % TEAM_FALLBACK_PHOTOS.length]

        const bio =
          typeof member.bio === 'string' && member.bio.trim()
            ? member.bio.trim()
            : `${member.name} leads our ${member.role ?? 'team'} practice — shipping quality work with clients from discovery through launch.`

        return {
          name: member.name,
          title: member.role ?? 'Team',
          description: bio,
          imageUrl,
          githubUrl: member.github_url || member.githubUrl || '#',
          twitterUrl: member.twitter_url || member.twitterUrl || '#',
          youtubeUrl: member.youtube_url || member.youtubeUrl || '#',
          linkedinUrl: member.linkedin_url || member.linkedinUrl || '#',
        }
      }),
    [team],
  )

  return (
    <main className="about-page">
      <Seo
        title="About Us"
        description="Meet Logix Contact — a UK web and app agency combining strategy, product design, and engineering. Discover our team, process, and values."
        keywords="about Logix Contact, UK web development agency, app development team UK, digital product studio United Kingdom"
      />
      <FloatingIconsHero
        title="Transforming Ideas into Digital Realities"
        subtitle="Web & app development agency since 2018 — strategy, product design, and engineering in one team. Explore the tools and stack we use to ship."
        ctaText="Start a project"
        ctaHref="/contact"
      />

      <AboutWhatWeDoStack
        items={innovationServices.map((item, i) => ({
          title: item.title,
          description: item.desc,
          color: item.color,
          image: WHAT_WE_DO_IMAGES[i % WHAT_WE_DO_IMAGES.length],
        }))}
      />

      {/* How We Work */}
      <section className="about-section about-section--alt">
        <div className="about-section__inner">
          <m.div
            className="about-section__header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="about-section__badge">Our Process</span>
            <h2 className="about-section__title">How We Work</h2>
            <p className="about-section__subtitle">
              Our comprehensive approach ensures seamless project execution and client satisfaction
            </p>
          </m.div>
          <div className="about-process">
            {processSteps.map((step, i) => (
              <m.div
                key={step.name}
                className="about-process__step"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                {i > 0 && <div className="about-process__connector" aria-hidden />}
                <div className="about-process__card">
                  <span className="about-process__num" style={{ background: step.color }}>{i + 1}</span>
                  <div className="about-process__icon" style={{ color: step.color }}>
                    <Icon name={step.icon} size={28} />
                  </div>
                  <h3 className="about-process__title">{step.name}</h3>
                  <p className="about-process__desc">{step.desc}</p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="about-section about-section--timeline">
        <div className="about-section__glow about-section__glow--blue" />
        <div className="about-section__inner">
          <m.div
            className="about-section__header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="about-section__badge">Milestones</span>
            <h2 className="about-section__title">Our Transformative Journey</h2>
            <p className="about-section__subtitle">
              A timeline of milestones and achievements that define our success
            </p>
            <span className="about-section__accent-line" />
          </m.div>
          <div className="about-timeline">
            <div className="about-timeline__line" />
            {timeline.map((item, i) => (
              <m.div
                key={item.year}
                className={`about-timeline__item about-timeline__item--${i % 2 === 0 ? 'left' : 'right'}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="about-timeline__dot" style={{ background: i % 2 === 0 ? 'var(--accent-blue)' : 'var(--accent-orange)' }} />
                <div className="about-timeline__card">
                  <span className="about-timeline__year">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values — expanding image cards */}
      <section className="about-section about-section--alt about-section--expanding-values">
        <div className="about-section__inner">
          <m.div
            className="about-section__header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="about-section__badge">Our Values</span>
            <h2 className="about-section__title">Principles That Guide Us</h2>
            <p className="about-section__subtitle">
              Hover, focus, or tap a card to expand it. Our core values shape every decision we make.
            </p>
          </m.div>
          <div className="about-expanding-values">
            <ExpandingCards items={ourValueCards} defaultActiveIndex={0} />
          </div>
        </div>
      </section>

      {/* Tech stack — arc + flip cards (scroll-scrubbed) */}
      <section className="about-section about-section--tech-arc">
        <div className="about-section__inner">
          <m.div
            className="about-section__header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="about-section__badge">Tech Stack</span>
            <h2 className="about-section__title about-section__title--muted">Our Expertise</h2>
            <p className="about-section__subtitle">
              Leveraging cutting-edge technologies to build future-ready solutions. Scroll the section below to see
              icons assemble into an arc.
            </p>
          </m.div>
        </div>
        <AboutTechStackArc />
      </section>

      {/* Meet Our Team — profile card carousel */}
      <section className="about-section about-section--alt" id="team">
        <div className="about-section__inner">
          <m.div
            className="about-section__header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="about-section__badge">The People</span>
            <h2 className="about-section__title">Meet Our Team</h2>
            <p className="about-section__subtitle">
              Faces behind the work — use the arrows or dots to browse profiles.
            </p>
          </m.div>
          <ProfileCardTestimonialCarousel items={teamProfileCarouselItems} />
        </div>
      </section>

      {/* What Clients Say — same block as home (marquee columns + SiteData testimonials) */}
      <div className="home-landing">
        <Testimonials />
      </div>
    </main>
  )
}
