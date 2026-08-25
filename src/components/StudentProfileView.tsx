'use client';

import React, { useState } from 'react';
import {
  Code2,
  BookOpen,
  Cpu,
  Award,
  Star,
  CheckCircle2,
  Zap,
  Lock,
  Check,
  Sparkles,
  XCircle,
} from 'lucide-react';

import {
  evaluateStudentAchievements,
  StudentActivityMetrics,
  EvaluatedBadge,
} from '@/lib/skillBarterAchievementEngine';

interface StudentProfileViewProps {
  user: any;
  onRefresh?: () => void;
}

export default function StudentProfileView({ user }: StudentProfileViewProps) {
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<EvaluatedBadge | null>(null);

  const metrics: StudentActivityMetrics = {
    totalSessionsCompleted: 8,
    studentsHelped: 6,
    teachingSessionsCompleted: 6,
    distinctSkillsTaught: 4,
    currentRating: 4.9,
    consecutiveTeachingWeeks: 4,
  };

  const evaluation = evaluateStudentAchievements(metrics, {
    'sb-badge-1': 'Earned 12 Aug 2026',
    'sb-badge-2': 'Earned 15 Aug 2026',
    'sb-badge-3': 'Earned 18 Aug 2026',
    'sb-badge-4': 'Earned 20 Aug 2026',
    'sb-badge-5': 'Earned 22 Aug 2026',
    'sb-badge-6': 'Earned 24 Aug 2026',
    'sb-badge-8': 'Earned 24 Aug 2026',
    'sb-badge-9': 'Earned 25 Aug 2026',
  });

  const evaluatedBadges = evaluation.badges;
  const unlockedBadges = evaluatedBadges.filter((b) => b.isUnlocked);
  const unlockedCount = evaluation.unlockedCount;
  const totalBadgesCount = evaluation.totalCount;
  const highestBadge = evaluation.highestBadge;
  const earnedReputationMark = highestBadge ? highestBadge.icon : '🧑‍🏫';

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Profile Header Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0d0e1a] overflow-hidden shadow-2xl">
        <div className="h-28 bg-gradient-to-r from-violet-900/60 via-indigo-900/50 to-slate-900" />
        <div className="px-6 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-6 gap-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-pink-500 flex items-center justify-center text-5xl shadow-2xl ring-4 ring-[#080910]">
              👩‍💻
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
                <span>{earnedReputationMark}</span>
                <span>{highestBadge ? `${highestBadge.name} · Verified Builder` : 'Verified Participant'}</span>
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{user?.name || 'Anusha A'}</h2>
            <p className="text-xs text-slate-400 font-mono mt-1">3rd Year · Computer Science & Engineering (CSE)</p>
            <p className="text-xs text-slate-500 mt-2 font-light max-w-xl leading-relaxed">
              Active student developer contributing to peer learning circles, AI algorithm challenges, and full-stack web applications.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: 'Credits Earned', value: '85 Pts', color: 'text-violet-400' },
              { label: 'Peers Helped', value: '6 Students', color: 'text-emerald-400' },
              { label: 'Sessions Done', value: '8 Sessions', color: 'text-cyan-400' },
              { label: 'Average Rating', value: '4.9 ★', color: 'text-amber-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className={`text-base font-bold font-mono ${color}`}>{value}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0e1a] p-6 space-y-4">
          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Can Teach (Expertise)</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {['Python', 'React.js', 'PostgreSQL', 'Figma', 'Next.js', 'Tailwind CSS'].map((s) => (
              <span key={s} className="px-3 py-1 rounded-lg border text-xs font-mono bg-emerald-500/10 border-emerald-500/20 text-emerald-300">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0e1a] p-6 space-y-4">
          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Wants to Learn (Goals)</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {['Docker', 'Machine Learning', 'Kubernetes', 'System Design', 'Rust'].map((s) => (
              <span key={s} className="px-3 py-1 rounded-lg border text-xs font-mono bg-cyan-500/10 border-cyan-500/20 text-cyan-300">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0e1a] p-6 space-y-3">
          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Special Skills & Projects</span>
          </h4>
          <div className="space-y-2.5">
            <p className="text-xs text-slate-400 leading-relaxed">• <strong className="text-slate-200">SkillVerse Platform</strong> — Gamified student club ecosystem</p>
            <p className="text-xs text-slate-400 leading-relaxed">• <strong className="text-slate-200">Neural Query Engine</strong> — Fast vector search in Python & PostgreSQL</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0e1a] p-6 space-y-3">
          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Earned Reputation Badges</span>
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {unlockedBadges.map((b) => (
              <div key={b.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs shadow-sm hover:border-violet-500/30 transition-all">
                <span className="text-base">{b.icon}</span>
                <span className="text-slate-200 font-medium">{b.name}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">✓ {b.reputationMark}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 20-SLOT SKILLBARTER ACHIEVEMENTS SHOWCASE                           */}
      {/* =================================================================== */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0d0e1a] p-6 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] font-mono text-violet-400 uppercase tracking-widest">SkillBarter Achievement Journey</p>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>All 20 SkillBarter Achievements</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300">
                20 Slots
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Complete SkillBarter activities to automatically unlock badges and elevate your campus reputation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-white/[0.03] border border-white/[0.06] p-3 rounded-2xl">
            <div className="text-center px-2">
              <p className="text-xl font-bold text-emerald-400 font-mono">{unlockedCount}</p>
              <p className="text-[10px] text-slate-400 font-mono uppercase">Earned</p>
            </div>
            <div className="w-px h-6 bg-white/[0.08]" />
            <div className="text-center px-2">
              <p className="text-xl font-bold text-slate-500 font-mono">{totalBadgesCount - unlockedCount}</p>
              <p className="text-[10px] text-slate-500 font-mono uppercase">Locked</p>
            </div>
            <div className="w-px h-6 bg-white/[0.08]" />
            <div className="text-center px-2">
              <p className="text-xl font-bold text-amber-400 font-mono">
                {Math.round((unlockedCount / totalBadgesCount) * 100)}%
              </p>
              <p className="text-[10px] text-slate-400 font-mono uppercase">Unlocked</p>
            </div>
          </div>
        </div>

        {/* 20-Badge Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {evaluatedBadges.map((badge) => {
            const pct = Math.min(100, Math.round((badge.currentProgress / badge.requirementValue) * 100));

            return (
              <button
                key={badge.id}
                onClick={() => setSelectedBadgeDetail(badge)}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                  badge.isUnlocked
                    ? 'border-white/[0.09] bg-white/[0.03] hover:border-violet-500/40 hover:bg-white/[0.05] shadow-lg'
                    : badge.isNextAchievable
                    ? 'border-amber-400/40 bg-amber-500/[0.03] ring-1 ring-amber-400/20 shadow-lg shadow-amber-500/5'
                    : 'border-white/[0.04] bg-white/[0.01] opacity-65 hover:opacity-85'
                }`}
                style={badge.isUnlocked ? { boxShadow: `0 0 30px -10px ${badge.glowColor}` } : undefined}
              >
                {badge.isUnlocked && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-[0.05] pointer-events-none`} />
                )}

                {/* Card Header */}
                <div className="flex items-start justify-between gap-1 relative">
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    #{badge.badgeNumber}
                  </span>

                  {badge.isUnlocked ? (
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" />
                      <span>EARNED</span>
                    </span>
                  ) : badge.isNextAchievable ? (
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1 animate-pulse">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>NEXT UP</span>
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.07] text-slate-500 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>

                {/* Badge Artwork */}
                <div className="flex flex-col items-center justify-center text-center py-2 relative">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-105 ${
                      badge.isUnlocked
                        ? `bg-gradient-to-br ${badge.color} shadow-lg ring-2 ring-white/[0.1]`
                        : badge.isNextAchievable
                        ? 'bg-white/[0.06] border border-amber-400/30 text-slate-300'
                        : 'bg-white/[0.04] border border-white/[0.06] text-slate-600'
                    }`}
                  >
                    {badge.isUnlocked ? (
                      badge.icon
                    ) : (
                      <div className="relative">
                        <span className="opacity-30 grayscale">{badge.icon}</span>
                        <Lock className="w-4 h-4 text-slate-400 absolute inset-0 m-auto" />
                      </div>
                    )}
                  </div>

                  <div className="mt-2.5 space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-violet-300 transition-colors leading-snug">
                      {badge.name}
                    </h4>
                    <span className="text-[9px] text-slate-500 font-mono block">
                      {badge.category}
                    </span>
                  </div>
                </div>

                {/* Requirement & Progress */}
                <div className="space-y-2 pt-2 border-t border-white/[0.05] relative">
                  <p className="text-[10px] text-slate-400 leading-tight line-clamp-2 min-h-[24px]">
                    &ldquo;{badge.requirement}&rdquo;
                  </p>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      <span className="text-slate-500">Progress</span>
                      <span className={badge.isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                        {badge.currentProgress}/{badge.requirementValue} {badge.unit}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          badge.isUnlocked
                            ? `bg-gradient-to-r ${badge.color}`
                            : badge.isNextAchievable
                            ? 'bg-amber-400'
                            : 'bg-white/[0.2]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {badge.isUnlocked && badge.unlockedAt && (
                    <span className="text-[9px] font-mono text-emerald-400/80 block text-right">
                      {badge.unlockedAt}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BADGE DETAIL MODAL ───────────────────────────────────────────── */}
      {selectedBadgeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl border border-white/[0.08] bg-[#0d0e1c] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Badge #{selectedBadgeDetail.badgeNumber} · {selectedBadgeDetail.category}
              </span>
              <button onClick={() => setSelectedBadgeDetail(null)} className="text-slate-500 hover:text-white cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center gap-3 py-2">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl ${
                  selectedBadgeDetail.isUnlocked
                    ? `bg-gradient-to-br ${selectedBadgeDetail.color} ring-4 ring-white/[0.1]`
                    : 'bg-white/[0.05] border border-white/[0.08]'
                }`}
                style={selectedBadgeDetail.isUnlocked ? { boxShadow: `0 0 45px -8px ${selectedBadgeDetail.glowColor}` } : undefined}
              >
                {selectedBadgeDetail.isUnlocked ? (
                  selectedBadgeDetail.icon
                ) : (
                  <div className="relative">
                    <span className="opacity-30 grayscale">{selectedBadgeDetail.icon}</span>
                    <Lock className="w-6 h-6 text-slate-400 absolute inset-0 m-auto" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="text-base font-bold text-white">{selectedBadgeDetail.name}</h3>
                  {selectedBadgeDetail.isUnlocked && <span>{selectedBadgeDetail.reputationMark}</span>}
                </div>
                <p className="text-xs text-amber-300 font-mono mt-1">&ldquo;{selectedBadgeDetail.requirement}&rdquo;</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Activity Progress</span>
                <span className={selectedBadgeDetail.isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                  {selectedBadgeDetail.currentProgress} / {selectedBadgeDetail.requirementValue} {selectedBadgeDetail.unit}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    selectedBadgeDetail.isUnlocked
                      ? `bg-gradient-to-r ${selectedBadgeDetail.color}`
                      : 'bg-white/[0.25]'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.round((selectedBadgeDetail.currentProgress / selectedBadgeDetail.requirementValue) * 100))}%`,
                  }}
                />
              </div>
              {selectedBadgeDetail.isUnlocked && selectedBadgeDetail.unlockedAt && (
                <p className="text-[10px] text-emerald-400 font-mono text-center pt-1">
                  ✓ {selectedBadgeDetail.unlockedAt}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedBadgeDetail(null)}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

