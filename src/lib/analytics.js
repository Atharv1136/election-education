/**
 * Google Analytics 4 (GA4) tracking utilities for ElectIQ.
 * Wraps gtag calls safely — no-ops if GA is not loaded.
 */

/**
 * Returns true if the gtag function is available in the global scope.
 * @returns {boolean}
 */
const isGaAvailable = () => typeof window !== 'undefined' && typeof window.gtag === 'function'

/**
 * Tracks a page view event in GA4.
 * @param {string} path - The URL path of the page being viewed.
 * @param {string} title - The human-readable title of the page.
 */
export function trackPageView(path, title) {
  if (!isGaAvailable()) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
  })
}

/**
 * Tracks a quiz completion event in GA4.
 * @param {number} score - The number of correct answers.
 * @param {number} total - The total number of questions.
 * @param {string} difficulty - The quiz difficulty level ('easy' | 'medium' | 'hard').
 */
export function trackQuizComplete(score, total, difficulty) {
  if (!isGaAvailable()) return
  window.gtag('event', 'quiz_complete', {
    event_category: 'Quiz',
    event_label: difficulty,
    score,
    total,
    percentage: Math.round((score / total) * 100),
  })
}

/**
 * Tracks when a user sends a message to the AI assistant.
 * @param {string} [queryPreview] - A truncated preview of the user's message.
 */
export function trackChatMessage(queryPreview = '') {
  if (!isGaAvailable()) return
  window.gtag('event', 'chat_message', {
    event_category: 'Assistant',
    event_label: queryPreview.slice(0, 50),
  })
}

/**
 * Tracks a glossary term lookup.
 * @param {string} term - The term the user looked up.
 */
export function trackGlossaryLookup(term) {
  if (!isGaAvailable()) return
  window.gtag('event', 'glossary_lookup', {
    event_category: 'Glossary',
    event_label: term,
  })
}
