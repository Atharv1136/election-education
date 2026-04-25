import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import TimelineCard from '../components/TimelineCard'
import { Download, Share2, Clock } from 'lucide-react'

export default function ElectionTimeline() {
  const [events, setEvents] = useState([])
  const [type, setType] = useState('General')
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const { data } = await supabase
        .from('election_timelines')
        .select('*')
        .eq('election_type', type)
        .order('start_date', { ascending: true })
      setEvents(data || [])
      setLoading(false)

      // Find next upcoming event for countdown
      const upcoming = (data || []).find(e => e.status === 'upcoming')
      if (upcoming?.start_date) {
        setCountdown(new Date(upcoming.start_date))
      } else {
        setCountdown(null)
      }
    }
    fetch()
  }, [type])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-hero-gradient text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 animate-slide-up">Election Timeline</h1>
          <p className="text-civic-200 text-lg max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Track every phase of the election process — from announcement to results.
          </p>
          <div className="flex items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <select
              value={type} onChange={(e) => setType(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur focus:outline-none focus:ring-2 focus:ring-gold-400"
              aria-label="Select election type"
            >
              {['General', 'State', 'Local', 'By-Election'].map(t => (
                <option key={t} value={t} className="text-civic-900">{t} Election</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Countdown */}
      {countdown && <CountdownTimer targetDate={countdown} />}

      {/* Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-civic-200 border-t-civic-600 rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-text-secondary py-20">No timeline data available for this election type.</p>
        ) : (
          <div className="relative">
            <div className="timeline-line" />
            <div className="space-y-8 sm:space-y-12">
              {events.map((event, i) => (
                <TimelineCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Actions */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-civic-700 text-white font-medium hover:bg-civic-800 transition-colors shadow-sm">
            <Download size={18} /> Download Timeline
          </button>
          <button onClick={() => navigator.share?.({ title: 'ElectIQ Timeline', url: window.location.href }).catch(() => {})} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-civic-300 text-civic-700 font-medium hover:bg-civic-50 transition-colors">
            <Share2 size={18} /> Share
          </button>
        </div>
      </section>
    </div>
  )
}

function CountdownTimer({ targetDate }) {
  const [diff, setDiff] = useState({})

  useEffect(() => {
    const calc = () => {
      const now = new Date()
      const ms = targetDate - now
      if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0 }
      return {
        d: Math.floor(ms / 86400000),
        h: Math.floor((ms % 86400000) / 3600000),
        m: Math.floor((ms % 3600000) / 60000),
        s: Math.floor((ms % 60000) / 1000),
      }
    }
    setDiff(calc())
    const timer = setInterval(() => setDiff(calc()), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="max-w-3xl mx-auto px-4 -mt-8 relative z-10">
      <div className="card p-6 bg-gradient-to-r from-civic-50 to-gold-50 border-civic-200">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock size={18} className="text-civic-600" />
          <p className="text-sm font-semibold text-civic-700">Next Election Phase</p>
        </div>
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          {[
            { v: diff.d, l: 'Days' }, { v: diff.h, l: 'Hours' },
            { v: diff.m, l: 'Minutes' }, { v: diff.s, l: 'Seconds' },
          ].map(({ v, l }) => (
            <div key={l} className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-civic-800 font-mono">{String(v || 0).padStart(2, '0')}</p>
              <p className="text-xs text-text-secondary mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
