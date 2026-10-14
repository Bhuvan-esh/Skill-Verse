'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ShieldCheck, RefreshCw, CheckCircle2, AlertTriangle, Lightbulb,
  MessageSquare, Send, Star, Trophy, Filter, Search, ChevronRight,
  X, Plus, BarChart3, Users, BadgeCheck, Clock, Sparkles,
  Megaphone, Eye, BookOpen, Layers, Flag, TrendingUp, Award
} from 'lucide-react';

import VAUserManagement from './VAUserManagement';

interface Props { user: any; onBack?: () => void; }

type Tab = 'overview' | 'pitch-queue' | 'channel-inbox' | 'promote' | 'analytics' | 'user-management';

// ── Utilities ──────────────────────────────────────────────────────────────────
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
  const cfg: Record<string, string> = {
    PENDING:   'bg-amber-500/10  text-amber-400  border-amber-500/25',
    APPROVED:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    REJECTED:  'bg-red-500/10    text-red-400    border-red-500/20',
    FEATURED:  'bg-[#6D3DF5]/10  text-[#A78BFA]  border-[#6D3DF5]/25',
    BUILT:     'bg-sky-500/10    text-sky-400     border-sky-500/25',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/25'}`}>
      {status}
    </span>
  );
}

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'overview',        label: 'Overview',          icon: BarChart3     },
  { id: 'pitch-queue',     label: 'Pitch Queue',        icon: Lightbulb     },
  { id: 'channel-inbox',   label: 'Channel Inbox',      icon: MessageSquare },
  { id: 'promote',         label: 'Promote / Feature',  icon: Star          },
  { id: 'analytics',       label: 'Analytics',          icon: TrendingUp    },
  { id: 'user-management', label: 'User Management',    icon: Users         },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function FounderIdeaHubCurationDesk({ user }: Props) {
  const [activeTab,      setActiveTab]      = useState<Tab>('overview');

  // Data
  const [ideas,          setIdeas]          = useState<any[]>([]);
  const [channels,       setChannels]       = useState<any[]>([]);
  const [loading,        setLoading]        = useState(false);

  // Pitch queue
  const [filterStatus,   setFilterStatus]   = useState('ALL');
  const [searchQ,        setSearchQ]        = useState('');
  const [decisionMap,    setDecisionMap]    = useState<Record<string, { decision: 'APPROVE'|'REJECT'; reason: string }>>({});
  const [submitting,     setSubmitting]     = useState<Record<string, boolean>>({});

  // Channel inbox / messaging
  const [activeChannel,  setActiveChannel]  = useState<any | null>(null);
  const [messages,       setMessages]       = useState<any[]>([]);
  const [msgText,        setMsgText]        = useState('');
  const [sendingMsg,     setSendingMsg]     = useState(false);
  const [loadingMsgs,    setLoadingMsgs]    = useState(false);
  const msgEndRef = useRef<HTMLDivElement>(null);

  // Promote
  const [promotingId,    setPromotingId]    = useState<string | null>(null);
  const [promoteStatus,  setPromoteStatus]  = useState<'FEATURED'|'BUILT'|'APPROVED'>('FEATURED');

  // Toast
  const [toast, setToast] = useState<{ type: 'ok'|'err'; msg: string } | null>(null);
  const showToast = (type: 'ok'|'err', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4500);
  };

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([
      fetch('/api/ideas').then(r => r.json()).then(d => { if (d.ideas) setIdeas(d.ideas); }),
      fetch('/api/ideas/channel').then(r => r.json()).then(d => { if (d.channels) setChannels(d.channels); }),
    ]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (msgEndRef.current) msgEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Open Channel ──────────────────────────────────────────────────────────
  const openChannel = async (ch: any) => {
    setActiveChannel(ch);
    setLoadingMsgs(true);
    try {
      const res  = await fetch(`/api/ideas/channel/${ch.id}/messages`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (_) {}
    setLoadingMsgs(false);
  };

  // ── Send Message ──────────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!msgText.trim() || !activeChannel) return;
    setSendingMsg(true);
    try {
      const res  = await fetch(`/api/ideas/channel/${activeChannel.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msgText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setMessages(p => [...p, data.message]);
      setMsgText('');
    } catch (e: any) { showToast('err', e.message); }
    setSendingMsg(false);
  };

  // ── Approve / Reject Idea ─────────────────────────────────────────────────
  const submitDecision = async (ideaId: string) => {
    const d = decisionMap[ideaId];
    if (!d) return;
    if (d.decision === 'REJECT' && !d.reason.trim()) {
      showToast('err', 'A reason is required when rejecting an idea.');
      return;
    }
    setSubmitting(p => ({ ...p, [ideaId]: true }));
    try {
      const res  = await fetch(`/api/ideas/${ideaId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: d.decision, reason: d.reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      showToast('ok', data.message);
      setDecisionMap(p => { const n = { ...p }; delete n[ideaId]; return n; });
      fetchAll();
    } catch (e: any) { showToast('err', e.message); }
    setSubmitting(p => ({ ...p, [ideaId]: false }));
  };

  // ── Promote / Feature / Mark Built ───────────────────────────────────────
  const promoteIdea = async (ideaId: string, status: 'FEATURED'|'BUILT'|'APPROVED') => {
    setPromotingId(ideaId);
    try {
      const res  = await fetch(`/api/ideas/${ideaId}/feature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      showToast('ok', data.message);
      fetchAll();
    } catch (e: any) { showToast('err', e.message); }
    setPromotingId(null);
  };

  // ── Computed ───────────────────────────────────────────────────────────────
  const pending  = ideas.filter(i => i.status === 'PENDING');
  const approved = ideas.filter(i => i.status === 'APPROVED');
  const rejected = ideas.filter(i => i.status === 'REJECTED');
  const featured = ideas.filter(i => i.status === 'FEATURED');
  const built    = ideas.filter(i => i.status === 'BUILT');

  const filteredIdeas = ideas
    .filter(i => filterStatus === 'ALL' || i.status === filterStatus)
    .filter(i =>
      !searchQ.trim() ||
      i.title.toLowerCase().includes(searchQ.toLowerCase()) ||
      i.student?.name?.toLowerCase().includes(searchQ.toLowerCase())
    );

  const categoryBreakdown = ideas.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1;
    return acc;
  }, {});

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 font-sans">

      {/* Header */}
      <div className="p-5 rounded-2xl border border-[#6D3DF5]/20 bg-gradient-to-br from-[#0F1220] to-[#12162A] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6D3DF5]/15 border border-[#6D3DF5]/30 text-[#A78BFA] text-[11px] font-bold mb-2 tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            VISUAL ARCHITECT · IDEA HUB CURATION DESK
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">Idea Hub — Curation Desk</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Review pitches, approve or reject ideas, message students directly, feature the best ideas, and track the ecosystem.
          </p>
        </div>
        <button
          onClick={fetchAll} disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-slate-300 hover:bg-white/[0.08] transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-2 p-3.5 rounded-xl border text-xs font-medium ${
          toast.type === 'ok'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {toast.type === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-[#0B0D18] rounded-xl border border-white/[0.06]">
        {TABS.map(tab => {
          const badge = tab.id === 'pitch-queue' ? pending.length : 0;
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
              {badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-black">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB: Overview ── */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <StatCard icon={Clock}        label="Pending Review"  value={pending.length}  sub="Awaiting your decision" color="#FBBF24" />
            <StatCard icon={CheckCircle2} label="Approved"        value={approved.length} sub="Greenlit ideas"          color="#34D399" />
            <StatCard icon={X}            label="Rejected"        value={rejected.length} sub="Declined pitches"        color="#F87171" />
            <StatCard icon={Star}         label="Featured"        value={featured.length} sub="Idea of the Day"         color="#A78BFA" />
            <StatCard icon={Trophy}       label="Built"           value={built.length}    sub="Launched products"       color="#60A5FA" />
          </div>

          {/* Pending alerts */}
          {pending.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/08 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-sm font-bold text-amber-400">{pending.length} idea{pending.length !== 1 ? 's' : ''} awaiting your review</span>
              </div>
              <div className="space-y-2">
                {pending.slice(0, 3).map(i => (
                  <div key={i.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#0B0D18] border border-white/[0.06]">
                    <div>
                      <p className="text-xs font-bold text-white">{i.title}</p>
                      <p className="text-[10px] text-slate-400">{i.student?.name} · {i.category}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('pitch-queue')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#6D3DF5] text-white text-[10px] font-bold hover:bg-[#5B2FD1] transition-all cursor-pointer"
                    >
                      Review <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {pending.length > 3 && (
                  <p className="text-[11px] text-amber-400 text-center">+{pending.length - 3} more pending pitches</p>
                )}
              </div>
            </div>
          )}

          {/* Recent channels */}
          {channels.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span className="text-sm font-bold text-white">Recent Student Channels</span>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-[#6D3DF5]/15 text-[#A78BFA] text-[10px] font-bold border border-[#6D3DF5]/25">{channels.length}</span>
              </div>
              {channels.slice(0, 4).map(ch => (
                <button
                  key={ch.id}
                  onClick={() => { setActiveTab('channel-inbox'); openChannel(ch); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#12162A]/60 border border-white/[0.05] hover:border-[#6D3DF5]/25 hover:bg-[#6D3DF5]/05 transition-all cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-[#6D3DF5]/20 border border-[#6D3DF5]/30 flex items-center justify-center text-[#A78BFA] font-black text-xs shrink-0">
                    {ch.student?.name?.[0] || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{ch.student?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{ch.messages?.[0]?.text || 'No messages yet'}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-auto" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Pitch Queue ── */}
      {activeTab === 'pitch-queue' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="Search by idea or student..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] transition-all"
              />
            </div>
            <div className="flex gap-1">
              {['ALL','PENDING','APPROVED','REJECTED','FEATURED','BUILT'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    filterStatus === s ? 'bg-[#6D3DF5] text-white' : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  {s === 'ALL' ? 'All' : s}
                  {s === 'PENDING' && pending.length > 0 && (
                    <span className="ml-1 px-1 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px]">{pending.length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {filteredIdeas.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Lightbulb className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500">No ideas match this filter.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredIdeas.map((idea: any) => {
                const d = decisionMap[idea.id] || { decision: 'APPROVE' as const, reason: '' };
                const isDecided = idea.status !== 'PENDING';
                return (
                  <div key={idea.id} className="p-4 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-3">
                    {/* Header row */}
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-white">{idea.title}</span>
                          <StatusBadge status={idea.status} />
                        </div>
                        <div className="flex gap-3 text-[11px] text-slate-400">
                          <span>👤 {idea.student?.name}</span>
                          {idea.student?.usn && <span>· {idea.student.usn}</span>}
                          <span>· 🏷 {idea.category}</span>
                        </div>
                      </div>
                      {idea.approvals?.length > 0 && (
                        <div className="text-[10px] text-slate-500">
                          Reviewed by: {idea.approvals.map((a: any) => a.founder?.name).join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-[12px] text-slate-300 leading-relaxed border-l-2 border-[#6D3DF5]/30 pl-3">
                      {idea.description}
                    </p>

                    {/* Decision controls — only for PENDING */}
                    {!isDecided && (
                      <div className="space-y-2 border-t border-white/[0.06] pt-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDecisionMap(p => ({ ...p, [idea.id]: { decision: 'APPROVE', reason: p[idea.id]?.reason || '' } }))}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                              d.decision === 'APPROVE'
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => setDecisionMap(p => ({ ...p, [idea.id]: { decision: 'REJECT', reason: p[idea.id]?.reason || '' } }))}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                              d.decision === 'REJECT'
                                ? 'bg-red-500/15 border-red-500/30 text-red-400'
                                : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>

                        {d.decision === 'REJECT' && (
                          <textarea
                            value={d.reason}
                            onChange={e => setDecisionMap(p => ({ ...p, [idea.id]: { ...d, reason: e.target.value } }))}
                            placeholder="Reason for rejection (required)..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl bg-[#0B0D18] border border-red-500/25 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 resize-none transition-all"
                          />
                        )}

                        {d.decision === 'APPROVE' && (
                          <textarea
                            value={d.reason}
                            onChange={e => setDecisionMap(p => ({ ...p, [idea.id]: { ...d, reason: e.target.value } }))}
                            placeholder="Optional approval note to the student..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] resize-none transition-all"
                          />
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => submitDecision(idea.id)}
                            disabled={submitting[idea.id]}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shadow-lg ${
                              d.decision === 'APPROVE'
                                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 shadow-emerald-500/10'
                                : 'bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 shadow-red-500/10'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            {submitting[idea.id] ? 'Submitting...' : `Submit ${d.decision === 'APPROVE' ? 'Approval' : 'Rejection'}`}
                          </button>
                          {/* Quick channel link */}
                          <button
                            onClick={() => {
                              const ch = channels.find(c => c.student?.id === idea.student_id);
                              if (ch) { setActiveTab('channel-inbox'); openChannel(ch); }
                              else showToast('err', 'No channel found for this student yet.');
                            }}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#6D3DF5]/10 border border-[#6D3DF5]/25 text-[#A78BFA] text-[11px] font-semibold hover:bg-[#6D3DF5]/20 transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" /> Message Student
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Already decided */}
                    {isDecided && (
                      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <BadgeCheck className="w-3.5 h-3.5 text-[#A78BFA]" />
                          Decision recorded — status: <StatusBadge status={idea.status} />
                        </div>
                        <div className="flex gap-2">
                          {idea.status === 'APPROVED' && (
                            <button
                              onClick={() => promoteIdea(idea.id, 'FEATURED')}
                              disabled={promotingId === idea.id}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#6D3DF5]/15 border border-[#6D3DF5]/25 text-[#A78BFA] text-[10px] font-bold hover:bg-[#6D3DF5]/25 transition-all cursor-pointer"
                            >
                              <Star className="w-3 h-3" /> Feature
                            </button>
                          )}
                          <button
                            onClick={() => {
                              const ch = channels.find(c => c.student?.id === idea.student_id);
                              if (ch) { setActiveTab('channel-inbox'); openChannel(ch); }
                              else showToast('err', 'No channel found for this student yet.');
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-slate-400 text-[10px] font-semibold hover:text-white transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" /> Chat
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Channel Inbox ── */}
      {activeTab === 'channel-inbox' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ minHeight: 520 }}>
          {/* Channel list */}
          <div className="md:col-span-1 p-4 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-2 overflow-y-auto max-h-[560px]">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span className="text-xs font-bold text-white">All Student Channels</span>
              <span className="ml-auto px-1.5 py-0.5 rounded-full bg-[#6D3DF5]/15 text-[#A78BFA] text-[10px] font-bold">{channels.length}</span>
            </div>

            {channels.length === 0 ? (
              <p className="text-[11px] text-slate-500 text-center py-6">No student channels yet. Students open channels when they submit ideas.</p>
            ) : (
              channels.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => openChannel(ch)}
                  className={`w-full flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer text-left ${
                    activeChannel?.id === ch.id
                      ? 'bg-[#6D3DF5]/15 border-[#6D3DF5]/35'
                      : 'bg-[#12162A]/40 border-white/[0.05] hover:border-[#6D3DF5]/20 hover:bg-[#6D3DF5]/05'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#6D3DF5]/20 border border-[#6D3DF5]/30 flex items-center justify-center text-[#A78BFA] font-black text-xs shrink-0">
                    {ch.student?.name?.[0] || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{ch.student?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{ch.student?.usn || ch.student?.college_email}</p>
                    {ch.messages?.[0] && (
                      <p className="text-[10px] text-slate-600 truncate mt-0.5">{ch.messages[0].text}</p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Chat window */}
          <div className="md:col-span-2 flex flex-col rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] overflow-hidden">
            {!activeChannel ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20 text-center px-6">
                <MessageSquare className="w-10 h-10 text-slate-700" />
                <p className="text-sm font-bold text-slate-500">Select a student channel</p>
                <p className="text-[11px] text-slate-600">Pick a channel from the left to start a 1:1 conversation with a student builder.</p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]">
                  <div className="w-8 h-8 rounded-full bg-[#6D3DF5]/20 border border-[#6D3DF5]/30 flex items-center justify-center text-[#A78BFA] font-black text-xs">
                    {activeChannel.student?.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{activeChannel.student?.name}</p>
                    <p className="text-[10px] text-slate-400">{activeChannel.student?.usn || activeChannel.student?.college_email}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6D3DF5]/10 border border-[#6D3DF5]/20">
                    <ShieldCheck className="w-3 h-3 text-[#A78BFA]" />
                    <span className="text-[10px] text-[#A78BFA] font-semibold">Visual Architect Channel</span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[360px]">
                  {loadingMsgs ? (
                    <div className="text-center py-8 text-xs text-slate-500">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">No messages yet. Start the conversation.</div>
                  ) : (
                    messages.map((m: any) => {
                      const isVA = m.sender?.role === 'FOUNDER';
                      return (
                        <div key={m.id} className={`flex ${isVA ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isVA
                              ? 'bg-[#6D3DF5] text-white rounded-br-sm'
                              : 'bg-[#12162A] border border-white/[0.06] text-slate-200 rounded-bl-sm'
                          }`}>
                            {!isVA && (
                              <p className="text-[10px] text-[#A78BFA] font-bold mb-1">{m.sender?.name}</p>
                            )}
                            {m.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={msgEndRef} />
                </div>

                {/* Message input */}
                <div className="p-3 border-t border-white/[0.06] flex gap-2">
                  <input
                    value={msgText}
                    onChange={e => setMsgText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Type a message to the student builder..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] transition-all"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sendingMsg || !msgText.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D3DF5] text-white text-xs font-bold hover:bg-[#5B2FD1] transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-[#6D3DF5]/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {sendingMsg ? '...' : 'Send'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: Promote / Feature ── */}
      {activeTab === 'promote' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#6D3DF5]/08 border border-[#6D3DF5]/20">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-[#A78BFA]" />
              <span className="text-xs font-bold text-white">VA Promotion Controls</span>
            </div>
            <p className="text-[11px] text-slate-400">
              <strong className="text-[#A78BFA]">FEATURED</strong> = Idea of the Day (only one at a time, replaces previous). &nbsp;
              <strong className="text-sky-400">BUILT</strong> = Mark as a launched product. &nbsp;
              <strong className="text-emerald-400">APPROVED</strong> = Revert to approved state.
            </p>
          </div>

          {approved.length === 0 && featured.length === 0 && built.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500">No approved ideas to promote yet.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {[...approved, ...featured, ...built].map((idea: any) => (
                <div key={idea.id} className="p-4 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{idea.title}</span>
                        <StatusBadge status={idea.status} />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{idea.student?.name} · {idea.category}</p>
                    </div>
                  </div>

                  <p className="text-[12px] text-slate-400 line-clamp-2">{idea.description}</p>

                  <div className="flex flex-wrap gap-2 border-t border-white/[0.06] pt-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mr-2">
                      <Flag className="w-3 h-3" /> Promote to:
                    </div>
                    {(['FEATURED', 'BUILT', 'APPROVED'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => promoteIdea(idea.id, s)}
                        disabled={promotingId === idea.id || idea.status === s}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer disabled:opacity-40 ${
                          s === 'FEATURED' ? 'bg-[#6D3DF5]/15 border-[#6D3DF5]/25 text-[#A78BFA] hover:bg-[#6D3DF5]/25'
                          : s === 'BUILT'  ? 'bg-sky-500/10 border-sky-500/25 text-sky-400 hover:bg-sky-500/20'
                          :                  'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {s === 'FEATURED' ? <Star className="w-3 h-3" /> : s === 'BUILT' ? <Trophy className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {promotingId === idea.id ? '...' : s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Analytics ── */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          {/* Status breakdown */}
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span className="text-sm font-bold text-white">Idea Pipeline</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Pending Review', count: pending.length,  color: '#FBBF24', pct: ideas.length ? Math.round(pending.length  / ideas.length * 100) : 0 },
                { label: 'Approved',       count: approved.length, color: '#34D399', pct: ideas.length ? Math.round(approved.length / ideas.length * 100) : 0 },
                { label: 'Rejected',       count: rejected.length, color: '#F87171', pct: ideas.length ? Math.round(rejected.length / ideas.length * 100) : 0 },
                { label: 'Featured',       count: featured.length, color: '#A78BFA', pct: ideas.length ? Math.round(featured.length / ideas.length * 100) : 0 },
                { label: 'Built',          count: built.length,    color: '#60A5FA', pct: ideas.length ? Math.round(built.length    / ideas.length * 100) : 0 },
              ].map(row => (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">{row.label}</span>
                    <span className="font-bold text-white">{row.count} <span className="text-slate-500 font-normal">({row.pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${row.pct}%`, backgroundColor: row.color }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 pt-1">Total ideas submitted: <span className="text-white font-bold">{ideas.length}</span></p>
          </div>

          {/* Category breakdown */}
          {Object.keys(categoryBreakdown).length > 0 && (
            <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span className="text-sm font-bold text-white">By Category</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(categoryBreakdown).map(([cat, cnt]) => (
                  <div key={cat} className="p-3 rounded-xl bg-[#12162A]/60 border border-white/[0.05] text-center">
                    <p className="text-lg font-black text-white">{cnt}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{cat}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Channel activity */}
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span className="text-sm font-bold text-white">Channel Activity</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#6D3DF5]/08 border border-[#6D3DF5]/15 text-center">
                <p className="text-2xl font-black text-white">{channels.length}</p>
                <p className="text-[11px] text-slate-400">Active Channels</p>
              </div>
              <div className="p-3 rounded-xl bg-[#6D3DF5]/08 border border-[#6D3DF5]/15 text-center">
                <p className="text-2xl font-black text-white">{channels.filter(c => c.messages?.length > 0).length}</p>
                <p className="text-[11px] text-slate-400">Channels with Messages</p>
              </div>
              <div className="p-3 rounded-xl bg-[#6D3DF5]/08 border border-[#6D3DF5]/15 text-center">
                <p className="text-2xl font-black text-white">{ideas.filter(i => i.approvals?.length > 0).length}</p>
                <p className="text-[11px] text-slate-400">Ideas Reviewed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: User Management ── */}
      {activeTab === 'user-management' && (
        <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
          <VAUserManagement />
        </div>
      )}

    </div>
  );
}
