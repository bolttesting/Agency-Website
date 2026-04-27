import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  getSiteUrl,
  LOCALE,
  HTML_LANG,
} from '../config/seo';

function upsertMeta(attrName, attrValue, content) {
  if (content == null || content === '') return;
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function removeMeta(attrName, attrValue) {
  document.querySelector(`meta[${attrName}="${attrValue}"]`)?.remove();
}

/**
 * Per-route SEO: title, description, Open Graph, Twitter, canonical, hreflang (UK), robots, JSON-LD WebPage.
 */
export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  path: pathOverride,
  image,
  type = 'website',
  noindex = false,
  articlePublishedTime,
  articleModifiedTime,
  /** BlogPosting / Article: author display name */
  articleAuthor,
  /** BlogPosting: section (e.g. category) */
  articleSection,
  /** BlogPosting: visible H1 title for JSON-LD headline (when meta title differs from on-page title) */
  headline,
}) {
  const { pathname, search } = useLocation();
  const path = pathOverride ?? `${pathname}${search}`;

  useEffect(() => {
    document.documentElement.lang = HTML_LANG;

    const siteUrl = getSiteUrl();
    const canonical = `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`.split('#')[0];
    const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Web & App Development Agency UK`;
    document.title = pageTitle;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywords);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('name', 'language', 'English');
    upsertMeta('name', 'geo.region', 'GB');
    upsertMeta('name', 'geo.placename', 'United Kingdom');

    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:locale', LOCALE);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    if (image != null && image !== '') {
      const imageStr = typeof image === 'string' ? image : String(image);
      upsertMeta('property', 'og:image', imageStr.startsWith('http') ? imageStr : `${siteUrl}${imageStr}`);
    } else {
      removeMeta('property', 'og:image');
      removeMeta('name', 'twitter:image');
    }

    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    upsertMeta('name', 'twitter:title', pageTitle);
    upsertMeta('name', 'twitter:description', description);
    if (image != null && image !== '') {
      const imageStr = typeof image === 'string' ? image : String(image);
      upsertMeta('name', 'twitter:image', imageStr.startsWith('http') ? imageStr : `${siteUrl}${imageStr}`);
    }

    upsertLink('canonical', canonical);

    const ensureHreflang = (code) => {
      let el = document.querySelector(`link[rel="alternate"][hreflang="${code}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'alternate');
        el.setAttribute('hreflang', code);
        document.head.appendChild(el);
      }
      el.setAttribute('href', canonical);
    };
    ensureHreflang('en-GB');
    ensureHreflang('x-default');

    if (type === 'article' && articlePublishedTime) {
      upsertMeta('property', 'article:published_time', articlePublishedTime);
      if (articleModifiedTime) {
        upsertMeta('property', 'article:modified_time', articleModifiedTime);
      }
    }
    if (type === 'article' && articleAuthor) {
      upsertMeta('property', 'article:author', articleAuthor);
    }
    if (type === 'article' && articleSection) {
      upsertMeta('property', 'article:section', articleSection);
    }

    const webPage = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'BlogPosting' : 'WebPage',
      name: pageTitle,
      description,
      url: canonical,
      inLanguage: HTML_LANG,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: siteUrl,
      },
    };
    if (type === 'article' && articlePublishedTime) {
      webPage.datePublished = articlePublishedTime;
      if (articleModifiedTime) webPage.dateModified = articleModifiedTime;
    }
    if (type === 'article' && (headline || title)) {
      webPage.headline = headline || title;
    }
    if (type === 'article' && articleAuthor) {
      webPage.author = { '@type': 'Person', name: articleAuthor };
    }
    if (type === 'article' && articleSection) {
      webPage.articleSection = articleSection;
    }
    if (image != null && image !== '') {
      const imageStr = typeof image === 'string' ? image : String(image);
      const imgUrl = imageStr.startsWith('http') ? imageStr : `${siteUrl}${imageStr}`;
      webPage.image = [imgUrl];
    }

    let script = document.getElementById('seo-jsonld-page');
    if (!script) {
      script = document.createElement('script');
      script.id = 'seo-jsonld-page';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(webPage);
  }, [
    title,
    description,
    keywords,
    path,
    image,
    type,
    noindex,
    articlePublishedTime,
    articleModifiedTime,
    articleAuthor,
    articleSection,
    headline,
  ]);

  return null;
}
