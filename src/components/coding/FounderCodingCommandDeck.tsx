'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck, RefreshCw, Sparkles, CheckCircle2, AlertTriangle,
  Lock, Unlock, Zap, Trophy, Users, BarChart3, Send, ChevronDown,
  ChevronUp, Terminal, Flag, Star, Activity, Clock, Megaphone,
  Filter, Eye, TrendingUp, Award, BadgeCheck, AlertCircle, Plus, X
} from 'lucide-react';

interface Props {
  user: any;
  onBack?: () => void;
}

type Tab = 'command' | 'judge-rows' | 'leaderboard' | 'team-release' | 'dispatches';

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
  const map: Record<string, string> = {
    QUALIFIED_TOP_PERFORMER:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    AVERAGE_PASS:             'bg-amber-500/10  text-amber-400  border-amber-500/25',
    NEEDS_ATTENTION_FAIL:     'bg-red-500/10    text-red-400    border-red-500/25',
  };
  const label: Record<string, string> = {
    QUALIFIED_TOP_PERFORMER: 'Top Performer',
    AVERAGE_PASS:            'Average Pass',
    NEEDS_ATTENTION_FAIL:    'Needs Attention',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${map[verdict] || 'bg-slate-500/10 text-slate-400 border-slate-500/25'}`}>
      {label[verdict] || verdict}
    </span>
  );
}

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'command',      label: 'Command Centre', icon: Terminal    },
  { id: 'judge-rows',  label: 'Judge Spreadsheet', icon: BarChart3 },
  { id: 'leaderboard', label: 'Leaderboard',     icon: Trophy      },
  { id: 'team-release',label: 'Team Release',    icon: Users       },
  { id: 'dispatches',  label: 'Dispatches',      icon: Megaphone   },
];

// ── Main Component ─────────────────────────────────────────────────────────────

export default function FounderCodingCommandDeck({ user }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('command');

  // Data
  const [gate,       setGate]       = useState<any>(null);
  const [judgeData,  setJudgeData]  = useState<any>(null);
  const [leaderboard,setLeaderboard]= useState<any[]>([]);
  const [teamEvents, setTeamEvents] = useState<any[]>([]);

  // UI
  const [loading,        setLoading]        = useState(false);
  const [toast,          setToast]          = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [gateToggling,   setGateToggling]   = useState(false);
  const [lbFrozen,       setLbFrozen]       = useState(false);
  const [verdictFilter,  setVerdictFilter]  = useState('ALL');
  const [teamActions,    setTeamActions]    = useState<Record<string, boolean>>({});
  const [dispatchOpen,   setDispatchOpen]   = useState(false);
  const [dispatchForm,   setDispatchForm]   = useState({
    title: '', message: '', category: 'ROUND_RELEASE', priority: 'HIGH', action_items: ''
  });
  const [sendingDispatch, setSendingDispatch] = useState(false);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4500);
  };

  // ── Fetchers ───────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([
      fetch('/api/coding/ambassador-gate').then(r => r.json()).then(d => { if (d.gate) setGate(d.gate); }),
      fetch('/api/coding/judge-deck').then(r => r.json()).then(d => { if (d.success) setJudgeData(d); }),
      fetch('/api/coding/leaderboard').then(r => r.json()).then(d => { if (d.entries) setLeaderboard(d.entries); }),
      fetch('/api/coding/team-release').then(r => r.json()).then(d => { if (d.events) setTeamEvents(d.events); }),
    ]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Gate Toggle ────────────────────────────────────────────────────────────
  const handleGateToggle = async () => {
    if (!gate) return;
    setGateToggling(true);
    try {
      const res  = await fetch('/api/coding/ambassador-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE_GATE', isUnlocked: !gate.isUnlocked }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setGate(data.gate);
      showToast('ok', data.message);
    } catch (e: any) {
      showToast('err', e.message);
    } finally {
      setGateToggling(false);
    }
  };

  // ── Send Dispatch ──────────────────────────────────────────────────────────
  const handleSendDispatch = async () => {
    if (!dispatchForm.title.trim() || !dispatchForm.message.trim()) {
      showToast('err', 'Title and message are required.');
      return;
    }
    setSendingDispatch(true);
    try {
      const items = dispatchForm.action_items
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      const res  = await fetch('/api/coding/ambassador-gate', {
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
      setDispatchForm({ title: '', message: '', category: 'ROUND_RELEASE', priority: 'HIGH', action_items: '' });
      showToast('ok', data.message);
    } catch (e: any) {
      showToast('err', e.message);
    } finally {
      setSendingDispatch(false);
    }
  };

  // ── Team Release / Revoke / Generate ──────────────────────────────────────
  const handleTeamAction = async (eventId: string, action: 'RELEASE' | 'REVOKE' | 'GENERATE') => {
    setTeamActions(p => ({ ...p, [eventId + action]: true }));
    try {
      const res  = await fetch('/api/coding/team-release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      showToast('ok', data.message);
      // refresh team events
      const fresh = await fetch('/api/coding/team-release').then(r => r.json());
      if (fresh.events) setTeamEvents(fresh.events);
    } catch (e: any) {
      showToast('err', e.message);
    } finally {
      setTeamActions(p => { const n = { ...p }; delete n[eventId + action]; return n; });
    }
  };

  // ── Leaderboard freeze (in-memory UI state) ────────────────────────────────
  const toggleFreeze = () => {
    setLbFrozen(f => !f);
    showToast('ok', lbFrozen ? 'Leaderboard unfrozen — live updates resumed.' : 'Leaderboard frozen — scores locked.');
  };

  // ── Computed ───────────────────────────────────────────────────────────────
  const judgeRows   = judgeData?.judgeRows         ?? [];
  const summary     = judgeData?.summary           ?? {};
  const dispatches  = gate?.dispatches             ?? [];
  const submittedRows = judgeRows.filter((r: any) => r.submitted_to_architects);

  const filteredRows = verdictFilter === 'ALL'
    ? judgeRows
    : judgeRows.filter((r: any) => r.verdict === verdictFilter);

  const priorityColor = (p: string) =>
    p === 'CRITICAL' ? 'text-red-400 border-red-500/25 bg-red-500/10'
    : p === 'HIGH'   ? 'text-amber-400 border-amber-500/25 bg-amber-500/10'
    :                  'text-slate-400 border-white/10 bg-white/[0.03]';

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 font-sans">

      {/* Header */}
      <div className="p-5 rounded-2xl border border-[#6D3DF5]/20 bg-gradient-to-br from-[#0F1220] to-[#12162A] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6D3DF5]/15 border border-[#6D3DF5]/30 text-[#A78BFA] text-[11px] font-bold mb-2 tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            VISUAL ARCHITECT · CODING CHALLENGE COMMAND DECK
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">Coding Challenge — Command Deck</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gate control, judge verdicts review, leaderboard governance, team release, and ambassador dispatches.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-slate-300 hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh All
          </button>

          {/* Live Gate Status pill */}
          {gate && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
              gate.isUnlocked
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                : 'bg-red-500/10 border-red-500/25 text-red-400'
            }`}>
              {gate.isUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              Gate {gate.isUnlocked ? 'OPEN' : 'LOCKED'}
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
          const dot = tab.id === 'dispatches' ? dispatches.filter((d: any) => d.priority === 'CRITICAL').length : 0;
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

      {/* ── TAB: Command Centre ── */}
      {activeTab === 'command' && (
        <div className="space-y-4">
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={BarChart3}  label="Total Evaluated"    value={summary.totalEvaluated ?? 0}         sub="Mentor judge rows"         color="#A78BFA" />
            <StatCard icon={BadgeCheck} label="Submitted to VA"    value={summary.submittedToArchitectsCount ?? 0} sub="Cleared by mentors"     color="#34D399" />
            <StatCard icon={AlertCircle}label="Pending Submission" value={summary.pendingSubmissionCount ?? 0}  sub="Awaiting mentor sign-off" color="#FBBF24" />
            <StatCard icon={Trophy}     label="Avg Accuracy"       value={summary.avgAccuracy ?? '—'}           sub="Across all submissions"   color="#60A5FA" />
          </div>

          {/* Gate Control */}
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
            <SectionHead icon={Zap} title="Platform Gate Control" />
            {gate ? (
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${gate.isUnlocked ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className="text-sm font-bold text-white">
                      Gate is currently {gate.isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {gate.isUnlocked
                      ? `Unlocked at ${new Date(gate.lastUnlockedAt).toLocaleTimeString()} — Ambassadors have access.`
                      : `Locked at ${new Date(gate.lastLockedAt).toLocaleTimeString()} — Platform access restricted.`}
                  </p>
                  {gate.activeRound && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#A78BFA]">
                      <Activity className="w-3 h-3" />
                      {gate.activeRound.roundNumber} · {gate.activeRound.duration}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleGateToggle}
                  disabled={gateToggling}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-lg disabled:opacity-60 ${
                    gate.isUnlocked
                      ? 'bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 shadow-red-500/10'
                      : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 shadow-emerald-500/10'
                  }`}
                >
                  {gate.isUnlocked
                    ? <><Lock className="w-4 h-4" />{gateToggling ? 'Locking...' : 'Lock Platform'}</>
                    : <><Unlock className="w-4 h-4" />{gateToggling ? 'Unlocking...' : 'Release Key'}</>}
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Loading gate state...</p>
            )}
          </div>

          {/* Active Round Info */}
          {gate?.activeRound && (
            <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-[#6D3DF5]/15 space-y-3">
              <SectionHead icon={Terminal} title="Active Round Details" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Round',       value: gate.activeRound.roundNumber },
                  { label: 'Theme',       value: gate.activeRound.theme },
                  { label: 'Duration',    value: gate.activeRound.duration },
                  { label: 'Target',      value: `${gate.activeRound.totalParticipantsTarget} participants` },
                  { label: 'Start Time',  value: new Date(gate.activeRound.startTime).toLocaleString() },
                  { label: 'Venues',      value: gate.activeRound.labVenues?.join(' · ') || '—' },
                ].map(item => (
                  <div key={item.label} className="p-2.5 rounded-xl bg-[#6D3DF5]/08 border border-[#6D3DF5]/15">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{item.label}</p>
                    <p className="text-xs text-white font-semibold mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick leaderboard freeze */}
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] flex items-center justify-between gap-4">
            <div>
              <SectionHead icon={Trophy} title="Leaderboard Control" />
              <p className="text-[11px] text-slate-400 -mt-2">
                {lbFrozen
                  ? 'Leaderboard is FROZEN — scores are locked, no new updates.'
                  : 'Leaderboard is LIVE — scores update in real time.'}
              </p>
            </div>
            <button
              onClick={toggleFreeze}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                lbFrozen
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-[#6D3DF5]/15 border-[#6D3DF5]/25 text-[#A78BFA] hover:bg-[#6D3DF5]/25'
              }`}
            >
              {lbFrozen ? <><Unlock className="w-3.5 h-3.5" /> Unfreeze</> : <><Lock className="w-3.5 h-3.5" /> Freeze</>}
            </button>
          </div>
        </div>
      )}

      {/* ── TAB: Judge Spreadsheet ── */}
      {activeTab === 'judge-rows' && (
        <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHead icon={BarChart3} title="Mentor Judge Evaluations" count={judgeRows.length} />
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              {['ALL', 'QUALIFIED_TOP_PERFORMER', 'AVERAGE_PASS', 'NEEDS_ATTENTION_FAIL'].map(v => (
                <button
                  key={v}
                  onClick={() => setVerdictFilter(v)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    verdictFilter === v
                      ? 'bg-[#6D3DF5] text-white'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  {v === 'ALL' ? 'All' : v === 'QUALIFIED_TOP_PERFORMER' ? 'Top' : v === 'AVERAGE_PASS' ? 'Pass' : 'Fail'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3 text-emerald-400" />{submittedRows.length} submitted to VA</span>
            <span>·</span>
            <span>Avg exec: {summary.avgExecutionTime ?? '—'}</span>
          </div>

          {filteredRows.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500">No evaluation rows yet. Mentors submit via their Judge Deck.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    {['Student', 'USN', 'Dept', 'Accuracy', 'Exec (ms)', 'Score', 'Verdict', 'Submitted'].map(h => (
                      <th key={h} className="text-left py-2 px-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredRows.map((r: any) => (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-2 font-semibold text-white">{r.student_name}</td>
                      <td className="py-2.5 px-2 font-mono text-slate-400">{r.usn}</td>
                      <td className="py-2.5 px-2 text-slate-400">{r.department}</td>
                      <td className="py-2.5 px-2">
                        <span className={`font-bold ${r.test_accuracy >= 80 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {r.test_accuracy}%
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-slate-300">{r.execution_time_ms}ms</td>
                      <td className="py-2.5 px-2 font-bold text-[#A78BFA]">{r.total_score}</td>
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
            <div className="p-3 rounded-xl bg-[#6D3DF5]/08 border border-[#6D3DF5]/15 flex items-center gap-2 text-[11px] text-[#A78BFA]">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              AI Anti-Cheat: All submissions are automatically scanned for code similarity and suspicious execution spikes before being surfaced here.
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Leaderboard ── */}
      {activeTab === 'leaderboard' && (
        <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
          <div className="flex items-center justify-between">
            <SectionHead icon={Trophy} title="Coding Leaderboard" count={leaderboard.length} />
            <div className="flex items-center gap-2">
              {lbFrozen && (
                <span className="px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> FROZEN
                </span>
              )}
              <button
                onClick={toggleFreeze}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                  lbFrozen
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-[#6D3DF5]/15 border-[#6D3DF5]/25 text-[#A78BFA] hover:bg-[#6D3DF5]/25'
                }`}
              >
                {lbFrozen ? <><Unlock className="w-3 h-3" /> Unfreeze</> : <><Lock className="w-3 h-3" /> Freeze</>}
              </button>
            </div>
          </div>

          {leaderboard.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-10">No leaderboard entries yet.</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {leaderboard.map((entry: any, idx: number) => (
                <div key={entry.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#12162A]/60 border border-white/[0.05] hover:border-[#6D3DF5]/20 transition-all">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    idx === 0 ? 'bg-amber-500 text-black' :
                    idx === 1 ? 'bg-slate-400 text-black' :
                    idx === 2 ? 'bg-orange-700 text-white' :
                    'bg-[#6D3DF5]/20 text-[#A78BFA]'
                  }`}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{entry.student?.name || 'Student'}</p>
                    <p className="text-[11px] text-slate-400">{entry.student?.usn} · {entry.wins ?? 0} wins · {entry.competitions_count ?? 0} contests</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-black text-[#A78BFA]">{entry.points} pts</p>
                    <p className="text-[11px] text-slate-500">{entry.credits ?? 0} credits</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Team Release ── */}
      {activeTab === 'team-release' && (
        <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-4">
          <SectionHead icon={Users} title="Team Release Control" count={teamEvents.length} />
          <p className="text-[11px] text-slate-400 -mt-2">
            Generate AI-balanced teams, release them to students, or revoke visibility per event.
          </p>

          {teamEvents.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500">No team-based coding events found.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {teamEvents.map((ev: any) => (
                <div key={ev.id} className="p-4 rounded-xl border border-white/[0.07] bg-[#12162A]/50 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">{ev.title}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span>{ev._count?.registrations ?? 0} registered</span>
                        <span>·</span>
                        <span>{ev._count?.teams ?? 0} teams</span>
                        {ev.team_department && <span>· {ev.team_department}</span>}
                      </div>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      ev.team_release_status === 'RELEASED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25'
                    }`}>
                      {ev.team_release_status || 'PENDING'}
                    </span>
                  </div>
                  {ev.team_release_time && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Released: {new Date(ev.team_release_time).toLocaleString()}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleTeamAction(ev.id, 'GENERATE')}
                      disabled={!!teamActions[ev.id + 'GENERATE']}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6D3DF5]/15 border border-[#6D3DF5]/25 text-[#A78BFA] text-[11px] font-semibold hover:bg-[#6D3DF5]/25 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" />
                      {teamActions[ev.id + 'GENERATE'] ? 'Generating...' : 'Generate Teams'}
                    </button>
                    {ev.team_release_status !== 'RELEASED' ? (
                      <button
                        onClick={() => handleTeamAction(ev.id, 'RELEASE')}
                        disabled={!!teamActions[ev.id + 'RELEASE']}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold hover:bg-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Unlock className="w-3 h-3" />
                        {teamActions[ev.id + 'RELEASE'] ? 'Releasing...' : 'Release to Students'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleTeamAction(ev.id, 'REVOKE')}
                        disabled={!!teamActions[ev.id + 'REVOKE']}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-semibold hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Lock className="w-3 h-3" />
                        {teamActions[ev.id + 'REVOKE'] ? 'Revoking...' : 'Revoke Release'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Dispatches ── */}
      {activeTab === 'dispatches' && (
        <div className="space-y-4">
          {/* Compose form */}
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-3">
            <div className="flex items-center justify-between">
              <SectionHead icon={Megaphone} title="Send Directive to Ambassadors" />
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
                      placeholder="e.g. Round #03 Release — Sorting Sprint"
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
                        <option value="ROUND_RELEASE">Round Release</option>
                        <option value="TEST_PARAMETERS">Test Parameters</option>
                        <option value="EMERGENCY_INSTRUCTION">Emergency</option>
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
                    placeholder="Directive message to Community Ambassadors..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] resize-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 block">Action Items (one per line)</label>
                  <textarea
                    value={dispatchForm.action_items}
                    onChange={e => setDispatchForm(p => ({ ...p, action_items: e.target.value }))}
                    rows={2}
                    placeholder="Verify LAN connections in Lab 04&#10;Distribute badge cards to participants"
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
                    {sendingDispatch ? 'Transmitting...' : 'Transmit to All Ambassadors'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dispatch feed */}
          <div className="p-5 rounded-2xl bg-[#0F1220]/90 border border-white/[0.07] space-y-3">
            <SectionHead icon={Activity} title="Dispatch Feed" count={dispatches.length} />
            {dispatches.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No dispatches sent yet.</p>
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
