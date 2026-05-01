/**
 * Polling Station Locator page.
 * Uses Google Maps Embed API to help users find nearby polling stations.
 * Integrates with browser geolocation for personalized results.
 */
import { useState, useEffect } from 'react'
import { MapPin, Navigation, Search, Info, ExternalLink } from 'lucide-react'

const MAPS_EMBED_BASE = 'https://www.google.com/maps/embed/v1/search'
// Using free embed — works without an API key for basic usage
const DEFAULT_QUERY = 'polling+station+near+me'

export default function PollingLocator() {
  const [query, setQuery] = useState('')
  const [mapSrc, setMapSrc] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const [userCity, setUserCity] = useState('')

  // Build a Google Maps search URL
  const buildMapUrl = (searchQuery) => {
    const encoded = encodeURIComponent(searchQuery || DEFAULT_QUERY)
    return `https://maps.google.com/maps?q=${encoded}&output=embed&z=14`
  }

  useEffect(() => {
    // Load default map on mount
    setMapSrc(buildMapUrl('election polling booth India'))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setMapSrc(buildMapUrl(`polling station ${query}`))
  }

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.')
      return
    }
    setLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const src = `https://maps.google.com/maps?q=polling+booth&near=${latitude},${longitude}&output=embed&z=14`
        setMapSrc(src)
        setLocating(false)
      },
      () => {
        setLocationError('Unable to retrieve your location. Please enter your area manually.')
        setLocating(false)
      }
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-hero-gradient shadow-md mb-4">
            <MapPin className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-civic-800 mb-2">Find Your Polling Station</h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Locate your nearest polling booth or election center. Enter your area, city, or pin code to get started.
          </p>
        </div>

        {/* Search Controls */}
        <div className="card p-5 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="polling-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your city, area, or PIN code..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-civic-400 focus:ring-2 focus:ring-civic-100 transition-all"
                aria-label="Search for polling station by area"
              />
            </div>
            <button
              type="submit"
              id="polling-search-btn"
              className="px-5 py-2.5 rounded-xl bg-hero-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
            >
              <Search size={16} /> Search
            </button>
            <button
              type="button"
              id="polling-geolocate-btn"
              onClick={handleGeolocate}
              disabled={locating}
              className="px-5 py-2.5 rounded-xl border border-civic-300 text-civic-700 text-sm font-semibold hover:bg-civic-50 transition-colors flex items-center gap-2 disabled:opacity-60"
              aria-label="Use my current location"
            >
              <Navigation size={16} className={locating ? 'animate-spin' : ''} />
              {locating ? 'Locating...' : 'Use My Location'}
            </button>
          </form>

          {locationError && (
            <p className="text-sm text-error flex items-center gap-1.5">
              <Info size={14} /> {locationError}
            </p>
          )}
        </div>

        {/* Map Embed */}
        <div className="card overflow-hidden mb-6">
          <div className="bg-surface-dark px-4 py-2.5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-error" />
              <div className="w-2.5 h-2.5 rounded-full bg-gold-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-success" />
            </div>
            <span className="text-xs text-text-muted">Google Maps — Polling Stations</span>
          </div>
          {mapSrc ? (
            <iframe
              src={mapSrc}
              title="Google Maps — Find Polling Stations Near You"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block"
            />
          ) : (
            <div className="h-96 flex items-center justify-center bg-surface-dark">
              <div className="w-8 h-8 border-4 border-civic-200 border-t-civic-600 rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: '🗳️', title: 'Check Voter Roll', desc: 'Verify your name is on the electoral roll before voting day.', link: 'https://electoralsearch.eci.gov.in/', linkText: 'ECI Portal' },
            { icon: '🪪', title: 'Voter ID Card', desc: 'Apply for or download your digital Voter ID (e-EPIC) online.', link: 'https://voters.eci.gov.in/', linkText: 'NVSP Portal' },
            { icon: '📍', title: 'Booth Locator', desc: 'Use the official ECI portal to find your exact assigned polling booth.', link: 'https://electoralsearch.eci.gov.in/', linkText: 'Find Booth' },
          ].map((item) => (
            <div key={item.title} className="card p-5">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-civic-800 mb-1 text-sm">{item.title}</h3>
              <p className="text-xs text-text-secondary mb-3">{item.desc}</p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-civic-600 hover:underline"
                aria-label={`Open ${item.linkText} in a new tab`}
              >
                {item.linkText} <ExternalLink size={11} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
