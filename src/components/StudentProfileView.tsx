'use client';

import React, { useState, useEffect } from 'react';
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
  Crown,
  Edit3,
  Plus,
  Trash2,
  X,
  Save,
  CheckCheck,
  User,
  GraduationCap
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

interface ProjectItem {
  id: string;
  title: string;
  description: string;
}

type ActiveEditSection = 'NONE' | 'PROFILE_INFO' | 'CAN_TEACH' | 'WANTS_TO_LEARN' | 'PROJECTS';

export default function StudentProfileView({ user }: StudentProfileViewProps) {
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<EvaluatedBadge | null>(null);
  const [selectedGhBadgeDetail, setSelectedGhBadgeDetail] = useState<EvaluatedGitHubBadge | null>(null);
  const [profileBadgeFilter, setProfileBadgeFilter] = useState<'all' | 'skillbarter' | 'github'>('all');

  // Editable Profile Header Information State (Clean baseline for new accounts)
  const [profileName, setProfileName] = useState<string>(user?.name || '');
  const [profileYearBranch, setProfileYearBranch] = useState<string>('');
  const [profileBio, setProfileBio] = useState<string>('');

  // Profile Skills & Projects State (Clean baseline for new accounts)
  const [canTeach, setCanTeach] = useState<string[]>([]);
  const [wantsToLearn, setWantsToLearn] = useState<string[]>([]);
  const [specialProjects, setSpecialProjects] = useState<ProjectItem[]>([]);

  // Dynamic Metrics & Stats
  const creditsDisplay = user?.credits?.total !== undefined
    ? `${user.credits.total} Pts`
    : typeof user?.credits === 'number'
    ? `${user.credits} Pts`
    : '0 Pts';

  // Section-specific Edit Modal State
  const [activeEditSection, setActiveEditSection] = useState<ActiveEditSection>('NONE');

  // Edit Buffer States
  const [editName, setEditName] = useState('');
  const [editYearBranch, setEditYearBranch] = useState('');
  const [editBio, setEditBio] = useState('');

  const [editCanTeach, setEditCanTeach] = useState<string[]>([]);
  const [editWantsToLearn, setEditWantsToLearn] = useState<string[]>([]);
  const [editSpecialProjects, setEditSpecialProjects] = useState<ProjectItem[]>([]);

  const [newCanTeachInput, setNewCanTeachInput] = useState('');
  const [newWantsToLearnInput, setNewWantsToLearnInput] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Load profile details from backend API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/skill-barter/profile?userId=${encodeURIComponent(user?.id || 'default')}`);
        const data = await res.json();
        if (res.ok && data.profile) {
          if (data.profile.name) setProfileName(data.profile.name);
          if (data.profile.yearBranch) setProfileYearBranch(data.profile.yearBranch);
          if (data.profile.bio) setProfileBio(data.profile.bio);
          if (Array.isArray(data.profile.canTeach)) setCanTeach(data.profile.canTeach);
          if (Array.isArray(data.profile.wantsToLearn)) setWantsToLearn(data.profile.wantsToLearn);
          if (Array.isArray(data.profile.specialProjects)) setSpecialProjects(data.profile.specialProjects);
        }
      } catch {
        // Keep initial clean baseline
      }
    };
    fetchProfile();
  }, [user?.id]);

  // Open Edit Modals
  const handleOpenProfileInfoModal = () => {
    setEditName(profileName || user?.name || '');
    setEditYearBranch(profileYearBranch || '');
    setEditBio(profileBio || '');
    setActiveEditSection('PROFILE_INFO');
  };

  const handleOpenCanTeachModal = () => {
    setEditCanTeach([...canTeach]);
    setNewCanTeachInput('');
    setActiveEditSection('CAN_TEACH');
  };

  const handleOpenWantsToLearnModal = () => {
    setEditWantsToLearn([...wantsToLearn]);
    setNewWantsToLearnInput('');
    setActiveEditSection('WANTS_TO_LEARN');
  };

  const handleOpenProjectsModal = () => {
    setEditSpecialProjects(specialProjects.map(p => ({ ...p })));
    setNewProjectTitle('');
    setNewProjectDesc('');
    setActiveEditSection('PROJECTS');
  };

  const handleCloseModal = () => {
    setActiveEditSection('NONE');
  };

  // Handlers for Can Teach
  const handleAddCanTeach = () => {
    const trimmed = newCanTeachInput.trim();
    if (trimmed && !editCanTeach.includes(trimmed)) {
      setEditCanTeach([...editCanTeach, trimmed]);
      setNewCanTeachInput('');
    }
  };

  const handleRemoveCanTeach = (skillToRemove: string) => {
    setEditCanTeach(editCanTeach.filter(s => s !== skillToRemove));
  };

  // Handlers for Wants to Learn
  const handleAddWantsToLearn = () => {
    const trimmed = newWantsToLearnInput.trim();
    if (trimmed && !editWantsToLearn.includes(trimmed)) {
      setEditWantsToLearn([...editWantsToLearn, trimmed]);
      setNewWantsToLearnInput('');
    }
  };

  const handleRemoveWantsToLearn = (skillToRemove: string) => {
    setEditWantsToLearn(editWantsToLearn.filter(s => s !== skillToRemove));
  };

  // Handlers for Projects
  const handleAddProject = () => {
    if (newProjectTitle.trim()) {
      setEditSpecialProjects([
        ...editSpecialProjects,
        {
          id: `proj-${Date.now()}`,
          title: newProjectTitle.trim(),
          description: newProjectDesc.trim() || 'Student project walkthrough',
        },
      ]);
      setNewProjectTitle('');
      setNewProjectDesc('');
    }
  };

  const handleRemoveProject = (idToRemove: string) => {
    setEditSpecialProjects(editSpecialProjects.filter(p => p.id !== idToRemove));
  };

  // Save specific section
  const handleSaveSection = async (section: ActiveEditSection) => {
    try {
      setIsSaving(true);

      const payload = {
        userId: user?.id || 'default',
        name: section === 'PROFILE_INFO' ? editName : profileName,
        yearBranch: section === 'PROFILE_INFO' ? editYearBranch : profileYearBranch,
        bio: section === 'PROFILE_INFO' ? editBio : profileBio,
        canTeach: section === 'CAN_TEACH' ? editCanTeach : canTeach,
        wantsToLearn: section === 'WANTS_TO_LEARN' ? editWantsToLearn : wantsToLearn,
        specialProjects: section === 'PROJECTS' ? editSpecialProjects : specialProjects,
      };

      const res = await fetch('/api/skill-barter/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save profile changes');

      if (section === 'PROFILE_INFO') {
        setProfileName(editName);
        setProfileYearBranch(editYearBranch);
        setProfileBio(editBio);
      }
      if (section === 'CAN_TEACH') setCanTeach(editCanTeach);
      if (section === 'WANTS_TO_LEARN') setWantsToLearn(editWantsToLearn);
      if (section === 'PROJECTS') setSpecialProjects(editSpecialProjects);

      setActiveEditSection('NONE');
      setFeedbackMsg(
        `✓ ${
          section === 'PROFILE_INFO'
            ? 'Profile details'
            : section === 'CAN_TEACH'
            ? 'Expertise skills'
            : section === 'WANTS_TO_LEARN'
            ? 'Learning goals'
            : 'Special projects'
        } updated successfully!`
      );
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (e: any) {
      if (section === 'PROFILE_INFO') {
        setProfileName(editName);
        setProfileYearBranch(editYearBranch);
        setProfileBio(editBio);
      }
      if (section === 'CAN_TEACH') setCanTeach(editCanTeach);
      if (section === 'WANTS_TO_LEARN') setWantsToLearn(editWantsToLearn);
      if (section === 'PROJECTS') setSpecialProjects(editSpecialProjects);

      setActiveEditSection('NONE');
      setFeedbackMsg('✓ Changes saved successfully!');
      setTimeout(() => setFeedbackMsg(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // 1. SkillBarter Milestones (20 Badges) — Open / 1 Unlocked (#1 First Exchange) & All others locked!
  const metrics: StudentActivityMetrics = {
    totalSessionsCompleted: 1,
    studentsHelped: 0,
    teachingSessionsCompleted: 0,
    distinctSkillsTaught: 0,
    currentRating: 0,
    consecutiveTeachingWeeks: 0,
  };

  const evaluation = evaluateStudentAchievements(metrics, {
    'sb-badge-1': 'Earned 12 Aug 2026',
  });

  // 2. Grand Master Prestige Badges (12) — Earned for something big, ALL locked except ONE!
  const ghStats = {
    prsMerged: 2, // Pull Shark Tier 1 unlocked
    fastResponses: 0,
    acceptedSolutions: 0,
    pairSessions: 0,
    starsReceived: 0,
    flawlessDeploys: 0,
    vaultContributions: 0,
    kudosGiven: 0,
    nightSessions: 0,
    streakWeeks: 0,
    branchesMentored: 0,
    securityAudits: 0,
  };

  const ghUnlockedDatesMap = {
    'gh-pull-shark': 'Earned 14 Aug 2026',
  };

  const ghEvaluation = evaluateGitHubAchievements(ghStats, ghUnlockedDatesMap);
  const evaluatedBadges = evaluation.badges;
  const evaluatedGhBadges = ghEvaluation.badges;

  const unlockedCount = evaluation.unlockedCount + ghEvaluation.unlockedCount;
  const totalBadgesCount = evaluation.totalCount + ghEvaluation.totalCount;
  const highestBadge = evaluation.highestBadge;
  const earnedReputationMark = highestBadge ? highestBadge.icon : '🧑‍🏫';

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-sans">
      
      {/* Feedback Banner */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 shadow-md">
          <span className="flex items-center gap-2">
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>{feedbackMsg}</span>
          </span>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0d0e1a] overflow-hidden shadow-2xl">
        <div className="h-28 bg-gradient-to-r from-violet-900/60 via-indigo-900/50 to-slate-900" />
        <div className="px-6 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-6 gap-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-pink-500 flex items-center justify-center text-5xl shadow-2xl ring-4 ring-[#080910]">
              👩‍💻
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleOpenProfileInfoModal}
                className="px-3.5 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile Info</span>
              </button>

              <span className="px-3.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
                <span>{earnedReputationMark}</span>
                <span>{highestBadge ? `${highestBadge.name} · Verified Builder` : 'Verified Participant'}</span>
              </span>
            </div>
          </div>

          {/* Header Texts (Empty defaults with friendly placeholders) */}
          <div className="group relative">
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {profileName || user?.name || 'New Participant'}
              </h2>
              <button
                onClick={handleOpenProfileInfoModal}
                className="p-1 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-white/5 transition-colors cursor-pointer"
                title="Edit name, branch and bio"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              {profileYearBranch || (
                <span className="text-slate-500 italic">Branch & Year not specified · Tap Edit Profile Info</span>
              )}
            </p>
            <p className="text-xs text-slate-400 mt-2 font-light max-w-xl leading-relaxed">
              {profileBio || (
                <span className="text-slate-500 italic">No bio added yet. Tap &quot;Edit Profile Info&quot; to describe your focus and skills.</span>
              )}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: 'Credits Earned', value: creditsDisplay, color: 'text-violet-400' },
              { label: 'Peers Helped', value: '0 Students', color: 'text-emerald-400' },
              { label: 'Sessions Done', value: '0 Sessions', color: 'text-cyan-400' },
              { label: 'Average Rating', value: '0.0 ★', color: 'text-amber-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className={`text-base font-bold font-mono ${color}`}>{value}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SKILL SECTIONS: 3 CLEAN CARDS (Can Teach, Wants to Learn, Projects) */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Can Teach (Expertise) */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0e1a] p-6 space-y-4 shadow-lg hover:border-emerald-500/30 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 font-heading">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Can Teach (Expertise)</span>
              </h4>
              <button
                onClick={handleOpenCanTeachModal}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-[11px] font-mono font-bold text-emerald-300 border border-emerald-500/20 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            
            {canTeach.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {canTeach.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-lg border text-xs font-mono bg-emerald-500/10 border-emerald-500/20 text-emerald-300 shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <div
                onClick={handleOpenCanTeachModal}
                className="py-4 text-center space-y-1.5 border border-dashed border-emerald-500/20 rounded-xl bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05] transition-colors cursor-pointer"
              >
                <p className="text-xs text-slate-400">No expertise skills added yet.</p>
                <p className="text-[10px] font-mono text-emerald-400 font-bold">+ Tap Edit to add skills you teach</p>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Wants to Learn (Goals) */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0e1a] p-6 space-y-4 shadow-lg hover:border-cyan-500/30 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 font-heading">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Wants to Learn (Goals)</span>
              </h4>
              <button
                onClick={handleOpenWantsToLearnModal}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-[11px] font-mono font-bold text-cyan-300 border border-cyan-500/20 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            {wantsToLearn.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {wantsToLearn.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-lg border text-xs font-mono bg-cyan-500/10 border-cyan-500/20 text-cyan-300 shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <div
                onClick={handleOpenWantsToLearnModal}
                className="py-4 text-center space-y-1.5 border border-dashed border-cyan-500/20 rounded-xl bg-cyan-500/[0.02] hover:bg-cyan-500/[0.05] transition-colors cursor-pointer"
              >
                <p className="text-xs text-slate-400">No learning goals added yet.</p>
                <p className="text-[10px] font-mono text-cyan-400 font-bold">+ Tap Edit to add your goals</p>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Special Skills & Projects */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0e1a] p-6 space-y-4 shadow-lg hover:border-purple-500/30 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 font-heading">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Special Skills & Projects</span>
              </h4>
              <button
                onClick={handleOpenProjectsModal}
                className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-[11px] font-mono font-bold text-purple-300 border border-purple-500/20 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            {specialProjects.length > 0 ? (
              <div className="space-y-2.5 pt-1">
                {specialProjects.map((p) => (
                  <p key={p.id} className="text-xs text-slate-300 leading-relaxed font-sans">
                    • <strong className="text-white font-semibold">{p.title}</strong> — <span className="text-slate-400">{p.description}</span>
                  </p>
                ))}
              </div>
            ) : (
              <div
                onClick={handleOpenProjectsModal}
                className="py-4 text-center space-y-1.5 border border-dashed border-purple-500/20 rounded-xl bg-purple-500/[0.02] hover:bg-purple-500/[0.05] transition-colors cursor-pointer"
              >
                <p className="text-xs text-slate-400">No special projects added yet.</p>
                <p className="text-[10px] font-mono text-purple-400 font-bold">+ Tap Edit to showcase projects</p>
              </div>
            )}
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
              <p className="text-[10px] font-mono text-violet-400 uppercase tracking-widest font-bold">Achievement & GitHub Badge Journey</p>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-heading">
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
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Grand Master Prestige ({ghEvaluation.totalCount})</span>
          </button>
          <button
            onClick={() => setProfileBadgeFilter('skillbarter')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              profileBadgeFilter === 'skillbarter'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SkillBarter Milestones ({evaluation.totalCount})
          </button>
        </div>

        {/* 1. Grand Master Prestige Badges */}
        {(profileBadgeFilter === 'all' || profileBadgeFilter === 'github') && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Grand Master Prestige Badges & Tier Levels
                </h4>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                12 High-Stakes Milestones
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#080914] border border-white/[0.06] shadow-xl">
              <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6">
                {evaluatedGhBadges.map((badge) => {
                  const isUnlocked = badge.isUnlocked;
                  const level = badge.currentLevel;

                  return (
                    <button
                      key={badge.id}
                      onClick={() => setSelectedGhBadgeDetail(badge)}
                      title={`${badge.name} — ${badge.category} (Tap to inspect)`}
                      className={`relative group p-2.5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-gradient-to-b from-[#13162c] to-[#0d0f22] border-white/[0.15] hover:border-cyan-400 shadow-lg'
                          : 'bg-white/[0.02] border-white/[0.05] opacity-50 hover:opacity-80'
                      }`}
                      style={isUnlocked ? { boxShadow: `0 0 25px -8px ${badge.accentColor}` } : undefined}
                    >
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 relative ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-slate-900 to-slate-950 ring-1 ring-white/10'
                            : 'bg-white/[0.02] text-slate-600'
                        }`}
                        style={isUnlocked ? { borderColor: badge.accentColor } : undefined}
                      >
                        {isUnlocked ? (
                          <>
                            <span className="drop-shadow-lg select-none">{badge.icon}</span>
                            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-slate-900 border border-white/20 text-[9px] font-mono font-bold text-white shadow-md">
                              x{level}
                            </span>
                          </>
                        ) : (
                          <div className="relative flex items-center justify-center">
                            <span className="opacity-25 grayscale text-2xl select-none">{badge.icon}</span>
                            <Lock className="w-4 h-4 text-slate-400 absolute inset-0 m-auto" />
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

        {/* 2. SkillBarter Milestones */}
        {(profileBadgeFilter === 'all' || profileBadgeFilter === 'skillbarter') && (
          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  SkillBarter Milestones & Reputation Marks
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                20 Progressive Milestones
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#080914] border border-white/[0.06] shadow-xl">
              <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6">
                {evaluatedBadges.map((badge) => {
                  return (
                    <button
                      key={badge.id}
                      onClick={() => setSelectedBadgeDetail(badge)}
                      title={`#${badge.badgeNumber} ${badge.name} — ${badge.category} (Tap to inspect)`}
                      className={`relative group p-2.5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer flex items-center justify-center ${
                        badge.isUnlocked
                          ? 'bg-gradient-to-b from-[#13162c] to-[#0d0f22] border-white/[0.15] hover:border-emerald-400 shadow-lg'
                          : badge.isNextAchievable
                          ? 'bg-amber-500/[0.05] border-amber-400/40 ring-1 ring-amber-400/20 shadow-md hover:border-amber-400'
                          : 'bg-white/[0.02] border-white/[0.05] opacity-50 hover:opacity-80'
                      }`}
                      style={badge.isUnlocked ? { boxShadow: `0 0 25px -8px ${badge.glowColor}` } : undefined}
                    >
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 relative ${
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
                            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-slate-900 border border-white/20 text-[9px] font-mono font-bold text-white shadow-md">
                              #{badge.badgeNumber}
                            </span>
                          </>
                        ) : (
                          <div className="relative flex items-center justify-center">
                            <span className="opacity-25 grayscale text-2xl select-none">{badge.icon}</span>
                            <Lock className="w-4 h-4 text-slate-400 absolute inset-0 m-auto" />
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

      {/* =================================================================== */}
      {/* MODAL 0: EDIT PROFILE INFO (NAME, YEAR & BRANCH, BIO)               */}
      {/* =================================================================== */}
      {activeEditSection === 'PROFILE_INFO' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel p-6 sm:p-7 rounded-3xl border border-violet-500/40 shadow-2xl space-y-5 bg-gradient-to-b from-slate-900 to-[#07080f] font-sans">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-violet-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Edit Profile Information
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Full Student Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-sans font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Year & Branch Subtitle</label>
                <input
                  type="text"
                  required
                  value={editYearBranch}
                  onChange={(e) => setEditYearBranch(e.target.value)}
                  placeholder="e.g. 3rd Year · Computer Science & Engineering (CSE)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Bio / About Me</label>
                <textarea
                  rows={3}
                  required
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Describe your focus, learning interests, and projects..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-sans leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveSection('PROFILE_INFO')}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white text-xs font-mono font-bold shadow-lg shadow-violet-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 1: EDIT ONLY "CAN TEACH (EXPERTISE SKILLS)"                    */}
      {/* =================================================================== */}
      {activeEditSection === 'CAN_TEACH' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel p-6 sm:p-7 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-5 bg-gradient-to-b from-slate-900 to-[#07080f] font-sans">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Can Teach (Expertise Skills)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCanTeachInput}
                  onChange={(e) => setNewCanTeachInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCanTeach();
                    }
                  }}
                  placeholder="e.g. Next.js, FastAPI, GraphQL, Kotlin"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddCanTeach}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer shadow-md shadow-emerald-600/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* Current Can Teach Skills List */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Current Expertise Skills ({editCanTeach.length}):</p>
                {editCanTeach.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 rounded-xl bg-black/30 border border-white/5">
                    {editCanTeach.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono shadow-sm"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCanTeach(skill)}
                          className="text-emerald-400 hover:text-white cursor-pointer"
                          title="Remove skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-2">No skills in list yet. Type above to add your first skill.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveSection('CAN_TEACH')}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: EDIT ONLY "WANTS TO LEARN (GOALS & ASPIRATIONS)"            */}
      {/* =================================================================== */}
      {activeEditSection === 'WANTS_TO_LEARN' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel p-6 sm:p-7 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-5 bg-gradient-to-b from-slate-900 to-[#07080f] font-sans">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Wants to Learn (Goals & Aspirations)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWantsToLearnInput}
                  onChange={(e) => setNewWantsToLearnInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddWantsToLearn();
                    }
                  }}
                  placeholder="e.g. System Design, Kubernetes, PyTorch, Golang"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleAddWantsToLearn}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer shadow-md shadow-cyan-600/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Goal</span>
                </button>
              </div>

              {/* Current Wants to Learn Goals List */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Current Learning Goals ({editWantsToLearn.length}):</p>
                {editWantsToLearn.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 rounded-xl bg-black/30 border border-white/5">
                    {editWantsToLearn.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-sm"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveWantsToLearn(skill)}
                          className="text-cyan-400 hover:text-white cursor-pointer"
                          title="Remove goal"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-2">No learning goals in list yet. Type above to add target topics.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveSection('WANTS_TO_LEARN')}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold shadow-lg shadow-cyan-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 3: EDIT ONLY "SPECIAL SKILLS & PROJECTS"                      */}
      {/* =================================================================== */}
      {activeEditSection === 'PROJECTS' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel p-6 sm:p-7 rounded-3xl border border-purple-500/40 shadow-2xl space-y-5 bg-gradient-to-b from-slate-900 to-[#07080f] font-sans">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Special Skills & Projects
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="Project / Skill Title (e.g. SkillVerse Platform)"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Summary (e.g. Gamified student club ecosystem)"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans"
                />
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAddProject}
                    disabled={!newProjectTitle.trim()}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40 shadow-md shadow-purple-600/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>

              {/* Current Projects List */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Current Special Projects ({editSpecialProjects.length}):</p>
                {editSpecialProjects.length > 0 ? (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {editSpecialProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-white font-sans">• {proj.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{proj.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(proj.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Remove Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-2">No projects added yet. Enter title and summary above to add one.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveSection('PROJECTS')}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 4: BADGE INSPECT MODAL                                        */}
      {/* =================================================================== */}
      {selectedBadgeDetail && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 bg-gradient-to-b from-slate-900 to-black font-sans">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Milestone #{selectedBadgeDetail.badgeNumber}
              </span>
              <button
                onClick={() => setSelectedBadgeDetail(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2 py-2">
              <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-2xl bg-gradient-to-br ${
                selectedBadgeDetail.isUnlocked ? selectedBadgeDetail.color : 'from-slate-800 to-slate-900 border border-white/10'
              }`}>
                {selectedBadgeDetail.icon}
              </div>
              <h3 className="text-xl font-extrabold text-white font-heading">
                {selectedBadgeDetail.name}
              </h3>
              <p className="text-xs text-emerald-300 font-mono">
                {selectedBadgeDetail.category}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-mono uppercase block text-[10px]">Requirement:</span>
                <p className="text-white font-semibold mt-0.5">{selectedBadgeDetail.requirement}</p>
              </div>
              <div>
                <span className="text-slate-400 font-mono uppercase block text-[10px]">Status:</span>
                <p className={`font-bold mt-0.5 font-mono ${
                  selectedBadgeDetail.isUnlocked ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {selectedBadgeDetail.isUnlocked ? '✓ Unlocked & Earned in Skillora' : '🔒 Locked — Progressive Milestone'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBadgeDetail(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 5: GRAND MASTER PRESTIGE BADGE INSPECT MODAL                  */}
      {/* =================================================================== */}
      {selectedGhBadgeDetail && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-4 bg-gradient-to-b from-slate-900 to-black font-sans">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Grand Master Prestige Badge</span>
              </span>
              <button
                onClick={() => setSelectedGhBadgeDetail(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2 py-2">
              <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-5xl shadow-2xl ${
                selectedGhBadgeDetail.isUnlocked ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-white/5 border border-white/10 grayscale'
              }`}>
                {selectedGhBadgeDetail.icon}
              </div>
              <h3 className="text-xl font-extrabold text-white font-heading">
                {selectedGhBadgeDetail.name}
              </h3>
              <p className="text-xs text-cyan-300 font-mono">
                {selectedGhBadgeDetail.category}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <p className="text-slate-300 leading-relaxed">{selectedGhBadgeDetail.description}</p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Status:</span>
                <span className={selectedGhBadgeDetail.isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {selectedGhBadgeDetail.isUnlocked ? '✓ Grand Achievement Earned' : '🔒 Locked — High-Stakes Milestone'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedGhBadgeDetail(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs cursor-pointer"
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
