'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lightbulb,
  Trophy,
  Users,
  Award,
  Bell,
  LogOut,
  UserCheck,
  MessageSquare,
  Zap,
  ArrowLeft,
  Code,
  History,
  TrendingUp,
  User,
} from 'lucide-react';

interface NavbarProps {
  user: any;
  activeRole: string;
  activeTab: string;
  pageTitle?: string;
  pageSubtitle?: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onOpenLoginModal?: () => void;
  unreadNotifications: number;
  onOpenNotifications: () => void;
  codingSubTab?: string;
  setCodingSubTab?: (subTab: string) => void;
}

export default function Navbar({
  user,
  activeRole,
  activeTab,
  pageTitle,
  pageSubtitle,
  setActiveTab,
  onLogout,
  unreadNotifications,
  onOpenNotifications,
  codingSubTab = 'events',
  setCodingSubTab,
}: NavbarProps) {
  const router = useRouter();
  const profileInitials = user?.name
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0])
    .join('')
    .toUpperCase() || 'U';
  const profileRoleLabel = user?.role === 'FOUNDER'
    ? 'Visual Architect'
    : user?.role === 'MENTOR'
      ? 'Mentor'
      : user?.role === 'VOLUNTEER'
        ? 'Community Ambassador'
        : 'Participant';
  const profileAccent = user?.role === 'FOUNDER'
    ? 'bg-purple-400 text-purple-950'
    : user?.role === 'MENTOR'
      ? 'bg-blue-400 text-blue-950'
      : user?.role === 'VOLUNTEER'
        ? 'bg-emerald-400 text-emerald-950'
        : 'bg-indigo-400 text-indigo-950';
  const profileRoleBadge = user?.role === 'FOUNDER'
    ? 'border-purple-400/25 bg-purple-400/10 text-purple-200'
    : user?.role === 'MENTOR'
      ? 'border-blue-400/25 bg-blue-400/10 text-blue-200'
      : user?.role === 'VOLUNTEER'
        ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
        : 'border-indigo-400/25 bg-indigo-400/10 text-indigo-200';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080A12]/90 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Brand: Skillora Peer Network ── */}
          <div className="flex items-center gap-3 shrink-0">
            {user && (
              <button
                onClick={() => router.push('/horizon')}
                aria-label="Return to Horizon"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white border border-white/[0.08] transition-all cursor-pointer group"
                title="Return to 3D Horizon view"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}

            <button
              onClick={() => setActiveTab('skillbarter')}
              className="flex items-center gap-2.5 text-left group transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-[#6D3DF5] flex items-center justify-center shadow-sm shadow-[#6D3DF5]/30">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-white tracking-tight flex items-center gap-1.5">
                  Skillora <span className="text-white/40 font-normal text-xs">Peer Network</span>
                </span>
                <span className="text-[10px] text-white/40 font-medium tracking-wide">
                  {pageTitle || (activeTab === 'skillbarter' ? 'Participant Portal' : activeTab === 'competitions' ? 'Coding Arena' : 'Innovation Hub')}
                </span>
              </div>
            </button>
          </div>

          {/* ── Center Navigation: Progress, Leaderboard, Open Desk, Profile ── */}
          {user && (
            <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]" aria-label="Participant Navigation">
              {activeTab === 'competitions' ? (
                /* Coding Challenge Context */
                <>
                  <button
                    onClick={() => setCodingSubTab && setCodingSubTab('events')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      codingSubTab === 'events'
                        ? 'bg-white/[0.1] text-white shadow-sm'
                        : 'text-white/45 hover:text-white/80'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Competitions</span>
                  </button>

                  <button
                    onClick={() => setCodingSubTab && setCodingSubTab('workspace')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      codingSubTab === 'workspace'
                        ? 'bg-white/[0.1] text-white shadow-sm'
                        : 'text-white/45 hover:text-white/80'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5 text-blue-400" />
                    <span>Workspace</span>
                  </button>

                  <button
                    onClick={() => setCodingSubTab && setCodingSubTab('team')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      codingSubTab === 'team'
                        ? 'bg-white/[0.1] text-white shadow-sm'
                        : 'text-white/45 hover:text-white/80'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>My Peers</span>
                  </button>

                  <button
                    onClick={() => setCodingSubTab && setCodingSubTab('leaderboard')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      codingSubTab === 'leaderboard'
                        ? 'bg-white/[0.1] text-white shadow-sm'
                        : 'text-white/45 hover:text-white/80'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Leaderboard</span>
                  </button>

                  <button
                    onClick={() => setCodingSubTab && setCodingSubTab('history')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      codingSubTab === 'history'
                        ? 'bg-white/[0.1] text-white shadow-sm'
                        : 'text-white/45 hover:text-white/80'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Profile</span>
                  </button>
                </>
              ) : (
                /* Skillora Peer Network Primary Navigation */
                <>
                  <button
                    onClick={() => setActiveTab('ideas')}
                    className={`relative px-4 py-1.5 text-xs font-medium tracking-tight rounded-lg transition-all duration-150 cursor-pointer ${
                      activeTab === 'ideas'
                        ? 'bg-white/[0.08] text-white shadow-sm'
                        : 'text-white/45 hover:text-white/80 hover:bg-white/[0.02]'
                    }`}
                  >
                    Progress
                    {activeTab === 'ideas' && (
                      <span className="absolute inset-x-2 bottom-0 h-[1.5px] rounded-full bg-[#6D3DF5]" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`relative px-4 py-1.5 text-xs font-medium tracking-tight rounded-lg transition-all duration-150 cursor-pointer ${
                      activeTab === 'leaderboard'
                        ? 'bg-white/[0.08] text-white shadow-sm'
                        : 'text-white/45 hover:text-white/80 hover:bg-white/[0.02]'
                    }`}
                  >
                    Leaderboard
                    {activeTab === 'leaderboard' && (
                      <span className="absolute inset-x-2 bottom-0 h-[1.5px] rounded-full bg-[#6D3DF5]" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('privatechat')}
                    className={`relative px-4 py-1.5 text-xs font-medium tracking-tight rounded-lg transition-all duration-150 cursor-pointer ${
                      activeTab === 'privatechat'
                        ? 'bg-white/[0.08] text-white shadow-sm'
                        : 'text-white/45 hover:text-white/80 hover:bg-white/[0.02]'
                    }`}
                  >
                    Open Desk
                    {activeTab === 'privatechat' && (
                      <span className="absolute inset-x-2 bottom-0 h-[1.5px] rounded-full bg-[#6D3DF5]" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`relative px-4 py-1.5 text-xs font-medium tracking-tight rounded-lg transition-all duration-150 cursor-pointer ${
                      activeTab === 'profile'
                        ? 'bg-white/[0.08] text-white shadow-sm'
                        : 'text-white/45 hover:text-white/80 hover:bg-white/[0.02]'
                    }`}
                  >
                    Profile
                    {activeTab === 'profile' && (
                      <span className="absolute inset-x-2 bottom-0 h-[1.5px] rounded-full bg-[#6D3DF5]" />
                    )}
                  </button>
                </>
              )}
            </nav>
          )}

          {/* ── User Information + Log Out Action ── */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Notification Bell */}
            {user && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-white/50 hover:text-white transition-all cursor-pointer"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 bg-[#6D3DF5] rounded-full" />
                )}
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* User Info Capsule: Avatar Initials + Name + Role */}
                <div
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2 py-1 pl-1 pr-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer"
                  title={`${user.name || 'Preetam Rathod'} · ${user.role || 'STUDENT'}`}
                >
                  <div className="w-7 h-7 rounded-md bg-[#6D3DF5] flex items-center justify-center text-[11px] font-bold text-white tracking-wide shrink-0">
                    {profileInitials || 'PR'}
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-[12px] font-medium text-white/90 truncate max-w-[120px]">
                      {user.name || 'Preetam Rathod'}
                    </span>
                    <span className="text-[9px] font-medium text-white/40 uppercase tracking-wider">
                      {user.role || 'STUDENT'}
                    </span>
                  </div>
                </div>

                {/* Log Out Action */}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-rose-500/30 bg-white/[0.02] hover:bg-rose-500/10 text-white/50 hover:text-rose-300 text-xs font-medium transition-all cursor-pointer"
                  title="Log Out action"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#6D3DF5] hover:bg-[#5B30E0] text-white font-medium text-xs shadow-sm transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Sign In / Join</span>
              </Link>
            )}
          </div>

        </div>

        {/* ── Mobile Nav Row ── */}
        {user && activeTab !== 'competitions' && (
          <div className="md:hidden flex items-center gap-1 py-2 border-t border-white/[0.04] overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('ideas')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                activeTab === 'ideas' ? 'bg-white/[0.1] text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              Progress
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                activeTab === 'leaderboard' ? 'bg-white/[0.1] text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('privatechat')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                activeTab === 'privatechat' ? 'bg-white/[0.1] text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              Open Desk
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                activeTab === 'profile' ? 'bg-white/[0.1] text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              Profile
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
