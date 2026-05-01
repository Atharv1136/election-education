import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Security: Guard against missing environment variables at runtime
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[ElectIQ] ❌ Supabase environment variables are missing.\n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  )
}

/**
 * Pre-configured Supabase client instance.
 * Use this singleton throughout the app for all database and auth operations.
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
