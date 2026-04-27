import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCookiePrefs, hasCookieDecision, setCookiePrefs } from '../utils/cookieConsent';
import './CookieNotice.css';

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const show = () => {
      try {
        const prefs = getCookiePrefs();
        setAnalyticsEnabled(Boolean(prefs.analytics));
        setVisible(!hasCookieDecision());
      } catch {
        setVisible(true);
      }
    };
    const t = window.setTimeout(show, 450);
    return () => clearTimeout(t);
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);

  const acceptAllCookies = () => {
    setCookiePrefs('accepted', { essential: true, analytics: true });
    setVisible(false);
  };

  const rejectNonEssential = () => {
    setCookiePrefs('rejected', { essential: true, analytics: false });
    setVisible(false);
  };

  const savePreferences = () => {
    setCookiePrefs(analyticsEnabled ? 'accepted' : 'rejected', {
      essential: true,
      analytics: analyticsEnabled,
    });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="cookie-notice"
      role="dialog"
      aria-modal="false"
      aria-live="polite"
      aria-labelledby="cookie-notice-heading"
    >
      <div className="cookie-notice__card">
        <div className="cookie-notice__head">
          <span className="cookie-notice__emoji" aria-hidden>🍪</span>
          <h2 id="cookie-notice-heading">Cookie Notice</h2>
        </div>
        <p className="cookie-notice__text">
          We use essential cookies to run the site and optional analytics cookies to improve performance.
          Accepting cookies does not collect your email address.
          {' '}
          <Link to="/legal/cookie-policy">Read cookie policy</Link>.
        </p>
        <div className="cookie-notice__actions">
          <button type="button" className="cookie-notice__prefs" onClick={() => setShowPrefs(true)}>
            Manage your preferences
          </button>
          <button type="button" className="cookie-notice__reject" onClick={rejectNonEssential}>
            Reject
          </button>
          <button type="button" className="cookie-notice__accept" onClick={acceptAllCookies}>
            Accept all
          </button>
        </div>
        <p className="cookie-notice__meta">Logix Contact · {year}</p>
      </div>
      {showPrefs ? (
        <div className="cookie-notice__modal-backdrop" role="presentation" onClick={() => setShowPrefs(false)}>
          <div
            className="cookie-notice__modal"
            role="dialog"
            aria-label="Cookie preferences"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Cookie Preferences</h3>
            <p>Choose which cookies you allow. Essential cookies are always on for website functionality.</p>
            <label className="cookie-notice__toggle">
              <span>Essential cookies</span>
              <input type="checkbox" checked disabled />
            </label>
            <label className="cookie-notice__toggle">
              <span>Analytics cookies</span>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              />
            </label>
            <div className="cookie-notice__modal-actions">
              <button type="button" className="cookie-notice__modal-cancel" onClick={() => setShowPrefs(false)}>
                Cancel
              </button>
              <button type="button" className="cookie-notice__accept" onClick={savePreferences}>
                Save preferences
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
