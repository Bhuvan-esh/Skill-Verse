'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, RefreshCw, CheckCircle2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';
import Link from 'next/link';

function VerifyEmailContent() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') || '';
  const [resent, setResent] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Poll every 4 seconds to check if email is verified
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval);
          router.push('/application-pending');
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [router]);

  const handleResend = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError('Please sign in again to resend verification.');
      return;
    }
    try {
      await sendEmailVerification(user);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (e: any) {
      setError(e.message || 'Failed to resend verification email.');
    }
  };

  const handleCheckNow = async () => {
    setChecking(true);
    const user = auth.currentUser;
    if (user) {
      await user.reload();
      if (user.emailVerified) {
        router.push('/application-pending');
        return;
      } else {
        setError('Email not verified yet. Please check your spam or inbox.');
      }
    }
    setChecking(false);
  };

  return (
    <div className="min-h-screen bg-[#08070d] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#6D3DF5]/20 border border-[#6D3DF5]/30 flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-[#A78BFA]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Check your inbox</h1>
          <p className="text-sm text-slate-400 mt-2">We sent a verification link to</p>
          <p className="text-sm font-bold text-[#A78BFA] mt-1">{email || 'your registered email'}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0F1220] border border-white/[0.08] space-y-4">
          <p className="text-xs text-slate-400">
            Click the link in the email to verify your address. This page will automatically move forward once verified.
          </p>
          {resent && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Verification email resent!
            </div>
          )}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>
          )}
          <button
            onClick={handleCheckNow}
            disabled={checking}
            className="w-full py-2.5 rounded-xl bg-[#6D3DF5] text-white font-bold text-sm hover:bg-[#5B2FD1] transition-all cursor-pointer disabled:opacity-60"
          >
            {checking ? 'Checking...' : "I've verified — continue"}
          </button>
          <button
            onClick={handleResend}
            className="w-full py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 text-sm font-semibold hover:bg-white/[0.08] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Resend verification email
          </button>
        </div>
        <p className="text-xs text-slate-600">
          Wrong email?{' '}
          <Link href="/register" className="text-[#A78BFA] hover:text-white">
            Start over
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08070d] flex items-center justify-center text-slate-500 text-sm">
          Loading verification...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
