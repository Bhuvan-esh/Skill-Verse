'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { chooseRole } from '@/lib/authService';
import { onAuthStateChanged } from 'firebase/auth';

const ROLES = [
  { id: 'community_ambassador', label: 'Community Ambassador', desc: 'Help coordinate club events and manage participants' },
  { id: 'mentor',              label: 'Mentor',               desc: 'Guide and evaluate students in skill challenges' },
  { id: 'participant',         label: 'Participant',          desc: 'Join competitions, earn credits, climb leaderboards' },
] as const;

type PublicRole = 'community_ambassador' | 'mentor' | 'participant';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<PublicRole>('participant');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push('/login');
      else setUid(u.uid);
    });
    return unsub;
  }, [router]);

  const handleSubmit = async () => {
    if (!uid) return;
    setLoading(true);
    setError('');
    try {
      await chooseRole(uid, selectedRole);
      router.push('/application-pending');
    } catch (e: any) {
      setError(e.message || 'Failed to save role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08070d] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6D3DF5]/15 border border-[#6D3DF5]/30 text-[#A78BFA] text-[11px] font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> ONE MORE STEP
          </div>
          <h1 className="text-2xl font-black text-white">Complete your profile</h1>
          <p className="text-sm text-slate-400">Choose your role to submit your application</p>
        </div>
        <div className="p-6 rounded-2xl bg-[#0F1220] border border-white/[0.08] space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select your role</p>
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRole(r.id)}
              className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedRole === r.id
                  ? 'bg-[#6D3DF5]/15 border-[#6D3DF5]/40'
                  : 'bg-[#0B0D18] border-white/[0.07] hover:border-white/20'
              }`}
            >
              <div
                className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selectedRole === r.id ? 'border-[#6D3DF5]' : 'border-slate-600'
                }`}
              >
                {selectedRole === r.id && <div className="w-2 h-2 rounded-full bg-[#6D3DF5]" />}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{r.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{r.desc}</p>
              </div>
            </button>
          ))}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading || !uid}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#6D3DF5] text-white font-bold text-sm hover:bg-[#5B2FD1] transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-[#6D3DF5]/25"
          >
            {loading ? (
              'Submitting...'
            ) : (
              <>
                Submit Application <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
