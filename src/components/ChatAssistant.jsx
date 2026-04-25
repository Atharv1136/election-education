import { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Sparkles } from 'lucide-react'
import { streamChat } from '../lib/geminiClient'

const SUGGESTED_PROMPTS = [
  "What is the last date to register as a voter?",
  "How does EVM work?",
  "What are my rights on voting day?",
  "Explain the election code of conduct",
]

export default function ChatAssistant({ initialQuery = '', onMessagesUpdate }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState(initialQuery)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { if (initialQuery) handleSend(initialQuery) }, [])

  const handleSend = async (text) => {
    const msg = text || input.trim()
    if (!msg || isStreaming) return
    setInput('')

    const userMsg = { role: 'user', content: msg, timestamp: new Date() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setIsStreaming(true)

    try {
      const stream = await streamChat(newMessages)
      let assistantContent = ''
      const assistantMsg = { role: 'assistant', content: '', timestamp: new Date() }
      setMessages(prev => [...prev, assistantMsg])

      for await (const chunk of stream) {
        const text = chunk.text()
        assistantContent += text
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { ...assistantMsg, content: assistantContent }
          return updated
        })
      }
      if (onMessagesUpdate) onMessagesUpdate([...newMessages, { ...assistantMsg, content: assistantContent }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, but I encountered an error. Please try again or check your API key configuration.', timestamp: new Date() }])
    }
    setIsStreaming(false)
  }

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SR()
    recognition.continuous = false; recognition.interimResults = false; recognition.lang = 'en-IN'
    recognition.onresult = (e) => { setInput(e.results[0][0].transcript); setIsListening(false) }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-hero-gradient flex items-center justify-center mb-4 animate-float shadow-float">
              <Sparkles className="text-gold-300" size={28} />
            </div>
            <h3 className="text-xl font-bold text-civic-800 mb-2">Ask ElectIQ Anything</h3>
            <p className="text-text-secondary text-sm mb-6 max-w-md">Your AI-powered election guide. Ask about voting, candidates, timelines, or civic rights.</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button key={prompt} onClick={() => handleSend(prompt)} className="px-3 py-2 rounded-xl bg-civic-50 border border-civic-200 text-sm text-civic-700 hover:bg-civic-100 hover:border-civic-300 transition-all">
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-gold-200' : 'text-text-muted'}`}>
                {msg.timestamp?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="chat-bubble-assistant px-4 py-3">
              <div className="typing-indicator"><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4 bg-white">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <button onClick={toggleVoice} className={`p-2.5 rounded-xl transition-colors ${isListening ? 'bg-error text-white' : 'bg-surface-dark text-text-secondary hover:text-civic-600'}`} aria-label={isListening ? 'Stop listening' : 'Start voice input'}>
            {isListening ? <MicOff size={20}/> : <Mic size={20}/>}
          </button>
          <input
            ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about elections, voting, or civic rights..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-civic-400 focus:ring-2 focus:ring-civic-100 transition-all"
            disabled={isStreaming} aria-label="Chat input"
          />
          <button onClick={() => handleSend()} disabled={isStreaming || !input.trim()} className="p-2.5 rounded-xl bg-hero-gradient text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition-all" aria-label="Send message">
            <Send size={20}/>
          </button>
        </div>
      </div>
    </div>
  )
}
