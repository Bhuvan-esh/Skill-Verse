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

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      const defaultNotifs = [
        {
          id: 'notif-sb-accepted',
          title: '🤝 SkillBarter Request Accepted',
          message: "Rahul Sharma accepted your barter request for 'PostgreSQL Query Optimization & Indexing'. The session is now active in My Sessions!",
          created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          read: false,
          category: 'SKILL_BARTER',
        },
        {
          id: 'notif-sb-msg',
          title: '💬 New Message in Barter Session',
          message: "Meera K sent a message in UI Design exchange: 'I reviewed the Figma design tokens you shared! Looks great.'",
          created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          read: false,
          category: 'SKILL_BARTER',
        },
        {
          id: 'notif-sb-badge',
          title: '🏆 SkillBarter Badge Unlocked',
          message: "✨ Achievement Unlocked: 'Trusted Guide' (Maintain 4.5+ rating). Your profile reputation badge has been updated automatically!",
          created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          read: false,
          category: 'ACHIEVEMENT',
        },
        {
          id: 'notif-sb-credit',
          title: '⚡ Session Completed & Credits Awarded',
          message: "Session completed with Sanjay V for Docker Compose. +15 SkillBarter Contribution Credits credited to Domain 4!",
          created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
          read: true,
          category: 'CREDITS',
        },
        {
          id: 'notif-sess-launch',
          title: '🎉 Session Launched',
          message: 'AI Code Review & Automated Agent Hackathon session is now live! Accept your slot under Profile → Upcoming Sessions.',
          created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
          read: true,
          category: 'CAMPUS',
        },
        {
          id: 'notif-open-desk',
          title: '💬 Message from Open Desk',
          message: '"Welcome to the club! Your session request for SQL Queries has been approved by the Open Desk team."',
          created_at: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
          read: true,
          category: 'OPEN_DESK',
        },
      ];

      if (res.ok && data.notifications && data.notifications.length > 0) {
        const combined = [...defaultNotifs, ...data.notifications];
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

      {/* Top Navbar with Role Badge & Logout */}
      <Navbar
        user={user}
        activeRole={user.role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
        onOpenLoginModal={() => { }} // No inline modal login in dashboard
        unreadNotifications={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
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
          <BizLinkMentorshipTracker />
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

      {/* Notifications Drawer */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white font-heading flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-400" />
                <span>In-App Notifications</span>
              </h3>
              <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No notifications.</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleMarkNotificationRead(n.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${n.read ? 'bg-slate-900/50 border-white/5 opacity-75' : 'bg-blue-500/10 border-blue-500/30'
                      }`}
                  >
                    <span className="font-bold text-white block mb-0.5">{n.title}</span>
                    <p className="text-slate-300 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">{new Date(n.created_at).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
