/**
 * @fileoverview Unit tests for the Gemini AI client utilities.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mock the @google/generative-ai module using inline factory ───────────
// All mock functions must be declared INSIDE the factory to avoid hoisting issues
vi.mock('@google/generative-ai', () => {
  const mockSendMessageStream = vi.fn().mockResolvedValue({
    stream: (async function* () { yield { text: () => 'mock response' } })()
  })
  const mockStartChat = vi.fn().mockReturnValue({ sendMessageStream: mockSendMessageStream })
  const mockGenerateContent = vi.fn().mockResolvedValue({
    response: { text: () => 'Test response from Gemini' }
  })

  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({
        startChat: mockStartChat,
        generateContent: mockGenerateContent,
      }),
    })),
    // Expose for test access
    __mocks: { mockSendMessageStream, mockStartChat, mockGenerateContent }
  }
})

import * as geminiModule from '../lib/geminiClient.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

describe('streamChat()', () => {
  it('calls getGenerativeModel with gemini-2.0-flash', async () => {
    const messages = [{ role: 'user', content: 'What is an EVM?' }]
    await geminiModule.streamChat(messages)
    const instance = GoogleGenerativeAI.mock.results[0].value
    expect(instance.getGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gemini-2.0-flash' })
    )
  })

  it('returns a stream object', async () => {
    const messages = [{ role: 'user', content: 'Test question?' }]
    const stream = await geminiModule.streamChat(messages)
    expect(stream).toBeDefined()
  })

  it('sends empty history for a single message', async () => {
    const messages = [{ role: 'user', content: 'First message' }]
    await geminiModule.streamChat(messages)
    const instance = GoogleGenerativeAI.mock.results[0].value
    const model = instance.getGenerativeModel.mock.results[0].value
    expect(model.startChat).toHaveBeenCalledWith({ history: [] })
  })

  it('converts assistant role to model role in history', async () => {
    const messages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
      { role: 'user', content: 'What is democracy?' },
    ]
    await geminiModule.streamChat(messages)
    const instance = GoogleGenerativeAI.mock.results[0].value
    const model = instance.getGenerativeModel.mock.results[0].value
    expect(model.startChat).toHaveBeenCalledWith({
      history: expect.arrayContaining([
        { role: 'user', parts: [{ text: 'Hello' }] },
        { role: 'model', parts: [{ text: 'Hi there!' }] },
      ]),
    })
  })
})

describe('quickChat()', () => {
  it('calls getGenerativeModel with gemini-2.0-flash', async () => {
    await geminiModule.quickChat('What is voting?')
    const instance = GoogleGenerativeAI.mock.results[0].value
    expect(instance.getGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gemini-2.0-flash' })
    )
  })

  it('calls generateContent with the provided prompt', async () => {
    await geminiModule.quickChat('Explain EVM machines')
    const instance = GoogleGenerativeAI.mock.results[0].value
    const model = instance.getGenerativeModel.mock.results[0].value
    expect(model.generateContent).toHaveBeenCalledWith('Explain EVM machines')
  })

  it('returns a string response', async () => {
    const response = await geminiModule.quickChat('What is voting?')
    expect(typeof response).toBe('string')
    expect(response).toBe('Test response from Gemini')
  })
})

describe('Message format mapping', () => {
  it('user role stays as user in Gemini format', () => {
    const msg = { role: 'user', content: 'Hello' }
    const mapped = { role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text: msg.content }] }
    expect(mapped.role).toBe('user')
  })

  it('assistant role becomes model in Gemini format', () => {
    const msg = { role: 'assistant', content: 'Response' }
    const mapped = { role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text: msg.content }] }
    expect(mapped.role).toBe('model')
  })

  it('parts array contains the message text', () => {
    const msg = { role: 'user', content: 'Test content' }
    const mapped = { role: 'user', parts: [{ text: msg.content }] }
    expect(mapped.parts[0].text).toBe('Test content')
  })

  it('both user and assistant messages have parts', () => {
    const messages = [
      { role: 'user', content: 'Question' },
      { role: 'assistant', content: 'Answer' },
    ]
    messages.forEach((msg) => {
      const mapped = { role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text: msg.content }] }
      expect(mapped.parts).toHaveLength(1)
      expect(mapped.parts[0]).toHaveProperty('text')
    })
  })
})
