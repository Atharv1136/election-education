import { useState, useEffect } from 'react'

export default function QuizCard({ question, questionNumber, total, onAnswer, answered }) {
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    if (answered) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); onAnswer(null); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [answered, onAnswer])

  useEffect(() => { setSelected(null); setTimeLeft(30) }, [question])

  const options = [
    { key: 'a', text: question.option_a },
    { key: 'b', text: question.option_b },
    { key: 'c', text: question.option_c },
    { key: 'd', text: question.option_d },
  ]

  const handleSelect = (key) => {
    if (answered) return
    setSelected(key)
    onAnswer(key)
  }

  const getOptionClass = (key) => {
    if (!answered) return selected === key ? 'border-civic-400 bg-civic-50' : ''
    if (key === question.correct_option) return 'correct'
    if (key === selected && key !== question.correct_option) return 'incorrect'
    return 'opacity-50'
  }

  const progressPct = ((questionNumber) / total) * 100
  const timePct = (timeLeft / 30) * 100

  return (
    <div className="card p-6 sm:p-8 max-w-2xl mx-auto animate-fade-in">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-secondary">Question {questionNumber} of {total}</span>
        <span className={`text-sm font-mono font-bold ${timeLeft <= 10 ? 'text-error' : 'text-text-secondary'}`}>
          {timeLeft}s
        </span>
      </div>
      <div className="progress-bar h-2 mb-6">
        <div className="progress-bar-fill h-full" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Timer Bar */}
      <div className="h-1 bg-surface-dark rounded-full mb-6 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${timeLeft <= 10 ? 'bg-error' : 'bg-civic-400'}`}
          style={{ width: `${timePct}%` }}
        />
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold text-civic-800 mb-6 leading-relaxed">{question.question}</h3>

      {/* Options */}
      <div className="space-y-3">
        {options.map(({ key, text }) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            disabled={answered}
            className={`quiz-option w-full text-left p-4 rounded-xl border-2 border-border flex items-center gap-3 ${getOptionClass(key)}`}
            aria-label={`Option ${key.toUpperCase()}: ${text}`}
          >
            <span className="w-8 h-8 rounded-full bg-surface-dark flex items-center justify-center text-sm font-bold text-text-secondary flex-shrink-0">
              {key.toUpperCase()}
            </span>
            <span className="text-sm font-medium">{text}</span>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {answered && (
        <div className={`mt-6 p-4 rounded-xl animate-slide-up ${selected === question.correct_option ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className="text-sm font-semibold mb-1">
            {selected === question.correct_option ? '✅ Correct!' : '❌ Incorrect'}
          </p>
          <p className="text-sm text-text-secondary">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
