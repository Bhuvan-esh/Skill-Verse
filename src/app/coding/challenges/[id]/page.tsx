'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Zap,
  Bug,
  Bot,
  Users,
  Sparkles,
  Presentation,
  ArrowLeft,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Sample 7-pillar challenge data matching detail route
  const challenge = {
    id: params.id,
    title: "Microservices Concurrency & Fault Tolerance",
    description: "Design a resilient distributed checkout pipeline that gracefully handles network latency spikes and database connection dropouts.",
    difficulty: "HARD",
    is_team: true,
    team_size: 3,
    credits_reward: 150,
    status: "LIVE",
    rules: "1. Follow clean code standards.\n2. Adapt immediately to live resource constraint twists.\n3. Present working live demo to mentors at 14:30 PM.",
    tags: [
      { name: "REAL_WORLD_PROBLEMS", label: "Real-World Problems", desc: "Production systems & concurrency bottlenecks" },
      { name: "UNEXPECTED_TWISTS", label: "Unexpected Twists", desc: "Mid-challenge resource constraint injections" },
      { name: "TEAM_BASED", label: "Team-Based Challenges", desc: "3-person skill-balanced team collaboration" },
      { name: "BUILD_AND_DEMO", label: "Build & Demo", desc: "10-minute live demonstration slot" },
    ],
    twists: [
      {
        title: "Resource Cap Injection",
        description: "RAM allocation capped at 50MB and network latency artificially increased to 300ms.",
        status: "ACTIVE",
      },
    ],
    team: {
      team_name: "Team Cyber-Architects",
      strategy: "Focus on circuit breakers and Redis async queue buffers to prevent request dropping.",
      members: [
        { name: "Alex Johnson", role: "Full-Stack Lead", usn: "1MS21CS001" },
        { name: "Priya Sharma", role: "Backend Systems Engineer", usn: "1MS21CS042" },
        { name: "Rohan Gupta", role: "DevOps & Reliability Specialist", usn: "1MS21CS089" },
      ],
    },
    demo_tracker: {
      slot: "14:30 PM • Slot #2",
      status: "READY_FOR_DEMO",
      notes: "Demonstration of 10,000 TPS under simulated network latency.",
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500 font-sans">
      <Navbar
        user={user}
        activeRole={user?.role || 'STUDENT'}
        activeTab="competitions"
        setActiveTab={() => router.push('/dashboard?tab=competitions')}
        onLogout={async () => {
          await logout();
          router.push('/join');
        }}
        unreadNotifications={0}
        onOpenNotifications={() => {}}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Back Link */}
        <div>
          <Link
            href="/dashboard?tab=competitions"
            className="inline-flex items-center space-x-2 text-xs font-mono text-purple-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Coding Arena</span>
          </Link>
        </div>

        {/* Challenge Header Card */}
        <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/60 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold uppercase animate-pulse">
                {challenge.status}
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
                Difficulty: {challenge.difficulty}
              </span>
            </div>

            <span className="text-base font-extrabold text-amber-400 font-mono flex items-center space-x-1">
              <Award className="w-4 h-4" />
              <span>+{challenge.credits_reward} Domain Credits</span>
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white font-heading tracking-tight">
            {challenge.title}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            {challenge.description}
          </p>

          {/* Applicable 7-Pillar Badges */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Applicable 7 Pillars for this Challenge
            </span>
            <div className="flex flex-wrap gap-2">
              {challenge.tags.map((tag) => (
                <div
                  key={tag.name}
                  className="px-3 py-1.5 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">{tag.label}</span>
                    <span className="text-[9px] font-sans text-slate-300">{tag.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 1: Active Twists (Pillar 2) */}
        {challenge.twists?.length > 0 && (
          <div className="p-6 rounded-3xl bg-amber-950/40 border border-amber-500/50 space-y-3 shadow-xl">
            <div className="flex items-center space-x-2 text-amber-300 font-mono text-xs font-bold">
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Pillar 2: Active Mid-Challenge Twist</span>
            </div>
            {challenge.twists.map((t, idx) => (
              <div key={idx} className="space-y-1">
                <h3 className="text-base font-bold text-white font-heading">{t.title}</h3>
                <p className="text-xs text-slate-200">{t.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Section 2: Team Roster (Pillar 5) */}
        {challenge.is_team && challenge.team && (
          <div className="glass-card p-6 rounded-3xl border border-indigo-500/30 space-y-4 bg-slate-950/70 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-extrabold text-white font-heading">
                  Pillar 5: Team Roster — {challenge.team.team_name}
                </h3>
              </div>
              <span className="text-xs font-mono text-indigo-300 font-bold">3 Members</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {challenge.team.members.map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">{m.role}</span>
                  <h4 className="text-xs font-bold text-white">{m.name}</h4>
                  <span className="text-[10px] font-mono text-slate-400">{m.usn}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Build & Demo Schedule (Pillar 7) */}
        {challenge.demo_tracker && (
          <div className="glass-card p-6 rounded-3xl border border-teal-500/30 space-y-3 bg-slate-950/70 shadow-xl">
            <div className="flex items-center space-x-2 text-teal-300 font-mono text-xs font-bold">
              <Presentation className="w-4 h-4 text-teal-400" />
              <span>Pillar 7: Live Build & Demo Schedule</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-heading">Mentorship Demo Presentation</h3>
                <p className="text-xs text-slate-300 font-sans">{challenge.demo_tracker.notes}</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold">
                {challenge.demo_tracker.slot}
              </span>
            </div>
          </div>
        )}

        {/* Section 4: Rules & Guidelines */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
          <div className="flex items-center space-x-2 text-purple-300 font-mono text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Rules & Scoring Guidelines</span>
          </div>

          <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/10">
            {challenge.rules}
          </pre>
        </div>

      </main>
    </div>
  );
}
