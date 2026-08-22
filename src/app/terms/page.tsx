'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lightbulb, Users, Trophy, Code2, BrainCircuit } from 'lucide-react';

export default function TermsPage() {
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
              Student Club Legal Governance
            </span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
            ⚡ Official Club Policy
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            Terms of Service & Community Code
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-sans max-w-2xl leading-relaxed">
            Welcome to the Student Club Platform (Idea Hub, Coding Arena, Skill Barter & Soft Skills). By accessing our services or creating an account, you agree to these governing terms.
          </p>
        </div>

        {/* Main Terms Document Body */}
        <div className="bg-[#12101e]/90 border border-purple-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 backdrop-blur-xl">

          {/* Section 1 */}
          <section className="space-y-3 border-b border-white/5 pb-6">
            <div className="flex items-center space-x-2 text-purple-300 font-mono text-sm font-bold">
              <Users className="w-4 h-4" />
              <span>1. Academic & Community Code of Conduct</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              All student builders, mentors, community ambassadors, and visual architects must maintain academic honesty and respectful behavior. Harassment, offensive communication, malicious code submissions, or plagiarism across any of the 4 club pillars will result in immediate account suspension and review by club leadership.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-b border-white/5 pb-6">
            <div className="flex items-center space-x-2 text-amber-300 font-mono text-sm font-bold">
              <Lightbulb className="w-4 h-4" />
              <span>2. Project Incubation & Grant Credits (Idea Hub)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Students retain 100% intellectual property ownership of their original project submissions in the Idea Hub. Milestone grants and club credits allocated by Visual Architects are non-monetary academic incentive points designated for incubator project advancement.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-b border-white/5 pb-6">
            <div className="flex items-center space-x-2 text-cyan-300 font-mono text-sm font-bold">
              <Code2 className="w-4 h-4" />
              <span>3. Algorithmic Integrity & Coding Arena</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Participants in algorithmic tournaments and coding challenges agree to submit original solution logic. Automated solution scraping, multi-account manipulation, or test runner exploitation is strictly prohibited.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-b border-white/5 pb-6">
            <div className="flex items-center space-x-2 text-emerald-300 font-mono text-sm font-bold">
              <BrainCircuit className="w-4 h-4" />
              <span>4. Peer Skill Barter & Micro-Mentorship</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Skill Barter sessions are non-monetary peer learning exchanges. Credits earned track collegiate leaderboard standing and verified skill credentials.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-pink-300 font-mono text-sm font-bold">
              <Trophy className="w-4 h-4" />
              <span>5. Membership Roles & Access Control</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              User roles (Participant, Community Ambassador, Mentor, Visual Architect) are assigned based on club leadership approval. Access permissions are strictly bound to your authenticated role session.
            </p>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-4">
          <span>Student Club Governance Board</span>
          <Link href="/privacy" className="text-purple-300 hover:underline">
            Read Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
