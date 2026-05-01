/**
 * @fileoverview Component tests for QuizCard.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import QuizCard from '../components/QuizCard.jsx'

const mockQuestion = {
  question: 'What does EVM stand for?',
  option_a: 'Electronic Voting Machine',
  option_b: 'Electoral Vote Method',
  option_c: 'Electronic Vote Monitor',
  option_d: 'Election Verification Machine',
  correct_option: 'a',
  explanation: 'EVM stands for Electronic Voting Machine, used in Indian elections since 1982.',
}

describe('QuizCard — Rendering', () => {
  it('renders the question text', () => {
    render(
      <QuizCard
        question={mockQuestion}
        questionNumber={1}
        total={10}
        onAnswer={vi.fn()}
        answered={false}
      />
    )
    expect(screen.getByText('What does EVM stand for?')).toBeInTheDocument()
  })

  it('renders all 4 answer options', () => {
    render(
      <QuizCard
        question={mockQuestion}
        questionNumber={1}
        total={10}
        onAnswer={vi.fn()}
        answered={false}
      />
    )
    expect(screen.getByText('Electronic Voting Machine')).toBeInTheDocument()
    expect(screen.getByText('Electoral Vote Method')).toBeInTheDocument()
    expect(screen.getByText('Electronic Vote Monitor')).toBeInTheDocument()
    expect(screen.getByText('Election Verification Machine')).toBeInTheDocument()
  })

  it('shows question number and total', () => {
    render(
      <QuizCard
        question={mockQuestion}
        questionNumber={3}
        total={10}
        onAnswer={vi.fn()}
        answered={false}
      />
    )
    expect(screen.getByText('Question 3 of 10')).toBeInTheDocument()
  })

  it('shows timer countdown (starts at 30s)', () => {
    render(
      <QuizCard
        question={mockQuestion}
        questionNumber={1}
        total={10}
        onAnswer={vi.fn()}
        answered={false}
      />
    )
    expect(screen.getByText('30s')).toBeInTheDocument()
  })
})

describe('QuizCard — Interactions', () => {
  it('calls onAnswer with correct key when option is clicked', () => {
    const onAnswer = vi.fn()
    render(
      <QuizCard
        question={mockQuestion}
        questionNumber={1}
        total={10}
        onAnswer={onAnswer}
        answered={false}
      />
    )
    fireEvent.click(screen.getByText('Electronic Voting Machine'))
    expect(onAnswer).toHaveBeenCalledWith('a')
  })

  it('calls onAnswer with correct key for option B', () => {
    const onAnswer = vi.fn()
    render(
      <QuizCard
        question={mockQuestion}
        questionNumber={1}
        total={10}
        onAnswer={onAnswer}
        answered={false}
      />
    )
    fireEvent.click(screen.getByText('Electoral Vote Method'))
    expect(onAnswer).toHaveBeenCalledWith('b')
  })

  it('does not call onAnswer again after already answered', () => {
    const onAnswer = vi.fn()
    render(
      <QuizCard
        question={mockQuestion}
        questionNumber={1}
        total={10}
        onAnswer={onAnswer}
        answered={true}
      />
    )
    fireEvent.click(screen.getByText('Electronic Voting Machine'))
    expect(onAnswer).not.toHaveBeenCalled()
  })
})

describe('QuizCard — After Answer', () => {
  it('shows explanation when answered is true', () => {
    render(
      <QuizCard
        question={mockQuestion}
        questionNumber={1}
        total={10}
        onAnswer={vi.fn()}
        answered={true}
      />
    )
    expect(screen.getByText(/EVM stands for Electronic Voting Machine/)).toBeInTheDocument()
  })

  it('buttons are disabled when answered is true', () => {
    render(
      <QuizCard
        question={mockQuestion}
        questionNumber={1}
        total={10}
        onAnswer={vi.fn()}
        answered={true}
      />
    )
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled()
    })
  })
})

describe('QuizCard — Accessibility', () => {
  it('option buttons have aria-labels', () => {
    render(
      <QuizCard
        question={mockQuestion}
        questionNumber={1}
        total={10}
        onAnswer={vi.fn()}
        answered={false}
      />
    )
    expect(screen.getByLabelText(/Option A: Electronic Voting Machine/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Option B: Electoral Vote Method/)).toBeInTheDocument()
  })
})
