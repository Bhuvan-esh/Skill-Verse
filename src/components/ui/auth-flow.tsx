"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  GraduationCap,
  Calendar,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type Step = "email" | "role-select" | "code" | "success";
export type Role = "founder" | "mentor" | "organiser" | "participant";

interface AuthFlowProps {
  onSuccessRedirect?: string;
  onRoleSelected?: (role: Role) => void;
  className?: string;
}

export function AuthFlow({
  onSuccessRedirect = "/dashboard",
  onRoleSelected,
  className = "",
}: AuthFlowProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleRoleChoose = (role: Role) => {
    setSelectedRole(role);
    if (onRoleSelected) onRoleSelected(role);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep("role-select");
  };

  const handleGoogleSignIn = () => {
    setStep("role-select");
  };

  const handleRoleContinue = () => {
    if (!selectedRole) return;
    setStep("code");
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste handling
      const digits = value.slice(0, 6).split("");
      const newCode = [...code];
      digits.forEach((d, i) => {
        newCode[i] = d;
      });
      setCode(newCode);
      const nextFocus = Math.min(digits.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.some((digit) => !digit)) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
    }, 600);
  };

  const handleFinalSuccess = async () => {
    setIsLoading(true);
    const roleToSend = selectedRole || "participant";
    try {
      await fetch("/api/auth/select-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roleToSend }),
      });
    } catch (err) {
      console.error("Failed to establish role session", err);
    } finally {
      window.location.href = onSuccessRedirect;
    }
  };

  const roleOptions: {
    id: Role;
    title: string;
    description: string;
    icon: React.ElementType;
  }[] = [
    {
      id: "founder",
      title: "FOUNDER",
      description: "Building & managing club initiatives, challenges, and team oversight.",
      icon: Crown,
    },
    {
      id: "mentor",
      title: "MENTOR",
      description: "Guiding students, conducting workshops, and reviewing skill barter.",
      icon: GraduationCap,
    },
    {
      id: "organiser",
      title: "ORGANISER",
      description: "Coordinating events, managing logistics, and leaderboard tracking.",
      icon: Calendar,
    },
    {
      id: "participant",
      title: "PARTICIPANT",
      description: "Joining coding challenges, trading skills, and earning achievements.",
      icon: UserCheck,
    },
  ];

  return (
    <div className={`w-full min-h-[580px] bg-[#040406] text-white rounded-3xl overflow-hidden shadow-2xl relative border border-white/10 flex flex-col justify-between p-6 sm:p-10 ${className}`}>
      {/* EXACT DARK DOT MATRIX GRID BACKGROUND FROM ATTACHED SCREENSHOT */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* White Dot Matrix Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Top Center Radial Spotlight Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12)_0%,rgba(139,92,246,0.08)_40%,transparent_75%)] pointer-events-none" />
        
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(4,4,6,0.85)_90%)]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-2xl mx-auto my-auto flex flex-col items-center">
        {/* Form Container Card */}
        <div className="w-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          <AnimatePresence mode="wait">
            {/* STEP 1: EMAIL & GOOGLE */}
            {step === "email" && (
              <motion.div
                key="step-email"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-center"
              >
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                    Welcome Developer
                  </h1>
                  <p className="text-sm text-slate-400 font-sans">
                    Your sign in component
                  </p>
                </div>

                {/* Google OAuth Trigger */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/15 rounded-full text-white text-sm font-medium flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:border-white/30 group"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <div className="relative flex items-center justify-center my-4">
                  <div className="w-full border-t border-white/10" />
                  <span className="absolute bg-[#060609] px-4 text-xs text-slate-500 font-mono-code">
                    or
                  </span>
                </div>

                {/* Email Input Form with Arrow Button */}
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="info@gmail.com"
                      className="w-full pl-5 pr-14 py-4 rounded-full bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-white/40 text-sm transition-all shadow-inner text-center font-mono-code"
                    />
                    <button
                      type="submit"
                      disabled={!email}
                      className="absolute right-2 w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all duration-300 border border-white/20 disabled:opacity-30"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: ROLE SELECTION */}
            {step === "role-select" && (
              <motion.div
                key="step-role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep("email")}
                    className="text-xs font-mono-code text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <span className="text-xs font-mono-code text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                    Step 2 of 3
                  </span>
                </div>

                <div className="space-y-1 text-center">
                  <h2 className="text-2xl font-bold font-heading text-white">Select Access Role</h2>
                  <p className="text-xs text-slate-400">
                    Choose how you will participate in Club Idea Hub.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roleOptions.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                      <div
                        key={role.id}
                        onClick={() => handleRoleChoose(role.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-3 relative overflow-hidden ${
                          isSelected
                            ? "bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20"
                            : "bg-white/5 border-white/10 hover:border-purple-400/40 hover:bg-white/10"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 text-purple-400">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected ? "bg-purple-500 text-white" : "bg-white/10 text-purple-300"
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-sm text-white tracking-wider font-heading">{role.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{role.description}</p>
                      </div>
                    );
                  })}
                </div>

                <Button
                  type="button"
                  disabled={!selectedRole}
                  onClick={handleRoleContinue}
                  className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-full transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  <span>Continue to Verification</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* STEP 3: 6-DIGIT CODE VERIFICATION */}
            {step === "code" && (
              <motion.div
                key="step-code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep("role-select")}
                    className="text-xs font-mono-code text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <span className="text-xs font-mono-code text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                    Step 3 of 3
                  </span>
                </div>

                <div className="space-y-1 text-center">
                  <h2 className="text-2xl font-bold font-heading text-white">Enter 6-Digit Passcode</h2>
                  <p className="text-xs text-slate-400">
                    Code sent to <span className="text-purple-300 font-mono-code">{email || "your email"}</span>.
                  </p>
                </div>

                <form onSubmit={handleCodeSubmit} className="space-y-6">
                  <div className="flex justify-between items-center gap-2">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-14 rounded-2xl bg-white/5 border border-white/15 text-center text-xl font-bold font-mono-code text-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                      />
                    ))}
                  </div>

                  <Button
                    type="submit"
                    disabled={code.some((d) => !d) || isLoading}
                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-full transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                  >
                    {isLoading ? "Verifying..." : "Verify & Authorize"}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS SCREEN */}
            {step === "success" && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-center py-6"
              >
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                    Authentication Successful!
                  </h2>
                  <p className="text-sm text-slate-300">
                    Role: <span className="font-bold text-purple-300 uppercase">{selectedRole || "PARTICIPANT"}</span>.
                  </p>
                </div>

                <Button
                  onClick={handleFinalSuccess}
                  disabled={isLoading}
                  className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-full transition-all shadow-lg shadow-emerald-500/20 text-base"
                >
                  {isLoading ? "Redirecting..." : "Continue to Dashboard"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Screenshot Legal Notice at Bottom */}
        <p className="mt-8 text-[11px] text-slate-500 text-center max-w-lg leading-relaxed font-sans">
          By signing up, you agree to the{" "}
          <a href="#" className="underline text-slate-400 hover:text-white">MSA</a>,{" "}
          <a href="#" className="underline text-slate-400 hover:text-white">Product Terms</a>,{" "}
          <a href="#" className="underline text-slate-400 hover:text-white">Policies</a>,{" "}
          <a href="#" className="underline text-slate-400 hover:text-white">Privacy Notice</a>, and{" "}
          <a href="#" className="underline text-slate-400 hover:text-white">Cookie Notice</a>.
        </p>
      </div>
    </div>
  );
}
