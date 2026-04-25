import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'
import ChatAssistant from '../components/ChatAssistant'
import { History, Trash2, X, MessageCircle } from 'lucide-react'

export default function Assistant() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [currentSessionId] = useState(crypto.randomUUID())

  useEffect(() => {
    if (user) fetchSessions()
  }, [user])

  async function fetchSessions() {
    const { data } = await supabase
      .from('chat_history')
      .select('session_id, content, created_at')
      .eq('user_id', user.id)
      .eq('role', 'user')
      .order('created_at', { ascending: false })
      .limit(20)
    // Group by session
    const seen = new Set()
    const unique = (data || []).filter(d => { if (seen.has(d.session_id)) return false; seen.add(d.session_id); return true })
    setSessions(unique)
  }

  async function handleMessagesUpdate(msgs) {
    if (!user) return
    // Save last user and assistant messages
    const lastTwo = msgs.slice(-2)
    for (const msg of lastTwo) {
      await supabase.from('chat_history').insert({
        user_id: user.id,
        session_id: currentSessionId,
        role: msg.role,
        content: msg.content,
      })
    }
    fetchSessions()
  }

  async function deleteSession(sessionId) {
    await supabase.from('chat_history').delete().eq('session_id', sessionId)
    fetchSessions()
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* History Sidebar (Desktop) */}
      {user && showHistory && (
        <div className="hidden md:flex flex-col w-72 border-r border-border bg-white animate-slide-down">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-sm text-civic-800">Chat History</h3>
            <button onClick={() => setShowHistory(false)} className="p-1 rounded hover:bg-surface-dark"><X size={16}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.map(s => (
              <div key={s.session_id} className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-surface-dark group cursor-pointer">
                <MessageCircle size={14} className="text-text-muted flex-shrink-0"/>
                <span className="flex-1 text-sm text-text-secondary truncate">{s.content}</span>
                <button onClick={() => deleteSession(s.session_id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-error transition-opacity" aria-label="Delete session">
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}
            {sessions.length === 0 && <p className="text-xs text-text-muted text-center py-8">No conversations yet</p>}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
              <span className="text-white text-sm font-bold">E</span>
            </div>
            <div>
              <h2 className="font-semibold text-sm text-civic-800">ElectIQ Assistant</h2>
              <p className="text-xs text-success">● Online</p>
            </div>
          </div>
          {user && (
            <button onClick={() => setShowHistory(!showHistory)} className="p-2 rounded-lg hover:bg-surface-dark text-text-secondary transition-colors" aria-label="Toggle chat history">
              <History size={20}/>
            </button>
          )}
        </div>

        <ChatAssistant initialQuery={initialQuery} onMessagesUpdate={handleMessagesUpdate} />
      </div>
    </div>
  )
}
