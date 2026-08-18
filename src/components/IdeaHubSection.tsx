'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Award, Plus, CheckCircle2, UserCheck, Calendar, BookOpen, Check, XCircle, Trophy } from 'lucide-react';

interface ProfileSectionProps {
  user: any;
  onRefresh: () => void;
}

export default function ProfileSection({ user, onRefresh }: ProfileSectionProps) {
  const [credits, setCredits] = useState<any>(null);

  // Embedded Active Leaderboard Standings Table inside Profile
  const [leaderboardData] = useState([
    { rank: 1, name: 'Alex Johnson', usn: '1RV23CS001', d1: 45, d2: 38, d3: 50, d4: 60, score: 193 },
    { rank: 2, name: 'Rahul Sharma', usn: '1RV23CS042', d1: 40, d2: 35, d3: 45, d4: 55, score: 175 },
    { rank: 3, name: 'Meera K', usn: '1RV23AI018', d1: 38, d2: 42, d3: 40, d4: 50, score: 170 },
    { rank: 4, name: 'Sanjay V', usn: '1RV23IS089', d1: 30, d2: 30, d3: 35, d4: 45, score: 140 },
    { rank: 5, name: 'Priya S', usn: '1RV23AI055', d1: 25, d2: 32, d3: 38, d4: 40, score: 135 },
  ]);

  // Upcoming Sessions State
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      title: 'AI Code Review & Automated Agent Hackathon',
      speaker: 'Alex Johnson',
      domain: 'Skill League · CS-Lec-4',
      date: '📅 Tomorrow, 4:00 PM',
      description: 'A contest where students build dynamic prompts and agents to perform automated security audits.',
      accepted: false,
    },
    {
      id: 'sess-2',
      title: 'Full-Stack Next.js 14 & Prisma Bootcamp',
      speaker: 'Priya Sharma',
      domain: 'Web Architecture · CS-Lec-2',
      date: '📅 20 Apr, 2:30 PM',
      description: 'Hands-on session building server actions, database schemas, and authenticated REST endpoints.',
      accepted: false,
    },
    {
      id: 'sess-3',
      title: 'Docker Containerization & Kubernetes Workflow',
      speaker: 'Sanjay V',
      domain: 'Cloud DevOps · CS-Lec-3',
      date: '📅 22 Apr, 5:00 PM',
      description: 'Walkthrough covering Dockerfiles, multi-stage builds, container networking, and cluster orchestration.',
      accepted: false,
    },
  ]);

  // Submit New Idea Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Skill League');
  const [lectureId, setLectureId] = useState('CS-Lec-1');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Tallies state
  const [tallies, setTallies] = useState({
    submissions: 5,
    sessionAttended: 12,
    sessionConducted: 3,
  });

  const fetchProfileData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.user) {
        const creditRes = await fetch(`/api/founder/students/${data.user.id}/credits`);
        if (creditRes.ok) {
          const cData = await creditRes.json();
          setCredits(cData.credit);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleAcceptSession = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, accepted: true } : s))
    );
    setTallies((prev) => ({
      ...prev,
      sessionAttended: prev.sessionAttended + 1,
    }));
  };

  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, lecture_id: lectureId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSubmitSuccess('Submission created successfully!');
      setTitle('');
      setDescription('');
      setTallies((prev) => ({ ...prev, submissions: prev.submissions + 1 }));
      onRefresh();
      setTimeout(() => setShowSubmitModal(false), 1500);
    } catch (err: any) {
      setSubmitError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Profile & Innovation Hub</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Profile — {user?.name || 'Student Participant'}
          </h2>
          <p className="text-sm text-slate-400">
            {user?.usn ? `USN: ${user.usn} | ` : ''} View earned credits, attendance metrics, and upcoming club sessions.
          </p>
        </div>

        {user && user.role === 'STUDENT' && (
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Concept</span>
          </button>
        )}
      </div>

      {/* Leaderboard Credit Scorecards */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4.5 h-4.5" />
            <span>Your Leaderboard Credit Scorecard</span>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Rank #1 Active Standings
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="glass-card p-3.5 rounded-xl border border-blue-500/20 text-center">
            <span className="text-xs text-blue-400 font-semibold block mb-1">Session 1</span>
            <span className="text-2xl font-extrabold text-white">{credits?.domain_1 || 45}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">pts</span>
          </div>

          <div className="glass-card p-3.5 rounded-xl border border-purple-500/20 text-center">
            <span className="text-xs text-purple-400 font-semibold block mb-1">Session 2</span>
            <span className="text-2xl font-extrabold text-white">{credits?.domain_2 || 38}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">pts</span>
          </div>

          <div className="glass-card p-3.5 rounded-xl border border-emerald-500/20 text-center">
            <span className="text-xs text-emerald-400 font-semibold block mb-1">Session 3</span>
            <span className="text-2xl font-extrabold text-white">{credits?.domain_3 || 50}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">pts</span>
          </div>

          <div className="glass-card p-3.5 rounded-xl border border-rose-500/20 text-center">
            <span className="text-xs text-rose-400 font-semibold block mb-1">Session 4</span>
            <span className="text-2xl font-extrabold text-white">{credits?.domain_4 || 60}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">pts</span>
          </div>

          <div className="col-span-2 sm:col-span-1 glass-card p-3.5 rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500/20 to-amber-600/20 text-center">
            <span className="text-xs text-amber-300 font-bold block mb-1">Total Score</span>
            <span className="text-2xl font-extrabold text-amber-400">
              {(credits?.domain_1 || 45) + (credits?.domain_2 || 38) + (credits?.domain_3 || 50) + (credits?.domain_4 || 60)}
            </span>
            <span className="text-[10px] text-amber-200 block mt-0.5">Overall Credits</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Transferred into Profile */}
      <div className="glass-panel rounded-2xl border border-amber-500/20 overflow-hidden shadow-2xl space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Leaderboard Standings Table</span>
          </h3>
          <span className="text-xs text-amber-300 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Transferred from Leaderboard Section
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">USN</th>
                <th className="py-3 px-4 text-center">Session 1</th>
                <th className="py-3 px-4 text-center">Session 2</th>
                <th className="py-3 px-4 text-center">Session 3</th>
                <th className="py-3 px-4 text-center">Session 4</th>
                <th className="py-3 px-4 text-right">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200 font-medium">
              {leaderboardData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Trophy className="w-8 h-8 text-slate-600 mb-1" />
                      <p className="text-sm font-semibold text-slate-300">No profile leaderboard records available yet.</p>
                      <p className="text-xs text-slate-500">Standings update automatically as credit tasks are verified.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leaderboardData.map((row) => (
                  <tr key={row.rank} className="hover:bg-white/5 transition-all">
                    <td className="py-3 px-4 font-bold">
                      {row.rank === 1 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          🥇 #1
                        </span>
                      ) : row.rank === 2 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/30">
                          🥈 #2
                        </span>
                      ) : row.rank === 3 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/30">
                          🥉 #3
                        </span>
                      ) : (
                        <span className="text-slate-400">#{row.rank}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-white text-xs">{row.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{row.usn}</td>
                    <td className="py-3 px-4 text-center font-semibold text-blue-400">{row.d1}</td>
                    <td className="py-3 px-4 text-center font-semibold text-purple-400">{row.d2}</td>
                    <td className="py-3 px-4 text-center font-semibold text-emerald-400">{row.d3}</td>
                    <td className="py-3 px-4 text-center font-semibold text-rose-400">{row.d4}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-amber-400 text-xs font-heading">
                      {row.score} pts
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Headcount Tallies: Submissions, Session Attended, Session Conducted */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Lecture Headcount Tallies & Activity Metrics
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Submissions */}
          <div className="glass-card p-5 rounded-xl border border-blue-500/30 text-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">Submissions</span>
            <div className="text-3xl font-extrabold text-blue-400 font-heading">
              {tallies.submissions}
            </div>
            <span className="text-[11px] text-slate-400 block">Total ideas & tasks submitted</span>
          </div>

          {/* Session Attended */}
          <div className="glass-card p-5 rounded-xl border border-emerald-500/30 text-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">Session Attended</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-heading">
              {tallies.sessionAttended}
            </div>
            <span className="text-[11px] text-slate-400 block">Live workshops & lectures attended</span>
          </div>

          {/* Session Conducted */}
          <div className="glass-card p-5 rounded-xl border border-purple-500/30 text-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">Session Conducted</span>
            <div className="text-3xl font-extrabold text-purple-400 font-heading">
              {tallies.sessionConducted}
            </div>
            <span className="text-[11px] text-slate-400 block">Mentoring walkthroughs run</span>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions Feed (With Accept Button) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-heading flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span>Upcoming Sessions</span>
          </h3>
          <span className="text-xs text-slate-400">Accept sessions to confirm attendance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className={`glass-card p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                sess.accepted
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-white/10 hover:border-blue-500/40'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-blue-300 border border-blue-500/20">
                    {sess.domain}
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono font-bold">
                    {sess.date}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white leading-tight">{sess.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{sess.description}</p>
                <div className="text-xs text-slate-400 pt-1">
                  Speaker: <strong className="text-slate-200">{sess.speaker}</strong>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-white/10">
                {sess.accepted ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs text-center flex items-center justify-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Session Accepted ✓</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAcceptSession(sess.id)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Session</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Idea Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xl font-bold text-white font-heading">Submit New Concept</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {submitError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">{submitError}</div>}
            {submitSuccess && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">{submitSuccess}</div>}

            <form onSubmit={handleSubmitIdea} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI Code Review Hackathon"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your concept and objectives..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/25"
              >
                Submit Concept
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
