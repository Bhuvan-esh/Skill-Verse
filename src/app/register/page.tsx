'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import { signInWithGoogle, signUpWithEmail } from '@/lib/authService';
import { auth } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';
import Link from 'next/link';

const ROLES = [
  { id: 'community_ambassador', label: 'Community Ambassador', desc: 'Help coordinate events and manage participants' },
  { id: 'mentor',              label: 'Mentor',               desc: 'Guide students through skill-building challenges' },
  { id: 'participant',         label: 'Participant',          desc: 'Join competitions, earn credits, build skills' },
] as const;

type PublicRole = 'community_ambassador' | 'mentor' | 'participant';

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<PublicRole>('participant');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [terms, setTerms]         = useState(false);
  const [loading, setLoading]     = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]         = useState('');

  const syncSession = async (firebaseUser: any) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      await fetch('/api/auth/firebase-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
    } catch (_) {}
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const result = await signInWithGoogle();
      const firebaseUser = auth.currentUser;
      if (firebaseUser) await syncSession(firebaseUser);
      if (result.status === 'pending_role') return router.push('/complete-profile');
      if (result.status === 'approved') return router.push('/horizon');
      router.push('/application-pending');
    } catch (e: any) {
      setError(e.message || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Email is required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (!terms) { setError('Please agree to the Terms & Conditions.'); return; }
    setLoading(true);
    setError('');
    try {
      await signUpWithEmail({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: selectedRole,
        emailOptOut: false,
      });
      if (auth.currentUser) {
        await syncSession(auth.currentUser);
        await sendEmailVerification(auth.currentUser);
      }
      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (e: any) {
      const msg = e.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists. Please sign in instead.'
        : e.code === 'auth/weak-password'
        ? 'Password is too weak. Use at least 8 characters.'
        : e.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08070d] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6D3DF5]/15 border border-[#6D3DF5]/30 text-[#A78BFA] text-[11px] font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            SKILL VERSE PLATFORM
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Create your account</h1>
          <p className="text-sm text-slate-400">Submit your application. A Visual Architect will review it.</p>
        </div>

        {/* Role selector */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select your role</p>
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRole(r.id)}
              className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedRole === r.id
                  ? 'bg-[#6D3DF5]/15 border-[#6D3DF5]/40'
                  : 'bg-[#0F1220] border-white/[0.07] hover:border-white/20'
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
        </div>

        <div className="p-6 rounded-2xl bg-[#0F1220] border border-white/[0.08] shadow-2xl space-y-4">
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
            {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-xs text-slate-500">or register with email</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          <form onSubmit={handleEmailRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Anusha"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Bhat"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
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
              <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  autoComplete="new-password"
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
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0D18] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6D3DF5] transition-all"
                />
              </div>
            </div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#6D3DF5]"
              />
              <span className="text-xs text-slate-400">
                I agree to the{' '}
                <Link href="/terms" className="text-[#A78BFA] hover:text-white">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#A78BFA] hover:text-white">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#6D3DF5] text-white font-bold text-sm hover:bg-[#5B2FD1] transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-[#6D3DF5]/25"
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  Submit Application <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-[#A78BFA] hover:text-white font-semibold transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
