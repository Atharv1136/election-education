import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

const SYSTEM_PROMPT = `You are ElectIQ, an expert civic education assistant. You only answer questions related to elections, voting, democracy, civic rights, and electoral processes. Be clear, factual, and friendly. Always encourage civic participation.

Key guidelines:
- Focus on Indian elections by default, but be knowledgeable about global democratic processes
- Provide accurate information about the Election Commission of India, EVMs, VVPAT, voter registration, and electoral laws
- Explain complex electoral concepts in simple, easy-to-understand language
- If a question is not related to elections or civic participation, politely redirect the user
- Always cite constitutional articles or laws when relevant
- Encourage users to register to vote and participate in the democratic process
- Never express political opinions or favor any party/candidate`

/**
 * Sends a multi-turn conversation to Gemini and returns a streaming response.
 * The last message in the array is sent as the new user turn; all prior messages form the chat history.
 *
 * @param {Array<{role: 'user'|'assistant', content: string}>} messages - Full conversation history including the latest user message.
 * @returns {Promise<AsyncIterable>} A Gemini async stream that yields text chunks.
 * @throws {Error} If the Gemini API call fails (network error, invalid key, etc.)
 */
export async function streamChat(messages) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  // Map prior messages to Gemini history format (assistant → model)
  const chatHistory = messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))

  const chat = model.startChat({ history: chatHistory })
  const lastMessage = messages[messages.length - 1].content

  const result = await chat.sendMessageStream(lastMessage)
  return result.stream
}

/**
 * Sends a single prompt to Gemini and returns the complete text response.
 * Use for one-shot, non-streaming queries.
 *
 * @param {string} prompt - The prompt to send to Gemini.
 * @returns {Promise<string>} The text response from Gemini.
 * @throws {Error} If the Gemini API call fails.
 */
export async function quickChat(prompt) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const result = await model.generateContent(prompt)
  return result.response.text()
}
