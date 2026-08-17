"use client";

import React, { useState, useRef, useEffect } from "react";
import { RobotOnly } from "./robot-only";
import { Sparkles, X, Send, Bot, User, RefreshCw, MessageSquare, ChevronRight, ChevronLeft, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

interface TourStep {
  step: number;
  title: string;
  tagline: string;
  description: string;
  robotPositionClass: string;
  action: () => void;
}

const dispatchTourEvent = (detail: any) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("anvaya-tour-event", { detail }));
  }
};

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: "1. Landing Page — Enter the Club 🚀",
    tagline: "Landing View",
    description: "Welcome to ANVAYA! To start your tour, please click the 'ENTER THE STUDENT CLUB' button (or click Next below to proceed automatically).",
    robotPositionClass: "fixed top-1/3 right-6 sm:right-16 z-[100000]",
    action: () => dispatchTourEvent({ type: "back-to-landing" }),
  },
  {
    step: 2,
    title: "2. Ethereal — Digital Ecosystem 🌌",
    tagline: "Student Club Ecosystem",
    description: "Entering the Student Club! Ethereal connects students through peer skill exchange, computational design, and innovation.",
    robotPositionClass: "fixed top-1/4 left-6 sm:left-16 z-[100000]",
    action: () => dispatchTourEvent({ type: "enter-club" }),
  },
  {
    step: 3,
    title: "3. Innovation Through Design 🎨",
    tagline: "About ANVAYA",
    description: "Explore student project ideas, computational design systems, and club initiatives.",
    robotPositionClass: "fixed top-1/3 right-6 sm:right-16 z-[100000]",
    action: () => dispatchTourEvent({ type: "open-about" }),
  },
  {
    step: 4,
    title: "4. Sign In / Sign Up Access 🔑",
    tagline: "Authentication & Role Architecture",
    description: "To unlock member privileges, trade skills, or pitch ideas, please sign in or register with your college email!",
    robotPositionClass: "fixed top-1/4 left-6 sm:left-16 z-[100000]",
    action: () => dispatchTourEvent({ type: "open-signin" }),
  },
  {
    step: 5,
    title: "5. Horizon 3D: SKILL BARTER 🤝",
    tagline: "Horizon Section 1 of 4",
    description: "Peer-to-peer skill exchange & micro-mentorship. Trade knowledge in React, Python, or UI Design, and level up with fellow students.",
    robotPositionClass: "fixed top-1/3 right-6 sm:right-16 z-[100000]",
    action: () => dispatchTourEvent({ type: "set-horizon-section", sectionIndex: 1 }),
  },
  {
    step: 6,
    title: "6. Horizon 3D: CODING CHALLENGE 🏆",
    tagline: "Horizon Section 2 of 4",
    description: "Algorithmic contests & real-time benchmarks. Test your coding skills, earn credits, and climb the leaderboard!",
    robotPositionClass: "fixed top-1/4 left-6 sm:left-16 z-[100000]",
    action: () => dispatchTourEvent({ type: "set-horizon-section", sectionIndex: 2 }),
  },
  {
    step: 7,
    title: "7. Horizon 3D: SOFT SKILLS 🎤",
    tagline: "Horizon Section 3 of 4",
    description: "Interactive workshops & communication challenges. Master public speaking, leadership, and collaborative teamwork.",
    robotPositionClass: "fixed top-1/3 right-6 sm:right-16 z-[100000]",
    action: () => dispatchTourEvent({ type: "set-horizon-section", sectionIndex: 3 }),
  },
  {
    step: 8,
    title: "8. Horizon 3D: IDEA HUB 💡",
    tagline: "Horizon Section 4 of 4",
    description: "Student project incubator & founder collaboration. Pitch bold ideas and bring them to life with peer teams!",
    robotPositionClass: "fixed top-1/4 left-6 sm:left-16 z-[100000]",
    action: () => dispatchTourEvent({ type: "set-horizon-section", sectionIndex: 4 }),
  },
];

