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

export async function streamChat(messages) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const chatHistory = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))

  const chat = model.startChat({ history: chatHistory })
  const lastMessage = messages[messages.length - 1].content

  const result = await chat.sendMessageStream(lastMessage)
  return result.stream
}

export async function quickChat(prompt) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const result = await model.generateContent(prompt)
  return result.response.text()
}
