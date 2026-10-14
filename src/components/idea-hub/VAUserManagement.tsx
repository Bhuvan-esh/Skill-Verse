'use client';

import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, XCircle, Clock, ShieldOff } from 'lucide-react';
import {
  listenToPendingApprovals,
  approveUser,
  rejectUser,
  suspendUser,
  listenToAllUsers,
  UserDoc,
} from '@/lib/authService';
import { auth } from '@/lib/firebase';

const ROLE_LABELS: Record<string, string> = {
  community_ambassador: 'Community Ambassador',
  mentor: 'Mentor',
  participant: 'Participant',
  visual_architect: 'Visual Architect',
};

export default function VAUserManagement() {
  const [pendingUsers, setPendingUsers] = useState<UserDoc[]>([]);
  const [allUsers, setAllUsers] = useState<UserDoc[]>([]);
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const showToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const unsubPending = listenToPendingApprovals((users) => setPendingUsers(users));
    const unsubAll = listenToAllUsers((users) => setAllUsers(users));
    return () => {
      if (typeof unsubPending === 'function') unsubPending();
      if (typeof unsubAll === 'function') unsubAll();
    };
  }, []);

  const handleApprove = async (uid: string) => {
    const vaUid = auth.currentUser?.uid || 'visual-architect-root';
    setProcessing((p) => ({ ...p, [uid]: true }));
    try {
      await approveUser(uid, vaUid);
      showToast('ok', 'Applicant approved! Their dashboard access is now unlocked.');
    } catch (e: any) {
      showToast('err', e.message || 'Failed to approve applicant.');
    }
    setProcessing((p) => ({ ...p, [uid]: false }));
  };

  const handleReject = async (uid: string) => {
    const vaUid = auth.currentUser?.uid || 'visual-architect-root';
    const reason = rejectionReasons[uid]?.trim();
    if (!reason) {
      showToast('err', 'Please provide a reason when rejecting an applicant.');
      return;
    }
    setProcessing((p) => ({ ...p, [uid]: true }));
    try {
      await rejectUser(uid, vaUid, reason);
      showToast('ok', 'Applicant rejected. They will see the reason when attempting access.');
      setRejectionReasons((p) => {
        const n = { ...p };
        delete n[uid];
        return n;
      });
    } catch (e: any) {
      showToast('err', e.message || 'Failed to reject applicant.');
    }
    setProcessing((p) => ({ ...p, [uid]: false }));
  };

  const handleSuspend = async (uid: string) => {
    const vaUid = auth.currentUser?.uid || 'visual-architect-root';
    setProcessing((p) => ({ ...p, [uid]: true }));
    try {
      await suspendUser(uid, vaUid, 'Account access suspended by Visual Architect');
      showToast('ok', 'User account suspended.');
    } catch (e: any) {
      showToast('err', e.message || 'Failed to suspend account.');
    }
    setProcessing((p) => ({ ...p, [uid]: false }));
  };

  const STATUS_COLOR: Record<string, string> = {
    approved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    pending_approval: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rejected: 'text-red-400 bg-red-500/10 border-red-500/20',
    suspended: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    pending_role: 'text-slate-400 bg-white/[0.05] border-white/[0.1]',
  };

  return (
    <div className="space-y-4">
      {/* Tab row */}
      <div className="flex gap-1.5 p-1 bg-[#0B0D18] rounded-xl border border-white/[0.06]">
        {(['pending', 'all'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === t ? 'bg-[#6D3DF5] text-white' : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            {t === 'pending' ? <Clock className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
            {t === 'pending' ? 'Pending Approvals' : 'All Registered Users'}
            {t === 'pending' && pendingUsers.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-black">
                {pendingUsers.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
            toast.type === 'ok'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {toast.type === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Pending list */}
      {tab === 'pending' && (
        <div className="space-y-3">
          {pendingUsers.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto" />
              <p className="text-xs text-slate-500">No pending applications in queue. You are all caught up!</p>
            </div>
          ) : (
            pendingUsers.map((u) => (
              <div key={u.uid} className="p-4 rounded-2xl bg-[#0F1220]/90 border border-amber-500/20 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-white">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLOR['pending_approval']}`}>
                    Pending Approval
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span>
                    Role Requested:{' '}
                    <strong className="text-white">{ROLE_LABELS[u.role || ''] || u.role || 'Not selected'}</strong>
                  </span>
                  <span>
                    Provider: <strong className="text-white">{u.authProvider || 'google'}</strong>
                  </span>
                </div>
                <textarea
                  value={rejectionReasons[u.uid] || ''}
                  onChange={(e) => setRejectionReasons((p) => ({ ...p, [u.uid]: e.target.value }))}
                  placeholder="Reason for rejection (mandatory if clicking Reject)..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] resize-none transition-all"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(u.uid)}
                    disabled={processing[u.uid]}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> {processing[u.uid] ? 'Processing...' : 'Approve Access'}
                  </button>
                  <button
                    onClick={() => handleReject(u.uid)}
                    disabled={processing[u.uid]}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" /> {processing[u.uid] ? 'Processing...' : 'Reject Application'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* All users list */}
      {tab === 'all' && (
        <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
          {allUsers.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-10">No users registered in Firestore yet.</p>
          ) : (
            allUsers.map((u) => (
              <div
                key={u.uid}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0F1220]/90 border border-white/[0.06] justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#6D3DF5]/20 border border-[#6D3DF5]/30 flex items-center justify-center text-[#A78BFA] font-black text-xs shrink-0">
                    {u.firstName?.[0] || u.email?.[0] || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {u.email} · {ROLE_LABELS[u.role || ''] || u.role || 'No role'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      STATUS_COLOR[u.status] || 'text-slate-400 bg-white/[0.05] border-white/[0.1]'
                    }`}
                  >
                    {u.status?.replace('_', ' ') || 'unknown'}
                  </span>
                  {u.status === 'approved' && u.role !== 'visual_architect' && (
                    <button
                      onClick={() => handleSuspend(u.uid)}
                      disabled={processing[u.uid]}
                      className="px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-semibold hover:bg-orange-500/20 transition-all cursor-pointer flex items-center gap-1"
                      title="Suspend account"
                    >
                      <ShieldOff className="w-3 h-3" /> Suspend
                    </button>
                  )}
                  {u.status === 'suspended' && (
                    <button
                      onClick={() => handleApprove(u.uid)}
                      disabled={processing[u.uid]}
                      className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold hover:bg-emerald-500/20 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Reinstate
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
