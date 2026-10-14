'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, getUserByUid } from '@/lib/authService';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const routeByStatus = (status: string, role: string | null) => {
    if (status === 'pending_role') return router.push('/complete-profile');
    if (status === 'pending_approval') return router.push('/application-pending');
    if (status === 'rejected') return router.push('/application-rejected');
    if (status === 'suspended') return router.push('/account-suspended');
    if (status === 'approved') return router.push('/horizon');
    router.push('/complete-profile');
  };

  const syncSession = async (firebaseUser: any) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      await fetch('/api/auth/firebase-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
    } catch (e) {
      console.warn('Session sync failed:', e);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const result = await signInWithGoogle();
      const firebaseUser = auth.currentUser;
      if (firebaseUser) await syncSession(firebaseUser);
      routeByStatus(result.status, result.role);
    } catch (e: any) {
      setError(e.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await signInWithEmail(email.trim().toLowerCase(), password);
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        await syncSession(firebaseUser);
        const profile = await getUserByUid(result.uid);
        routeByStatus(profile?.status || result.status, profile?.role || null);
      }
    } catch (e: any) {
      const msg =
        e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password'
          ? 'Incorrect email or password.'
          : e.code === 'auth/user-not-found'
          ? 'No account found with this email. Please register first.'
          : e.message || 'Sign-in failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08070d] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6D3DF5]/15 border border-[#6D3DF5]/30 text-[#A78BFA] text-[11px] font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            SKILL VERSE PLATFORM
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-400">Sign in to your account to continue</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0F1220] border border-white/[0.08] shadow-2xl space-y-5">
          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-gray-800 font-bold text-sm hover:bg-gray-100 transition-all disabled:opacity-60 cursor-pointer shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-xs text-slate-500">or</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Email/Password */}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-xs text-[#A78BFA] hover:text-white transition-all">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#6D3DF5] text-white font-bold text-sm hover:bg-[#5B2FD1] transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-[#6D3DF5]/25"
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#A78BFA] hover:text-white font-semibold transition-all">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
