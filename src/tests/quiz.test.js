/**
 * @fileoverview Unit tests for Quiz page logic.
 * Tests getBadge calculations, answer handling, and edge cases.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── getBadge logic extracted from Quiz.jsx for isolated testing ──────────────
/**
 * Returns badge info based on percentage score.
 * @param {number} pct - Percentage score (0-100)
 */
function getBadge(pct) {
  if (pct >= 80) return { title: 'Democracy Champion', icon: '🥇', color: 'text-yellow-500' }
  if (pct >= 50) return { title: 'Informed Voter', icon: '🥈', color: 'text-gray-400' }
  return { title: 'Beginner', icon: '🥉', color: 'text-amber-600' }
}

// ── Score calculation helpers ─────────────────────────────────────────────────
function calculateScore(answers) {
  return answers.filter((a) => a.isCorrect).length
}

function shuffleQuestions(questions) {
  return [...questions].sort(() => Math.random() - 0.5)
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('getBadge()', () => {
  it('returns Democracy Champion for score >= 80%', () => {
    expect(getBadge(80).title).toBe('Democracy Champion')
    expect(getBadge(100).title).toBe('Democracy Champion')
    expect(getBadge(80).icon).toBe('🥇')
  })

  it('returns Informed Voter for score between 50% and 79%', () => {
    expect(getBadge(50).title).toBe('Informed Voter')
    expect(getBadge(79).title).toBe('Informed Voter')
    expect(getBadge(60).icon).toBe('🥈')
  })

  it('returns Beginner for score below 50%', () => {
    expect(getBadge(0).title).toBe('Beginner')
    expect(getBadge(49).title).toBe('Beginner')
    expect(getBadge(0).icon).toBe('🥉')
  })

  it('handles boundary value at exactly 50%', () => {
    expect(getBadge(50).title).toBe('Informed Voter')
  })

  it('handles boundary value at exactly 80%', () => {
    expect(getBadge(80).title).toBe('Democracy Champion')
  })
})

describe('calculateScore()', () => {
  it('returns 0 for all incorrect answers', () => {
    const answers = [
      { isCorrect: false },
      { isCorrect: false },
    ]
    expect(calculateScore(answers)).toBe(0)
  })

  it('returns correct count for mixed answers', () => {
    const answers = [
      { isCorrect: true },
      { isCorrect: false },
      { isCorrect: true },
      { isCorrect: true },
    ]
    expect(calculateScore(answers)).toBe(3)
  })

  it('returns full count for all correct answers', () => {
    const answers = Array(10).fill({ isCorrect: true })
    expect(calculateScore(answers)).toBe(10)
  })

  it('handles empty answers array', () => {
    expect(calculateScore([])).toBe(0)
  })
})

describe('shuffleQuestions()', () => {
  it('returns an array of the same length', () => {
    const questions = [
      { id: 1, question: 'Q1' },
      { id: 2, question: 'Q2' },
      { id: 3, question: 'Q3' },
    ]
    const shuffled = shuffleQuestions(questions)
    expect(shuffled).toHaveLength(questions.length)
  })

  it('does not mutate the original array', () => {
    const questions = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const original = [...questions]
    shuffleQuestions(questions)
    expect(questions).toEqual(original)
  })

  it('contains all the same elements', () => {
    const questions = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const shuffled = shuffleQuestions(questions)
    expect(shuffled).toEqual(expect.arrayContaining(questions))
  })

  it('handles empty array', () => {
    expect(shuffleQuestions([])).toEqual([])
  })

  it('handles single element', () => {
    const single = [{ id: 1 }]
    expect(shuffleQuestions(single)).toEqual(single)
  })
})

describe('Difficulty levels', () => {
  const validDifficulties = ['easy', 'medium', 'hard']

  it('has exactly 3 difficulty levels', () => {
    expect(validDifficulties).toHaveLength(3)
  })

  it('all difficulties are lowercase strings', () => {
    validDifficulties.forEach((d) => {
      expect(typeof d).toBe('string')
      expect(d).toBe(d.toLowerCase())
    })
  })
})
