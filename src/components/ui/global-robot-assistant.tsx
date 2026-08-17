"use client";

import React, { useState, useRef, useEffect } from "react";
import { RobotOnly } from "./robot-only";
import { Sparkles, X, Send, Bot, User, RefreshCw, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export function GlobalRobotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHintBubble, setShowHintBubble] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hello! 👋 I'm your ANVAYA 3D AI Assistant. How can I help you navigate the student club ecosystem today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Periodically toggle hint bubble when closed
  useEffect(() => {
    const interval = setInterval(() => {
      setShowHintBubble((prev) => !prev);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();
      const botReply = data.reply || "I'm here to assist you with ANVAYA!";

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("AI Assistant request error:", err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "I experienced a temporary connection glitch. Try asking again!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPills = [
    { label: "🤝 Skill Barter", query: "How does Skill Barter work?" },
    { label: "💡 Project Ideas", query: "How do I submit an idea in Idea Hub?" },
    { label: "🏆 Earn Credits", query: "How do credits and ranks work?" },
    { label: "📞 Support Phone", query: "What are the support contact phone numbers?" },
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100000] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {/* Floating Chat Modal Panel */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[90vw] sm:w-[380px] h-[500px] mb-4 bg-slate-950/95 border border-purple-500/40 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto selection:bg-purple-500 selection:text-white"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-purple-500/20 bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-white/10 p-1 border border-purple-500/30 flex items-center justify-center relative">
                  <Bot className="w-5 h-5 text-cyan-400" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-heading tracking-wide flex items-center gap-1.5">
                    <span>ANVAYA Assistant</span>
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans">3D Interactive AI Companion</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() =>
                    setMessages([
                      {
                        id: Date.now().toString(),
                        sender: "bot",
                        text: "Chat cleared! How can I assist you now?",
                        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      },
                    ])
                  }
                  title="Clear chat"
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 font-sans scrollbar-thin scrollbar-thumb-purple-500/20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2 ${
                    msg.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                      msg.sender === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-slate-800 border border-purple-500/30 text-cyan-400"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-purple-600 text-white rounded-tr-none shadow-md"
                        : "bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none shadow-md"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1 opacity-60 text-right ${
                        msg.sender === "user" ? "text-purple-200" : "text-slate-400"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-xs text-purple-300 animate-pulse">
                  <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span>Thinking...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Suggestion Pills */}
            <div className="px-3 py-2 bg-slate-900/60 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickPills.map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => handleSendMessage(pill.query)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 text-purple-200 text-[10px] font-mono-code whitespace-nowrap transition-all cursor-pointer hover:border-purple-400/40"
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Message Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-purple-500/20 bg-slate-950 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask AI Assistant anything..."
                className="flex-1 bg-slate-900 border border-white/10 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-sans"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Speech Bubble when collapsed */}
      {!isOpen && showHintBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="mb-2 mr-2 bg-slate-900/90 border border-purple-500/40 text-purple-200 text-xs font-mono-code px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center space-x-2 pointer-events-auto cursor-pointer hover:border-purple-400"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
          <span>Need help? Click me! 🤖</span>
        </motion.div>
      )}

      {/* Robot Trigger Container */}
      <div className="flex flex-col items-center pointer-events-auto group">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="mb-1.5 opacity-90 group-hover:opacity-100 transition-all bg-slate-900/90 hover:bg-slate-800 border border-purple-500/40 text-white text-[10px] font-mono-code px-3 py-1 rounded-full backdrop-blur-md shadow-2xl flex items-center space-x-1.5 cursor-pointer hover:border-purple-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{isOpen ? "Close Assistant" : "AI Assistant"}</span>
        </button>

        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-28 h-28 sm:w-36 sm:h-36 relative drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          <RobotOnly color="#ffffff" pantallaColor="#06b6d4" pantallaBrillo={1.6} metalness={0.5} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default GlobalRobotAssistant;
