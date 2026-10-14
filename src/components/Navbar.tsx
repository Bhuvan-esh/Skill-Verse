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
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-3 sm:px-5 lg:px-7 py-2.5">
      <div className="w-full grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 lg:gap-4">

        {/* Brand Logo & Title with Back to Horizon Button */}
        <div className="flex min-w-0 items-center gap-2.5 lg:gap-3.5">
          {user && (
            <button
              onClick={() => router.push('/horizon')}
              aria-label="Return to Horizon"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-white border border-purple-500/30 transition-all cursor-pointer shadow-sm group"
              title="Return to 3D Horizon view"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent font-heading">
                {pageTitle || (activeTab === 'competitions' ? 'Coding Arena' : activeTab === 'skillbarter' ? 'Skillora' : 'Home Page')}
              </h1>
              <p className="text-[10px] lg:text-xs text-slate-400 font-medium truncate">{pageSubtitle || (activeTab === 'skillbarter' ? 'Peer Skill Exchange & Video Hub' : 'Student Innovation & Credit Engine')}</p>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs based on Active Context */}
        {user && (
          <nav className="hidden md:flex min-w-0 max-w-[min(58vw,760px)] items-center gap-0.5 bg-slate-900/80 p-1 rounded-xl border border-white/5 overflow-x-auto justify-self-center scrollbar-thin">
            {activeTab === 'competitions' ? (
              /* Coding Challenge Arena Sub-Tabs */
              <>
                <button
                  onClick={() => setCodingSubTab && setCodingSubTab('events')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    codingSubTab === 'events'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 border border-purple-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Competitions</span>
                </button>

                <button
                  onClick={() => setCodingSubTab && setCodingSubTab('workspace')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    codingSubTab === 'workspace'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 border border-purple-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Code className="w-4 h-4 text-blue-400" />
                  <span>Code Workspace</span>
                </button>

                <button
                  onClick={() => setCodingSubTab && setCodingSubTab('team')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    codingSubTab === 'team'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 border border-purple-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>My Peers</span>
                </button>

                <button
                  onClick={() => setCodingSubTab && setCodingSubTab('leaderboard')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    codingSubTab === 'leaderboard'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 border border-purple-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Leaderboard</span>
                </button>

                <button
                  onClick={() => setCodingSubTab && setCodingSubTab('history')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    codingSubTab === 'history'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 border border-purple-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Profile</span>
                </button>
              </>
            ) : (
              /* Standard Platform Sub-Tabs for Student */
              activeRole === 'STUDENT' && (
                <>
                  <button
                    onClick={() => setActiveTab('skillbarter')}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === 'skillbarter'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Skillora</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ideas')}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === 'ideas'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Progress</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === 'leaderboard'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Leaderboard</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('privatechat')}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === 'privatechat'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open Desk</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === 'profile'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                </>
              )
            )}

            {activeRole === 'FOUNDER' && (
              <>
                <button
                  onClick={() => setActiveTab('founder_panel')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'founder_panel'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Control Panel</span>
                </button>

                <button
                  onClick={() => setActiveTab('skillbarter')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'skillbarter'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Skillora</span>
                </button>

                <button
                  onClick={() => setActiveTab('ideas')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'ideas'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Progress</span>
                </button>

                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'leaderboard'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Leaderboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'profile'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab('volunteer_tasks')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'volunteer_tasks'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Volunteer Tasks</span>
                </button>
              </>
            )}

            {activeRole === 'MENTOR' && (
              <>
                <button
                  onClick={() => setActiveTab('skillbarter')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'skillbarter'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Skillora</span>
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'leaderboard'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Leaderboard</span>
                </button>
              </>
            )}

            {activeRole === 'VOLUNTEER' && (
              <>
                <button
                  onClick={() => setActiveTab('volunteer_tasks')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'volunteer_tasks'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Gated Task Board</span>
                </button>

                <button
                  onClick={() => setActiveTab('skillbarter')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'skillbarter'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Skillora</span>
                </button>
              </>
            )}
          </nav>
        )}

        {/* User Session & Role Badge & Logout */}
        <div className="flex items-center justify-end gap-2 lg:gap-2.5 min-w-0">

          {/* Notifications Button */}
          {user && (
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-blue-500/50 text-slate-300 hover:text-white transition-all"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotifications}
                </span>
              )}
            </button>
          )}

          {/* User Role Badge & Logout */}
          {user ? (
            <div className="flex items-center gap-2.5">
              <div
                className="flex min-w-0 items-center gap-2.5 rounded-full border border-white/10 bg-slate-900/80 py-1.5 pl-1.5 pr-3.5"
                title={`${user.name} · ${profileRoleLabel}${user.usn ? ` · ${user.usn}` : ''}`}
                aria-label={`${user.name}, ${profileRoleLabel}${user.usn ? `, ${user.usn}` : ''}`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${profileAccent}`}>
                  {profileInitials}
                </span>
                <span className="flex min-w-0 flex-col items-start gap-1">
                  <span className="max-w-[100px] truncate text-sm font-semibold leading-tight text-white sm:max-w-[140px]">
                    {user.name}
                  </span>
                  <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase leading-none tracking-wide sm:px-2 sm:text-[9px] ${profileRoleBadge}`}>
                    {user.role || 'STUDENT'}
                  </span>
                </span>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 font-bold text-xs transition-all"
                title="Log Out Session"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/join"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Enter / Select Role</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
