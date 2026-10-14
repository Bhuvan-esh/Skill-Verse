'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, LogOut, RefreshCw } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { listenToUserStatus, logOut } from '@/lib/authService';
import { onAuthStateChanged } from 'firebase/auth';

const ROLE_LABELS: Record<string, string> = {
  community_ambassador: 'Community Ambassador',
  mentor: 'Mentor',
  participant: 'Participant',
  visual_architect: 'Visual Architect',
};

export default function ApplicationPendingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>('pending_approval');
  const [role, setRole] = useState<string>('participant');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubStatus: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/login');
        return;
      }
      setLoading(false);
      unsubStatus = listenToUserStatus(firebaseUser.uid, (data) => {
        if (!data) return;
        setStatus(data.status);
        setRole(data.role || 'participant');
        setUserName(data.firstName || '');
        if (data.status === 'approved') {
          router.push('/horizon');
        } else if (data.status === 'rejected') {
          router.push('/application-rejected');
        } else if (data.status === 'suspended') {
          router.push('/account-suspended');
        }
      });
    });

    return () => {
      unsubAuth();
      if (unsubStatus) unsubStatus();
    };
  }, [router]);

  const handleLogout = async () => {
    await logOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08070d] flex items-center justify-center text-slate-500 text-sm">
        Checking status...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08070d] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 text-amber-400" />
        </div>
        {userName && (
          <p className="text-slate-400 text-sm">
            Hey <span className="text-white font-bold">{userName}</span> 👋
          </p>
        )}
        <div>
          <h1 className="text-2xl font-black text-white">Application submitted!</h1>
          <p className="text-sm text-slate-400 mt-2">Your account is waiting for approval from a Visual Architect.</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0F1220] border border-amber-500/15 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Role requested:</span>
            <span className="font-bold text-white">{ROLE_LABELS[role] || role}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Status:</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              Pending Review
            </span>
          </div>
          <div className="border-t border-white/[0.06] pt-4">
            <p className="text-xs text-slate-500">
              We will notify you once a decision has been made. You can also refresh this page to check for updates in
              real-time.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs font-semibold hover:bg-white/[0.08] transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs font-semibold hover:bg-white/[0.08] transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
