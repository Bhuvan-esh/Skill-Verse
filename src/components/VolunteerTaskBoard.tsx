'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle2, Lock, ShieldAlert } from 'lucide-react';

interface VolunteerTaskBoardProps {
  user: any;
}

export default function VolunteerTaskBoard({ user }: VolunteerTaskBoardProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [accessState, setAccessState] = useState<'OPEN' | 'CLOSED'>('CLOSED');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks || []);
        setAccessState(data.volunteer_access || 'CLOSED');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleClaimTask = async (taskId: string) => {
    setMsg(''); setErr('');
    try {
      const res = await fetch(`/api/tasks/${taskId}/claim`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg('Task claimed successfully!');
      fetchTasks();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    setMsg(''); setErr('');
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg('Task marked as completed!');
      fetchTasks();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2 border border-cyan-500/30">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Gated Organizer Task Portal</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Organizer Task Board</h2>
          <p className="text-sm text-slate-400">Claim and execute event operations pre-assigned by club founders.</p>
        </div>
      </div>

      {msg && <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2"><CheckCircle2 className="w-4 h-4" /><span>{msg}</span></div>}
      {err && <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2"><ShieldAlert className="w-4 h-4" /><span>{err}</span></div>}

      {/* Gated Access Check */}
      {accessState === 'CLOSED' ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-3 border border-white/10">
          <Lock className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white font-heading">Organizer Access Currently Closed</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Organizer task access is currently locked by club founders. Once a founder toggles organizer access to OPEN for an active competition, tasks will automatically populate here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white font-heading">Available Event Tasks</h3>

          {loading ? (
            <div className="text-center py-8 text-slate-400 text-sm">Loading open tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm glass-card rounded-2xl">No open tasks available to claim at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between border border-white/10 space-y-3">
                  <div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {task.competition?.name}
                    </span>
                    <h4 className="text-base font-bold text-white mt-2">{task.description}</h4>
                  </div>

                  <button
                    onClick={() => handleClaimTask(task.id)}
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20"
                  >
                    Claim Task as {user?.name || 'Organizer'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
