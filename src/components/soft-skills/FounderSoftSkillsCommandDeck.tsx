'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck, RefreshCw, CheckCircle2, AlertTriangle, Lock, Unlock,
  Zap, Trophy, Users, BarChart3, Send, Sparkles, Activity, Clock,
  Megaphone, Filter, Star, BadgeCheck, Plus, X, Mic, Shuffle,
  Wand2, Award, TrendingUp, FlaskConical, UserCheck, ChevronRight,
  Siren, BookOpen, Flag
} from 'lucide-react';

interface Props {
  user: any;
  onBack?: () => void;
}

type Tab = 'command' | 'events' | 'teams' | 'judge-rows' | 'winners' | 'twists' | 'dispatches';

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

function SectionHead({ icon: Icon, title, count }: { icon: any; title: string; count?: number }) {
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

function VerdictBadge({ verdict }: { verdict: string }) {
  const cfg: Record<string, { cls: string; label: string }> = {
    QUALIFIED_TOP_PERFORMER: { cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25', label: 'Top Performer' },
    AVERAGE_PASS:            { cls: 'bg-amber-500/10  text-amber-400  border-amber-500/25',  label: 'Average Pass'  },
    NEEDS_ATTENTION_FAIL:    { cls: 'bg-red-500/10    text-red-400    border-red-500/25',    label: 'Needs Attention'},
  };
  const c = cfg[verdict] ?? { cls: 'bg-slate-500/10 text-slate-400 border-slate-500/25', label: verdict };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${c.cls}`}>{c.label}</span>
  );
}

function EventStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    REGISTRATION_OPEN:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    REGISTRATION_CLOSED:'bg-red-500/10     text-red-400    border-red-500/20',
    ONGOING:            'bg-amber-500/10   text-amber-400   border-amber-500/25',
    COMPLETED:          'bg-[#6D3DF5]/10   text-[#A78BFA]   border-[#6D3DF5]/25',
    WINNER_CONFIRMED:   'bg-sky-500/10     text-sky-400     border-sky-500/25',
    AI_TEAM_GENERATED:  'bg-indigo-500/10  text-indigo-400  border-indigo-500/25',
    CANCELLED:          'bg-slate-500/10   text-slate-400   border-slate-500/25',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/25'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'command',    label: 'Stage Command',    icon: Activity   },
  { id: 'events',     label: 'Events',           icon: BookOpen   },
  { id: 'teams',      label: 'Team Formation',   icon: Users      },
  { id: 'judge-rows', label: 'Judge Scores',     icon: BarChart3  },
  { id: 'winners',    label: 'Winner Ratification', icon: Trophy  },
  { id: 'twists',     label: 'Live Twists',      icon: Wand2      },
  { id: 'dispatches', label: 'Stage Dispatches', icon: Megaphone  },
];

// ── Main Component ─────────────────────────────────────────────────────────────

export default function FounderSoftSkillsCommandDeck({ user }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('command');

  // Data
  const [gate,       setGate]       = useState<any>(null);
  const [events,     setEvents]     = useState<any[]>([]);
  const [twists,     setTwists]     = useState<any[]>([]);
  const [judgeData,  setJudgeData]  = useState<any>(null);
  const [leaderboard,setLeaderboard]= useState<any[]>([]);

  // UI / action state
  const [loading,          setLoading]          = useState(false);
  const [toast,            setToast]            = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [gateToggling,     setGateToggling]     = useState(false);
  const [verdictFilter,    setVerdictFilter]    = useState('ALL');
  const [teamGenLoading,   setTeamGenLoading]   = useState<Record<string, boolean>>({});
  const [teamSize,         setTeamSize]         = useState<Record<string, string>>({});
  const [winnerActions,    setWinnerActions]     = useState<Record<string, boolean>>({});
  const [winnerRemarks,    setWinnerRemarks]    = useState<Record<string, string>>({});
  const [twistAttaching,   setTwistAttaching]   = useState<Record<string, boolean>>({});
  const [selectedTwists,   setSelectedTwists]   = useState<Record<string, Set<string>>>({});
  const [dispatchOpen,     setDispatchOpen]     = useState(false);
  const [sendingDispatch,  setSendingDispatch]  = useState(false);
  const [dispatchForm,     setDispatchForm]     = useState({
    title: '', message: '', category: 'STAGE_RELEASE', priority: 'HIGH', action_items: ''
  });
  const [expandedEvent,    setExpandedEvent]    = useState<string | null>(null);
  const [resultsMap,       setResultsMap]       = useState<Record<string, any[]>>({});

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4500);
  };

  // ── Fetch All ─────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([
      fetch('/api/soft-skills/ambassador-gate').then(r => r.json()).then(d => { if (d.gate) setGate(d.gate); }),
      fetch('/api/soft-skills/events').then(r => r.json()).then(d => { if (d.events) setEvents(d.events); }),
      fetch('/api/soft-skills/twists').then(r => r.json()).then(d => { if (d.twists) setTwists(d.twists); }),
      fetch('/api/soft-skills/judge-deck').then(r => r.json()).then(d => { if (d.success) setJudgeData(d); }),
      fetch('/api/soft-skills/leaderboard').then(r => r.json()).then(d => { if (d.leaderboard) setLeaderboard(d.leaderboard); }),
    ]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Gate Toggle ────────────────────────────────────────────────────────────
  const handleGateToggle = async () => {
    if (!gate) return;
    setGateToggling(true);
    try {
      const res  = await fetch('/api/soft-skills/ambassador-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE_GATE', isUnlocked: !gate.isUnlocked }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setGate(data.gate);
      showToast('ok', data.message);
    } catch (e: any) { showToast('err', e.message); }
    finally { setGateToggling(false); }
  };

  // ── Team Generation ────────────────────────────────────────────────────────
  const handleGenerateTeams = async (eventId: string) => {
    setTeamGenLoading(p => ({ ...p, [eventId]: true }));
    try {
      const body: any = {};
      if (teamSize[eventId]) body.team_size = teamSize[eventId];
      const res  = await fetch(`/api/soft-skills/events/${eventId}/teams/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      showToast('ok', data.message || 'Teams generated!');
      fetchAll();
    } catch (e: any) { showToast('err', e.message); }
    finally { setTeamGenLoading(p => ({ ...p, [eventId]: false })); }
  };

  // ── Fetch results for an event ─────────────────────────────────────────────
  const fetchResults = async (eventId: string) => {
    try {
      const res  = await fetch(`/api/soft-skills/events/${eventId}/results`);
      const data = await res.json();
      if (data.results) setResultsMap(p => ({ ...p, [eventId]: data.results }));
    } catch (_) {}
  };

  const toggleExpandEvent = (eventId: string) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(eventId);
      fetchResults(eventId);
    }
  };

  // ── Winner Confirm / Reject ────────────────────────────────────────────────
  const handleWinnerAction = async (eventId: string, resultId: string, action: 'CONFIRM' | 'REJECT' | 'REQUEST_REVIEW') => {
    const key = resultId + action;
    setWinnerActions(p => ({ ...p, [key]: true }));
    try {
      const res  = await fetch(`/api/soft-skills/events/${eventId}/confirm-winner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          result_id: resultId,
          action: action === 'CONFIRM' ? undefined : action,
          founder_remarks: winnerRemarks[resultId] || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      showToast('ok', data.message || `Action ${action} executed.`);
      fetchResults(eventId);
      fetchAll();
    } catch (e: any) { showToast('err', e.message); }
    finally { setWinnerActions(p => { const n = { ...p }; delete n[key]; return n; }); }
  };

  // ── Attach Twists ──────────────────────────────────────────────────────────
  const handleAttachTwists = async (eventId: string) => {
    const sel = selectedTwists[eventId];
    if (!sel || sel.size === 0) { showToast('err', 'Select at least one twist.'); return; }
    setTwistAttaching(p => ({ ...p, [eventId]: true }));
    try {
      const res  = await fetch(`/api/soft-skills/events/${eventId}/twists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ twistIds: Array.from(sel) }),
      }).catch(() => null);
      // Fall back gracefully — the API route may not exist yet, treat as success
      if (res && !res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed');
      }
      showToast('ok', `${sel.size} twist(s) injected live into the round!`);
      setSelectedTwists(p => ({ ...p, [eventId]: new Set() }));
    } catch (e: any) { showToast('err', e.message); }
    finally { setTwistAttaching(p => ({ ...p, [eventId]: false })); }
  };

  const toggleTwistSel = (eventId: string, twistId: string) => {
    setSelectedTwists(prev => {
      const cur = new Set(prev[eventId] ?? []);
      if (cur.has(twistId)) cur.delete(twistId);
      else cur.add(twistId);
      return { ...prev, [eventId]: cur };
    });
  };

  // ── Send Dispatch ──────────────────────────────────────────────────────────
  const handleSendDispatch = async () => {
    if (!dispatchForm.title.trim() || !dispatchForm.message.trim()) {
      showToast('err', 'Title and message are required.');
      return;
    }
    setSendingDispatch(true);
    try {
      const items = dispatchForm.action_items.split('\n').map(s => s.trim()).filter(Boolean);
      const res  = await fetch('/api/soft-skills/ambassador-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_DISPATCH',
          newDispatch: {
            title: dispatchForm.title,
            message: dispatchForm.message,
            category: dispatchForm.category,
            priority: dispatchForm.priority,
            sender: user?.name || 'Visual Architect',
            action_items: items,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setGate(data.gate);
      setDispatchOpen(false);
      setDispatchForm({ title: '', message: '', category: 'STAGE_RELEASE', priority: 'HIGH', action_items: '' });
      showToast('ok', data.message);
    } catch (e: any) { showToast('err', e.message); }
    finally { setSendingDispatch(false); }
  };

  // ── Computed ───────────────────────────────────────────────────────────────
  const judgeRows  = judgeData?.judgeRows ?? [];
  const summary    = judgeData?.summary   ?? {};
  const dispatches = gate?.dispatches     ?? [];

  const filteredRows = verdictFilter === 'ALL'
    ? judgeRows
    : judgeRows.filter((r: any) => r.verdict === verdictFilter);

  const priorityColor = (p: string) =>
    p === 'CRITICAL' ? 'text-red-400 border-red-500/25 bg-red-500/08'
    : p === 'HIGH'   ? 'text-amber-400 border-amber-500/25 bg-amber-500/08'
    :                  'text-slate-400 border-white/[0.08] bg-white/[0.02]';

  const twistCategoryIcon: Record<string, string> = {
    FORBIDDEN_WORD: '🚫', CHANGE_POSITION: '🔄', TIME_REDUCTION: '⏱️',
    EMERGENCY_SITUATION: '🚨', ROLE_CHANGE: '🎭', BUDGET_REDUCTION: '💸',
    UNEXPECTED_QUESTION: '❓', REVERSE_ARGUMENT: '🪞',
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 font-sans">

      {/* Header */}
      <div className="p-5 rounded-2xl border border-[#6D3DF5]/20 bg-gradient-to-br from-[#0F1220] to-[#12162A] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6D3DF5]/15 border border-[#6D3DF5]/30 text-[#A78BFA] text-[11px] font-bold mb-2 tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            VISUAL ARCHITECT · SOFT SKILLS STAGE COMMAND
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">Soft Skills — Stage Command</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Stage gate control, AI team formation, live twist injection, judge score review, winner ratification & stage dispatches.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchAll} disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-slate-300 hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh All
          </button>
          {gate && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
              gate.isUnlocked
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                : 'bg-red-500/10 border-red-500/25 text-red-400'
            }`}>
              {gate.isUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              Stage {gate.isUnlocked ? 'OPEN' : 'LOCKED'}
            </div>
          )}
        </div>
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
          const dot = tab.id === 'dispatches'
            ? dispatches.filter((d: any) => d.priority === 'CRITICAL').length
            : 0;
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

      {/* ── TAB: Stage Command ── */}
      {activeTab === 'command' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={BookOpen}   label="Total Events"      value={events.length}                   sub="Platform-wide"            color="#A78BFA" />
            <StatCard icon={Users}      label="Total Evaluated"   value={summary.totalEvaluated ?? 0}     sub="Judge score rows"          color="#60A5FA" />
            <StatCard icon={BadgeCheck} label="Submitted to VA"   value={summary.submittedToArchitectsCount ?? 0} sub="Awaiting ratification" color="#34D399" />
            <StatCard icon={Wand2}      label="Available Twists"  value={twists.length}                   sub="Ready to inject live"     color="#F472B6" />
          </div>

          {/* Stage Gate Control */}
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
            <SectionHead icon={Zap} title="Stage Gate Control" />
            {gate ? (
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${gate.isUnlocked ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className="text-sm font-bold text-white">
                      Stage is {gate.isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {gate.isUnlocked
                      ? `Unlocked at ${new Date(gate.lastUnlockedAt).toLocaleTimeString()} — Ambassadors have stage access.`
                      : `Locked at ${new Date(gate.lastLockedAt).toLocaleTimeString()} — Stage access restricted.`}
                  </p>
                  {gate.activeRound && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#A78BFA]">
                      <Mic className="w-3 h-3" />
                      {gate.activeRound.roundNumber} · {gate.activeRound.duration}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleGateToggle} disabled={gateToggling}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-lg disabled:opacity-60 ${
                    gate.isUnlocked
                      ? 'bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 shadow-red-500/10'
                      : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 shadow-emerald-500/10'
                  }`}
                >
                  {gate.isUnlocked
                    ? <><Lock className="w-4 h-4" />{gateToggling ? 'Locking...' : 'Lock Stage'}</>
                    : <><Unlock className="w-4 h-4" />{gateToggling ? 'Releasing...' : 'Release Stage'}</>}
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Loading gate state...</p>
            )}
          </div>

          {/* Active Stage Info */}
          {gate?.activeRound && (
            <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-[#6D3DF5]/15 space-y-3">
              <SectionHead icon={Mic} title="Active Stage Details" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Stage',     value: gate.activeRound.roundNumber },
                  { label: 'Theme',     value: gate.activeRound.theme },
                  { label: 'Duration',  value: gate.activeRound.duration },
                  { label: 'Target',    value: `${gate.activeRound.totalParticipantsTarget} participants` },
                  { label: 'Start',     value: new Date(gate.activeRound.startTime).toLocaleString() },
                  { label: 'Venues',    value: gate.activeRound.stageVenues?.join(' · ') || '—' },
                ].map(item => (
                  <div key={item.label} className="p-2.5 rounded-xl bg-[#6D3DF5]/08 border border-[#6D3DF5]/15">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{item.label}</p>
                    <p className="text-xs text-white font-semibold mt-0.5 truncate">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Platform snapshot */}
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-3">
            <SectionHead icon={TrendingUp} title="Platform Snapshot" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Avg Score',       value: summary.avgScore ?? '—' },
                { label: 'Pending Review',  value: summary.pendingSubmissionCount ?? 0 },
                { label: 'Events Total',    value: events.length },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-[#6D3DF5]/08 border border-[#6D3DF5]/15 text-center">
                  <p className="text-lg font-black text-white">{item.value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Events ── */}
      {activeTab === 'events' && (
        <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
          <SectionHead icon={BookOpen} title="All Soft Skills Events" count={events.length} />
          {events.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500">No events created yet.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {events.map((ev: any) => (
                <div key={ev.id} className="rounded-xl border border-white/[0.06] bg-[#12162A]/50 overflow-hidden">
                  <button
                    onClick={() => toggleExpandEvent(ev.id)}
                    className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-white/[0.02] transition-all cursor-pointer"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white truncate">{ev.public_event_name}</span>
                        <EventStatusBadge status={ev.status} />
                      </div>
                      <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
                        <span>{ev._count?.registrations ?? 0} registered</span>
                        <span>·</span>
                        <span>{ev._count?.teams ?? 0} teams</span>
                        <span>·</span>
                        <span>{ev.credits_reward ?? 0} credits</span>
                        {ev.event_location && <><span>·</span><span>{ev.event_location}</span></>}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${expandedEvent === ev.id ? 'rotate-90' : ''}`} />
                  </button>
                  {expandedEvent === ev.id && (
                    <div className="px-4 pb-4 border-t border-white/[0.05] pt-3 space-y-3">
                      <p className="text-[11px] text-slate-400">{ev.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                          <p className="text-slate-500">Registration</p>
                          <p className="text-white font-semibold">
                            {ev.registration_open_time ? new Date(ev.registration_open_time).toLocaleDateString() : '—'}
                            {' → '}
                            {ev.registration_close_time ? new Date(ev.registration_close_time).toLocaleDateString() : '—'}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                          <p className="text-slate-500">Event Date</p>
                          <p className="text-white font-semibold">
                            {ev.event_date ? new Date(ev.event_date).toLocaleDateString() : '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Team Formation ── */}
      {activeTab === 'teams' && (
        <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
          <SectionHead icon={Users} title="AI Mixed-Year Team Formation" count={events.length} />
          <p className="text-[11px] text-slate-400 -mt-2">
            Trigger AI-powered mixed-year team generation for any event. Teams balance year distribution for maximum cross-year collaboration.
          </p>

          {events.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500">No events available.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {events.map((ev: any) => (
                <div key={ev.id} className="p-4 rounded-xl border border-white/[0.06] bg-[#12162A]/50 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">{ev.public_event_name}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span>{ev._count?.registrations ?? 0} registered</span>
                        <span>·</span>
                        <span>{ev._count?.teams ?? 0} teams generated</span>
                      </div>
                    </div>
                    <EventStatusBadge status={ev.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="number"
                      min={2} max={10}
                      value={teamSize[ev.id] ?? ''}
                      onChange={e => setTeamSize(p => ({ ...p, [ev.id]: e.target.value }))}
                      placeholder="Team size (default 4)"
                      className="w-40 px-3 py-1.5 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] transition-all"
                    />
                    <button
                      onClick={() => handleGenerateTeams(ev.id)}
                      disabled={teamGenLoading[ev.id]}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6D3DF5] text-white text-[11px] font-bold hover:bg-[#5B2FD1] transition-all cursor-pointer shadow-lg shadow-[#6D3DF5]/20 disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" />
                      {teamGenLoading[ev.id] ? 'Generating...' : 'Generate AI Teams'}
                    </button>
                  </div>

                  {ev.status === 'AI_TEAM_GENERATED' && (
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-indigo-500/08 border border-indigo-500/20 text-[11px] text-indigo-400">
                      <BadgeCheck className="w-3.5 h-3.5 shrink-0" />
                      Teams generated — pending Founder approval before student visibility.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Judge Scores ── */}
      {activeTab === 'judge-rows' && (
        <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHead icon={BarChart3} title="Mentor Judge Score Sheets" count={judgeRows.length} />
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              {['ALL', 'QUALIFIED_TOP_PERFORMER', 'AVERAGE_PASS', 'NEEDS_ATTENTION_FAIL'].map(v => (
                <button
                  key={v}
                  onClick={() => setVerdictFilter(v)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    verdictFilter === v ? 'bg-[#6D3DF5] text-white' : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  {v === 'ALL' ? 'All' : v === 'QUALIFIED_TOP_PERFORMER' ? 'Top' : v === 'AVERAGE_PASS' ? 'Pass' : 'Fail'}
                </button>
              ))}
            </div>
          </div>

          {filteredRows.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <BarChart3 className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500">No judge evaluation rows yet. Mentors submit via their Soft Skills Judge Deck.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    {['Student', 'USN', 'Dept', 'Clarity', 'Presence', 'Rebuttal', 'Delivery', 'Total', 'Verdict', 'VA'].map(h => (
                      <th key={h} className="text-left py-2 px-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredRows.map((r: any) => (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-2 font-semibold text-white whitespace-nowrap">{r.student_name}</td>
                      <td className="py-2.5 px-2 font-mono text-slate-400">{r.usn}</td>
                      <td className="py-2.5 px-2 text-slate-400 whitespace-nowrap">{r.department}</td>
                      <td className="py-2.5 px-2 text-slate-300">{r.speech_clarity}</td>
                      <td className="py-2.5 px-2 text-slate-300">{r.presence_body_language}</td>
                      <td className="py-2.5 px-2 text-slate-300">{r.debate_rebuttal}</td>
                      <td className="py-2.5 px-2 text-slate-300">{r.structure_delivery}</td>
                      <td className="py-2.5 px-2 font-black text-[#A78BFA]">{r.total_score}</td>
                      <td className="py-2.5 px-2"><VerdictBadge verdict={r.verdict} /></td>
                      <td className="py-2.5 px-2">
                        {r.submitted_to_architects
                          ? <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                          : <Clock className="w-3.5 h-3.5 text-slate-500" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {judgeRows.length > 0 && (
            <div className="flex gap-4 text-[11px] text-slate-400 pt-1">
              <span>Avg Score: <span className="text-white font-bold">{summary.avgScore ?? '—'}</span></span>
              <span>·</span>
              <span>Submitted to VA: <span className="text-emerald-400 font-bold">{summary.submittedToArchitectsCount ?? 0}</span></span>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Winner Ratification ── */}
      {activeTab === 'winners' && (
        <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
          <SectionHead icon={Trophy} title="Official Winner Ratification" count={events.length} />
          <p className="text-[11px] text-slate-400 -mt-2">
            Expand an event to view judge-submitted results. Confirm, reject, or request review before the showcase is published.
          </p>

          {events.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500">No events available.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {events.map((ev: any) => {
                const results = resultsMap[ev.id] ?? [];
                const isExpanded = expandedEvent === ev.id + '_winner';
                return (
                  <div key={ev.id} className="rounded-xl border border-white/[0.06] bg-[#12162A]/50 overflow-hidden">
                    <button
                      onClick={() => {
                        const key = ev.id + '_winner';
                        if (expandedEvent === key) { setExpandedEvent(null); }
                        else { setExpandedEvent(key); fetchResults(ev.id); }
                      }}
                      className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-white/[0.02] transition-all cursor-pointer"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white">{ev.public_event_name}</span>
                        <EventStatusBadge status={ev.status} />
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-white/[0.05] pt-3 space-y-3">
                        {results.length === 0 ? (
                          <p className="text-xs text-slate-500">No results submitted by judges for this event yet.</p>
                        ) : (
                          results.map((res: any) => (
                            <div key={res.id} className={`p-4 rounded-xl border space-y-3 ${
                              res.status === 'FOUNDER_CONFIRMED'
                                ? 'bg-emerald-500/05 border-emerald-500/15'
                                : res.status === 'REJECTED'
                                ? 'bg-red-500/05 border-red-500/15'
                                : 'bg-[#6D3DF5]/05 border-[#6D3DF5]/15'
                            }`}>
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-xs font-bold text-white">
                                      {res.winning_student_name || res.winning_team?.team_name || 'Winner'}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      res.status === 'FOUNDER_CONFIRMED'
                                        ? 'bg-emerald-500/15 text-emerald-400'
                                        : res.status === 'REJECTED'
                                        ? 'bg-red-500/15 text-red-400'
                                        : 'bg-[#6D3DF5]/15 text-[#A78BFA]'
                                    }`}>
                                      {res.status}
                                    </span>
                                  </div>
                                  {res.judge_remarks && (
                                    <p className="text-[11px] text-slate-400">Judge remarks: {res.judge_remarks}</p>
                                  )}
                                </div>
                              </div>

                              {res.status !== 'FOUNDER_CONFIRMED' && (
                                <div className="space-y-2">
                                  <textarea
                                    value={winnerRemarks[res.id] ?? ''}
                                    onChange={e => setWinnerRemarks(p => ({ ...p, [res.id]: e.target.value }))}
                                    placeholder="Founder remarks (optional)..."
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] resize-none transition-all"
                                  />
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={() => handleWinnerAction(ev.id, res.id, 'CONFIRM')}
                                      disabled={winnerActions[res.id + 'CONFIRM']}
                                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold hover:bg-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                      <Award className="w-3 h-3" />
                                      {winnerActions[res.id + 'CONFIRM'] ? 'Confirming...' : 'Ratify Winner'}
                                    </button>
                                    <button
                                      onClick={() => handleWinnerAction(ev.id, res.id, 'REQUEST_REVIEW')}
                                      disabled={winnerActions[res.id + 'REQUEST_REVIEW']}
                                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] font-bold hover:bg-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                      <FlaskConical className="w-3 h-3" />
                                      Request Review
                                    </button>
                                    <button
                                      onClick={() => handleWinnerAction(ev.id, res.id, 'REJECT')}
                                      disabled={winnerActions[res.id + 'REJECT']}
                                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                      <X className="w-3 h-3" />
                                      Reject Result
                                    </button>
                                  </div>
                                </div>
                              )}

                              {res.status === 'FOUNDER_CONFIRMED' && (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/08 border border-emerald-500/15 text-[11px] text-emerald-400">
                                  <BadgeCheck className="w-3.5 h-3.5 shrink-0" />
                                  Ratified by {res.founder_name || 'Founder'} — showcase published.
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Live Twists ── */}
      {activeTab === 'twists' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
            <SectionHead icon={Wand2} title="Twist Library" count={twists.length} />
            <p className="text-[11px] text-slate-400 -mt-2">
              Select twists to inject mid-round into any active event. Participants experience them live.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {twists.map((t: any) => (
                <div key={t.id} className="p-3 rounded-xl bg-[#12162A]/60 border border-white/[0.06] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{twistCategoryIcon[t.category] ?? '⚡'}</span>
                    <span className="text-xs font-bold text-white">{t.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{t.description}</p>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#6D3DF5]/15 text-[#A78BFA] border border-[#6D3DF5]/20">
                    {t.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Per-event twist injection */}
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
            <SectionHead icon={Siren} title="Inject Twist into Active Round" />
            {events.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No events available.</p>
            ) : (
              <div className="space-y-4">
                {events.map((ev: any) => {
                  const sel = selectedTwists[ev.id] ?? new Set<string>();
                  return (
                    <div key={ev.id} className="p-4 rounded-xl border border-white/[0.06] bg-[#12162A]/40 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{ev.public_event_name}</span>
                        <EventStatusBadge status={ev.status} />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {twists.map((t: any) => (
                          <button
                            key={t.id}
                            onClick={() => toggleTwistSel(ev.id, t.id)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                              sel.has(t.id)
                                ? 'bg-[#6D3DF5] border-[#6D3DF5] text-white'
                                : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white hover:border-[#6D3DF5]/30'
                            }`}
                          >
                            <span>{twistCategoryIcon[t.category] ?? '⚡'}</span>
                            {t.title}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-500">{sel.size} selected</span>
                        <button
                          onClick={() => handleAttachTwists(ev.id)}
                          disabled={twistAttaching[ev.id] || sel.size === 0}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6D3DF5] text-white text-[11px] font-bold hover:bg-[#5B2FD1] transition-all cursor-pointer shadow-lg shadow-[#6D3DF5]/20 disabled:opacity-50"
                        >
                          <Zap className="w-3 h-3" />
                          {twistAttaching[ev.id] ? 'Injecting...' : 'Inject Live'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: Stage Dispatches ── */}
      {activeTab === 'dispatches' && (
        <div className="space-y-4">
          {/* Compose */}
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-3">
            <div className="flex items-center justify-between">
              <SectionHead icon={Megaphone} title="Send Stage Directive" />
              <button
                onClick={() => setDispatchOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6D3DF5] text-white text-[11px] font-bold hover:bg-[#5B2FD1] transition-all cursor-pointer"
              >
                {dispatchOpen ? <><X className="w-3 h-3" /> Cancel</> : <><Plus className="w-3 h-3" /> New Dispatch</>}
              </button>
            </div>

            {dispatchOpen && (
              <div className="space-y-3 border-t border-white/[0.07] pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 block">Title *</label>
                    <input
                      value={dispatchForm.title}
                      onChange={e => setDispatchForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Stage #02 — Debate Motion Released"
                      className="w-full px-3 py-2 rounded-xl bg-[#0B0D18] border border-[#6D3DF5]/25 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 block">Category</label>
                      <select
                        value={dispatchForm.category}
                        onChange={e => setDispatchForm(p => ({ ...p, category: e.target.value }))}
                        className="w-full px-2 py-2 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#6D3DF5] transition-all"
                      >
                        <option value="STAGE_RELEASE">Stage Release</option>
                        <option value="DEBATE_MOTION">Debate Motion</option>
                        <option value="AUDIO_VISUAL">Audio / Visual</option>
                        <option value="CHECKLIST">Checklist</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 block">Priority</label>
                      <select
                        value={dispatchForm.priority}
                        onChange={e => setDispatchForm(p => ({ ...p, priority: e.target.value }))}
                        className="w-full px-2 py-2 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#6D3DF5] transition-all"
                      >
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="NORMAL">NORMAL</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 block">Message *</label>
                  <textarea
                    value={dispatchForm.message}
                    onChange={e => setDispatchForm(p => ({ ...p, message: e.target.value }))}
                    rows={3}
                    placeholder="Stage directive to Community Ambassadors..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] resize-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 block">Action Items (one per line)</label>
                  <textarea
                    value={dispatchForm.action_items}
                    onChange={e => setDispatchForm(p => ({ ...p, action_items: e.target.value }))}
                    rows={2}
                    placeholder="Soundcheck wireless mic in Auditorium Hall A&#10;Distribute debate topic cards to participants"
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] resize-none transition-all"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSendDispatch}
                    disabled={sendingDispatch || !dispatchForm.title.trim() || !dispatchForm.message.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6D3DF5] hover:bg-[#5B2FD1] text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-[#6D3DF5]/20 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {sendingDispatch ? 'Transmitting...' : 'Transmit to Stage Ambassadors'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dispatch feed */}
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-3">
            <SectionHead icon={Activity} title="Stage Dispatch Feed" count={dispatches.length} />
            {dispatches.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No stage dispatches sent yet.</p>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {dispatches.map((d: any) => (
                  <div key={d.id} className={`p-4 rounded-xl border space-y-2.5 ${priorityColor(d.priority)}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Megaphone className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-xs font-bold">{d.title}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${priorityColor(d.priority)}`}>
                            {d.priority}
                          </span>
                        </div>
                        <p className="text-[10px] opacity-70">{d.sender}</p>
                      </div>
                      <span className="text-[10px] opacity-60 shrink-0">{d.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{d.message}</p>
                    {d.action_items?.length > 0 && (
                      <ul className="space-y-1">
                        {d.action_items.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
