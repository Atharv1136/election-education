/**
 * @fileoverview Component tests for the Navbar.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock the useAuth hook
vi.mock('../hooks/useAuth.js', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../hooks/useAuth.js'
import Navbar from '../components/Navbar.jsx'

const renderWithRouter = (ui, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  )
}

describe('Navbar — Unauthenticated state', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: null,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    })
  })

  it('renders the ElectIQ brand name', () => {
    renderWithRouter(<Navbar />)
    // Brand name is split across two spans: "Elect" and "IQ"
    expect(screen.getByLabelText('ElectIQ Home')).toBeInTheDocument()
  })

  it('shows Sign In button when user is not logged in', () => {
    renderWithRouter(<Navbar />)
    const signInButtons = screen.getAllByText(/Sign In/i)
    expect(signInButtons.length).toBeGreaterThan(0)
  })

  it('does not show Dashboard link when user is not logged in', () => {
    renderWithRouter(<Navbar />)
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })

  it('renders all main navigation links', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Timeline').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Quiz').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Glossary').length).toBeGreaterThan(0)
  })

  it('calls signInWithGoogle when Sign In is clicked', () => {
    const signInWithGoogle = vi.fn()
    useAuth.mockReturnValue({
      user: null,
      signInWithGoogle,
      signOut: vi.fn(),
    })
    renderWithRouter(<Navbar />)
    // Click desktop Sign In button (first one)
    const signInButtons = screen.getAllByLabelText('Sign in with Google')
    fireEvent.click(signInButtons[0])
    expect(signInWithGoogle).toHaveBeenCalled()
  })
})

describe('Navbar — Authenticated state', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { id: 'user-123', email: 'test@example.com' },
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    })
  })

  it('shows Dashboard link when user is logged in', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0)
  })

  it('shows Sign Out button when user is logged in', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getAllByText('Sign Out').length).toBeGreaterThan(0)
  })

  it('does not show Sign In button when user is logged in', () => {
    renderWithRouter(<Navbar />)
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
  })

  it('calls signOut when Sign Out is clicked', () => {
    const signOut = vi.fn()
    useAuth.mockReturnValue({
      user: { id: 'user-123', email: 'test@example.com' },
      signInWithGoogle: vi.fn(),
      signOut,
    })
    renderWithRouter(<Navbar />)
    const signOutButtons = screen.getAllByLabelText('Sign out')
    fireEvent.click(signOutButtons[0])
    expect(signOut).toHaveBeenCalled()
  })
})

describe('Navbar — Mobile menu', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: null,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    })
  })

  it('mobile menu is hidden by default', () => {
    renderWithRouter(<Navbar />)
    // Mobile menu button exists
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
  })

  it('opens mobile menu when hamburger button is clicked', () => {
    renderWithRouter(<Navbar />)
    const menuButton = screen.getByLabelText('Open menu')
    fireEvent.click(menuButton)
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument()
  })

  it('closes mobile menu when close button is clicked', () => {
    renderWithRouter(<Navbar />)
    const menuButton = screen.getByLabelText('Open menu')
    fireEvent.click(menuButton)
    const closeButton = screen.getByLabelText('Close menu')
    fireEvent.click(closeButton)
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
  })
})

describe('Navbar — Accessibility', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: null,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    })
  })

  it('nav element has role and aria-label', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
  })

  it('logo has aria-label', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByLabelText('ElectIQ Home')).toBeInTheDocument()
  })
})
