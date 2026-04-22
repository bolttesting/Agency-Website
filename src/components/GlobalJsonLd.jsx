import { useEffect } from 'react';
import { SITE_NAME, getSiteUrl, HTML_LANG } from '../config/seo';

/** One-time Organization + WebSite + LocalBusiness JSON-LD for UK local signals. */
export default function GlobalJsonLd() {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    const graph = [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
        logo: `${siteUrl}/LC.svg`,
        areaServed: {
          '@type': 'Country',
          name: 'United Kingdom',
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'GB',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: SITE_NAME,
        url: siteUrl,
        inLanguage: HTML_LANG,
        publisher: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${siteUrl}/#localbusiness`,
        name: SITE_NAME,
        url: siteUrl,
        image: `${siteUrl}/LC.svg`,
        logo: `${siteUrl}/LC.svg`,
        description: 'UK web and app development agency delivering design and engineering services.',
        inLanguage: HTML_LANG,
        telephone: '+44 7440 147953',
        email: 'info@logixcontact.co.uk',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'GB',
        },
        areaServed: [
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'City', name: 'London' },
          { '@type': 'City', name: 'Manchester' },
          { '@type': 'City', name: 'Birmingham' },
          { '@type': 'City', name: 'Leeds' },
          { '@type': 'City', name: 'Glasgow' },
          { '@type': 'City', name: 'Edinburgh' },
          { '@type': 'City', name: 'Bristol' },
          { '@type': 'City', name: 'Liverpool' },
          { '@type': 'City', name: 'Sheffield' },
          { '@type': 'City', name: 'Newcastle upon Tyne' },
          { '@type': 'City', name: 'Nottingham' },
          { '@type': 'City', name: 'Leicester' },
          { '@type': 'City', name: 'Coventry' },
          { '@type': 'City', name: 'Cardiff' },
          { '@type': 'City', name: 'Swansea' },
          { '@type': 'City', name: 'Belfast' },
          { '@type': 'City', name: 'Aberdeen' },
          { '@type': 'AdministrativeArea', name: 'England' },
          { '@type': 'AdministrativeArea', name: 'Scotland' },
          { '@type': 'AdministrativeArea', name: 'Wales' },
          { '@type': 'AdministrativeArea', name: 'Northern Ireland' },
        ],
        serviceArea: {
          '@type': 'GeoShape',
          addressCountry: 'GB',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Digital Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Web Development',
                serviceType: 'Custom website and web application development',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Mobile App Development',
                serviceType: 'iOS and Android app development',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'UI/UX Design',
                serviceType: 'User interface and user experience design',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Digital Marketing',
                serviceType: 'SEO and digital growth services',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cloud Solutions',
                serviceType: 'Cloud architecture, deployment, and optimization',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'IT Consultancy',
                serviceType: 'Technology strategy and consulting',
              },
            },
          ],
        },
        parentOrganization: { '@id': `${siteUrl}/#organization` },
      },
    ];

    let script = document.getElementById('seo-jsonld-global');
    if (!script) {
      script = document.createElement('script');
      script.id = 'seo-jsonld-global';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  }, []);

  return null;
}
