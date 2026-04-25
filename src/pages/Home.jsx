import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Vote, MessageCircle, ArrowRight, Users, HelpCircle, Globe } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [stats, setStats] = useState({ questions: 0, terms: 0, steps: 0 })

  useEffect(() => {
    async function fetchStats() {
      const [q, t, s] = await Promise.all([
        supabase.from('quiz_questions').select('id', { count: 'exact', head: true }),
        supabase.from('glossary_terms').select('id', { count: 'exact', head: true }),
        supabase.from('voting_steps').select('id', { count: 'exact', head: true }),
      ])
      setStats({ questions: q.count || 0, terms: t.count || 0, steps: s.count || 0 })
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hero-gradient text-white overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gold-500 blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-civic-300 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-gold-300 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              AI-Powered Election Guide
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-slide-up">
              Understand Your Vote.{' '}
              <span className="text-gradient">Shape Your Future.</span>
            </h1>
            <p className="text-lg sm:text-xl text-civic-200 mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              ElectIQ is your AI-powered guide to the election process — clear, simple, and interactive. Learn about timelines, voting steps, and test your civic knowledge.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/timeline" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold-gradient text-white font-semibold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                Explore Election Timeline <ArrowRight size={18} />
              </Link>
              <Link to="/assistant" className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass text-white font-semibold text-base hover:bg-white/15 transition-all flex items-center justify-center gap-2">
                Ask the Assistant <MessageCircle size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="wave-container">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Calendar, title: 'Election Timelines', desc: 'Know every key date, phase, and milestone in the election process.', to: '/timeline', color: 'civic' },
            { icon: Vote, title: 'How to Vote', desc: 'Step-by-step voting guide for first-time, NRI, and returning voters.', to: '/how-to-vote', color: 'gold' },
            { icon: MessageCircle, title: 'AI Assistant', desc: 'Ask anything about elections, voting rights, and civic participation.', to: '/assistant', color: 'civic' },
          ].map(({ icon: Icon, title, desc, to, color }) => (
            <Link key={to} to={to} className="card p-6 group hover:border-civic-300">
              <div className={`w-12 h-12 rounded-xl ${color === 'gold' ? 'bg-gold-100 text-gold-600' : 'bg-civic-100 text-civic-600'} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <h3 className="font-semibold text-lg text-civic-800 mb-2">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-civic-900 rounded-2xl p-8 sm:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { value: stats.questions, label: 'Quiz Questions', icon: HelpCircle },
              { value: stats.terms, label: 'Glossary Terms', icon: Globe },
              { value: stats.steps, label: 'Guided Steps', icon: Users },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center">
                <Icon className="text-gold-400 mb-2" size={24} />
                <p className="text-3xl font-extrabold text-white mb-1">{value}+</p>
                <p className="text-civic-300 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="card p-8 sm:p-10 bg-gradient-to-br from-gold-50 to-white border-gold-200">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-civic-800 mb-3">Are You Election Ready?</h2>
              <p className="text-text-secondary mb-4">Test your knowledge of the Indian electoral system with our interactive quiz. Choose your difficulty and challenge yourself!</p>
              <Link to="/quiz" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-hero-gradient text-white font-semibold hover:opacity-90 transition-opacity shadow-md">
                Take the Quiz <ArrowRight size={18} />
              </Link>
            </div>
            <div className="text-6xl sm:text-8xl">🗳️</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold text-civic-800 text-center mb-10">How ElectIQ Helps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Priya Sharma', role: 'First-Time Voter', text: 'ElectIQ made my first voting experience so easy! The step-by-step guide helped me understand everything from registration to casting my vote.', emoji: '👩‍🎓' },
            { name: 'Rahul Mehta', role: 'NRI Voter', text: 'As an overseas Indian, I was confused about my voting rights. The AI assistant answered all my questions about NRI voting procedures clearly.', emoji: '🌏' },
            { name: 'Ananya Desai', role: 'College Student', text: 'The quiz feature is amazing! I learned so much about our electoral system. The glossary helped me understand complex terms easily.', emoji: '📚' },
          ].map(({ name, role, text, emoji }) => (
            <div key={name} className="card p-6">
              <div className="text-3xl mb-4">{emoji}</div>
              <p className="text-sm text-text-secondary leading-relaxed mb-4 italic">"{text}"</p>
              <div>
                <p className="font-semibold text-civic-800 text-sm">{name}</p>
                <p className="text-xs text-text-muted">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
