'use client';

import React, { useState } from 'react';
import { Trophy, RefreshCw, Award } from 'lucide-react';

export default function LeaderboardSection() {
  const [selectedDomain, setSelectedDomain] = useState('OVERALL');
  
  // Leaderboard tab is initially empty
  const [leaderboard] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Official Realtime Standings</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Club Leaderboard</h2>
          <p className="text-sm text-slate-400">Public student rankings sourced directly from approved student credits across 4 domains.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
            title="Refresh Leaderboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Session Filter Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-white/5">
        {['OVERALL', 'SESSION_1', 'SESSION_2', 'SESSION_3', 'SESSION_4'].map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDomain(d)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedDomain === d ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            {d === 'OVERALL' ? 'Overall Leaderboard' : d.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-6">USN</th>
                <th className="py-3.5 px-6 text-center">Session 1</th>
                <th className="py-3.5 px-6 text-center">Session 2</th>
                <th className="py-3.5 px-6 text-center">Session 3</th>
                <th className="py-3.5 px-6 text-center">Session 4</th>
                <th className="py-3.5 px-6 text-right">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200 font-medium">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Trophy className="w-8 h-8 text-slate-600 mb-1" />
                      <p className="text-sm font-semibold text-slate-300">No leaderboard standings recorded yet.</p>
                      <p className="text-xs text-slate-500">Rankings will update as students complete session activities & earn credits.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leaderboard.map((row) => (
                <tr key={row.rank} className="hover:bg-white/5 transition-all">
                  <td className="py-4 px-6 font-bold">
                    {row.rank === 1 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        🥇 #1
                      </span>
                    ) : row.rank === 2 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/30">
                        🥈 #2
                      </span>
                    ) : row.rank === 3 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/30">
                        🥉 #3
                      </span>
                    ) : (
                      <span className="text-slate-400">#{row.rank}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 font-bold text-white text-sm">{row.name}</td>
                  <td className="py-4 px-6 font-mono text-slate-400">{row.usn}</td>
                  <td className="py-4 px-6 text-center font-semibold text-blue-400">{row.domain_1}</td>
                  <td className="py-4 px-6 text-center font-semibold text-purple-400">{row.domain_2}</td>
                  <td className="py-4 px-6 text-center font-semibold text-emerald-400">{row.domain_3}</td>
                  <td className="py-4 px-6 text-center font-semibold text-rose-400">{row.domain_4}</td>
                  <td className="py-4 px-6 text-right font-extrabold text-amber-400 text-sm font-heading">
                    {row.score} pts
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
