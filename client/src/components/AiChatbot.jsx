import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Lock,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';
import { api } from '../services/api';

export const AiChatbot = () => {
  const { user, promptLogin } = useAuth();
  const { language, t } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const getInitialMessages = () => [
    {
      sender: 'bot',
      text: t('aiBotGreeting'),
      suggestions: [
        t('suggestion1'),
        t('suggestion2'),
        t('suggestion3'),
        t('suggestion4')
      ]
    }
  ];

  const [messages, setMessages] = useState(getInitialMessages);

  // Update initial message if language changes and conversation hasn't started yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        return getInitialMessages();
      }
      return prev;
    });
  }, [language]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleFloatingButtonClick = () => {
    if (!user) {
      promptLogin({
        title: 'Sign In to Use AI Assistant',
        message: 'Create your account or sign in to consult our AI Accessibility Assistant for personalized route guidance, ramp measurements, and navigation assistance across Sri Lanka.',
        actionName: 'chat with the AI Accessibility Assistant'
      });
      return;
    }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (textToSend) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || loading) return;

    const userMsg = { sender: 'user', text: message.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await api.chatWithAssistant(message.trim(), history);
      if (res.success && res.reply) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: res.reply,
            suggestions: res.suggestions || []
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: 'I am having trouble reaching the Colombo accessibility database right now. Please try again shortly.',
            suggestions: []
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: err.message || 'Unable to connect to the assistant service. Please check your network and try again.',
          suggestions: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Activation Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={handleFloatingButtonClick}
          className="group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-gradient-to-r from-empoway-terracotta to-empoway-coffee text-white shadow-elevated hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Toggle AI Accessibility Assistant"
        >
          <span className="absolute -inset-0.5 rounded-full bg-empoway-peach/40 blur-xs group-hover:blur-sm transition-all pointer-events-none" />

          <div className="relative flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-empoway-champagne" />
            </div>
            <span className="text-xs font-bold tracking-tight pr-1">
              {t('aiAssistant')}
            </span>
            {!user && (
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-white/25 px-2 py-0.5 rounded-full">
                <Lock className="w-2.5 h-2.5" />
                <span>Member Only</span>
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Interactive Chat Window */}
      <AnimatePresence>
        {isOpen && user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-22 right-6 w-96 max-w-[calc(100vw-2rem)] h-[540px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-empoway-blush/80 flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-empoway-coffee to-empoway-terracotta text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
                  <Sparkles className="w-4 h-4 text-empoway-peach" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold tracking-tight leading-tight">
                    {t('aiBotTitle')}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{t('aiBotSubtitle')}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-empoway-ivory/40 text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${msg.sender === 'user'
                        ? 'bg-empoway-terracotta text-white rounded-tr-none shadow-xs'
                        : 'bg-white border border-empoway-blush/70 text-empoway-coffee rounded-tl-none shadow-card'
                      }`}
                  >
                    {msg.text}
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleSendMessage(sug)}
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-empoway-champagne hover:border-empoway-terracotta text-empoway-coffee hover:text-empoway-terracotta transition-colors shadow-2xs text-left"
                        >
                          {sug} &rarr;
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-empoway-muted bg-white p-3 rounded-2xl border border-empoway-blush/60 w-fit">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-empoway-terracotta" />
                  <span>Consulting Colombo accessibility records...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-empoway-blush/70 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('aiBotPlaceholder')}
                className="flex-1 py-2 px-3.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="p-2.5 rounded-xl bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white disabled:opacity-40 transition-colors shadow-xs"
                aria-label={t('send')}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiChatbot;
