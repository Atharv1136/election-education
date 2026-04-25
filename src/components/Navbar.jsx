import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  Menu, X, Home, Calendar, Vote, MessageCircle,
  HelpCircle, BookOpen, LayoutDashboard, LogIn, LogOut
} from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/timeline', label: 'Timeline', icon: Calendar },
  { to: '/how-to-vote', label: 'How to Vote', icon: Vote },
  { to: '/assistant', label: 'Assistant', icon: MessageCircle },
  { to: '/quiz', label: 'Quiz', icon: HelpCircle },
  { to: '/glossary', label: 'Glossary', icon: BookOpen },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, signInWithGoogle, signOut } = useAuth()
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 glass-light shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="ElectIQ Home">
            <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-xl text-civic-800">
              Elect<span className="text-gradient">IQ</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-civic-100 text-civic-700'
                      : 'text-text-secondary hover:text-civic-700 hover:bg-civic-50'
                    }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Auth + Dashboard */}
          <div className="hidden md:flex items-center gap-2">
            {user && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${location.pathname === '/dashboard'
                    ? 'bg-gold-100 text-gold-700'
                    : 'text-text-secondary hover:text-gold-700 hover:bg-gold-50'
                  }`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
            {user ? (
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-civic-700 hover:bg-civic-800 transition-colors shadow-sm"
                aria-label="Sign out"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-hero-gradient hover:opacity-90 transition-opacity shadow-sm"
                aria-label="Sign in with Google"
              >
                <LogIn size={16} />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-civic-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-civic-100 text-civic-700'
                      : 'text-text-secondary hover:text-civic-700 hover:bg-civic-50'
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              )
            })}
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-gold-700 hover:bg-gold-50"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            )}
            <div className="pt-2 border-t border-border">
              {user ? (
                <button
                  onClick={() => { signOut(); setMobileOpen(false) }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => { signInWithGoogle(); setMobileOpen(false) }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white bg-hero-gradient"
                >
                  <LogIn size={18} />
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
