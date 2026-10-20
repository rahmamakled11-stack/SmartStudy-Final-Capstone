import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Plus, MessageSquare, Trash2, Sparkles, User, Bot, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { useChatStore } from '@/store'

const suggestedPrompts = [
  'Help me create a study plan for finals week',
  'Explain the concept of photosynthesis',
  'How can I improve my focus while studying?',
  'Generate practice questions for Calculus',
]

export function ChatPage() {
  const { conversations, currentConversationId, isLoading, createConversation, setCurrentConversation, deleteConversation, getCurrentConversation, generateAIResponse } = useChatStore()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const currentConversation = getCurrentConversation()

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [currentConversation?.messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() || !currentConversationId) return
    const userMessage = input.trim()
    setInput('')
    await generateAIResponse(currentConversationId, userMessage)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-8rem)] flex gap-4">
      <Card className="w-64 glass-card-strong hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <Button className="w-full bg-gradient-to-r from-primary to-purple-600" onClick={() => createConversation()}>
            <Plus className="mr-2 h-4 w-4" />New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setCurrentConversation(conv.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  currentConversationId === conv.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-muted-foreground'
                }`}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="text-sm truncate flex-1">{conv.title}</span>
                <button onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id) }} className="opacity-0 hover:opacity-100 text-destructive">
                  <Trash2 className="h-3 w-3" />
                </button>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="flex-1 glass-card-strong flex flex-col">
        <div className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">AI Study Assistant</h2>
          </div>
        </div>

        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            <AnimatePresence>
              {currentConversation?.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${message.role === 'user' ? 'bg-primary/10' : 'bg-gradient-to-br from-primary to-purple-600'}`}>
                    {message.role === 'user' ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-white" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-accent rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {(!currentConversation || currentConversation.messages.length === 0) && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <Lightbulb className="h-4 w-4" />Suggested prompts
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button key={index} onClick={() => setInput(prompt)} className="text-xs px-3 py-1.5 rounded-full bg-accent hover:bg-accent/80 transition-colors text-muted-foreground">
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-border">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <Input placeholder="Ask your AI study assistant..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} className="flex-1" />
            <Button className="bg-gradient-to-r from-primary to-purple-600" onClick={handleSend} disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
