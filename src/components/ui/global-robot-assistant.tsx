"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { RobotOnly } from "./robot-only";
import { Sparkles, X, Send, Bot, User, RefreshCw, MessageSquare, ChevronRight, ChevronLeft, Navigation, Lock } from "lucide-react";
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
  requiresGate?: "enter-club" | "sign-in";
  action: () => void;
}

const dispatchTourEvent = (detail: any) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("orzya-tour-event", { detail }));
  }
};

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: "1. Landing Page — Enter the Club 🚀",
    tagline: "Landing View Gate",
    description: "Welcome to ORZYA! To begin your guided tour, please click the 'ENTER THE STUDENT CLUB' button on the page.",
    robotPositionClass: "fixed top-1/3 right-6 sm:right-16 z-[100000]",
    requiresGate: "enter-club",
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
    tagline: "About ORZYA",
    description: "Explore student project ideas, computational design systems, and club initiatives.",
    robotPositionClass: "fixed top-1/3 right-6 sm:right-16 z-[100000]",
    action: () => dispatchTourEvent({ type: "open-about" }),
  },
  {
    step: 4,
    title: "4. Sign In / Sign Up Access 🔑",
    tagline: "Authentication Gate",
    description: "Please sign in or enter your credentials below. ONLY when you complete sign in / up, the next tour sections (Horizon 3D) will be unlocked!",
    robotPositionClass: "fixed top-1/4 left-6 sm:left-16 z-[100000]",
    requiresGate: "sign-in",
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

interface SectionCard {
  id: string;
  title: string;
  icon: string;
  badge: string;
  gradient: string;
  border: string;
  desc: string;
  query: string;
}

const SECTION_CARDS: SectionCard[] = [
  {
    id: "about",
    title: "About Us",
    icon: "📖",
    badge: "Mission & Pillars",
    gradient: "from-amber-500/15 via-orange-500/10 to-transparent",
    border: "border-amber-500/30 hover:border-amber-400/60",
    desc: "Club mission, 4 pillars (Skill-Barter, Soft Skills, Coding Arena, Idea Hub) & department connect.",
    query: "Can you give me a comprehensive breakdown of the About Us section, our mission, and the student club ecosystem?",
  },
  {
    id: "signin",
    title: "Sign In / Sign Up",
    icon: "🔑",
    badge: "Student Access",
    gradient: "from-purple-500/15 via-indigo-500/10 to-transparent",
    border: "border-purple-500/30 hover:border-purple-400/60",
    desc: "Create account with Google, Apple, or OTP to unlock Horizon 3D and all club resources.",
    query: "Can you explain the Sign In / Sign Up process, verification steps, and what features unlock once signed in?",
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: "✉️",
    badge: "Direct Support",
    gradient: "from-cyan-500/15 via-blue-500/10 to-transparent",
    border: "border-cyan-500/30 hover:border-cyan-400/60",
    desc: "Faculty coordinators, student leads, office location (Dept of AI), and official support email.",
    query: "Can you provide the full Contact Us directory with faculty phone numbers, student coordinators, and support email?",
  },
];

const getLocalSectionResponse = (text: string): string | null => {
  const t = text.toLowerCase();

  // 1. About Us
  if (t.includes("about") || t.includes("mission") || t.includes("story") || t.includes("pillar") || t.includes("department") || t.includes("what is in about") || t.includes("soft skill") || t.includes("skill-barter") || t.includes("coding arena") || t.includes("idea hub")) {
    return "📖 **ABOUT US — CLUB PILLARS & MISSION**\n\n• **Core Vision**: ORZYA is a student-led engagement ecosystem designed to transform learning into peer collaboration and real achievements.\n• **4 Core Pillars**:\n  1. 🤝 **Skill-Barter**: Direct peer teaching credit exchange in React, Python, UI/UX, and DSA.\n  2. 🎤 **Soft Skill League**: Debate battles, public speaking keynote stages & dynamic leaderboard.\n  3. 💻 **Coding Arena**: Real-time algorithmic sprints, speed coding tournaments & bug hunts.\n  4. 💡 **Idea Hub**: Incubator for student project concepts and founder mentorship.\n• **Department Connect**: Directly integrated with the Department of AI curriculum and credits.";
  }

  // 2. Sign In / Sign Up
  if (t.includes("sign") || t.includes("login") || t.includes("auth") || t.includes("register") || t.includes("account") || t.includes("otp") || t.includes("verification") || t.includes("access") || t.includes("unlock") || t.includes("why sign in") || t.includes("credential")) {
    return "🔑 **SIGN IN / SIGN UP — STUDENT ACCESS GATE**\n\n• **How to Access**: Click 'SIGN IN/UP' in the top navbar on Ethereal.\n• **Login Methods**: Sign up with Google, Apple, or verify with a 6-digit email OTP.\n• **Role Pathways**: Choose your role — Visual Architect (Club Leadership), Community Ambassador (Design & UX), Mentor (Code Review & Guidance), or Participant (Student Builder).\n• **What You Unlock**: Access to Horizon 3D, live skill bartering, code challenges, project idea pitch boards, and verified credit earnings!";
  }

  // 3. Contact Us
  if (t.includes("contact") || t.includes("email") || t.includes("phone") || t.includes("coordinator") || t.includes("support") || t.includes("faculty") || t.includes("professor") || t.includes("reach") || t.includes("how to contact") || t.includes("team")) {
    return "✉️ **CONTACT US — OFFICIAL DIRECTORY**\n\n• **Official Support Email**: b.11.08.bandana@gmail.com (Replies within 24 hours)\n• **Visual Architect**: Dept of AI\n• **Professor Coordinators**:\n  - Coordinator 1: +91 8197613412\n  - Coordinator 2: +91 8904752677\n• **Student Coordinators**:\n  - Student Lead 1: +91 9110412394\n  - Student Lead 2: +91 9483379575\n  - Student Lead 3: +91 9148481986\n• **Office Hours**: Monday–Friday, 9:00 AM – 5:00 PM";
  }

  return null;
};

export function GlobalRobotAssistant() {
  const pathname = usePathname();
  const [isClubEntered, setIsClubEntered] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Proactive Tour Prompt State (Disabled/Cancelled)
  const [showTourPrompt, setShowTourPrompt] = useState(false);
  
  // Active Tour Mode State
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [isSignInOpened, setIsSignInOpened] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: "👋 Welcome to the ORZYA Student Club! Here is your quick orientation guide:\n\n📖 1. About Us — Discover our mission, departmental integration, and student initiatives.\n🔑 2. Sign In / Sign Up — Register or log in to unlock Horizon 3D (Skill Barter, Coding Challenges, Soft Skills, Idea Hub).\n✉️ 3. Contact Us — Reach our student and faculty coordinator team.\n\nClick any quick pill below or ask me any question!",
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

  // Horizon Page State (Sign notification only pops up when user reaches Horizon page)
  const [isOnHorizon, setIsOnHorizon] = useState(false);

  // Global Tour & Horizon Event Listener
  useEffect(() => {
    const handleTourEvent = (e: any) => {
      const type = e.detail?.type;

      if (type === "enter-club" || type === "user-clicked-enter") {
        setIsClubEntered(true);
      } else if (type === "back-to-landing") {
        setIsClubEntered(false);
        setIsOnHorizon(false);
        setIsSignInOpened(false);
        setIsOpen(false);
        setIsTourActive(false);
      } else if (type === "open-signin") {
        setIsSignInOpened(true);
      }

      if (type === "auth-success" || type === "reach-horizon") {
        setIsClubEntered(true);
        setIsOnHorizon(true);
        setIsSignInOpened(true);
      } else if (type === "leave-horizon") {
        setIsOnHorizon(false);
      }

      // Gate 1: User clicked "ENTER THE STUDENT CLUB" -> Auto advance from Step 1 to Step 2
      if (type === "user-clicked-enter" && isTourActive) {
        if (currentStepIndex === 0) {
          setCurrentStepIndex(1);
        }
      }

      // Gate 2: User completed authentication (sign in / up) -> Auto advance from Step 4 to Step 5 (Horizon 3D: SKILL BARTER)
      if (type === "auth-success" && isTourActive) {
        const step5Index = TOUR_STEPS.findIndex((s) => s.step === 5);
        if (step5Index !== -1) {
          setCurrentStepIndex(step5Index);
        }
      }
    };
    window.addEventListener("orzya-tour-event", handleTourEvent);
    return () => window.removeEventListener("orzya-tour-event", handleTourEvent);
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
    const currentStep = TOUR_STEPS[currentStepIndex];
    if (currentStep.requiresGate === "enter-club") {
      // Do nothing, wait for user to click "ENTER THE STUDENT CLUB" button
      return;
    }
    if (currentStep.requiresGate === "sign-in") {
      // Do nothing, wait for user to complete sign in / up
      return;
    }

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
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "Orientation completed! Explore the 3 section cards above or ask me any question about About Us, Sign In / Sign Up, and Contact Us.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

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

    // Instant local high-accuracy answer for any of the 3 sections
    const localAnswer = getLocalSectionResponse(textToSend);
    if (localAnswer) {
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: localAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsLoading(false);
      }, 150);
      return;
    }

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();
      const botReply = data.reply || "I am here to assist with our 3 main areas: 1. About Us (Pillars & Mission), 2. Sign In / Sign Up (Student Access Gate), and 3. Contact Us (Coordinator Directory). Please ask any question regarding these sections!";

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
        text: "I am ready to help you with our 3 club sections: About Us, Sign In / Sign Up, and Contact Us. Tap one of the 3 cards above or ask below!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPills = [
    { label: "📖 About Pillars", query: "Can you explain the 4 club pillars and mission in About Us?" },
    { label: "🔑 Sign In Steps", query: "What are the steps and methods to sign in or create an account?" },
    { label: "✉️ Contact Info", query: "Who are the professor and student coordinators to contact?" }
  ];

  const currentTourStep = TOUR_STEPS[currentStepIndex];

  if (pathname === "/" && !isClubEntered) {
    return null;
  }

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

                {currentTourStep.requiresGate === "enter-club" ? (
                  <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono-code flex items-center gap-1.5 animate-pulse">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Click &apos;ENTER THE STUDENT CLUB&apos; on page</span>
                  </div>
                ) : currentTourStep.requiresGate === "sign-in" ? (
                  <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-mono-code flex items-center gap-1.5 animate-pulse">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Waiting for Sign In / Up...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleNextTourStep}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold font-mono-code shadow-lg shadow-purple-500/30 transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{currentStepIndex === TOUR_STEPS.length - 1 ? "Finish Tour 🎉" : "Next Step"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 3. TRAVELING CHAT DRAWER MODAL (With 3 Dedicated Cards) */}
          {/* ========================================================= */}
          {isOpen && !isTourActive && (
            <motion.div
              key="chat-drawer-modal"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-[94vw] sm:w-[460px] h-[560px] mb-4 bg-slate-950/95 border border-purple-500/40 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto selection:bg-purple-500 selection:text-white"
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
                      <span>ORZYA Club Assistant</span>
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                    </h3>
                    <p className="text-[11px] text-slate-400 font-sans">3D Interactive Guide (About • Sign In • Contact)</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() =>
                      setMessages([
                        {
                          id: Date.now().toString(),
                          sender: "bot",
                          text: "Chat cleared! Tap any of the 3 section cards above or ask me anything about About Us, Sign In / Sign Up, and Contact Us.",
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

              {/* THREE SEPARATE SECTION CARDS */}
              <div className="p-3 bg-slate-900/70 border-b border-white/10">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-slate-300">
                    3 Club Sections
                  </span>
                  <span className="text-[10px] font-mono-code text-purple-400">
                    Click card for info ↓
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SECTION_CARDS.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleSendMessage(card.query)}
                      className={`p-2.5 rounded-2xl bg-gradient-to-b ${card.gradient} border ${card.border} flex flex-col items-start justify-between text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer group`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-sm">{card.icon}</span>
                        <span className="text-[8px] font-mono-code uppercase px-1 py-0.5 rounded bg-white/10 text-white/70 font-bold">
                          {card.badge}
                        </span>
                      </div>
                      <h4 className="text-[11px] font-bold text-white font-heading leading-tight mb-1 group-hover:text-purple-300 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-[9px] text-slate-300 font-sans leading-tight line-clamp-2">
                        {card.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Body Messages */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans scrollbar-thin scrollbar-thumb-purple-500/20">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2 ${
                      msg.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                        msg.sender === "user"
                          ? "bg-purple-600 text-white"
                          : "bg-slate-800 border border-purple-500/30 text-cyan-400"
                      }`}
                    >
                      {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
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
                    <span>Analyzing 3 club sections...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Action Suggestion Pills */}
              <div className="px-3 py-1.5 bg-slate-900/60 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
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
                  placeholder="Ask anything about About, Sign In, or Contact..."
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

        {/* Floating Double-Click Sign Notification for AI Robot Assistant (Pops up ONLY when reaching Horizon page) */}
        {isOnHorizon && !isOpen && !isTourActive && (
          <motion.div
            key="horizon-doubleclick-sign"
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mb-2 px-3.5 py-1.5 rounded-2xl bg-slate-950/95 border border-cyan-400/60 shadow-2xl backdrop-blur-xl text-cyan-200 text-[11px] font-mono-code flex items-center gap-1.5 animate-pulse pointer-events-none select-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-bold tracking-wide">Double-click on the section to enter</span>
          </motion.div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 4. AI ASSISTANT STATUS BADGE */}
        {/* ------------------------------------------------------------- */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className="mb-1.5 opacity-90 hover:opacity-100 transition-all bg-[#162019]/90 hover:bg-[#1f2e24] border border-white/[0.18] text-white text-[10px] font-mono-code px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.35)] flex items-center space-x-1.5 cursor-pointer hover:border-white/[0.35] active:scale-95 z-30 pointer-events-auto"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
          <span>{isOpen ? "Close Assistant ✕" : "AI Assistant 💬"}</span>
        </button>

        {/* ------------------------------------------------------------- */}
        {/* 5. 3D ROBOT CANVAS COMPONENT WITH CLICK OVERLAY */}
        {/* ------------------------------------------------------------- */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 relative drop-shadow-[0_10px_25px_rgba(0,0,0,0.22)] cursor-pointer group pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            className="absolute inset-0 z-30 w-full h-full bg-transparent cursor-pointer rounded-full focus:outline-none"
            aria-label={isOpen ? "Close Assistant" : "Open AI Assistant"}
          />
          <div className="w-full h-full pointer-events-none">
            <RobotOnly color="#ffffff" pantallaColor="#00e5ff" pantallaBrillo={2.0} metalness={0.2} className="w-full h-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default GlobalRobotAssistant;
