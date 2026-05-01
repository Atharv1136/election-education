/**
 * Validates that all required environment variables are present.
 * Logs warnings for missing variables without crashing the app.
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validateEnv() {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_GEMINI_API_KEY',
  ]

  const missing = required.filter(
    (key) => !import.meta.env[key] || import.meta.env[key] === `your_${key.toLowerCase().replace('vite_', '')}`
  )

  if (missing.length > 0) {
    console.warn(
      `[ElectIQ] ⚠️ Missing or placeholder environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}\n  Please check your .env file.`
    )
  }

  return { valid: missing.length === 0, missing }
}
