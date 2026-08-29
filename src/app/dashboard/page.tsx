'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import IdeaHubSection from '@/components/IdeaHubSection';
import CompetitionsSection from '@/components/CompetitionsSection';
import SkillBarterSection from '@/components/SkillBarterSection';
import PrivateFounderChannel from '@/components/PrivateFounderChannel';
import LeaderboardSection from '@/components/LeaderboardSection';
import FounderControlPanel from '@/components/FounderControlPanel';
import VolunteerTaskBoard from '@/components/VolunteerTaskBoard';
import BizLinkMentorshipTracker from '@/components/BizLinkMentorshipTracker';
import StudentProfileView from '@/components/StudentProfileView';
import { Award, Bell, X, ShieldAlert } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const router = useRouter();

  const [credits, setCredits] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('ideas');
  const [codingSubTab, setCodingSubTab] = useState<string>('events');

  // Notifications state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifCategoryFilter, setNotifCategoryFilter] = useState<'all' | 'coding' | 'skillbarter' | 'softskills'>('all');

  // Guarded Route Redirect: if unauthenticated, redirect to /join
  useEffect(() => {
    if (!loading && !user) {
      router.push('/join');
    }
  }, [user, loading, router]);

  // Set initial default tab depending on user role or URL query parameter
  useEffect(() => {
    if (user) {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam) {
          setActiveTab(tabParam);
          if (tabParam === 'competitions') {
            setNotifCategoryFilter('coding');
          }
          fetchNotifications();
          if (user.role === 'STUDENT') fetchStudentCredits(user.id);
          return;
        }
      }

      if (user.role === 'FOUNDER') {
        setActiveTab('founder_panel');
      } else if (user.role === 'VOLUNTEER') {
        setActiveTab('volunteer_tasks');
      } else {
        setActiveTab('ideas');
        fetchStudentCredits(user.id);
      }
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'competitions') {
      setNotifCategoryFilter('coding');
    }
  }, [activeTab]);

  const fetchStudentCredits = async (studentId: string) => {
    try {
      const res = await fetch(`/api/founder/students/${studentId}/credits`);
      const data = await res.json();
      if (res.ok) {
        setCredits(data.credits);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCredits = async () => {
    try {
      const res = await fetch('/api/user/credits');
      const data = await res.json();
      if (res.ok && data.credits) {
        setCredits(data.credits);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      const defaultNotifs = [
        // Coding Challenge Environment Notifications
        {
          id: 'notif-coding-team-roster',
          title: '🏛️ Visual Architects Team Roster Released',
          message: "Visual Architects have officially validated your AI Multi-Year Balanced team roster for 'Team #1 — Algorithmic Titans'. Verified participant USNs and contact slots are now released!",
          created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          read: false,
          category: 'CODING_CHALLENGE',
          actionTab: 'competitions',
          actionSubTab: 'team',
        },
        {
          id: 'notif-coding-sprint-live',
          title: '⚡ Algorithmic Sprint 2026 is Live!',
          message: 'Visual Architects have started the competition timer for Algorithmic Sprint 2026. Option 1: Problem Research & Architecture track is currently active.',
          created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          read: false,
          category: 'CODING_CHALLENGE',
          actionTab: 'competitions',
          actionSubTab: 'workspace',
        },
        {
          id: 'notif-coding-submission-locked',
          title: '🔒 Solution Submitted to Visual Architects',
          message: 'Your challenge solution has been locked and transferred to the Visual Architects Board for official test case assertions and scoring.',
          created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
          read: false,
          category: 'CODING_CHALLENGE',
          actionTab: 'competitions',
          actionSubTab: 'workspace',
        },
        {
          id: 'notif-coding-deadline-warning',
          title: '⚠️ Sprint Deadline Warning (10 Mins Remaining)',
          message: '10 minutes remaining on the Visual Architects countdown clock! Prepare to finalize your code patch to avoid timeout rejection.',
          created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
          read: false,
          category: 'CODING_CHALLENGE',
          actionTab: 'competitions',
          actionSubTab: 'workspace',
        },
        {
          id: 'notif-coding-rank-1',
          title: '🏆 Rank #1 Achieved on Algorithmic Leaderboard',
          message: 'Congratulations! You climbed to Rank #1 on the Algorithmic Standings with 193 Total Credits (+150 Pts reward).',
          created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          read: true,
          category: 'CODING_CHALLENGE',
          actionTab: 'competitions',
          actionSubTab: 'leaderboard',
        },
        {
          id: 'notif-coding-bug-hunt-feed',
          title: '🐛 Visual Architects Bug Hunt Feed Synchronized',
          message: 'Visual Architects have published the defect notice and test assertions for the Binary Search Subarray logic fault.',
          created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          read: true,
          category: 'CODING_CHALLENGE',
          actionTab: 'competitions',
          actionSubTab: 'workspace',
        },
        {
          id: 'notif-coding-badge-unlocked',
          title: '🎖️ Achievement Badge Unlocked: Code Starter (#1)',
          message: "You completed your first challenge and earned the 'Code Starter' Novice Bronze badge. Check your badge ladder in Profile!",
          created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          read: true,
          category: 'CODING_CHALLENGE',
          actionTab: 'competitions',
          actionSubTab: 'history',
        },
        // SkillBarter Notifications
        {
          id: 'notif-sb-accepted',
          title: '🤝 SkillBarter Request Accepted',
          message: "Rahul Sharma accepted your barter request for 'PostgreSQL Query Optimization & Indexing'. The session is now active in My Sessions!",
          created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          read: false,
          category: 'SKILL_BARTER',
          actionTab: 'skill-barter',
        },
        {
          id: 'notif-sb-msg',
          title: '💬 New Message in Barter Session',
          message: "Meera K sent a message in UI Design exchange: 'I reviewed the Figma design tokens you shared! Looks great.'",
          created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
          read: false,
          category: 'SKILL_BARTER',
          actionTab: 'skill-barter',
        },
        {
          id: 'notif-sb-badge',
          title: '🏆 SkillBarter Badge Unlocked',
          message: "✨ Achievement Unlocked: 'Trusted Guide' (Maintain 4.5+ rating). Your profile reputation badge has been updated automatically!",
          created_at: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
          read: true,
          category: 'SKILL_BARTER',
          actionTab: 'skill-barter',
        },
      ];

      if (res.ok && data.notifications && data.notifications.length > 0) {
        const combined = [...data.notifications, ...defaultNotifs.filter(d => !data.notifications.some((n: any) => n.id === d.id))];
        setNotifications(combined);
        setUnreadCount(combined.filter((n) => !n.read).length);
      } else {
        setNotifications(defaultNotifs);
        setUnreadCount(defaultNotifs.filter((n) => !n.read).length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkNotificationRead = async (notifId: string) => {
    try {
      await fetch(`/api/notifications/${notifId}/read`, { method: 'PATCH' });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || (!user && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying session & loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) return null; // Router redirect handles this

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">

      {/* Top Navbar with Context-Aware Notifications */}
      <Navbar
        user={user}
        activeRole={user.role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
        onOpenLoginModal={() => { }} // No inline modal login in dashboard
        unreadNotifications={(() => {
          if (activeTab === 'competitions') {
            return notifications.filter(n => n.category === 'CODING_CHALLENGE' && !n.read).length;
          }
          if (activeTab === 'skillbarter') {
            return notifications.filter(n => n.category === 'SKILL_BARTER' && !n.read).length;
          }
          if (activeTab === 'soft-skills' || activeTab === 'mentorship' || activeTab === 'ideas') {
            return notifications.filter(n => n.category === 'SOFT_SKILLS' && !n.read).length;
          }
          return unreadCount;
        })()}
        onOpenNotifications={() => {
          if (activeTab === 'competitions') {
            setNotifCategoryFilter('coding');
          } else if (activeTab === 'skillbarter') {
            setNotifCategoryFilter('skillbarter');
          } else if (activeTab === 'soft-skills' || activeTab === 'mentorship' || activeTab === 'ideas') {
            setNotifCategoryFilter('softskills');
          } else {
            setNotifCategoryFilter('all');
          }
          setIsNotificationsOpen(true);
        }}
        codingSubTab={codingSubTab}
        setCodingSubTab={setCodingSubTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Student Credit Summary Banner (Hidden in Coding Challenge section) */}
        {user.role === 'STUDENT' && credits && activeTab !== 'competitions' && (
          <div className="glass-panel p-4 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/30 via-slate-900 to-slate-900 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Domain Credits Scorecard</span>
                <h4 className="text-sm font-bold text-white">{user.name} ({user.usn})</h4>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-blue-500/30 text-blue-300">
                Domain 1: <span className="text-white">{credits.domain_1}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-purple-500/30 text-purple-300">
                Domain 2: <span className="text-white">{credits.domain_2}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300">
                Domain 3: <span className="text-white">{credits.domain_3}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-rose-500/30 text-rose-300">
                Domain 4: <span className="text-white">{credits.domain_4}</span>
              </div>
              <div className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold shadow-md">
                Total: {credits.total} Pts
              </div>
            </div>
          </div>
        )}

        {/* Tab Views strictly scoped to user role */}
        {activeTab === 'ideas' && (user.role === 'STUDENT' || user.role === 'FOUNDER') && (
          <BizLinkMentorshipTracker user={user} />
        )}

        {activeTab === 'competitions' && (user.role === 'STUDENT' || user.role === 'FOUNDER') && (
          <CompetitionsSection user={user} onRefresh={refreshUser} subTab={codingSubTab} setSubTab={setCodingSubTab} />
        )}

        {activeTab === 'skillbarter' && (
          <SkillBarterSection user={user} onRefresh={refreshUser} />
        )}

        {activeTab === 'profile' && (
          <StudentProfileView user={user} onRefresh={refreshUser} />
        )}

        {activeTab === 'privatechat' && (user.role === 'STUDENT' || user.role === 'FOUNDER') && (
          <PrivateFounderChannel user={user} />
        )}

        {(activeTab === 'mentorship' || activeTab === 'soft-skills' || activeTab === 'leaderboard') && (user.role === 'STUDENT' || user.role === 'FOUNDER') && (
          <IdeaHubSection user={user} onRefresh={refreshUser} />
        )}

        {activeTab === 'founder_panel' && user.role === 'FOUNDER' && (
          <FounderControlPanel user={user} onRefresh={refreshUser} />
        )}

        {activeTab === 'volunteer_tasks' && (user.role === 'VOLUNTEER' || user.role === 'FOUNDER') && (
          <VolunteerTaskBoard user={user} />
        )}

      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-white/10 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Club Idea Hub — Active {user.role} Session</p>
          <div className="flex space-x-4">
            <span className="text-slate-400">Skill League</span>
            <span className="text-slate-400">Skill-Barter</span>
            <span className="text-slate-400">Coding Challenge</span>
          </div>
        </div>
      </footer>

      {/* Notifications Drawer — Context-Scoped per Active Section */}
      {isNotificationsOpen && (() => {
        const isCodingContext = activeTab === 'competitions';
        const isSkillBarterContext = activeTab === 'skillbarter';
        const isSoftSkillsContext = activeTab === 'soft-skills' || activeTab === 'mentorship' || activeTab === 'ideas';

        const filteredNotifications = notifications.filter((n) => {
          if (notifCategoryFilter === 'coding' || (isCodingContext && notifCategoryFilter !== 'all')) {
            return n.category === 'CODING_CHALLENGE';
          }
          if (notifCategoryFilter === 'skillbarter' || (isSkillBarterContext && notifCategoryFilter !== 'all')) {
            return n.category === 'SKILL_BARTER';
          }
          if (notifCategoryFilter === 'softskills' || (isSoftSkillsContext && notifCategoryFilter !== 'all')) {
            return n.category === 'SOFT_SKILLS';
          }
          return true;
        });

        const activeUnreadCount = filteredNotifications.filter((n) => !n.read).length;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl bg-gradient-to-b from-slate-900 to-black font-sans">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                    isCodingContext
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : isSkillBarterContext
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : isSoftSkillsContext
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">
                      {isCodingContext
                        ? '💻 Coding Arena Notifications'
                        : isSkillBarterContext
                        ? '🤝 Skill Barter Notifications'
                        : isSoftSkillsContext
                        ? '🎭 Soft Skills Notifications'
                        : 'In-App Notifications'}
                    </h3>
                    <span className="text-[10px] font-mono text-purple-300">
                      {isCodingContext
                        ? 'Visual Architects & Algorithmic Sprint Feed'
                        : isSkillBarterContext
                        ? 'Peer Exchanges, Credits & Barter Chats'
                        : isSoftSkillsContext
                        ? 'Skill League Sprints, Pitches & Evaluations'
                        : 'Live Campus & Innovation Hub Feed'}
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scoped Context Info Strip */}
              <div className="flex items-center justify-between gap-2">
                {isCodingContext ? (
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
                      💻 Coding Challenge Feed ({filteredNotifications.length})
                    </span>
                  </div>
                ) : isSkillBarterContext ? (
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                      🤝 Skill Barter Feed ({filteredNotifications.length})
                    </span>
                  </div>
                ) : isSoftSkillsContext ? (
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                      🎭 Soft Skills Feed ({filteredNotifications.length})
                    </span>
                  </div>
                ) : (
                  /* Global Switcher for Generic Tabs */
                  <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs font-mono">
                    <button
                      onClick={() => setNotifCategoryFilter('all')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        notifCategoryFilter === 'all' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      onClick={() => setNotifCategoryFilter('coding')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        notifCategoryFilter === 'coding' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>💻 Coding</span>
                    </button>
                    <button
                      onClick={() => setNotifCategoryFilter('skillbarter')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        notifCategoryFilter === 'skillbarter' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>🤝 Barter</span>
                    </button>
                    <button
                      onClick={() => setNotifCategoryFilter('softskills')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        notifCategoryFilter === 'softskills' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>🎭 Soft Skills</span>
                    </button>
                  </div>
                )}

                {activeUnreadCount > 0 && (
                  <button
                    onClick={() => {
                      const activeIds = new Set(filteredNotifications.map(n => n.id));
                      setNotifications(prev => prev.map(n => activeIds.has(n.id) ? { ...n, read: true } : n));
                    }}
                    className="text-[11px] font-mono text-purple-400 hover:text-purple-300 underline cursor-pointer"
                  >
                    Mark section read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 font-mono text-xs space-y-2">
                    <p>No new notifications in this category.</p>
                  </div>
                ) : (
                  filteredNotifications.map((n) => {
                    const isCoding = n.category === 'CODING_CHALLENGE';
                    const isSkillBarter = n.category === 'SKILL_BARTER';
                    const isSoftSkills = n.category === 'SOFT_SKILLS';

                    return (
                      <div
                        key={n.id}
                        onClick={() => {
                          handleMarkNotificationRead(n.id);
                          if (n.actionTab) {
                            setActiveTab(n.actionTab);
                            if (n.actionSubTab && setCodingSubTab) {
                              setCodingSubTab(n.actionSubTab);
                            }
                            setIsNotificationsOpen(false);
                          }
                        }}
                        className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all relative overflow-hidden ${
                          n.read
                            ? 'bg-slate-950/40 border-white/5 opacity-75'
                            : isCoding
                            ? 'bg-gradient-to-r from-purple-950/40 to-slate-900 border-purple-500/30 ring-1 ring-purple-500/20'
                            : isSkillBarter
                            ? 'bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500/30 ring-1 ring-emerald-500/20'
                            : isSoftSkills
                            ? 'bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-500/30 ring-1 ring-amber-500/20'
                            : 'bg-gradient-to-r from-blue-950/40 to-slate-900 border-blue-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            isCoding
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : isSkillBarter
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isSoftSkills
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {isCoding
                              ? '💻 CODING ARENA'
                              : isSkillBarter
                              ? '🤝 SKILL BARTER'
                              : isSoftSkills
                              ? '🎭 SOFT SKILLS'
                              : 'CAMPUS FEED'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <span className="font-bold text-white block text-xs mt-0.5">{n.title}</span>
                        <p className="text-slate-300 leading-relaxed mt-1 text-[11px] font-sans">{n.message}</p>

                        {n.actionTab && (
                          <div className={`mt-2 pt-1.5 border-t border-white/5 flex items-center justify-end text-[10px] font-mono ${
                            isCoding ? 'text-cyan-300 hover:text-cyan-200' : isSkillBarter ? 'text-emerald-300 hover:text-emerald-200' : isSoftSkills ? 'text-amber-300 hover:text-amber-200' : 'text-blue-300 hover:text-blue-200'
                          }`}>
                            <span>
                              Open in {isCoding && n.actionSubTab ? `Coding Arena (${n.actionSubTab})` : isSkillBarter ? 'SkillBarter Hub' : isSoftSkills ? 'Soft Skills Arena' : n.actionTab} →
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
