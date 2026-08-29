'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Zap,
  Bug,
  Bot,
  Users,
  Sparkles,
  Presentation,
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  Terminal,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface PillarCodingDashboardProps {
  user: any;
  onRefresh: () => void;
}

export default function PillarCodingDashboard({ user, onRefresh }: PillarCodingDashboardProps) {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock initial 7-Pillar sample challenges for participant view
  useEffect(() => {
    const samplePillarChallenges = [
      {
        id: 'pillar-c1',
        title: 'Microservices Concurrency & Fault Tolerance',
        description: 'Design a resilient distributed checkout pipeline that gracefully handles network latency spikes and database connection dropouts.',
        difficulty: 'HARD',
        is_team: true,
        team_size: 3,
        status: 'LIVE',
        credits_reward: 150,
        tags: ['REAL_WORLD_PROBLEMS', 'UNEXPECTED_TWISTS', 'TEAM_BASED', 'BUILD_AND_DEMO'],
        twists: [
          {
            id: 't1',
            title: 'Resource Cap Injection',
            description: 'RAM allocation capped at 50MB and network latency artificially increased to 300ms.',
            status: 'ACTIVE',
          },
        ],
        team: {
          team_name: 'Team Cyber-Architects',
          strategy_notes: 'Focus on circuit breakers and Redis async queue buffers to prevent request dropping.',
          members: [
            { id: 'm1', name: user?.name || 'Alex Johnson', usn: user?.usn || '1MS21CS001', role: 'Full-Stack Lead' },
            { id: 'm2', name: 'Priya Sharma', usn: '1MS21CS042', role: 'Backend & Systems Engineer' },
            { id: 'm3', name: 'Rohan Gupta', usn: '1MS21CS089', role: 'DevOps & Reliability Specialist' },
          ],
        },
        awards: [
          { category: 'Most Creative Solution', badge: '💡 Creative Genius', recipient: 'Team Cyber-Architects', reason: 'Implemented an inline zero-alloc memory pool.' },
          { category: 'Best AI Improvement', badge: '🤖 LLM Optimizer', recipient: 'Alex Johnson', reason: 'Fixed 4 halluncinated logic bugs in generated code.' },
        ],
        demo_tracker: {
          demo_slot: '14:30 PM • Slot #2',
          status: 'READY_FOR_DEMO',
          repo_link: 'https://github.com/club/checkout-pipeline',
          demo_notes: 'Live demonstration of 10,000 TPS under latency injection.',
        },
      },
      {
        id: 'pillar-c2',
        title: 'Memory Leak & Race Condition Debugging Battle',
        description: 'An intentionally broken Node.js microservice is leaking heap memory under load. Locate the unclosed streams and fix race conditions.',
        difficulty: 'MEDIUM',
        is_team: false,
        team_size: 1,
        status: 'LIVE',
        credits_reward: 100,
        tags: ['DEBUGGING_BATTLES', 'REAL_WORLD_PROBLEMS', 'FUN_RECOGNITION'],
        twists: [],
        team: null,
        awards: [
          { category: 'Fastest Debug', badge: '⚡ Speed Bug Hunter', recipient: 'Priya Sharma', reason: 'Identified stream memory leak in 4 minutes.' },
        ],
        demo_tracker: null,
      },
      {
        id: 'pillar-c3',
        title: 'AI Code Refactoring & Benchmark Showdown',
        description: 'Analyze LLM-generated SQL queries and API controllers, identify security vulnerabilities (SQLi), and refactor for 5x throughput.',
        difficulty: 'MEDIUM',
        is_team: false,
        team_size: 1,
        status: 'UPCOMING',
        credits_reward: 120,
        tags: ['AI_VS_HUMAN', 'REAL_WORLD_PROBLEMS', 'FUN_RECOGNITION'],
        twists: [],
        team: null,
        awards: [],
        demo_tracker: null,
      },
    ];

    setChallenges(samplePillarChallenges);
    setLoading(false);
  }, [user]);

  const activeLiveChallenge = challenges.find((c) => c.status === 'LIVE');
  const activeTwist = activeLiveChallenge?.twists?.find((t: any) => t.status === 'ACTIVE');

  return (
    <div className="space-y-10 font-sans">

      {/* Twist Alert Banner */}
      {activeTwist && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-950 to-slate-900 border border-amber-500/50 shadow-xl shadow-amber-500/10 flex items-start space-x-4 animate-in fade-in duration-300">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0 text-amber-400">
            <Zap className="w-5 h-5 animate-bounce" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold text-[10px] uppercase">
                ⚠️ TWIST ALERT IN LIVE CHALLENGE
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold">{activeLiveChallenge.title}</span>
            </div>
            <h4 className="text-sm font-extrabold text-white font-heading">{activeTwist.title}</h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">{activeTwist.description}</p>
          </div>
        </div>
      )}

      {/* SECTION 1: Active & Upcoming 7-Pillar Challenges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-white font-heading flex items-center space-x-2">
            <Globe className="w-5 h-5 text-purple-400" />
            <span>Active & Upcoming Pillar Challenges</span>
          </h3>
          <span className="text-xs font-mono text-slate-400 font-bold">
            {challenges.length} Challenges Scheduled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((c) => (
            <div
              key={c.id}
              className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all shadow-xl bg-slate-950/60"
            >
              <div>
                {/* Pillar Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {c.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold uppercase"
                    >
                      {tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                    c.status === 'LIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {c.status}
                  </span>

                  <span className="text-xs font-mono font-extrabold text-amber-400">
                    +{c.credits_reward} Credits
                  </span>
                </div>

                <h4 className="text-lg font-bold text-white font-heading mb-1">{c.title}</h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4 line-clamp-2">{c.description}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  {c.is_team ? `Team (${c.team_size} members)` : 'Individual'}
                </span>

                <Link
                  href={`/coding/challenges/${c.id}`}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs shadow-md shadow-purple-600/30 flex items-center space-x-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Team Status Section (Visible for Team-Based Challenges) */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-white font-heading flex items-center space-x-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <span>Pillar 5: Team Roster & Strategy Status</span>
        </h3>

        {activeLiveChallenge?.team ? (
          <div className="glass-card p-6 rounded-3xl border border-indigo-500/30 bg-slate-950/70 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Assigned Team</span>
                <h4 className="text-lg font-extrabold text-white font-heading">{activeLiveChallenge.team.team_name}</h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold">
                {activeLiveChallenge.team.members.length} Members Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeLiveChallenge.team.members.map((m: any) => (
                <div key={m.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 block font-bold uppercase">{m.role}</span>
                  <h5 className="text-xs font-bold text-white">{m.name}</h5>
                  <span className="text-[10px] font-mono text-slate-400 block">{m.usn}</span>
                </div>
              ))}
            </div>

            {activeLiveChallenge.team.strategy_notes && (
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 text-xs font-mono text-slate-300">
                <span className="text-amber-300 font-bold block mb-1">💡 Team Strategy Notes:</span>
                <p className="text-slate-300">{activeLiveChallenge.team.strategy_notes}</p>
              </div>
            )}
          </div>
        ) : (
          /* Team Empty State */
          <div className="glass-card p-8 rounded-3xl border border-white/10 text-center space-y-3 bg-slate-950/40">
            <Users className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-white font-heading">No Team Competition Currently Selected</h4>
            <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
              Join a Team-Based Challenge above to be automatically assigned to a skill-balanced algorithmic team.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 3: Fun Recognition & Category Awards */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-white font-heading flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Pillar 6: Fun Recognition & Category Honors</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {challenges.flatMap((c) => c.awards || []).map((award: any, idx: number) => (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-amber-500/30 flex items-start space-x-4 bg-slate-950/70">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0 text-amber-400 font-bold text-lg">
                🏆
              </div>
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  {award.category}
                </span>
                <h4 className="text-sm font-extrabold text-white font-heading">{award.badge}</h4>
                <p className="text-xs text-slate-300 font-sans">
                  Awarded to <strong>{award.recipient}</strong>: {award.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Build & Demo Tracker */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-white font-heading flex items-center space-x-2">
          <Presentation className="w-5 h-5 text-teal-400" />
          <span>Pillar 7: Build & Demo Live Tracker</span>
        </h3>

        {activeLiveChallenge?.demo_tracker ? (
          <div className="glass-card p-6 rounded-3xl border border-teal-500/30 bg-slate-950/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold">
                  {activeLiveChallenge.demo_tracker.status}
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold">
                  Slot: {activeLiveChallenge.demo_tracker.demo_slot}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-white font-heading">
                Live Prototype Presentation
              </h4>
              <p className="text-xs text-slate-300 font-sans">
                {activeLiveChallenge.demo_tracker.demo_notes}
              </p>
            </div>

            {activeLiveChallenge.demo_tracker.repo_link && (
              <a
                href={activeLiveChallenge.demo_tracker.repo_link}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-mono font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-teal-600/30 self-start md:self-auto"
              >
                <span>View Submitted Repository</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ) : (
          /* Demo Empty State */
          <div className="glass-card p-8 rounded-3xl border border-white/10 text-center space-y-3 bg-slate-950/40">
            <Presentation className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-white font-heading">No Active Build & Demo Session</h4>
            <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
              Build & Demo sessions launch during the final 2 hours of hackathon challenges.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
