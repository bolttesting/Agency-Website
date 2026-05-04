import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import Icon from './Icons';
import { useSiteData } from '../context/SiteDataContext';
import { contactEmails, contactPhones, telHref } from '../utils/contactLines';
import { parseFooterSocialLinks } from '../utils/footerSocialLinks';
import { TextHoverEffect, FooterBackgroundGradient } from './ui/hover-footer';
import FooterContactGlobe from './FooterContactGlobe';
import FooterCompanyProfileDownload from './FooterCompanyProfileDownload';

const ACCORDION_MQ = '(max-width: 900px)';

function useFooterAccordionMode() {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(ACCORDION_MQ).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(ACCORDION_MQ);
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return narrow;
}

function FooterAccordionColumn({
  sectionId,
  title,
  isNarrow,
  isOpen,
  onToggle,
  className = '',
  children,
}) {
  if (!isNarrow) {
    return (
      <div className={`footer__col ${className}`.trim()}>
        <h3 className="footer__col-title">{title}</h3>
        {children}
      </div>
    );
  }

  const panelId = `footer-section-${sectionId}`;
  const triggerId = `footer-trigger-${sectionId}`;

  return (
    <div className={`footer__col footer__col--accordion ${isOpen ? 'footer__col--open' : ''} ${className}`.trim()}>
      <button
        type="button"
        className="footer__accordion-trigger"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="footer__accordion-title">{title}</span>
        <ChevronDown className="footer__accordion-chevron" size={18} strokeWidth={2} aria-hidden />
      </button>
      <div className="footer__accordion-panel" id={panelId} role="region" aria-labelledby={triggerId}>
        <div className="footer__accordion-panel-inner" inert={!isOpen || undefined}>
          {children}
        </div>
      </div>
    </div>
  );
}

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/#services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact Us', to: '/contact' },
];

const services = [
  'Web Development',
  'Mobile App Development',
  'UI/UX Design',
  'Digital Marketing',
  'Cloud Solutions',
  'IT Consultancy',
];

const policyLinks = [
  { label: 'Terms & Conditions', to: '/legal/terms' },
  { label: 'Privacy Policy', to: '/legal/privacy' },
  { label: 'Cookie Policy', to: '/legal/cookie-policy' },
  { label: 'Refund Policy', to: '/legal/refunds' },
  { label: 'Service & contract policy', to: '/legal/service-agreement' },
];

/** Authoritative UK references (outbound). These are not backlinks to your site; they support trust context. */
const ukResourcesLinks = [
  { label: 'ICO — UK GDPR & data protection', href: 'https://ico.org.uk/for-organisations/' },
  { label: 'GOV.UK — Business and self-employed', href: 'https://www.gov.uk/browse/business' },
  { label: 'Companies House', href: 'https://www.gov.uk/government/organisations/companies-house' },
  { label: 'National Cyber Security Centre', href: 'https://www.ncsc.gov.uk/' },
];

export default function Footer() {
  const { settings } = useSiteData();
  const socialLinks = parseFooterSocialLinks(settings?.social_links);
  const emailLines = contactEmails(settings);
  const phoneLines = contactPhones(settings);
  const isNarrow = useFooterAccordionMode();

  const [open, setOpen] = useState({
    quick: true,
    services: false,
    contact: false,
    policies: false,
    ukResources: false,
    presence: false,
  });

  useEffect(() => {
    if (!isNarrow) {
      setOpen({
        quick: true,
        services: true,
        contact: true,
        policies: true,
        ukResources: true,
        presence: true,
      });
    } else {
      setOpen({
        quick: true,
        services: false,
        contact: false,
        policies: false,
        ukResources: false,
        presence: false,
      });
    }
  }, [isNarrow]);

  const toggle = useCallback(
    (key) => {
      if (!isNarrow) return;
      setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [isNarrow],
  );

  return (
    <footer className="footer">
      <FooterBackgroundGradient />
      <div className="footer__inner">
        <h2 className="sr-only">Site footer</h2>
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__brand-link" aria-label="Logix Contact home">
              <img
                src="/LC.svg"
                alt=""
                width={64}
                height={64}
                decoding="async"
                fetchPriority="low"
                className="footer__logo-mark"
              />
              <span className="footer__logo" aria-hidden="true">
                Logix<span className="footer__logo-accent">Contact</span>
              </span>
            </Link>
            <p className="footer__slogan">Web & App Development Agency</p>
            <div className="footer__brand-download">
              <FooterCompanyProfileDownload />
            </div>
          </div>
          <div className="footer__cols">
            <FooterAccordionColumn
              sectionId="quick"
              title="Quick Links"
              isNarrow={isNarrow}
              isOpen={open.quick}
              onToggle={() => toggle('quick')}
            >
              <ul>
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </FooterAccordionColumn>
            <FooterAccordionColumn
              sectionId="services"
              title="Services"
              isNarrow={isNarrow}
              isOpen={open.services}
              onToggle={() => toggle('services')}
            >
              <ul>
                {services.map((s) => (
                  <li key={s}>
                    <Link to="/#services">{s}</Link>
                  </li>
                ))}
              </ul>
            </FooterAccordionColumn>
            <FooterAccordionColumn
              sectionId="policies"
              title="Policies"
              isNarrow={isNarrow}
              isOpen={open.policies}
              onToggle={() => toggle('policies')}
            >
              <ul>
                {policyLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </FooterAccordionColumn>
            <FooterAccordionColumn
              sectionId="uk-resources"
              title="UK resources"
              isNarrow={isNarrow}
              isOpen={open.ukResources}
              onToggle={() => toggle('ukResources')}
            >
              <ul>
                {ukResourcesLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </FooterAccordionColumn>
            <FooterAccordionColumn
              sectionId="contact"
              title="Contact"
              className="footer__col--contact"
              isNarrow={isNarrow}
              isOpen={open.contact}
              onToggle={() => toggle('contact')}
            >
              {emailLines.map((em) => (
                <a key={em} href={`mailto:${em}`} className="footer__contact-item footer__contact-item--row">
                  <span className="footer__contact-icon" aria-hidden>
                    <Icon name="email" size={18} />
                  </span>
                  <span className="footer__contact-text">{em}</span>
                </a>
              ))}
              {phoneLines.map((num) => (
                <a key={num} href={telHref(num)} className="footer__contact-item footer__contact-item--row">
                  <span className="footer__contact-icon" aria-hidden>
                    <Icon name="phone" size={18} />
                  </span>
                  <span className="footer__contact-text">{num}</span>
                </a>
              ))}
            </FooterAccordionColumn>
            <FooterAccordionColumn
              sectionId="presence"
              title="Global presence"
              className="footer__col--globe"
              isNarrow={isNarrow}
              isOpen={open.presence}
              onToggle={() => toggle('presence')}
            >
              <FooterContactGlobe />
            </FooterAccordionColumn>
          </div>
        </div>
        <div className="footer__bottom">
          {socialLinks.length > 0 ? (
            <div className="footer__social footer__social--bottom">
              {socialLinks.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  className="footer__social-link"
                  aria-label={s.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name={s.icon} size={18} />
                </a>
              ))}
            </div>
          ) : null}
          <p className="footer__copyright">
            © {new Date().getFullYear()} Logix Contact. All rights reserved.
          </p>
        </div>
        <div className="footer__brand-mark">
          <TextHoverEffect text="Logix Contact" duration={0} viewBox="0 0 640 110" />
        </div>
      </div>
    </footer>
  );
}
