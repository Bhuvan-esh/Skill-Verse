'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock, Unlock, Key, ArrowLeft, RefreshCw, Send, CheckCircle2,
  AlertTriangle, ShieldCheck, Clock, Users, Terminal, Sparkles,
  Radio, FileText, CheckSquare, Square, Layers, Zap, Info
} from 'lucide-react';
import LockedWaitingForKey from '@/components/events/LockedWaitingForKey';

interface Props {
  user?: any;
  onBack?: () => void;
}

export default function CommunityAmbassadorCodingView({ user, onBack }: Props) {
  const [gateState, setGateState] = useState<any>({
    isUnlocked: true, // Demo Mode: Access granted by Visual Architects
    lastLockedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    lastUnlockedAt: new Date().toISOString(),
    governingCouncil: 'Visual Architects (The 7 Founders)',
    activeRound: {
      roundNumber: 'Round #02 · Algorithmic Sprint 2026',
      theme: 'Distributed Concurrency & Ring Buffers',
      startTime: new Date().toISOString(),
      duration: '90 Minutes',
      totalParticipantsTarget: 120,
      labVenues: ['CSE Lab 04', 'AIML Innovation Center', 'ISE Server Room B'],
    },
    dispatches: [
      {
        id: 'disp-1',
        title: 'Official Round #02 Directives & Test Harness Released',
        sender: 'Visual Architect Governance Council (Alex & Founders)',
        category: 'ROUND_RELEASE',
        message: 'The concurrency challenge repository and test runner suite has been signed off. Please verify local terminal compilers in CSE Lab 04 and unlock participant seating.',
        timestamp: 'Today at 07:45 PM',
        priority: 'CRITICAL',
        action_items: [
          'Verify high-speed LAN ethernet links in CSE Lab 04',
          'Distribute participant badge cards & USN seat assignments',
          'Ensure test runner daemon port 4000 is open on local cluster',
        ],
      },
      {
        id: 'disp-2',
        title: 'Automated Test Assertions Matrix & Latency Thresholds',
        sender: 'Visual Architect Lead (Founder #1)',
        category: 'TEST_PARAMETERS',
        message: 'All test benchmarks must execute under 5.0ms. Timeout exceptions will be automatically flagged for Mentor Judge inspection.',
        timestamp: 'Today at 08:10 PM',
        priority: 'HIGH',
        action_items: [
          'Monitor live telemetry for timeout spikes (>8.0ms)',
          'Flag concurrency deadlocks to on-duty Mentor Judges',
        ],
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    item1: true,
    item2: true,
    item3: false,
    item4: false,
  });
  const [newDispatchText, setNewDispatchText] = useState('');
  const [isSendingDispatch, setIsSendingDispatch] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const isVisualArchitect = user?.role === 'FOUNDER';

  const fetchGateState = async () => {
    try {
      const res = await fetch('/api/coding/ambassador-gate');
      const data = await res.json();
      if (data.success && data.gate) {
        setGateState(data.gate);
      }
    } catch (err) {
      console.warn('Failed to fetch gate state:', err);
    }
  };

  useEffect(() => {
    fetchGateState();
    // Auto-poll every 4 seconds so when Visual Architects release the key from their portal, it opens automatically here!
    const interval = setInterval(fetchGateState, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleGate = async (targetUnlocked?: boolean) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/coding/ambassador-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TOGGLE_GATE',
          isUnlocked: targetUnlocked !== undefined ? targetUnlocked : !gateState.isUnlocked,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGateState(data.gate);
        setNotification(data.message);
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err: any) {
      console.error('Failed to toggle gate:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendDispatch = async () => {
    if (!newDispatchText.trim()) return;
    setIsSendingDispatch(true);
    try {
      const res = await fetch('/api/coding/ambassador-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_DISPATCH',
          newDispatch: {
            title: 'Visual Architect Operational Directive',
            sender: user?.name ? `Visual Architect (${user.name})` : 'Visual Architect Governance Council',
            message: newDispatchText.trim(),
            priority: 'HIGH',
            action_items: ['Acknowledge received directive on ambassador console'],
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGateState(data.gate);
        setNewDispatchText('');
        setNotification('Directive broadcasted to Community Ambassadors!');
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err: any) {
      console.error('Failed to send dispatch:', err);
    } finally {
      setIsSendingDispatch(false);
    }
  };

  const toggleChecklistItem = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatTime = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' on ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // =========================================================================
  // 1. LOCKED STATE (When Visual Architects have NOT given access)
  // Shows ONLY the Locked Screen without any extraneous controller bars
  // =========================================================================
  if (!gateState.isUnlocked) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        {/* If user is a Visual Architect (Founder), allow releasing the key */}
        {isVisualArchitect && (
          <div className="w-full max-w-xl mb-4 p-3 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-between">
            <span className="text-xs font-mono text-purple-300 font-bold">
              👑 Founder Control: Release Key for Ambassadors
            </span>
            <button
              onClick={() => handleToggleGate(true)}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Release Key 🔑</span>
            </button>
          </div>
        )}

        <LockedWaitingForKey
          backHref="/horizon"
          customPillarTitle="Coding Challenge · Community Ambassador"
        />
      </div>
    );
  }

  // =========================================================================
  // 2. UNLOCKED LIVE PLATFORM (When Visual Architects HAVE given access)
  // Shows ONLY the Open Challenge Hub and NEVER the locked screen
  // =========================================================================
  return (
    <div className="w-full space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* Visual Architect Founder Quick Bar (Only visible when unlocked) */}
      {isVisualArchitect && (
        <div className="glass-panel p-3.5 rounded-2xl border border-purple-500/30 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs font-mono text-emerald-400 font-bold flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Platform Live & Unlocked for Community Ambassadors</span>
          </span>
          <button
            onClick={() => handleToggleGate(false)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold transition-all flex items-center space-x-1 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Access 🔒</span>
          </button>
        </div>
      )}

      {/* Live Toast Notification */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold flex items-center space-x-2 animate-in fade-in duration-200">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Live Round Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest font-bold">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>LIVE ROUND UNLOCKED BY VISUAL ARCHITECTS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {gateState.activeRound.roundNumber}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Theme: <strong className="text-emerald-300">{gateState.activeRound.theme}</strong> • Duration: {gateState.activeRound.duration}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-300">
              ⏱️ Unlocked at {formatTime(gateState.lastUnlockedAt)}
            </span>
          </div>
        </div>

        {/* Quick Venue Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          <span className="text-xs font-mono text-slate-400">Designated Venues:</span>
          {gateState.activeRound.labVenues.map((v: string) => (
            <span key={v} className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
              📍 {v}
            </span>
          ))}
        </div>
      </div>

      {/* 2-Column Content Grid: Dispatches & Operational Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Visual Architect Directives & Dispatches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Visual Architect Dispatches & Directives</span>
              </h3>
              <span className="text-xs font-mono text-purple-300">
                {gateState.dispatches.length} Directives Active
              </span>
            </div>

            <div className="space-y-3">
              {gateState.dispatches.map((disp: any) => (
                <div
                  key={disp.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/20 space-y-2.5 shadow-md"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      disp.priority === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {disp.priority} PRIORITY
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{disp.timestamp}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{disp.title}</h4>
                    <p className="text-[11px] text-purple-300 font-mono">From: {disp.sender}</p>
                  </div>

                  <p className="text-xs text-slate-200 font-sans leading-relaxed">
                    {disp.message}
                  </p>

                  {disp.action_items && disp.action_items.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs font-mono text-slate-300">
                      <span className="text-[10px] text-amber-400 font-bold uppercase block">Required Actions:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                        {disp.action_items.map((item: string, idx: number) => (
                          <li key={idx} className="text-slate-300">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Broadcast Directive to Ambassadors Input Box */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-xs font-mono text-slate-400 block font-bold">
                Transmit Additional Operational Directive:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type operational guidance..."
                  value={newDispatchText}
                  onChange={(e) => setNewDispatchText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
                <button
                  onClick={handleSendDispatch}
                  disabled={isSendingDispatch || !newDispatchText.trim()}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ambassador On-Ground Checklist */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Ambassador Checklist</span>
              </h3>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div
                onClick={() => toggleChecklistItem('item1')}
                className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center space-x-2.5 cursor-pointer hover:bg-white/5 transition-colors"
              >
                {checklist.item1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span className={checklist.item1 ? 'line-through text-slate-500' : 'text-white'}>
                  Verify CSE Lab 04 Gigabit LAN Connections
                </span>
              </div>

              <div
                onClick={() => toggleChecklistItem('item2')}
                className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center space-x-2.5 cursor-pointer hover:bg-white/5 transition-colors"
              >
                {checklist.item2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span className={checklist.item2 ? 'line-through text-slate-500' : 'text-white'}>
                  Check Participant USN Identity Badges
                </span>
              </div>

              <div
                onClick={() => toggleChecklistItem('item3')}
                className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center space-x-2.5 cursor-pointer hover:bg-white/5 transition-colors"
              >
                {checklist.item3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span className={checklist.item3 ? 'line-through text-slate-500' : 'text-white'}>
                  Start Live Telemetry Test Runner Daemon
                </span>
              </div>

              <div
                onClick={() => toggleChecklistItem('item4')}
                className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center space-x-2.5 cursor-pointer hover:bg-white/5 transition-colors"
              >
                {checklist.item4 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span className={checklist.item4 ? 'line-through text-slate-500' : 'text-white'}>
                  Notify Mentor Judges for Score Submissions
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs font-mono text-emerald-300 space-y-1">
              <span className="font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>On-Ground Lead Operational Status</span>
              </span>
              <p className="text-[11px] text-slate-300 font-sans">
                All terminal test runners report nominal heartbeat latency (&lt;2ms).
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
