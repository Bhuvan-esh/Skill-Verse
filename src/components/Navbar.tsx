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
  History
} from 'lucide-react';

interface NavbarProps {
  user: any;
  activeRole: string;
  activeTab: string;
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
  setActiveTab,
  onLogout,
  unreadNotifications,
  onOpenNotifications,
  codingSubTab = 'events',
  setCodingSubTab,
}: NavbarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Brand Logo & Title with Back to Horizon Button */}
        <div className="flex items-center space-x-4">
          {user && (
            <button
              onClick={() => router.push('/horizon')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold font-mono transition-all cursor-pointer shadow-sm group"
              title="Return to 3D Horizon view"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Horizon</span>
            </button>
          )}

          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent font-heading">
                {activeTab === 'competitions' ? 'Coding Arena' : 'Home Page'}
              </h1>
              <p className="text-xs text-slate-400 font-medium">Student Innovation & Credit Engine</p>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs based on Active Context */}
        {user && (
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-xl border border-white/5">
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
                  <span>My Team (1)</span>
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
                  <History className="w-4 h-4 text-emerald-400" />
                  <span>My History</span>
                </button>
              </>
            ) : (
              /* Standard Platform Sub-Tabs for Student */
              activeRole === 'STUDENT' && (
                <>
                  <button
                    onClick={() => setActiveTab('ideas')}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === 'ideas'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Profile</span>
                  </button>

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
                  onClick={() => setActiveTab('ideas')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'ideas'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Profile</span>
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
        <div className="flex items-center space-x-3">

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
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-white">{user.name}</span>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${user.role === 'FOUNDER'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : user.role === 'MENTOR'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : user.role === 'VOLUNTEER'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                >
                  {user.role} ACCESS {user.usn ? `(${user.usn})` : ''}
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
