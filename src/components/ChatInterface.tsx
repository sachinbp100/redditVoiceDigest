import { useState, useRef, useEffect } from 'react';
import { ChatMessage, AnalysisResult } from '../types';
import { Send, MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSend: (question: string) => void;
  result: AnalysisResult;
}

export default function ChatInterface({ messages, onSend, result }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "What are my top interests?",
    "Which subreddit am I most active in?",
    "What have I been discussing recently?",
    "What changed in my interests over time?",
    "Summarize my activity",
    "What are the most interesting conversations?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleSuggestion = (suggestion: string) => {
    onSend(suggestion);
  };

  return (
    <div className="space-y-4">
      {/* Chat Header */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Ask Your Reddit AI</h2>
            <p className="text-xs text-slate-400">Ask anything about this Reddit activity</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="rounded-2xl bg-slate-800/30 border border-slate-700/30 min-h-[300px] max-h-[500px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="font-semibold mb-2">Start a Conversation</h3>
            <p className="text-sm text-slate-500 mb-6">
              Ask questions about the Reddit activity analysis
            </p>
            
            {/* Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(suggestion)}
                  className="text-left px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-indigo-500/30 hover:bg-indigo-500/5 text-xs text-slate-400 hover:text-indigo-300 transition-all"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-indigo-500/20 border border-indigo-500/20 text-indigo-100'
                    : 'bg-slate-800/50 border border-slate-700/30 text-slate-300'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this Reddit activity..."
          className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 rounded-xl transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Quick suggestions when messages exist */}
      {messages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 4).map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(suggestion)}
              className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-indigo-500/30 text-slate-500 hover:text-indigo-400 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
