import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { trackQuizComplete } from '../lib/analytics'
import QuizCard from '../components/QuizCard'
import PageLoader from '../components/PageLoader'
import { Trophy, RefreshCcw, Share2, ArrowRight, AlertCircle } from 'lucide-react'

export default function Quiz() {
  const [difficulty, setDifficulty] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [isFinished, setIsFinished] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (difficulty) fetchQuestions()
  }, [difficulty])

  /**
   * Fetches quiz questions from Supabase for the selected difficulty.
   * Handles network/database errors gracefully with a user-facing error state.
   */
  const fetchQuestions = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: dbError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('difficulty', difficulty)
        .limit(10)

      if (dbError) throw new Error(dbError.message)

      const shuffled = (data || []).sort(() => Math.random() - 0.5)
      if (shuffled.length === 0) {
        setError('No questions found for this difficulty. Please try another level.')
        setLoading(false)
        return
      }
      setQuestions(shuffled)
      setCurrentIndex(0)
      setScore(0)
      setAnswers([])
      setIsFinished(false)
    } catch (err) {
      setError(`Failed to load questions: ${err.message}. Please check your connection and try again.`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles a user's answer selection.
   * @param {string|null} selectedKey - The key of the selected option, or null if time ran out.
   */
  const handleAnswer = useCallback((selectedKey) => {
    const currentQ = questions[currentIndex]
    const isCorrect = selectedKey === currentQ.correct_option

    if (isCorrect) setScore((prev) => prev + 1)

    setAnswers((prev) => [
      ...prev,
      {
        question: currentQ.question,
        selected: selectedKey,
        correct: currentQ.correct_option,
        isCorrect,
      },
    ])

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1)
      } else {
        finishQuiz(isCorrect)
      }
    }, 2500)
  }, [currentIndex, questions])

  /**
   * Marks the quiz as finished and saves the score to Supabase if authenticated.
   * @param {boolean} lastWasCorrect - Whether the last answer was correct (needed for accurate final score).
   */
  const finishQuiz = async (lastWasCorrect = false) => {
    setIsFinished(true)
    const finalScore = score + (lastWasCorrect ? 1 : 0)

    // Track quiz completion in GA4
    trackQuizComplete(finalScore, questions.length, difficulty)

    if (user && questions.length > 0) {
      await supabase.from('quiz_scores').insert({
        user_id: user.id,
        score: finalScore,
        total: questions.length,
        difficulty,
      })
    }
  }

  /**
   * Returns badge information based on a percentage score.
   * @param {number} pct - Score percentage (0–100).
   */
  const getBadge = useCallback((pct) => {
    if (pct >= 80) return { title: 'Democracy Champion', icon: '🥇', color: 'text-yellow-500' }
    if (pct >= 50) return { title: 'Informed Voter', icon: '🥈', color: 'text-gray-400' }
    return { title: 'Beginner', icon: '🥉', color: 'text-amber-600' }
  }, [])

  // ── Difficulty Selection Screen ───────────────────────────────────────────
  if (!difficulty) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="card p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-6">
            <Trophy className="text-gold-500" size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-civic-800 mb-4">Are You Election Ready?</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Test your knowledge about the Indian electoral system, voting rights, and democratic processes.
          </p>
          <div className="space-y-4">
            <p className="text-sm font-semibold text-civic-600 uppercase tracking-wider mb-2">Select Difficulty</p>
            {['easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                id={`quiz-difficulty-${level}`}
                onClick={() => setDifficulty(level)}
                className="w-full py-4 rounded-xl border-2 border-border hover:border-civic-400 hover:bg-civic-50 text-civic-800 font-semibold capitalize transition-all"
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Error State ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="card p-8 max-w-md w-full text-center">
          <AlertCircle className="text-error mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-civic-800 mb-2">Something went wrong</h2>
          <p className="text-text-secondary text-sm mb-6">{error}</p>
          <button
            onClick={() => { setError(null); setDifficulty(null) }}
            className="px-6 py-3 rounded-xl bg-hero-gradient text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // ── Results Screen ────────────────────────────────────────────────────────
  if (isFinished) {
    const finalScore = answers.filter((a) => a.isCorrect).length
    const pct = (finalScore / questions.length) * 100
    const badge = getBadge(pct)

    return (
      <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 sm:p-10 text-center mb-8">
            <div className="text-6xl mb-4">{badge.icon}</div>
            <h2 className="text-2xl font-bold text-civic-800 mb-2">{badge.title}</h2>
            <p className="text-text-secondary mb-6">You scored {finalScore} out of {questions.length}</p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                id="quiz-retake-btn"
                onClick={() => setDifficulty(null)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-hero-gradient text-white font-semibold hover:opacity-90 transition-opacity shadow-sm"
              >
                <RefreshCcw size={18} /> Retake Quiz
              </button>
              <button
                id="quiz-share-btn"
                onClick={() =>
                  navigator.share?.({
                    title: 'My ElectIQ Score',
                    text: `I scored ${finalScore}/${questions.length} on the ElectIQ ${difficulty} quiz! Are you election ready?`,
                  }).catch(() => {})
                }
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-civic-300 text-civic-700 font-semibold hover:bg-civic-50 transition-colors"
              >
                <Share2 size={18} /> Share Score
              </button>
            </div>

            {!user && (
              <div className="mt-8 p-4 bg-gold-50 rounded-xl border border-gold-200">
                <p className="text-sm text-gold-800 mb-2">Want to save your scores and track your progress?</p>
                <Link to="/" className="text-sm font-semibold text-civic-600 hover:underline inline-flex items-center gap-1">
                  Sign in now <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-civic-800 mb-4 px-2">Review Answers</h3>
          <div className="space-y-4">
            {answers.map((ans, i) => (
              <div
                key={i}
                className={`card p-5 border-l-4 ${ans.isCorrect ? 'border-l-success bg-green-50/30' : 'border-l-error bg-red-50/30'}`}
              >
                <p className="font-medium text-civic-800 mb-2">{i + 1}. {ans.question}</p>
                {ans.isCorrect ? (
                  <p className="text-sm text-success flex items-center gap-1">✅ You answered correctly</p>
                ) : (
                  <div>
                    <p className="text-sm text-error flex items-center gap-1 mb-1">❌ You answered incorrectly</p>
                    {ans.selected === null && <p className="text-sm text-text-muted">Time ran out.</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Loading State ─────────────────────────────────────────────────────────
  if (loading || questions.length === 0) {
    return <PageLoader />
  }

  // ── Quiz Active Screen ────────────────────────────────────────────────────
  const currentQ = questions[currentIndex]
  const isAnswered = answers.length > currentIndex

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <QuizCard
        question={currentQ}
        questionNumber={currentIndex + 1}
        total={questions.length}
        onAnswer={handleAnswer}
        answered={isAnswered}
      />
    </div>
  )
}
