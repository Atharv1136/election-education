import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'
import GlossaryItem from '../components/GlossaryItem'
import { Search } from 'lucide-react'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function Glossary() {
  const [terms, setTerms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState('All')

  useEffect(() => {
    async function fetchTerms() {
      const { data } = await supabase
        .from('glossary_terms')
        .select('*')
        .order('term', { ascending: true })
      setTerms(data || [])
      setLoading(false)
    }
    fetchTerms()
  }, [])

  const filteredTerms = useMemo(() => {
    let filtered = terms
    if (activeLetter !== 'All') {
      filtered = filtered.filter(t => t.first_letter.toUpperCase() === activeLetter)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        t.term.toLowerCase().includes(q) || 
        t.definition.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      )
    }
    return filtered
  }, [terms, activeLetter, searchQuery])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-hero-gradient text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 animate-slide-up">Election Glossary</h1>
          <p className="text-civic-200 text-lg max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            A comprehensive dictionary of election-related terms to help you understand the democratic process better.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-civic-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border-none ring-2 ring-white/20 bg-white/10 text-white placeholder-civic-200 focus:ring-gold-400 focus:bg-white/20 transition-all backdrop-blur"
              placeholder="Search for terms, definitions, or categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setActiveLetter('All') // Reset letter filter when searching
              }}
            />
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Alphabet Filter */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-10">
          <button
            onClick={() => { setActiveLetter('All'); setSearchQuery('') }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeLetter === 'All' && !searchQuery ? 'bg-civic-700 text-white shadow-sm' : 'bg-surface-dark text-text-secondary hover:bg-civic-100 hover:text-civic-700'}`}
          >
            All
          </button>
          {ALPHABET.map(letter => {
            const hasTerms = terms.some(t => t.first_letter.toUpperCase() === letter)
            return (
              <button
                key={letter}
                onClick={() => { setActiveLetter(letter); setSearchQuery('') }}
                disabled={!hasTerms}
                className={`w-8 py-1.5 rounded-lg text-sm font-medium transition-colors 
                  ${activeLetter === letter ? 'bg-civic-700 text-white shadow-sm' : 
                    hasTerms ? 'bg-surface-dark text-text-secondary hover:bg-civic-100 hover:text-civic-700' : 
                    'opacity-30 cursor-not-allowed'}`}
              >
                {letter}
              </button>
            )
          })}
        </div>

        {/* Terms List */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-civic-200 border-t-civic-600 rounded-full animate-spin"/></div>
        ) : filteredTerms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg">No terms found matching your search.</p>
            <button onClick={() => { setSearchQuery(''); setActiveLetter('All') }} className="mt-4 text-civic-600 font-medium hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTerms.map(item => (
              <GlossaryItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
