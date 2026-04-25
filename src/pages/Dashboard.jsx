import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'
import { Trophy, History, MessageCircle, Calendar } from 'lucide-react'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [scores, setScores] = useState([])
  const [chats, setChats] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  async function fetchDashboardData() {
    setDataLoading(true)
    
    // Fetch recent quiz scores
    const { data: scoresData } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
    setScores(scoresData || [])

    // Fetch recent chat sessions
    const { data: chatsData } = await supabase
      .from('chat_history')
      .select('session_id, content, created_at')
      .eq('user_id', user.id)
      .eq('role', 'user')
      .order('created_at', { ascending: false })
    
    // Group chats by session id and just get the most recent ones
    const seen = new Set()
    const uniqueChats = (chatsData || [])
      .filter(d => { if(seen.has(d.session_id)) return false; seen.add(d.session_id); return true })
      .slice(0, 5)
    
    setChats(uniqueChats)
    setDataLoading(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-civic-200 border-t-civic-600 rounded-full animate-spin"/></div>
  if (!user) return <Navigate to="/" replace />

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-hero-gradient rounded-2xl p-8 sm:p-10 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold mb-2">Welcome back!</h1>
            <p className="text-civic-200">You're logged in as <span className="font-medium text-white">{user.email}</span></p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
            <Trophy size={200} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quiz Scores */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-civic-800 flex items-center gap-2">
                <Trophy size={20} className="text-gold-500" /> Recent Quiz Scores
              </h2>
              <Link to="/quiz" className="text-sm font-medium text-civic-600 hover:underline">Take Quiz</Link>
            </div>
            
            {dataLoading ? (
              <div className="py-8 flex justify-center"><div className="w-6 h-6 border-2 border-civic-200 border-t-civic-600 rounded-full animate-spin"/></div>
            ) : scores.length === 0 ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-border rounded-xl">
                <p className="text-sm text-text-secondary mb-3">You haven't taken any quizzes yet.</p>
                <Link to="/quiz" className="px-4 py-2 rounded-lg bg-civic-50 text-civic-700 text-sm font-medium hover:bg-civic-100 transition-colors">Start Quiz</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {scores.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-civic-200 transition-colors">
                    <div>
                      <p className="font-semibold text-civic-800">{s.score} / {s.total}</p>
                      <p className="text-xs text-text-muted">{new Date(s.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-dark capitalize">{s.difficulty}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Conversations */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-civic-800 flex items-center gap-2">
                <History size={20} className="text-civic-500" /> Recent Conversations
              </h2>
              <Link to="/assistant" className="text-sm font-medium text-civic-600 hover:underline">New Chat</Link>
            </div>
            
            {dataLoading ? (
              <div className="py-8 flex justify-center"><div className="w-6 h-6 border-2 border-civic-200 border-t-civic-600 rounded-full animate-spin"/></div>
            ) : chats.length === 0 ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-border rounded-xl">
                <p className="text-sm text-text-secondary mb-3">No conversations with the assistant yet.</p>
                <Link to="/assistant" className="px-4 py-2 rounded-lg bg-civic-50 text-civic-700 text-sm font-medium hover:bg-civic-100 transition-colors">Ask Something</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {chats.map(c => (
                  <Link key={c.session_id} to={`/assistant`} className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-civic-300 hover:shadow-sm transition-all group">
                    <div className="mt-0.5"><MessageCircle size={16} className="text-text-muted group-hover:text-civic-500 transition-colors" /></div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-civic-800 truncate">{c.content}</p>
                      <p className="text-xs text-text-muted mt-1">{new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/timeline" className="card p-5 flex items-center gap-4 hover:border-gold-300 group">
            <div className="w-10 h-10 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar size={20} />
            </div>
            <div>
              <p className="font-semibold text-civic-800">Election Timeline</p>
              <p className="text-xs text-text-secondary">Check upcoming phases</p>
            </div>
          </Link>
          <Link to="/how-to-vote" className="card p-5 flex items-center gap-4 hover:border-civic-300 group">
            <div className="w-10 h-10 rounded-full bg-civic-50 text-civic-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl">🗳️</span>
            </div>
            <div>
              <p className="font-semibold text-civic-800">Voting Checklist</p>
              <p className="text-xs text-text-secondary">Review your required documents</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
