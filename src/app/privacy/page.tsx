'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Database, Eye, Server } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#08070d] text-slate-100 selection:bg-purple-500 selection:text-white p-4 sm:p-6 lg:p-12 relative">
      {/* Background Radial Glow */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(167, 139, 250, 0.12) 0%, rgba(8, 7, 13, 0.98) 70%)',
        }}
      />

      {/* 42px Background Grid */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Top Header & Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link
            href="/join"
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-purple-300 hover:text-white border border-white/10 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Join Page</span>
          </Link>

          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <span className="font-mono text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Data Protection & Privacy
            </span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
            🔒 Official Privacy Policy
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            Student Club Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-sans max-w-2xl leading-relaxed">
            Your privacy and data protection are fundamental to our Student Club platform. This document explains how your information is handled.
          </p>
        </div>

        {/* Main Privacy Document Body */}
        <div className="bg-[#12101e]/90 border border-purple-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 backdrop-blur-xl">

          {/* Section 1 */}
          <section className="space-y-3 border-b border-white/5 pb-6">
            <div className="flex items-center space-x-2 text-purple-300 font-mono text-sm font-bold">
              <Database className="w-4 h-4" />
              <span>1. Information We Collect</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              We collect minimal required student credentials, including your Name, College Email Address, USN (Student ID), and Google OAuth Profile UID to verify student membership and manage your leaderboard credits.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-b border-white/5 pb-6">
            <div className="flex items-center space-x-2 text-cyan-300 font-mono text-sm font-bold">
              <Eye className="w-4 h-4" />
              <span>2. How We Use Your Data</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Your information is strictly used to authenticate your session, verify contest submissions, send security alerts, and display collegiate achievements on leaderboard rankings.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-b border-white/5 pb-6">
            <div className="flex items-center space-x-2 text-emerald-300 font-mono text-sm font-bold">
              <Lock className="w-4 h-4" />
              <span>3. Data Protection & Confidentiality</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              We store your credentials securely using encrypted authentication tokens. We do NOT sell, rent, or trade student data with third-party advertisers or external marketing organizations.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-amber-300 font-mono text-sm font-bold">
              <Server className="w-4 h-4" />
              <span>4. Third-Party Authentication</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              We integrate with Firebase Authentication for secure Google OAuth single sign-on. Your Google password is never stored on our servers and authentication is handled directly by Google.
            </p>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-4">
          <span>Student Club Privacy Team</span>
          <Link href="/terms" className="text-purple-300 hover:underline">
            Read Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
