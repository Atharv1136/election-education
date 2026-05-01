/**
 * @fileoverview Unit tests for Supabase client configuration.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the @supabase/supabase-js module
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn((url, key) => ({
    __url: url,
    __key: key,
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  })),
}))

describe('Supabase Client', () => {
  it('exports a supabase client instance', async () => {
    const { supabase } = await import('../lib/supabaseClient.js')
    expect(supabase).toBeDefined()
  })

  it('client has auth property', async () => {
    const { supabase } = await import('../lib/supabaseClient.js')
    expect(supabase.auth).toBeDefined()
    expect(supabase.auth.getSession).toBeDefined()
    expect(supabase.auth.signInWithOAuth).toBeDefined()
    expect(supabase.auth.signOut).toBeDefined()
  })

  it('client has from() method for database queries', async () => {
    const { supabase } = await import('../lib/supabaseClient.js')
    expect(supabase.from).toBeDefined()
    expect(typeof supabase.from).toBe('function')
  })

  it('from() returns a query builder', async () => {
    const { supabase } = await import('../lib/supabaseClient.js')
    const query = supabase.from('quiz_questions')
    expect(query).toBeDefined()
    expect(query.select).toBeDefined()
    expect(query.eq).toBeDefined()
  })
})

describe('Supabase Query Patterns', () => {
  it('quiz_scores query chain resolves with data', async () => {
    const { supabase } = await import('../lib/supabaseClient.js')
    const result = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('user_id', 'test-user')
      .order('created_at', { ascending: false })
      .limit(5)
    expect(result).toHaveProperty('data')
  })

  it('quiz_questions query chain resolves', async () => {
    const { supabase } = await import('../lib/supabaseClient.js')
    const result = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('difficulty', 'easy')
      .limit(10)
    expect(result).toHaveProperty('data')
    expect(result.data).toBeInstanceOf(Array)
  })
})
