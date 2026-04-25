import { Link } from 'react-router-dom'
import { Heart, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-civic-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl">Elect<span className="text-gold-400">IQ</span></span>
            </div>
            <p className="text-civic-300 text-sm leading-relaxed">Your AI-powered guide to elections and civic participation.</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-civic-400 mb-4">Explore</h3>
            <ul className="space-y-2">
              {[{to:'/timeline',l:'Election Timeline'},{to:'/how-to-vote',l:'How to Vote'},{to:'/assistant',l:'AI Assistant'},{to:'/quiz',l:'Civic Quiz'},{to:'/glossary',l:'Glossary'}].map(({to,l})=>(
                <li key={to}><Link to={to} className="text-civic-300 hover:text-gold-400 text-sm transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-civic-400 mb-4">Resources</h3>
            <ul className="space-y-2">
              {[{h:'https://eci.gov.in',l:'Election Commission'},{h:'https://www.nvsp.in',l:'Voter Registration'},{h:'https://voterportal.eci.gov.in',l:'Voter Portal'}].map(({h,l})=>(
                <li key={h}><a href={h} target="_blank" rel="noopener noreferrer" className="text-civic-300 hover:text-gold-400 text-sm transition-colors flex items-center gap-1">{l}<ExternalLink size={12}/></a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-civic-400 mb-4">Powered By</h3>
            <div className="space-y-2 text-civic-300 text-sm">
              <p>🤖 Google Gemini AI</p>
              <p>⚡ Supabase</p>
              <p>⚛️ React + Vite</p>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-civic-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-civic-400 text-sm flex items-center gap-1">Made with <Heart size={14} className="text-error fill-error"/> for civic education</p>
          <p className="text-civic-500 text-xs">© {new Date().getFullYear()} ElectIQ. Not affiliated with any government body.</p>
        </div>
      </div>
    </footer>
  )
}
