'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Users, MessageSquare, Award, RefreshCw, FileText, BookOpen } from 'lucide-react';

interface ViewProps {
  user: any;
  onRefresh: () => void;
}

export default function VolunteerSkillBarterView({ user, onRefresh }: ViewProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/skill-barter/requests');
      const data = await res.json();
      if (res.ok && data.requests) {
        setRequests(data.requests);
      }
    } catch (e: any) {
      console.error('Failed to load overview:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const totalOpen = requests.filter((r) => r.status === 'OPEN').length;
  const totalMatched = requests.filter((r) => r.status === 'MATCHED').length;
  const totalCompleted = requests.filter((r) => r.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Community Ambassador Header */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Community Ambassador (Volunteer) Monitoring</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">SkillBarter — Community Activity</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Logistics and verification oversight for student peer barter sessions and mentorship pairs.
          </p>
        </div>
        <button
          onClick={fetchOverview}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:bg-white/10 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 bg-slate-900/40 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Total Requests</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{requests.length}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Open & Searching</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-300 font-mono">{totalOpen}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-amber-500/20 bg-amber-950/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Active Matches</span>
            <MessageSquare className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-300 font-mono">{totalMatched}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Completed Sessions</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-300 font-mono">{totalCompleted}</p>
        </div>
      </div>

      {/* Live Peer Activity Stream */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-950/60 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Community Peer Requests Overview</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">{requests.length} records</span>
        </div>

        {requests.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-mono">
            No peer requests submitted yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
            {requests.map((r) => (
              <div key={r.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{r.requester?.name || 'Student'}</span>
                    <span className="text-[10px] font-mono text-slate-500">{r.requester?.usn}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                      r.status === 'OPEN' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      r.status === 'MATCHED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="font-semibold text-emerald-300">{r.skill}</p>
                  <p className="text-slate-400 text-[11px] truncate max-w-xl">{r.message}</p>
                </div>
                <div className="text-right text-[10px] font-mono text-slate-500 shrink-0">
                  <span>{r.responses?.length || 0} response(s)</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

