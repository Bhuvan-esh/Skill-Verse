'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Award, UserCheck, Trophy } from 'lucide-react';

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
  }, [user?.id]);

  return (
    <div className="space-y-8 font-sans">
      
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
            {user?.usn ? `USN: ${user.usn} | ` : ''} View earned credits, attendance metrics, and leaderboard standing.
          </p>
        </div>
      </div>

      {/* Leaderboard Credit Scorecards */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4.5 h-4.5" />
            <span>Your Leaderboard Credit Scorecard</span>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Domain-Based Evaluation Active
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-white/10 text-center">
            <span className="text-[11px] text-blue-400 uppercase font-semibold block">Domain 1 (Innovation)</span>
            <div className="text-2xl font-extrabold text-white mt-1 font-heading">
              {credits?.domain_1 || 0}
            </div>
            <span className="text-[10px] text-slate-500 block">Pts Earned</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-white/10 text-center">
            <span className="text-[11px] text-purple-400 uppercase font-semibold block">Domain 2 (Leadership)</span>
            <div className="text-2xl font-extrabold text-white mt-1 font-heading">
              {credits?.domain_2 || 0}
            </div>
            <span className="text-[10px] text-slate-500 block">Pts Earned</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-white/10 text-center">
            <span className="text-[11px] text-emerald-400 uppercase font-semibold block">Domain 3 (Tech Skill)</span>
            <div className="text-2xl font-extrabold text-white mt-1 font-heading">
              {credits?.domain_3 || 0}
            </div>
            <span className="text-[10px] text-slate-500 block">Pts Earned</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-white/10 text-center">
            <span className="text-[11px] text-rose-400 uppercase font-semibold block">Domain 4 (Mentorship)</span>
            <div className="text-2xl font-extrabold text-white mt-1 font-heading">
              {credits?.domain_4 || 0}
            </div>
            <span className="text-[10px] text-slate-500 block">Pts Earned</span>
          </div>

          <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-xl shadow-lg text-center flex flex-col justify-center">
            <span className="text-[11px] text-slate-950 uppercase font-extrabold block">Total Aggregate</span>
            <div className="text-3xl font-black text-slate-950 font-heading">
              {credits?.total || 0}
            </div>
            <span className="text-[10px] text-slate-900 font-bold block">Verified Pts</span>
          </div>
        </div>
      </div>

      {/* Embedded Active Leaderboard Standings Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-heading flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Leaderboard Standings</span>
          </h3>
          <span className="text-xs text-slate-400">Top contributors across all technical domains</span>
        </div>

        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Participant</th>
                <th className="px-6 py-4 text-center">USN</th>
                <th className="px-4 py-4 text-center text-blue-400">D1</th>
                <th className="px-4 py-4 text-center text-purple-400">D2</th>
                <th className="px-4 py-4 text-center text-emerald-400">D3</th>
                <th className="px-4 py-4 text-center text-rose-400">D4</th>
                <th className="px-6 py-4 text-right text-amber-400">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboardData.map((row) => (
                <tr key={row.rank} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        row.rank === 1
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                          : row.rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : row.rank === 3
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {row.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white flex items-center space-x-2">
                    <span>{row.name}</span>
                    {row.rank === 1 && <span className="text-xs">👑</span>}
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-xs text-slate-400">{row.usn}</td>
                  <td className="px-4 py-4 text-center font-mono text-xs text-blue-300">{row.d1}</td>
                  <td className="px-4 py-4 text-center font-mono text-xs text-purple-300">{row.d2}</td>
                  <td className="px-4 py-4 text-center font-mono text-xs text-emerald-300">{row.d3}</td>
                  <td className="px-4 py-4 text-center font-mono text-xs text-rose-300">{row.d4}</td>
                  <td className="px-6 py-4 text-right font-mono font-extrabold text-amber-400 text-base">
                    {row.score} Pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance & Activity Tracker */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-heading flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <span>Attendance & Club Activity Metrics</span>
          </h3>
          <span className="text-xs text-slate-400">Verified participant engagement score</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-semibold block uppercase">Concept Submissions</span>
            <div className="text-3xl font-extrabold text-blue-400 font-heading">
              {tallies.submissions}
            </div>
            <span className="text-[11px] text-slate-400 block">Ideas submitted to club review</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-semibold block uppercase">Sessions Attended</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-heading">
              {tallies.sessionAttended}
            </div>
            <span className="text-[11px] text-slate-400 block">Workshops & hackathons attended</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-semibold block uppercase">Session Conducted</span>
            <div className="text-3xl font-extrabold text-purple-400 font-heading">
              {tallies.sessionConducted}
            </div>
            <span className="text-[11px] text-slate-400 block">Mentoring walkthroughs run</span>
          </div>
        </div>
      </div>

    </div>
  );
}