export function GlobalRobotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Proactive Tour Prompt State
  const [showTourPrompt, setShowTourPrompt] = useState(true);
  
  // Active Tour Mode State
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

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

  // Execute step action on step index change
  useEffect(() => {
    if (isTourActive) {
      const step = TOUR_STEPS[currentStepIndex];
      if (step && step.action) {
        step.action();
      }
    }
  }, [isTourActive, currentStepIndex]);

  const startTour = () => {
    setShowTourPrompt(false);
    setIsOpen(false);
    setIsTourActive(true);
    setCurrentStepIndex(0);
  };

  const cancelTourPrompt = () => {
    setShowTourPrompt(false);
  };

  const handleNextTourStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      endTour();
    }
  };

  const handlePrevTourStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const endTour = () => {
    setIsTourActive(false);
    setCurrentStepIndex(0);
    
    // Add completion message to chat
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "Tour completed! 🎉 You have explored the full ANVAYA ecosystem and all 4 Horizon 3D sections. Ask me anything whenever you need help!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    if (textToSend.toLowerCase().includes("tour")) {
      startTour();
      return;
    }

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
    { label: "🚀 Take Guided Tour", query: "Take a tour" },
    { label: "🤝 Skill Barter", query: "How does Skill Barter work?" },
    { label: "💡 Project Ideas", query: "How do I submit an idea in Idea Hub?" },
    { label: "🏆 Earn Credits", query: "How do credits and ranks work?" },
  ];

  const currentTourStep = TOUR_STEPS[currentStepIndex];

  return (
    <motion.div
      layout
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={
        isTourActive
          ? currentTourStep.robotPositionClass
          : "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100000]"
      }
    >
      <div className="relative flex flex-col items-center pointer-events-auto font-sans">
        <AnimatePresence mode="wait">
          {/* ========================================================= */}
          {/* 1. TRAVELING TOUR STEP NOTIFICATION CARD */}
          {/* ========================================================= */}
          {isTourActive && (
            <motion.div
              key={`tour-card-step-${currentStepIndex}`}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -15 }}
              transition={{ duration: 0.3 }}
              className="mb-3 w-[88vw] sm:w-96 bg-slate-950/95 border border-purple-500/50 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl text-white font-sans pointer-events-auto"
            >
              {/* Header & Step Counter */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5">
                <div className="flex items-center space-x-2">
                  <div className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-mono-code font-bold flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-cyan-400 animate-spin" />
                    <span>Step {currentTourStep.step} of {TOUR_STEPS.length}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans">{currentTourStep.tagline}</span>
                </div>

                <button
                  onClick={endTour}
                  className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded-full hover:bg-white/10 transition-all cursor-pointer font-mono-code flex items-center gap-1"
                >
                  <span>Exit Tour</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 mb-3 font-sans">
                <h3 className="text-sm font-bold text-white tracking-wide font-heading flex items-center gap-2">
                  <span>{currentTourStep.title}</span>
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {currentTourStep.description}
                </p>
              </div>

              {/* Tour Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  onClick={handlePrevTourStep}
                  disabled={currentStepIndex === 0}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-200 text-xs font-semibold font-mono-code transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNextTourStep}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold font-mono-code shadow-lg shadow-purple-500/30 transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <span>{currentStepIndex === TOUR_STEPS.length - 1 ? "Finish Tour 🎉" : "Next Step"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 2. TRAVELING PROACTIVE TOUR PROMPT CARD */}
          {/* ========================================================= */}
          {showTourPrompt && !isOpen && !isTourActive && (
            <motion.div
              key="tour-prompt-bubble"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.3 }}
              className="mb-3 w-72 sm:w-80 bg-slate-950/95 border border-purple-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl pointer-events-auto text-white font-sans"
            >
              <div className="flex items-start justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
                  <h4 className="text-xs font-bold text-white font-heading">AI Robot Assistant</h4>
                </div>
                <button
                  onClick={cancelTourPrompt}
                  className="text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-200 mt-2 mb-3 leading-relaxed">
                Would you like to take a guided tour of the ANVAYA Student Club Ecosystem? 🤖
              </p>

              <div className="flex items-center space-x-2">
                <button
                  onClick={startTour}
                  className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-mono-code shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Yes, take a tour! 🚀</span>
                </button>

                <button
                  onClick={cancelTourPrompt}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold font-mono-code transition-all cursor-pointer"
                >
                  <span>No, thanks</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 3. TRAVELING CHAT DRAWER MODAL */}
          {/* ========================================================= */}
          {isOpen && !isTourActive && (
            <motion.div
              key="chat-drawer-modal"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-[90vw] sm:w-[380px] h-[510px] mb-4 bg-slate-950/95 border border-purple-500/40 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto selection:bg-purple-500 selection:text-white"
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

              {/* Tour Banner Inside Chat */}
              <div className="px-4 py-2 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border-b border-purple-500/20 flex items-center justify-between font-sans">
                <span className="text-xs text-purple-200 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Explore with a guided tour</span>
                </span>
                <button
                  onClick={startTour}
                  className="px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold font-mono-code transition-all shadow-md cursor-pointer"
                >
                  Start Tour 🚀
                </button>
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

        {/* ------------------------------------------------------------- */}
        {/* 4. AI ASSISTANT STATUS BADGE */}
        {/* ------------------------------------------------------------- */}
        <button
          onClick={() => {
            if (!isTourActive) setIsOpen((prev) => !prev);
          }}
          className="mb-1.5 opacity-90 hover:opacity-100 transition-all bg-slate-900/90 hover:bg-slate-800 border border-purple-500/40 text-white text-[10px] font-mono-code px-3 py-1 rounded-full backdrop-blur-md shadow-2xl flex items-center space-x-1.5 cursor-pointer hover:border-purple-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{isTourActive ? `Tour: Step ${currentTourStep.step}/8` : isOpen ? "Close Assistant" : "AI Assistant"}</span>
        </button>

        {/* ------------------------------------------------------------- */}
        {/* 5. 3D ROBOT CANVAS COMPONENT */}
        {/* ------------------------------------------------------------- */}
        <div
          onClick={() => {
            if (!isTourActive) setIsOpen((prev) => !prev);
          }}
          className="w-28 h-28 sm:w-36 sm:h-36 relative drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          <RobotOnly color="#ffffff" pantallaColor="#06b6d4" pantallaBrillo={1.8} metalness={0.5} className="w-full h-full" />
        </div>
      </div>
    </motion.div>
  );
}

export default GlobalRobotAssistant;
