import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

export default function GlossaryItem({ item }) {
  const navigate = useNavigate()

  const handleAskAssistant = () => {
    navigate(`/assistant?q=Explain the term "${item.term}" in the context of elections`)
  }

  return (
    <div className="card p-5 group" id={`term-${item.first_letter}`} role="article" aria-label={item.term}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-civic-800 text-base">{item.term}</h3>
            <span className="px-2 py-0.5 rounded-full bg-civic-50 text-civic-600 text-xs font-medium">{item.category}</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{item.definition}</p>
        </div>
        <button
          onClick={handleAskAssistant}
          className="flex-shrink-0 p-2 rounded-lg text-text-muted hover:text-civic-600 hover:bg-civic-50 transition-colors opacity-0 group-hover:opacity-100"
          aria-label={`Ask assistant about ${item.term}`}
          title="Ask ElectIQ Assistant"
        >
          <MessageCircle size={18} />
        </button>
      </div>
    </div>
  )
}
