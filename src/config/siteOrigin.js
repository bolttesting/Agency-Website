/**
 * Single fallback when `VITE_SITE_URL` is unset.
 * Used by `getSiteUrl()` and Vite `transformIndexHtml` — keep one source only.
 */
export const SITE_ORIGIN_FALLBACK = 'https://logixcontact.co.uk'

/** Normalise env value: trim, strip quotes, no trailing slash. */
export function normalizeSiteOrigin(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return SITE_ORIGIN_FALLBACK
  return raw.trim().replace(/^['"]|['"]$/g, '').replace(/\/$/, '')
}
