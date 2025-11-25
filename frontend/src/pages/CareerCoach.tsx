
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Sparkles, ThumbsUp, ThumbsDown, MoreHorizontal, Lightbulb, AlertCircle, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
}

const SUGGESTED_PROMPTS = [
  "How do I prepare for a behavioral interview?",
  "Review my resume summary",
  "What are good questions to ask recruiters?",
  "Salary negotiation tips for interns"
];

export const CareerCoach: React.FC = () => {
  const { user, profile } = useAuthStore();
  const userName = profile?.full_name || user?.user_metadata?.full_name || 'there';
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hi ${userName}! I'm your AI Career Coach. I can help you with interview prep, salary negotiation, or career planning. What's on your mind today?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // User message
    const userMsg: Message = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI Response logic
    try {
      const { response } = await api.coach.chat(text);

      const botMsg: Message = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
      setConnectionError(false);
      setRetryCount(0);
    } catch (error: any) {
      console.error('Career Coach Error:', error);
      setConnectionError(true);
      setRetryCount(prev => prev + 1);

      // Determine error type and show appropriate message
      let errorMessage = "I'm having trouble connecting right now.";
      let toastMessage = 'Failed to get response from Career Coach';

      if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        errorMessage = "It seems like there's a network issue. Please check your internet connection and try again.";
        toastMessage = 'Network error - please check your connection';
      } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        errorMessage = "Your session may have expired. Please try logging out and back in.";
        toastMessage = 'Authentication error - please log in again';
      } else if (error.message?.includes('500')) {
        errorMessage = "Our servers are experiencing issues. We're working on it! Please try again in a few moments.";
        toastMessage = 'Server error - please try again later';
      } else if (retryCount >= 2) {
        errorMessage = "I'm having persistent connection issues. Please try refreshing the page or contact support if this continues.";
        toastMessage = 'Multiple failures - please refresh the page';
      }

      toast.error(toastMessage, {
        duration: 4000,
        icon: '⚠️',
      });

      // Add error message to chat
      const botMsg: Message = {
        id: Date.now() + 1,
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSend(input);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col h-screen overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center border border-purple-200 relative">
              <Bot className="w-6 h-6 text-purple-600" />
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${connectionError ? 'bg-red-500' : 'bg-green-500'}`}></span>
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">Career Coach AI</h1>
              <div className={`text-xs font-medium ${connectionError ? 'text-red-500' : 'text-slate-500'}`}>
                {connectionError ? 'Connection issues' : 'Always here to help'}
              </div>
            </div>
          </div>
        </div>
        {connectionError && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
            <WifiOff className="w-3 h-3" />
            <span>Connection unstable</span>
          </div>
        )}
      </header>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-6 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Welcome date separator */}
          <div className="flex justify-center">
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              Today, {new Date().toLocaleDateString()}
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            >
              <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-teal-100 text-teal-700' : 'bg-purple-100 text-purple-700'}`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`p-4 rounded-2xl shadow-sm relative group ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-br-none'
                    : msg.isError
                    ? 'bg-red-50 text-red-900 border border-red-200 rounded-bl-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}>
                  {msg.isError && (
                    <div className="flex items-center gap-2 mb-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-semibold">Error</span>
                    </div>
                  )}
                  <p className="leading-relaxed text-sm sm:text-base whitespace-pre-wrap">{msg.text}</p>

                  {/* Bot Actions */}
                  {msg.sender === 'bot' && (
                    <div className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 pt-2">
                      <button className="p-1 text-slate-400 hover:text-green-500 hover:bg-white rounded shadow-sm border border-transparent hover:border-slate-200 transition-colors">
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-red-500 hover:bg-white rounded shadow-sm border border-transparent hover:border-slate-200 transition-colors">
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <span className={`text-[10px] absolute bottom-1 right-3 opacity-70 ${msg.sender === 'user' ? 'text-teal-100' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 shadow-sm animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <span className="ml-2 text-xs text-slate-500">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Suggested Prompts */}
          {messages.length < 3 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="text-xs sm:text-sm bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200 hover:border-purple-200 px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
                >
                  <Lightbulb className="w-3 h-3" /> {prompt}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about interview tips, resume help..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 disabled:cursor-not-allowed transition-all active:scale-95"
              title={isTyping ? 'Waiting for response...' : 'Send message'}
            >
              {isTyping ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
          <p className="text-center text-xs text-slate-400">
            AI can make mistakes. Please double-check important career advice.
          </p>
        </div>
      </div>
    </div>
  );
};
