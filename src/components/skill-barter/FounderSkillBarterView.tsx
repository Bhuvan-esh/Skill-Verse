'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, MessageSquare, Award, RefreshCw, FileText, CheckCircle2, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';

interface ViewProps {
  user: any;
  onRefresh: () => void;
}

export default function FounderSkillBarterView({ user, onRefresh }: ViewProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [actionErr, setActionErr] = useState('');

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

  const handleGenerateWeeklyReport = async () => {
    try {
      setGeneratingReport(true);
      setActionMsg('');
      setActionErr('');
      const res = await fetch('/api/skill-barter/weekly-report', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate report');
      setActionMsg(data.message || 'Weekly micro-mentorship credits drafted successfully!');
    } catch (e: any) {
      setActionErr(e.message || 'Failed to generate weekly report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const totalOpen = requests.filter((r) => r.status === 'OPEN').length;
  const totalMatched = requests.filter((r) => r.status === 'MATCHED').length;
  const totalCompleted = requests.filter((r) => r.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Visual Architect Header */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Visual Architect (Founder) Governance Console</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">SkillBarter — Architect Oversight</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Platform governance, peer session monitoring, and weekly micro-mentorship credit automation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOverview}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:bg-white/10 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
          <button
            onClick={handleGenerateWeeklyReport}
            disabled={generatingReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-lg shadow-purple-600/25 font-mono cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{generatingReport ? 'Drafting...' : 'Generate Credit Report'}</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {actionErr && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{actionErr}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-purple-500/20 bg-purple-950/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Total Requests</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{requests.length}</p>
          <span className="text-[10px] text-purple-300/70 font-mono">Peer mentorship listings</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Open & Searching</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-300 font-mono">{totalOpen}</p>
          <span className="text-[10px] text-cyan-300/70 font-mono">Awaiting peer response</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-amber-500/20 bg-amber-950/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Active Matches</span>
            <MessageSquare className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-300 font-mono">{totalMatched}</p>
          <span className="text-[10px] text-amber-300/70 font-mono">In 1:1 barter coordination</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Completed Sessions</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-300 font-mono">{totalCompleted}</p>
          <span className="text-[10px] text-emerald-300/70 font-mono">Ready for credit award</span>
        </div>
      </div>

      {/* Live Community Requests Feed */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-950/60 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Community Peer Requests Stream</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">{requests.length} records in database</span>
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
                  <p className="font-semibold text-purple-300">{r.skill}</p>
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

