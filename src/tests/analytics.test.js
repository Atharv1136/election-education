/**
 * @fileoverview Unit tests for GA4 analytics utilities.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { trackPageView, trackQuizComplete, trackChatMessage, trackGlossaryLookup } from '../lib/analytics.js'

describe('Analytics — when gtag is available', () => {
  beforeEach(() => {
    window.gtag = vi.fn()
  })

  afterEach(() => {
    delete window.gtag
  })

  it('trackPageView calls gtag with page_view event', () => {
    trackPageView('/quiz', 'Quiz Page')
    expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
      page_path: '/quiz',
      page_title: 'Quiz Page',
    })
  })

  it('trackQuizComplete calls gtag with quiz_complete event', () => {
    trackQuizComplete(8, 10, 'medium')
    expect(window.gtag).toHaveBeenCalledWith('event', 'quiz_complete', {
      event_category: 'Quiz',
      event_label: 'medium',
      score: 8,
      total: 10,
      percentage: 80,
    })
  })

  it('trackQuizComplete calculates percentage correctly', () => {
    trackQuizComplete(7, 10, 'easy')
    expect(window.gtag).toHaveBeenCalledWith(
      'event', 'quiz_complete',
      expect.objectContaining({ percentage: 70 })
    )
  })

  it('trackChatMessage calls gtag with chat_message event', () => {
    trackChatMessage('What is an EVM?')
    expect(window.gtag).toHaveBeenCalledWith('event', 'chat_message', {
      event_category: 'Assistant',
      event_label: 'What is an EVM?',
    })
  })

  it('trackChatMessage truncates long queries to 50 chars', () => {
    const longQuery = 'A'.repeat(100)
    trackChatMessage(longQuery)
    expect(window.gtag).toHaveBeenCalledWith('event', 'chat_message', {
      event_category: 'Assistant',
      event_label: 'A'.repeat(50),
    })
  })

  it('trackGlossaryLookup calls gtag with glossary_lookup event', () => {
    trackGlossaryLookup('EVM')
    expect(window.gtag).toHaveBeenCalledWith('event', 'glossary_lookup', {
      event_category: 'Glossary',
      event_label: 'EVM',
    })
  })
})

describe('Analytics — when gtag is NOT available (no-ops)', () => {
  beforeEach(() => {
    delete window.gtag
  })

  it('trackPageView does not throw', () => {
    expect(() => trackPageView('/quiz', 'Quiz')).not.toThrow()
  })

  it('trackQuizComplete does not throw', () => {
    expect(() => trackQuizComplete(5, 10, 'easy')).not.toThrow()
  })

  it('trackChatMessage does not throw', () => {
    expect(() => trackChatMessage('test')).not.toThrow()
  })

  it('trackGlossaryLookup does not throw', () => {
    expect(() => trackGlossaryLookup('VVPAT')).not.toThrow()
  })
})
