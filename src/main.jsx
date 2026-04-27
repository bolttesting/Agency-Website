/* eslint-disable react-refresh/only-export-components -- entry file: AnalyticsGate + root render */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LazyMotion, domMax } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import RootErrorBoundary from './RootErrorBoundary.jsx'
import { Analytics } from '@vercel/analytics/react'
import { COOKIE_CONSENT_EVENT, getCookiePrefs } from './utils/cookieConsent'
import './index.css'
import './theme-light.css'
import App from './App.jsx'

/** Start fetching the home page chunk immediately; matches `lazy()` in App and cuts time on `/` with an empty fallback. */
void import('./pages/HomePage')

function AnalyticsGate() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const sync = () => setEnabled(Boolean(getCookiePrefs().analytics))
    sync()
    window.addEventListener(COOKIE_CONSENT_EVENT, sync)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sync)
  }, [])

  return enabled ? <Analytics /> : null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootErrorBoundary>
      <LazyMotion features={domMax} strict>
        <BrowserRouter>
          <ThemeProvider>
            <AnalyticsGate />
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </LazyMotion>
    </RootErrorBoundary>
  </StrictMode>,
)
