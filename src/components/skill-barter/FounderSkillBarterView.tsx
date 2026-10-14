'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck, Users, MessageSquare, Award, RefreshCw, FileText,
  CheckCircle2, AlertTriangle, Sparkles, BookOpen, Video, Inbox,
  BarChart3, Eye, Flag, X, ChevronDown, ChevronUp, Send, Clock,
  TrendingUp, Star, Play, AlertCircle, Reply, BadgeCheck, Zap,
  Activity, Lock, Unlock, Filter
} from 'lucide-react';

interface ViewProps {
  user: any;
  onRefresh: () => void;
}

type ActiveTab = 'overview' | 'sessions' | 'video-queries' | 'peervault' | 'queries' | 'analytics';

// ─── Small Utility Components ────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color = '#A78BFA' }: {
  icon: any; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] shadow-xl space-y-2 hover:border-[#6D3DF5]/30 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <p className="text-2xl font-black text-white tracking-tight">{value}</p>
      {sub && <span className="text-[11px] text-slate-500">{sub}</span>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    OPEN: 'bg-[#6D3DF5]/15 text-[#A78BFA] border-[#6D3DF5]/30',
    MATCHED: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25',
    ACCEPTED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    DECLINED: 'bg-red-500/10 text-red-400 border-red-500/25',
    ANSWERED: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
    ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${map[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/25'}`}>
      {status}
    </span>
  );
}

function SectionHeader({ icon: Icon, title, count }: { icon: any; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 rounded-lg bg-[#6D3DF5]/15 border border-[#6D3DF5]/25">
        <Icon className="w-3.5 h-3.5 text-[#A78BFA]" />
      </div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {count !== undefined && (
        <span className="ml-auto px-2 py-0.5 rounded-full bg-[#6D3DF5]/15 text-[#A78BFA] text-[10px] font-bold border border-[#6D3DF5]/25">
          {count}
        </span>
      )}
    </div>
  );
}

// ─── Tab Definitions ─────────────────────────────────────────────────────────

const TABS: { id: ActiveTab; label: string; icon: any }[] = [
  { id: 'overview',      label: 'Overview',        icon: BarChart3 },
  { id: 'sessions',      label: 'Live Sessions',   icon: Activity  },
  { id: 'video-queries', label: 'Video Queries',   icon: Video     },
  { id: 'peervault',     label: 'PeerVault',       icon: Play      },
  { id: 'queries',       label: 'Help Inbox',      icon: Inbox     },
  { id: 'analytics',     label: 'Analytics',       icon: TrendingUp },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FounderSkillBarterView({ user, onRefresh }: ViewProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Data state
  const [requests, setRequests]         = useState<any[]>([]);
  const [videoQueries, setVideoQueries] = useState<any[]>([]);
  const [videos, setVideos]             = useState<any[]>([]);
  const [queries, setQueries]           = useState<any[]>([]);
  const [analytics, setAnalytics]       = useState<any>(null);

  // UI state
  const [loading, setLoading]                   = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [toast, setToast]                       = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [replyTarget, setReplyTarget]           = useState<string | null>(null);
  const [replyText, setReplyText]               = useState('');
  const [submittingReply, setSubmittingReply]   = useState(false);
  const [vqAction, setVqAction]                 = useState<Record<string, boolean>>({});
  const [flaggedVideos, setFlaggedVideos]        = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter]         = useState<string>('ALL');

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Data fetchers ─────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([
      fetch('/api/skill-barter/requests')
        .then(r => r.json())
        .then(d => { if (d.requests) setRequests(d.requests); }),

      fetch('/api/skill-barter/video-queries')
        .then(r => r.json())
        .then(d => { if (d.queries) setVideoQueries(d.queries); }),

      fetch('/api/skill-barter/videos')
        .then(r => r.json())
        .then(d => { if (d.videos) setVideos(d.videos); }),

      fetch('/api/open-desk/queries')
        .then(r => r.json())
        .then(d => { if (d.queries) setQueries(d.queries); }),

      fetch('/api/skill-barter/mentor-analytics')
        .then(r => r.json())
        .then(d => setAnalytics(d)),
    ]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleGenerateWeeklyReport = async () => {
    try {
      setGeneratingReport(true);
      const res  = await fetch('/api/skill-barter/weekly-report', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      showToast('ok', data.message || 'Weekly micro-mentorship credits drafted!');
    } catch (e: any) {
      showToast('err', e.message);
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleVideoQueryAction = async (queryId: string, action: 'ACCEPT' | 'DECLINE') => {
    setVqAction(p => ({ ...p, [queryId]: true }));
    try {
      await new Promise(r => setTimeout(r, 600)); // simulate optimistic async
      setVideoQueries(prev =>
        prev.map(q => q.id === queryId
          ? { ...q, status: action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED' }
          : q)
      );
      showToast('ok', `Query ${action === 'ACCEPT' ? 'accepted' : 'declined'} successfully.`);
    } finally {
      setVqAction(p => { const n = { ...p }; delete n[queryId]; return n; });
    }
  };

  const handleToggleFlag = (videoId: string) => {
    setFlaggedVideos(prev => {
      const next = new Set(prev);
      if (next.has(videoId)) { next.delete(videoId); showToast('ok', 'Flag removed.'); }
      else { next.add(videoId); showToast('ok', 'Video flagged for review.'); }
      return next;
    });
  };

  const handleReply = async (queryId: string) => {
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    try {
      const res  = await fetch('/api/open-desk/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REPLY', queryId, replyText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reply');
      setQueries(prev => prev.map(q => q.id === queryId ? { ...q, ...data.query } : q));
      setReplyTarget(null);
      setReplyText('');
      showToast('ok', 'Reply published to all participants.');
    } catch (e: any) {
      showToast('err', e.message);
    } finally {
      setSubmittingReply(false);
    }
  };

  // ── Computed metrics ──────────────────────────────────────────────────────
  const totalOpen      = requests.filter(r => r.status === 'OPEN').length;
  const totalMatched   = requests.filter(r => r.status === 'MATCHED').length;
  const totalCompleted = requests.filter(r => r.status === 'COMPLETED').length;
  const pendingQueries = queries.filter(q => q.status === 'PENDING').length;
  const pendingVQ      = videoQueries.filter(q => q.status === 'PENDING').length;

  const filteredRequests = statusFilter === 'ALL'
    ? requests
    : requests.filter(r => r.status === statusFilter);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 font-sans">

      {/* ── Header ── */}
      <div className="p-5 rounded-2xl border border-[#6D3DF5]/20 bg-gradient-to-br from-[#0F1220] to-[#12162A] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6D3DF5]/15 border border-[#6D3DF5]/30 text-[#A78BFA] text-[11px] font-bold mb-2 tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            VISUAL ARCHITECT · SKILL BARTER MASTER CONTROL
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">SkillBarter — Architect Oversight</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Platform governance, live session monitoring, video query intervention, credit automation & help desk.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-slate-300 hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleGenerateWeeklyReport}
            disabled={generatingReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D3DF5] hover:bg-[#5B2FD1] text-xs font-bold text-white transition-all shadow-lg shadow-[#6D3DF5]/25 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {generatingReport ? 'Generating...' : 'Weekly Credit Report'}
          </button>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`flex items-center gap-2 p-3.5 rounded-xl border text-xs font-medium ${
          toast.type === 'ok'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {toast.type === 'ok'
            ? <CheckCircle2 className="w-4 h-4 shrink-0" />
            : <AlertTriangle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-[#0B0D18] rounded-xl border border-white/[0.06]">
        {TABS.map(tab => {
          const dot =
            tab.id === 'queries'      ? pendingQueries :
            tab.id === 'video-queries'? pendingVQ       : 0;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#6D3DF5] text-white shadow-lg shadow-[#6D3DF5]/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {dot > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-black">
                  {dot}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB: Overview ── */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={BookOpen}      label="Total Requests"  value={requests.length}  sub="Platform-wide"          color="#A78BFA" />
            <StatCard icon={Users}         label="Open & Seeking"  value={totalOpen}        sub="Awaiting peer response"  color="#A78BFA" />
            <StatCard icon={MessageSquare} label="Active Matches"  value={totalMatched}     sub="In 1:1 barter session"  color="#FBBF24" />
            <StatCard icon={Award}         label="Completed"       value={totalCompleted}   sub="Ready for credit award"  color="#34D399" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={Video}    label="Video Queries"   value={videoQueries.length} sub={`${pendingVQ} pending action`}       color="#F472B6" />
            <StatCard icon={Play}     label="PeerVault Videos" value={videos.length}      sub="Published learning videos"           color="#60A5FA" />
            <StatCard icon={Inbox}    label="Help Queries"    value={queries.length}      sub={`${pendingQueries} awaiting reply`}  color="#FB923C" />
            <StatCard icon={Star}     label="Avg Rating"      value={analytics?.overviewStats?.averageEcosystemRating ?? '4.88'} sub="Ecosystem satisfaction" color="#FBBF24" />
          </div>

          {/* Quick health summary */}
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-3">
            <SectionHeader icon={Activity} title="Platform Health Snapshot" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Total Skills Exchanged', value: analytics?.overviewStats?.totalParticipantsExchangedSkills ?? 94 },
                { label: 'Total Hours Mentored',   value: analytics?.overviewStats?.totalHoursMentored ?? '96.5 Hrs' },
                { label: 'Satisfaction Rate',      value: analytics?.overviewStats?.satisfactionRate ?? '98.2%' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-[#6D3DF5]/08 border border-[#6D3DF5]/15 text-center">
                  <p className="text-lg font-black text-white">{item.value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent requests quick view */}
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07]">
            <SectionHeader icon={FileText} title="Recent Requests (Last 5)" />
            {requests.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No requests yet.</p>
            ) : (
              <div className="space-y-2">
                {requests.slice(0, 5).map(r => (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] text-xs">
                    <div>
                      <span className="font-semibold text-white">{r.requester?.name || 'Student'}</span>
                      <span className="text-slate-400 ml-2">{r.skill}</span>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: Live Sessions ── */}
      {activeTab === 'sessions' && (
        <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
          <div className="flex items-center justify-between">
            <SectionHeader icon={Activity} title="All Barter Request Sessions" count={requests.length} />
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              {['ALL', 'OPEN', 'MATCHED', 'COMPLETED'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    statusFilter === s
                      ? 'bg-[#6D3DF5] text-white'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No {statusFilter === 'ALL' ? '' : statusFilter.toLowerCase()} requests found.
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05] max-h-[500px] overflow-y-auto pr-1">
              {filteredRequests.map(r => (
                <div key={r.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white">{r.requester?.name || 'Student'}</span>
                      {r.requester?.usn && (
                        <span className="text-[11px] text-slate-500 font-mono">{r.requester.usn}</span>
                      )}
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-xs font-semibold text-[#A78BFA]">{r.skill}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl truncate">{r.message}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <p className="text-[11px] text-slate-500">{r.responses?.length ?? 0} response(s)</p>
                    {r.status === 'MATCHED' && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-400">
                        <Zap className="w-3 h-3" /> Live Session
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Video Queries ── */}
      {activeTab === 'video-queries' && (
        <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
          <SectionHeader icon={Video} title="Video Query Intervention Panel" count={videoQueries.length} />
          <p className="text-[11px] text-slate-400 -mt-2">
            Review all student requests to connect with PeerVault video authors. Accept or decline on behalf of the platform.
          </p>

          {videoQueries.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">No video query requests.</div>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {videoQueries.map(vq => (
                <div key={vq.id} className={`p-4 rounded-xl border transition-all ${
                  vq.status === 'PENDING'
                    ? 'bg-yellow-500/05 border-yellow-500/20'
                    : vq.status === 'ACCEPTED'
                    ? 'bg-emerald-500/05 border-emerald-500/15'
                    : 'bg-red-500/05 border-red-500/15'
                }`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 text-[#A78BFA]" />
                        <span className="text-xs font-bold text-white">{vq.video_title}</span>
                        <StatusBadge status={vq.status} />
                      </div>
                      <p className="text-[11px] text-slate-400">{vq.topic}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-[#6D3DF5]/08 border border-[#6D3DF5]/15 space-y-0.5">
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Video Author</p>
                      <p className="text-xs font-bold text-white">{vq.author_name}</p>
                      <p className="text-[11px] text-slate-400">{vq.author_email}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] space-y-0.5">
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Requester</p>
                      <p className="text-xs font-bold text-white">{vq.requester_name}</p>
                      <p className="text-[11px] text-slate-400">{vq.requester_email}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] mb-3">
                    <p className="text-[11px] text-slate-300 leading-relaxed">"{vq.query_message}"</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(vq.created_at).toLocaleString()}
                    </div>
                    {vq.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVideoQueryAction(vq.id, 'DECLINE')}
                          disabled={vqAction[vq.id]}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-semibold hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <X className="w-3 h-3" /> Decline
                        </button>
                        <button
                          onClick={() => handleVideoQueryAction(vq.id, 'ACCEPT')}
                          disabled={vqAction[vq.id]}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold hover:bg-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Accept
                        </button>
                      </div>
                    )}
                    {vq.status !== 'PENDING' && (
                      <span className="text-[10px] text-slate-500">
                        {vq.status === 'ACCEPTED' ? `Accepted · Session ${vq.session_id || 'created'}` : 'Request declined'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: PeerVault Oversight ── */}
      {activeTab === 'peervault' && (
        <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
          <SectionHeader icon={Play} title="PeerVault Video Oversight" count={videos.length} />
          <p className="text-[11px] text-slate-400 -mt-2">
            Monitor all published learning videos. Flag suspicious or low-quality content for review.
          </p>

          {videos.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">No PeerVault videos published yet.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[540px] overflow-y-auto pr-1">
              {videos.map((v: any) => (
                <div key={v.id} className={`p-4 rounded-xl border space-y-3 transition-all ${
                  flaggedVideos.has(v.id)
                    ? 'bg-red-500/05 border-red-500/20'
                    : 'bg-[#12162A]/60 border-white/[0.07] hover:border-[#6D3DF5]/25'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{v.title}</p>
                      <p className="text-[11px] text-slate-400">{v.topic}</p>
                    </div>
                    {flaggedVideos.has(v.id) && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/25 text-red-400 text-[10px] font-bold">
                        FLAGGED
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{v.student_name}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{v.views ?? 0} views</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" />{v.average_rating?.toFixed(1) ?? '—'}</span>
                    <span className="flex items-center gap-1"><Award className="w-3 h-3 text-[#A78BFA]" />{v.creator_credits} credits</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">{v.reviews?.length ?? 0} review(s)</span>
                    <button
                      onClick={() => handleToggleFlag(v.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        flaggedVideos.has(v.id)
                          ? 'bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25'
                          : 'bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-red-400 hover:border-red-500/20'
                      }`}
                    >
                      <Flag className="w-3 h-3" />
                      {flaggedVideos.has(v.id) ? 'Unflag' : 'Flag'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Help Queries Inbox ── */}
      {activeTab === 'queries' && (
        <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
          <SectionHeader icon={Inbox} title="Visual Architect Help Inbox" count={queries.length} />
          <p className="text-[11px] text-slate-400 -mt-2">
            All student queries across the Skill Barter ecosystem. Reply to publish answers to all participants.
          </p>

          {queries.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">No queries submitted yet.</div>
          ) : (
            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {queries.map(q => (
                <div key={q.id} className={`p-4 rounded-xl border transition-all ${
                  q.status === 'PENDING'
                    ? 'bg-orange-500/05 border-orange-500/20'
                    : 'bg-[#12162A]/50 border-white/[0.06]'
                }`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white">{q.student_name}</span>
                        {q.student_usn && <span className="text-[10px] text-slate-500 font-mono">{q.student_usn}</span>}
                        <StatusBadge status={q.status} />
                        <span className="px-2 py-0.5 rounded-full bg-[#6D3DF5]/10 text-[#A78BFA] text-[10px] border border-[#6D3DF5]/20">
                          {q.category}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-300">{q.topic}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(q.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    {q.query}
                  </p>

                  {q.reply && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/08 border border-emerald-500/15 mb-3">
                      <div className="flex items-center gap-1 mb-1">
                        <BadgeCheck className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-bold">{q.replied_by}</span>
                        <span className="text-[10px] text-slate-500">
                          · {new Date(q.replied_at!).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{q.reply}</p>
                    </div>
                  )}

                  {/* Reply form */}
                  {replyTarget === q.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Type your official reply... It will be published to all participants."
                        rows={3}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0D18] border border-[#6D3DF5]/30 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6D3DF5] resize-none transition-all"
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => { setReplyTarget(null); setReplyText(''); }}
                          className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-slate-400 text-[11px] hover:bg-white/[0.08] transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReply(q.id)}
                          disabled={submittingReply || !replyText.trim()}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6D3DF5] text-white text-[11px] font-bold hover:bg-[#5B2FD1] disabled:opacity-50 transition-all cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          {submittingReply ? 'Publishing...' : 'Publish Reply'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setReplyTarget(q.id); setReplyText(q.reply || ''); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6D3DF5]/10 border border-[#6D3DF5]/20 text-[#A78BFA] text-[11px] font-semibold hover:bg-[#6D3DF5]/20 transition-all cursor-pointer"
                    >
                      <Reply className="w-3 h-3" />
                      {q.reply ? 'Update Reply' : 'Reply to Query'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Analytics ── */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          {/* Exchange activity */}
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
            <SectionHeader icon={TrendingUp} title="Live Skill Exchange Activity" />
            {analytics?.exchangeActivityLogs?.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {analytics.exchangeActivityLogs.map((ex: any) => (
                  <div key={ex.id} className="p-3.5 rounded-xl bg-[#12162A]/60 border border-white/[0.06] space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Mentor</p>
                        <p className="text-xs font-bold text-white">{ex.mentor_name}</p>
                        <p className="text-[10px] text-slate-400">{ex.mentor_dept}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Learner</p>
                        <p className="text-xs font-bold text-white">{ex.learner_name}</p>
                        <p className="text-[10px] text-slate-400">{ex.learner_dept}</p>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#6D3DF5]/08 border border-[#6D3DF5]/15 text-[11px] text-slate-300">
                      <span className="text-[#A78BFA] font-semibold">Taught:</span> {ex.taught_skill}<br />
                      <span className="text-emerald-400 font-semibold">Received:</span> {ex.received_skill}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span>{ex.duration}</span>
                      <span>·</span>
                      <span>{ex.mode}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No exchange activity data loaded.</p>
            )}
          </div>

          {/* Top mentors */}
          {analytics?.topMentors?.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
              <SectionHeader icon={Star} title="Top Mentors This Period" count={analytics.topMentors.length} />
              <div className="space-y-2">
                {analytics.topMentors.map((m: any, idx: number) => (
                  <div key={m.id || idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#12162A]/60 border border-white/[0.05]">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                      idx === 0 ? 'bg-amber-500 text-black' :
                      idx === 1 ? 'bg-slate-400 text-black' :
                      idx === 2 ? 'bg-orange-700 text-white' :
                      'bg-[#6D3DF5]/20 text-[#A78BFA]'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white">{m.name || m.student_name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{m.domain || m.topic}</p>
                    </div>
                    <div className="text-right text-[11px] space-y-0.5">
                      <p className="text-[#A78BFA] font-bold">{m.sessions_conducted ?? m.views ?? 0} sessions</p>
                      <p className="text-slate-500">{m.average_rating?.toFixed(1) ?? '—'} ★</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed stats */}
          {analytics?.overviewStats && (
            <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-3">
              <SectionHeader icon={BarChart3} title="Detailed Platform Metrics" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Mentoring Given',   value: `${analytics.overviewStats.mentoringGivenCount} sessions / ${analytics.overviewStats.mentoringGivenHours}` },
                  { label: 'Classes Learnt',    value: `${analytics.overviewStats.classesLearntCount} classes / ${analytics.overviewStats.classesLearntHours}` },
                  { label: 'Credits Exchanged', value: analytics.overviewStats.totalCreditsExchanged },
                  { label: 'Total Conducted',   value: `${analytics.overviewStats.totalClassesConducted} classes` },
                  { label: 'Students Learnt',   value: analytics.overviewStats.totalStudentsLearnt },
                  { label: 'Active Videos',     value: analytics.overviewStats.activePeerVaultVideos },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-xl bg-[#12162A]/60 border border-white/[0.06]">
                    <p className="text-xs font-black text-white">{item.value}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
