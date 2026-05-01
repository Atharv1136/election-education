import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * Custom hook that provides authentication state and actions.
 * Subscribes to Supabase auth state changes and cleans up on unmount.
 *
 * @returns {{
 *   user: import('@supabase/supabase-js').User|null,
 *   loading: boolean,
 *   signInWithGoogle: () => Promise<void>,
 *   signOut: () => Promise<void>
 * }}
 */
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  /**
   * Initiates Google OAuth sign-in via Supabase.
   * Redirects the user back to the app's origin after authentication.
   * @returns {Promise<void>}
   */
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) console.error('Login error:', error.message)
  }

  /**
   * Signs the current user out of Supabase Auth.
   * @returns {Promise<void>}
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Logout error:', error.message)
  }

  return { user, loading, signInWithGoogle, signOut }
}
