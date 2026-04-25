import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import * as Icons from 'lucide-react'

export default function StepCard({ step }) {
  const [expanded, setExpanded] = useState(false)
  const IconComponent = Icons[step.icon] || Icons.CircleDot

  return (
    <div className="card p-6 relative group" role="article" aria-label={`Step ${step.step_number}: ${step.title}`}>
      {/* Step Number Badge */}
      <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-hero-gradient text-white font-bold text-lg flex items-center justify-center shadow-md">
        {step.step_number}
      </div>

      <div className="ml-4">
        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-civic-50 text-civic-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <IconComponent size={20} />
          </div>
          <h3 className="font-semibold text-base text-civic-800 leading-snug">{step.title}</h3>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed mb-3">{step.description}</p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium text-civic-600 hover:text-civic-800 flex items-center gap-1 transition-colors"
            aria-expanded={expanded}
          >
            {expanded ? 'Show Less' : 'Learn More'}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {step.external_link && (
            <a
              href={step.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gold-600 hover:text-gold-700 flex items-center gap-1 transition-colors"
            >
              Official Portal <ExternalLink size={14} />
            </a>
          )}
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-border animate-slide-down">
            <p className="text-sm text-text-secondary leading-relaxed">
              This step is crucial in the voting process. Make sure to complete it before moving to the next step. For official guidance, visit the Election Commission of India website or your local Electoral Registration Office.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
