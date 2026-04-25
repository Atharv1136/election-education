import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const statusStyles = {
  upcoming: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-gold-100 text-gold-700',
  completed: 'bg-green-100 text-green-700',
}

const statusLabels = {
  upcoming: 'Upcoming',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export default function TimelineCard({ event, index }) {
  const [expanded, setExpanded] = useState(false)
  const isLeft = index % 2 === 0

  return (
    <div className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      {/* Timeline Dot */}
      <div className="absolute left-[24px] md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-civic-400 flex items-center justify-center z-10 shadow-md">
        <span className="text-lg">{event.phase_icon}</span>
      </div>

      {/* Card */}
      <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
        <div
          className="card p-5 cursor-pointer group"
          onClick={() => setExpanded(!expanded)}
          role="button"
          tabIndex={0}
          aria-expanded={expanded}
          aria-label={`${event.phase_name} - click to ${expanded ? 'collapse' : 'expand'}`}
          onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[event.status]}`}>
                  {statusLabels[event.status]}
                </span>
              </div>
              <h3 className="font-semibold text-lg text-civic-800 group-hover:text-civic-600 transition-colors">
                {event.phase_name}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                {event.start_date && new Date(event.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {event.end_date && event.end_date !== event.start_date && ` — ${new Date(event.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
              </p>
            </div>
            <div className="text-text-muted mt-1">
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>

          {expanded && (
            <div className="mt-4 pt-4 border-t border-border animate-slide-down">
              <p className="text-sm text-text-secondary leading-relaxed">{event.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
