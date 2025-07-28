'use client'

import { useState } from 'react'
import { Send, Plus, Check, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface SuggestionButton {
  id: number
  text: string
}

interface ChatMessage {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

const suggestionButtons: SuggestionButton[] = [
  { id: 1, text: "What should I type in text box?" },
  { id: 2, text: "What should I type in text box?" },
  { id: 3, text: "What should I type in text box?" },
  { id: 4, text: "What should I type in text box?" },
]

// Sample chat messages
const initialMessages: ChatMessage[] = [
  {
    id: 1,
    text: "What Are The Latest Updates On My Favorite Team?",
    isUser: true,
    timestamp: new Date()
  },
  {
    id: 2,
    text: "Your Favorite Team, Real Madrid, Won 2-0 Today. Vinícius Júnior Scored Both Goals!",
    isUser: false,
    timestamp: new Date()
  },
  {
    id: 3,
    text: "What Are The Latest Updates On My Favorite Team?",
    isUser: true,
    timestamp: new Date()
  },
  {
    id: 4,
    text: "Your Favorite Team, Real Madrid, Won 2-0 Today. Vinícius Júnior Scored Both Goals!",
    isUser: false,
    timestamp: new Date()
  }
]

export default function NewPlanPage() {
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: inputText, 
        isUser: true, 
        timestamp: new Date() 
      }])
      setInputText('')
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          text: "I'm here to help you create your plan! What specific details would you like to include?", 
          isUser: false, 
          timestamp: new Date() 
        }])
      }, 1000)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleClickOutside = (e: React.MouseEvent) => {
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col w-full">
        {/* Chat Box */}
        <motion.div 
          className="flex-1 bg-white rounded-lg p-4 md:p-6 flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center">
                <Check className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            <div className="relative">
              <button 
                onClick={handleMenuClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-48"
                  >
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700">
                        Edit
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700">
                        Pin To Calendar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex items-start space-x-3 ${message.isUser ? 'justify-start' : 'justify-end'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message.isUser ? (
                  <>
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-gray-400"></div>
                    </div>
                    {/* User Message */}
                    <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg border border-gray-300 bg-white">
                      <p className="text-gray-900 text-sm">{message.text}</p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Assistant Message */}
                    <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg border border-purple-300 bg-purple-50">
                      <p className="text-purple-900 text-sm">{message.text}</p>
                    </div>
                    {/* Assistant Avatar */}
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type Your Text"
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Suggestion Buttons */}
          {/*  */}
          <div className="mt-4 grid grid-cols-2 gap-2 md:gap-3">
            {suggestionButtons.map((button) => (
              <Button className='hover:scale-[102%] transform duration-300 py-4 text-wrap text-[8px] md:text-lg' onClick={() => handleSuggestionClick(button.text)} key={button.id} variant={"optional"}>{button.text}</Button>
            ))}
          </div>
        </motion.div>
      </div>


    </div>
  )
} 