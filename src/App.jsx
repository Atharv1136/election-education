import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'
import { trackPageView } from './lib/analytics'

// Phase 5: React.lazy code splitting — each page is loaded on demand
const Home = lazy(() => import('./pages/Home'))
const ElectionTimeline = lazy(() => import('./pages/ElectionTimeline'))
const HowToVote = lazy(() => import('./pages/HowToVote'))
const Assistant = lazy(() => import('./pages/Assistant'))
const Quiz = lazy(() => import('./pages/Quiz'))
const Glossary = lazy(() => import('./pages/Glossary'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const PollingLocator = lazy(() => import('./pages/PollingLocator'))

/**
 * Analytics tracker — fires a GA4 page_view event on every route change.
 */
function RouteTracker() {
  const location = useLocation()
  useEffect(() => {
    const titles = {
      '/': 'Home',
      '/timeline': 'Election Timeline',
      '/how-to-vote': 'How to Vote',
      '/assistant': 'AI Assistant',
      '/quiz': 'Quiz',
      '/glossary': 'Glossary',
      '/dashboard': 'Dashboard',
      '/polling-locator': 'Polling Locator',
    }
    trackPageView(location.pathname, titles[location.pathname] || 'ElectIQ')
  }, [location.pathname])
  return null
}

function App() {
  return (
    <Router>
      <RouteTracker />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader fullPage />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/timeline" element={<ElectionTimeline />} />
              <Route path="/how-to-vote" element={<HowToVote />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/polling-locator" element={<PollingLocator />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
