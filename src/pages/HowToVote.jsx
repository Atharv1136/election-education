import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import StepCard from '../components/StepCard'
import { ChevronDown, ChevronUp, Download, CheckSquare, Square } from 'lucide-react'

const VOTER_TYPES = [
  { key: 'first_time', label: 'First-Time Voter', emoji: '🗳️' },
  { key: 'nri', label: 'NRI Voter', emoji: '🌏' },
  { key: 're_registering', label: 'Re-registering Voter', emoji: '🔄' },
]

const CHECKLIST_ITEMS = [
  'Voter ID (EPIC) or approved photo ID',
  'Address proof (Aadhaar, utility bill, etc.)',
  'Check name on electoral roll',
  'Know your polling station location',
  'Know polling date and timings',
  'Carry a pen (optional, for signing)',
]

export default function HowToVote() {
  const [voterType, setVoterType] = useState('first_time')
  const [steps, setSteps] = useState([])
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS.map(() => false))
  const [expandedFaq, setExpandedFaq] = useState(null)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const [stepsRes, faqsRes] = await Promise.all([
        supabase.from('voting_steps').select('*').eq('voter_type', voterType).order('step_number'),
        supabase.from('faqs').select('*').order('created_at'),
      ])
      setSteps(stepsRes.data || [])
      setFaqs(faqsRes.data || [])
      setLoading(false)
    }
    fetch()
  }, [voterType])

  const toggleCheck = (i) => setChecklist(prev => prev.map((v, j) => j === i ? !v : v))
  const checkedCount = checklist.filter(Boolean).length

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-hero-gradient text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 animate-slide-up">How to Vote — Step by Step</h1>
          <p className="text-civic-200 text-lg max-w-2xl mx-auto mb-8">Your complete guide to casting your vote with confidence.</p>
          {/* Voter Type Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {VOTER_TYPES.map(({ key, label, emoji }) => (
              <button key={key} onClick={() => setVoterType(key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${voterType === key ? 'bg-white text-civic-800 shadow-md' : 'glass text-white hover:bg-white/15'}`}
                aria-pressed={voterType === key}>
                {emoji} {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl font-bold text-civic-800 mb-8">Follow These Steps</h2>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-civic-200 border-t-civic-600 rounded-full animate-spin"/></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map(step => <StepCard key={step.id} step={step} />)}
          </div>
        )}
      </section>

      {/* Document Checklist */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-civic-800">📋 Document Checklist</h2>
            <span className="text-sm font-medium text-civic-600">{checkedCount}/{CHECKLIST_ITEMS.length}</span>
          </div>
          <div className="progress-bar h-2 mb-6"><div className="progress-bar-fill h-full" style={{ width: `${(checkedCount / CHECKLIST_ITEMS.length) * 100}%` }} /></div>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item, i) => (
              <button key={i} onClick={() => toggleCheck(i)} className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-surface-dark transition-colors" aria-label={item}>
                {checklist[i] ? <CheckSquare size={20} className="text-success flex-shrink-0"/> : <Square size={20} className="text-text-muted flex-shrink-0"/>}
                <span className={`text-sm ${checklist[i] ? 'line-through text-text-muted' : 'text-text-primary'}`}>{item}</span>
              </button>
            ))}
          </div>
          <button onClick={() => window.print()} className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-text-secondary hover:bg-surface-dark transition-colors">
            <Download size={16}/> Download Checklist
          </button>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-xl font-bold text-civic-800 mb-6">❓ Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq.id} className="card overflow-hidden">
              <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left" aria-expanded={expandedFaq === i}>
                <span className="font-medium text-sm text-civic-800 pr-4">{faq.question}</span>
                {expandedFaq === i ? <ChevronUp size={18} className="text-text-muted flex-shrink-0"/> : <ChevronDown size={18} className="text-text-muted flex-shrink-0"/>}
              </button>
              {expandedFaq === i && (
                <div className="px-5 pb-5 animate-slide-down">
                  <p className="text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
