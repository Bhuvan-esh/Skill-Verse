'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      setSent(true);
    } catch (e: any) {
      setError(
        e.code === 'auth/user-not-found'
          ? 'No account found with this email.'
          : e.message || 'Failed to send reset email.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08070d] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </Link>
        {sent ? (
          <div className="p-6 rounded-2xl bg-[#0F1220] border border-emerald-500/20 text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h1 className="text-xl font-black text-white">Reset email sent</h1>
            <p className="text-sm text-slate-400">
              Check <span className="text-white font-semibold">{email}</span> for a link to reset your application password.
            </p>
            <Link href="/login" className="block mt-4 text-xs text-[#A78BFA] hover:text-white font-semibold">
              Return to sign in
            </Link>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#0F1220] border border-white/[0.08] space-y-5">
            <div>
              <h1 className="text-2xl font-black text-white">Forgot password?</h1>
              <p className="text-sm text-slate-400 mt-1">Enter your registered email and we'll send you a reset link.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] transition-all"
                />
              </div>
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#6D3DF5] text-white font-bold text-sm hover:bg-[#5B2FD1] transition-all cursor-pointer disabled:opacity-60 shadow-lg shadow-[#6D3DF5]/20"
              >
                {loading ? 'Sending...' : 'Send reset email'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
