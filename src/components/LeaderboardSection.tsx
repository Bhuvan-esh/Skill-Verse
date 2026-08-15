'use client';

import React, { useState, useEffect } from 'react';
import { Award, Trophy, Sparkles, RefreshCw, Zap } from 'lucide-react';

export default function LeaderboardSection() {
  const [selectedDomain, setSelectedDomain] = useState('OVERALL');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);

  const fetchLeaderboard = async (domain: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?domain=${domain}`);
      const data = await res.json();
      if (res.ok) {
        setLeaderboard(data.leaderboard || []);
        setIsCached(data.cached);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(selectedDomain);
  }, [selectedDomain]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Realtime Official Standings</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Club Leaderboard</h2>
          <p className="text-sm text-slate-400">Public student rankings sourced directly from approved student credits across 4 domains.</p>
        </div>

        <div className="flex items-center space-x-2">
          {isCached && (
            <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-white/5 flex items-center space-x-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Cached (Auto-refreshes on approved credit changes)</span>
            </span>
          )}
          <button
            onClick={() => fetchLeaderboard(selectedDomain)}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-blue-500 text-slate-300 hover:text-white"
            title="Refresh Leaderboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Domain Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-white/5">
        {['OVERALL', 'DOMAIN_1', 'DOMAIN_2', 'DOMAIN_3', 'DOMAIN_4'].map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDomain(d)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedDomain === d ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            {d === 'OVERALL' ? 'Overall Leaderboard' : d}
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
                <th className="py-3.5 px-6 text-center">Domain 1</th>
                <th className="py-3.5 px-6 text-center">Domain 2</th>
                <th className="py-3.5 px-6 text-center">Domain 3</th>
                <th className="py-3.5 px-6 text-center">Domain 4</th>
                <th className="py-3.5 px-6 text-right">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">Loading standings...</td>
                </tr>
              ) : leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">No student credits recorded yet.</td>
                </tr>
              ) : (
                leaderboard.map((row) => (
                  <tr key={row.student_id} className="hover:bg-white/5 transition-all">
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
                    <td className="py-4 px-6 font-mono text-slate-400">{row.usn || 'N/A'}</td>
                    <td className="py-4 px-6 text-center font-semibold text-blue-400">{row.domain_1}</td>
                    <td className="py-4 px-6 text-center font-semibold text-purple-400">{row.domain_2}</td>
                    <td className="py-4 px-6 text-center font-semibold text-emerald-400">{row.domain_3}</td>
                    <td className="py-4 px-6 text-center font-semibold text-rose-400">{row.domain_4}</td>
                    <td className="py-4 px-6 text-right font-extrabold text-amber-400 text-sm font-heading">
                      {row.score} pts
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
