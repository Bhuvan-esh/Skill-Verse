'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Users, Award, AlertCircle, XCircle, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

interface CompetitionsSectionProps {
  user: any;
  onRefresh: () => void;
}

export default function CompetitionsSection({ user, onRefresh }: CompetitionsSectionProps) {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [actionErr, setActionErr] = useState('');

  // Cancellation Modal state
  const [cancelComp, setCancelComp] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('');

  const fetchCompetitions = async () => {
    try {
      const res = await fetch('/api/competitions');
      const data = await res.json();
      if (res.ok) {
        setCompetitions(data.competitions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleRegister = async (compId: string) => {
    setActionMsg('');
    setActionErr('');
    try {
      const res = await fetch(`/api/competitions/${compId}/register`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionMsg('Registered successfully! Confirmation email queued.');
      fetchCompetitions();
      onRefresh();
    } catch (err: any) {
      setActionErr(err.message);
    }
  };

  const handleCancelRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelComp) return;
    setActionMsg('');
    setActionErr('');
    try {
      const res = await fetch(`/api/competitions/${cancelComp.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionMsg(data.message);
      setCancelComp(null);
      setCancelReason('');
      fetchCompetitions();
      onRefresh();
    } catch (err: any) {
      setActionErr(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Club Arena & Contests</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Competitions & Events</h2>
          <p className="text-sm text-slate-400">Participate in gamified soft-skill and coding challenges to earn domain credits.</p>
        </div>
      </div>

      {actionMsg && <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2"><CheckCircle2 className="w-4 h-4" /><span>{actionMsg}</span></div>}
      {actionErr && <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2"><ShieldAlert className="w-4 h-4" /><span>{actionErr}</span></div>}

      {/* Competitions Grid */}
      {loading ? (
        <div className="text-center py-8 text-slate-400 text-sm">Loading competitions...</div>
      ) : competitions.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm glass-card rounded-2xl">No competitions scheduled at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitions.map((comp) => {
            const isRegistered = user && comp.registrations?.some((r: any) => r.student_id === user.id);
            const isIdeaHubSourced = comp.source === 'IDEA_HUB';
            const originStudentName = comp.origin_idea?.student?.name;

            return (
              <div key={comp.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 border border-white/10">
                <div>
                  {/* Source Origin Attribution Banner */}
                  {isIdeaHubSourced && (
                    <div className="mb-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-purple-500/15 border border-amber-500/30 text-xs text-amber-300 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>One of our club members had this idea — join in! Proposed by <strong>{originStudentName || 'Club Student'}</strong></span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {comp.domain}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        comp.type === 'DISPLAY_ONLY' ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {comp.type}
                      </span>
                      <span className="text-xs font-extrabold text-amber-400 flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>+{comp.credit_value} Credits</span>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1.5">{comp.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{comp.description}</p>

                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <span className="flex items-center space-x-1"><Calendar className="w-3.5 h-3.5" /><span>{new Date(comp.event_date).toLocaleDateString()}</span></span>
                    <span className="flex items-center space-x-1"><Users className="w-3.5 h-3.5" /><span>{comp._count?.registrations || 0} Registered</span></span>
                  </div>
                </div>

                {/* Actions */}
                {user && comp.type !== 'DISPLAY_ONLY' && (
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    {isRegistered ? (
                      <div className="w-full flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Registered</span>
                        </span>
                        <button
                          onClick={() => setCancelComp(comp)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/20"
                        >
                          Cancel Registration
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRegister(comp.id)}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20"
                      >
                        Register for Competition
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white font-heading">Cancel Registration</h3>
              <button onClick={() => setCancelComp(null)} className="text-slate-400 hover:text-white"><XCircle className="w-5 h-5" /></button>
            </div>

            <p className="text-xs text-slate-300">
              Canceling for: <strong>{cancelComp.name}</strong>
            </p>

            <form onSubmit={handleCancelRegistration} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Cancellation</label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Provide reason if within 24 hours of event start..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Note: Cancellations within 24 hours require founder review. Rejected reasons incur a -1 credit penalty.
                </p>
              </div>

              <div className="flex space-x-2">
                <button type="button" onClick={() => setCancelComp(null)} className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                  Back
                </button>
                <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold">
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
