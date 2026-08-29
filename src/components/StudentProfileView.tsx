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
  GitPullRequest,
} from 'lucide-react';

import {
  evaluateStudentAchievements,
  StudentActivityMetrics,
  EvaluatedBadge,
  evaluateGitHubAchievements,
  EvaluatedGitHubBadge,
} from '@/lib/skillBarterAchievementEngine';

interface StudentProfileViewProps {
  user: any;
  onRefresh?: () => void;
}

export default function StudentProfileView({ user }: StudentProfileViewProps) {
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<EvaluatedBadge | null>(null);
  const [selectedGhBadgeDetail, setSelectedGhBadgeDetail] = useState<EvaluatedGitHubBadge | null>(null);
  const [profileBadgeFilter, setProfileBadgeFilter] = useState<'all' | 'skillbarter' | 'github'>('all');

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

  const ghEvaluation = evaluateGitHubAchievements();
  const evaluatedBadges = evaluation.badges;
  const evaluatedGhBadges = ghEvaluation.badges;
  const unlockedBadges = evaluatedBadges.filter((b) => b.isUnlocked);
  const unlockedGhBadges = evaluatedGhBadges.filter((b) => b.isUnlocked);

  const unlockedCount = evaluation.unlockedCount + ghEvaluation.unlockedCount;
  const totalBadgesCount = evaluation.totalCount + ghEvaluation.totalCount;
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
            {unlockedBadges.slice(0, 4).map((b) => (
              <div key={b.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs shadow-sm hover:border-violet-500/30 transition-all">
                <span className="text-base">{b.icon}</span>
                <span className="text-slate-200 font-medium">{b.name}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">✓ {b.reputationMark}</span>
              </div>
            ))}
            {unlockedGhBadges.slice(0, 3).map((gh) => (
              <div key={gh.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs shadow-sm hover:border-cyan-500/40 transition-all">
                <span className="text-base">{gh.icon}</span>
                <span className="text-slate-200 font-medium">{gh.name}</span>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">x{gh.currentLevel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* ALL ACHIEVEMENTS SHOWCASE (SkillBarter + GitHub-Style)             */}
      {/* =================================================================== */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0d0e1a] p-6 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] font-mono text-violet-400 uppercase tracking-widest">Achievement & GitHub Badge Journey</p>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>All Achievement Badges</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300">
                {totalBadgesCount} Badges
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Badges unlock automatically across SkillBarter activities and GitHub-style milestones.
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

        {/* Filter Switcher */}
        <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl">
          <button
            onClick={() => setProfileBadgeFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              profileBadgeFilter === 'all'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Badges ({totalBadgesCount})
          </button>
          <button
            onClick={() => setProfileBadgeFilter('github')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              profileBadgeFilter === 'github'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5 text-cyan-400" />
            <span>GitHub-Style ({ghEvaluation.totalCount})</span>
          </button>
          <button
            onClick={() => setProfileBadgeFilter('skillbarter')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              profileBadgeFilter === 'skillbarter'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SkillBarter (20)
          </button>
        </div>

        {/* 1. GitHub-Style Badges Grid */}
        {(profileBadgeFilter === 'all' || profileBadgeFilter === 'github') && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-cyan-400" />
              <span>GitHub-Style Developer Badges ({ghEvaluation.totalCount})</span>
            </h4>

            <div className="p-5 rounded-3xl bg-[#090b17]/80 border border-white/[0.08] shadow-xl backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-5">
                {evaluatedGhBadges.map((badge) => {
                  const isUnlocked = badge.isUnlocked;
                  const level = badge.currentLevel;

                  return (
                    <button
                      key={badge.id}
                      onClick={() => setSelectedGhBadgeDetail(badge)}
                      title={`${badge.name} — ${badge.category} (Tap to inspect)`}
                      className={`relative group p-2 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-gradient-to-b from-[#13162c] to-[#0d0f22] border-white/[0.15] hover:border-cyan-400 shadow-md'
                          : 'bg-white/[0.02] border-white/[0.05] opacity-50 hover:opacity-80'
                      }`}
                      style={isUnlocked ? { boxShadow: `0 0 20px -8px ${badge.accentColor}` } : undefined}
                    >
                      {/* Badge Icon Emblem Only */}
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-300 relative ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-slate-900 to-slate-950 ring-1 ring-white/10'
                            : 'bg-white/[0.02] text-slate-600'
                        }`}
                        style={isUnlocked ? { borderColor: badge.accentColor } : undefined}
                      >
                        {isUnlocked ? (
                          <>
                            <span className="drop-shadow-lg select-none">{badge.icon}</span>
                            {/* Level multiplication indicator */}
                            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-slate-900 border border-white/20 text-[8px] font-mono font-bold text-white shadow-md">
                              x{level}
                            </span>
                          </>
                        ) : (
                          <div className="relative flex items-center justify-center">
                            <span className="opacity-25 grayscale text-xl select-none">{badge.icon}</span>
                            <Lock className="w-3.5 h-3.5 text-slate-400 absolute inset-0 m-auto" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. SkillBarter Badges Grid */}
        {(profileBadgeFilter === 'all' || profileBadgeFilter === 'skillbarter') && (
          <div className="space-y-3 pt-4 border-t border-white/[0.06]">
            <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-violet-400" />
              <span>SkillBarter Milestones (20 Badges)</span>
            </h4>

            <div className="p-5 rounded-3xl bg-[#090b17]/80 border border-white/[0.08] shadow-xl backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-5">
                {evaluatedBadges.map((badge) => {
                  return (
                    <button
                      key={badge.id}
                      onClick={() => setSelectedBadgeDetail(badge)}
                      title={`#${badge.badgeNumber} ${badge.name} — ${badge.category} (Tap to inspect)`}
                      className={`relative group p-2 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex items-center justify-center ${
                        badge.isUnlocked
                          ? 'bg-gradient-to-b from-[#13162c] to-[#0d0f22] border-white/[0.15] hover:border-violet-400 shadow-md'
                          : badge.isNextAchievable
                          ? 'bg-amber-500/[0.05] border-amber-400/40 ring-1 ring-amber-400/20 shadow-sm hover:border-amber-400'
                          : 'bg-white/[0.02] border-white/[0.05] opacity-50 hover:opacity-80'
                      }`}
                      style={badge.isUnlocked ? { boxShadow: `0 0 20px -8px ${badge.glowColor}` } : undefined}
                    >
                      {/* Badge Icon Emblem Only */}
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-300 relative ${
                          badge.isUnlocked
                            ? `bg-gradient-to-br ${badge.color} ring-1 ring-white/15 shadow-md`
                            : badge.isNextAchievable
                            ? 'bg-white/[0.06] border border-amber-400/30 text-slate-300'
                            : 'bg-white/[0.02] text-slate-600'
                        }`}
                      >
                        {badge.isUnlocked ? (
                          <>
                            <span className="drop-shadow-lg select-none">{badge.icon}</span>
                            {/* Small Slot # pill */}
                            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-slate-900 border border-white/20 text-[8px] font-mono font-bold text-white shadow-md">
                              #{badge.badgeNumber}
                            </span>
                          </>
                        ) : (
                          <div className="relative flex items-center justify-center">
                            <span className="opacity-25 grayscale text-xl select-none">{badge.icon}</span>
                            <Lock className="w-3.5 h-3.5 text-slate-400 absolute inset-0 m-auto" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── GITHUB BADGE INSPECTOR MODAL ──────────────────────────────── */}
      {selectedGhBadgeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-cyan-500/30 bg-[#0d0f22] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>GitHub-Style Achievement · {selectedGhBadgeDetail.category}</span>
              </span>
              <button onClick={() => setSelectedGhBadgeDetail(null)} className="text-slate-500 hover:text-white cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center gap-3 py-2">
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl relative ${
                  selectedGhBadgeDetail.isUnlocked
                    ? 'bg-gradient-to-br from-slate-900 to-slate-950 ring-4 ring-cyan-400/20 border-2'
                    : 'bg-white/[0.05] border border-white/[0.08]'
                }`}
                style={selectedGhBadgeDetail.isUnlocked ? { borderColor: selectedGhBadgeDetail.accentColor } : undefined}
              >
                {selectedGhBadgeDetail.isUnlocked ? (
                  <>
                    <span className="drop-shadow-xl">{selectedGhBadgeDetail.icon}</span>
                    <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-md bg-slate-900 border border-white/20 text-[10px] font-mono font-bold text-white shadow-lg">
                      x{selectedGhBadgeDetail.currentLevel}
                    </span>
                  </>
                ) : (
                  <div className="relative">
                    <span className="opacity-30 grayscale">{selectedGhBadgeDetail.icon}</span>
                    <Lock className="w-6 h-6 text-slate-400 absolute inset-0 m-auto" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                  <span>{selectedGhBadgeDetail.name}</span>
                  {selectedGhBadgeDetail.isUnlocked && selectedGhBadgeDetail.currentTier && (
                    <span className="text-xs px-2 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 font-mono">
                      {selectedGhBadgeDetail.currentTier.tierName}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-cyan-200/90 font-mono mt-1">&ldquo;{selectedGhBadgeDetail.tagline}&rdquo;</p>
                <p className="text-xs text-slate-400 font-light mt-2 max-w-sm mx-auto leading-relaxed">
                  {selectedGhBadgeDetail.description}
                </p>
              </div>
            </div>

            {/* Tier Level Progression Ladder */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3">
              <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                Badge Tier Ladder
              </p>
              <div className="grid grid-cols-4 gap-2">
                {selectedGhBadgeDetail.tiers.map((t) => {
                  const isTierUnlocked = selectedGhBadgeDetail.currentValue >= t.reqValue;
                  return (
                    <div
                      key={t.level}
                      className={`p-2.5 rounded-xl text-center border space-y-1 ${
                        isTierUnlocked
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-white'
                          : 'bg-white/[0.02] border-white/[0.04] text-slate-600 opacity-60'
                      }`}
                    >
                      <span className="text-[10px] font-bold block">{t.tierName}</span>
                      <span className="text-[9px] font-mono block text-slate-400">
                        {t.reqValue} {selectedGhBadgeDetail.unit}
                      </span>
                      <span className="text-[9px] font-mono font-bold block text-cyan-300">
                        {isTierUnlocked ? '✓ x' + t.level : 'LOCKED'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Current Activity Score</span>
                  <span className="text-cyan-300 font-bold">
                    {selectedGhBadgeDetail.currentValue} {selectedGhBadgeDetail.unit}
                  </span>
                </div>
                {selectedGhBadgeDetail.isUnlocked && selectedGhBadgeDetail.unlockedAt && (
                  <p className="text-[10px] text-emerald-400 font-mono text-center pt-1">
                    ✓ {selectedGhBadgeDetail.unlockedAt}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedGhBadgeDetail(null)}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SKILLBARTER BADGE INSPECTOR MODAL ─────────────────────────── */}
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
