import { m } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useSiteData } from '../context/SiteDataContext';
import { WorldMap } from './ui/world-map';
import { contactPhones, telHref } from '../utils/contactLines';
import './OfficesMapSection.css';

/** Approximate coords for map arcs (office areas). */
export const OFFICE_MAP_ROUTES = [
  {
    start: { lat: 51.3614, lng: -0.1938, label: 'London' },
    end: { lat: 25.1412, lng: 55.2264, label: 'Dubai' },
  },
  {
    start: { lat: 25.1412, lng: 55.2264, label: 'Dubai' },
    end: { lat: 31.4697, lng: 74.2728, label: 'Lahore' },
  },
  {
    start: { lat: 31.4697, lng: 74.2728, label: 'Lahore' },
    end: { lat: 51.3614, lng: -0.1938, label: 'London' },
  },
];

export const OFFICE_LOCATIONS = [
  {
    id: 'london',
    city: 'London',
    email: 'uk@logixcontact.co.uk',
    phone: null,
    address:
      'Suite 28, Nouvelle Building, 52 Sutton Court Road, Sutton, England, SM1 4SL',
  },
  {
    id: 'dubai',
    city: 'Dubai',
    email: 'info@logixcontact.com',
    phone: '+971 4 235 0843',
    address: 'Suite 26, Street 19 - Al Quoz 1 - Dubai - United Arab Emirates',
  },
  {
    id: 'lahore',
    city: 'Lahore',
    email: 'info@logixcontact.com',
    phone: '+92 42 3529 1232',
    address: 'Suite 411, Block K, M.A Johar Town, Lahore',
  },
];

export default function OfficesMapSection() {
  const { theme } = useTheme();
  const { settings } = useSiteData();
  const isLight = theme === 'light';
  const fallbackPhone = contactPhones(settings)?.[0] || null;

  return (
    <section className="section offices-map" id="offices" aria-labelledby="offices-map-heading">
      <div className="offices-map__glow" aria-hidden />
      <div className="offices-map__inner">
        <m.header
          className="offices-map__header"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="offices-map__badge">Global presence</span>
          <h2 id="offices-map-heading" className="offices-map__title">
            Our offices
          </h2>
          <p className="offices-map__lead">
            Three hubs — United Kingdom, UAE, and Pakistan. Reach the team that fits your time zone.
          </p>
        </m.header>

        <m.div
          className="offices-map__map-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          <WorldMap
            dots={OFFICE_MAP_ROUTES}
            lineColor={isLight ? '#0d9488' : '#2dd4bf'}
            mapDotColor={isLight ? 'rgba(13, 148, 136, 0.28)' : 'rgba(45, 212, 191, 0.22)'}
            backgroundColor={isLight ? '#ecfdf5' : '#050508'}
            showLabels
            animationDuration={2}
            loop
          />
        </m.div>

        <ul className="offices-map__grid">
          {OFFICE_LOCATIONS.map((office, index) => (
            (() => {
              const phone = office.phone || fallbackPhone;
              return (
            <m.li
              key={office.id}
              className="offices-map__card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 * index }}
            >
              <h3 className="offices-map__city">{office.city}</h3>
              <a href={`mailto:${office.email}`} className="offices-map__link">
                {office.email}
              </a>
              {phone ? (
                <a href={telHref(phone)} className="offices-map__phone">
                  {phone}
                </a>
              ) : null}
              <p className="offices-map__address">{office.address}</p>
            </m.li>
              );
            })()
          ))}
        </ul>
      </div>
    </section>
  );
}
