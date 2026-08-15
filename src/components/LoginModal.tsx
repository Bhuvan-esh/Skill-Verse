'use client';

import React, { useState } from 'react';
import { X, KeyRound, ShieldAlert, Sparkles, User, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'FOUNDER' | 'VOLUNTEER'>('STUDENT');
  
  // Student state
  const [usn, setUsn] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpEmail, setOtpEmail] = useState('');

  // Founder state
  const [founderEmail, setFounderEmail] = useState('founder1@club.edu');
  const [founderPassword, setFounderPassword] = useState('founderpass123');

  // Volunteer state
  const [volunteerEmail, setVolunteerEmail] = useState('volunteer1@club.edu');
  const [volunteerPassword, setVolunteerPassword] = useState('volunteerpass123');
  const [volunteerRequestId, setVolunteerRequestId] = useState<string | null>(null);
  const [volunteerStatus, setVolunteerStatus] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Student OTP Request
  const handleRequestOtp = async (targetUsn?: string) => {
    const finalUsn = targetUsn || usn;
    if (!finalUsn) {
      setError('Please enter a valid USN.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/student/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usn: finalUsn }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOtpEmail(data.email);
      if (data.dev_otp) {
        setOtpCode(data.dev_otp);
      }
      setOtpStep(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Student OTP Verify
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError('Enter 6-digit OTP code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/student/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usn, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Quick Student Preset Login
  const handleQuickStudentLogin = async (presetUsn: string) => {
    setUsn(presetUsn);
    setLoading(true);
    setError('');
    try {
      const reqRes = await fetch('/api/auth/student/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usn: presetUsn }),
      });
      const reqData = await reqRes.json();
      if (!reqRes.ok) throw new Error(reqData.error);

      const code = reqData.dev_otp || '123456';
      const verifyRes = await fetch('/api/auth/student/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usn: presetUsn, code }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error);

      onLoginSuccess(verifyData.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Founder Login
  const handleFounderLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/founder/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: founderEmail, password: founderPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Volunteer Login Request
  const handleVolunteerLoginRequest = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/volunteer/request-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: volunteerEmail, password: volunteerPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setVolunteerRequestId(data.request_id);
      setVolunteerStatus('PENDING');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Poll Volunteer Status
  const handlePollVolunteerStatus = async () => {
    if (!volunteerRequestId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/volunteer/status?request_id=${volunteerRequestId}`);
      const data = await res.json();
      setVolunteerStatus(data.status);
      if (data.status === 'APPROVED') {
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Access Club Idea Hub</h2>
          <p className="text-xs text-slate-400 mt-1">Select your account role to continue</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1.5 rounded-xl mb-6 border border-white/5">
          <button
            onClick={() => { setActiveTab('STUDENT'); setError(''); setOtpStep(false); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'STUDENT' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Student (USN)
          </button>
          <button
            onClick={() => { setActiveTab('FOUNDER'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'FOUNDER' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Founder
          </button>
          <button
            onClick={() => { setActiveTab('VOLUNTEER'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'VOLUNTEER' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Volunteer
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: STUDENT LOGIN */}
        {activeTab === 'STUDENT' && (
          <div className="space-y-4">
            {!otpStep ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enter your USN</label>
                  <input
                    type="text"
                    value={usn}
                    onChange={(e) => setUsn(e.target.value.toUpperCase())}
                    placeholder="e.g. 1MS21CS001"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono tracking-wide"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Must be pre-loaded in club whitelist</p>
                </div>

                <button
                  onClick={() => handleRequestOtp()}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Sending OTP...' : 'Send 6-Digit Email OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Quick Presets for Dev / Demo */}
                <div className="pt-3 border-t border-white/10 text-center">
                  <p className="text-[11px] font-semibold text-slate-400 mb-2">⚡ Demo Quick Login Presets:</p>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleQuickStudentLogin('1MS21CS001')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-blue-300 border border-blue-500/20"
                    >
                      Alex (1MS21CS001)
                    </button>
                    <button
                      onClick={() => handleQuickStudentLogin('1MS21CS002')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-purple-300 border border-purple-500/20"
                    >
                      Prior (1MS21CS002)
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                  OTP sent to <strong>{otpEmail}</strong>. Check email or use code below.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enter 6-Digit Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-center text-lg font-mono tracking-widest"
                  />
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Verifying...' : 'Verify OTP & Enter'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}

        {/* TAB 2: FOUNDER LOGIN */}
        {activeTab === 'FOUNDER' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Founder Email</label>
              <input
                type="email"
                value={founderEmail}
                onChange={(e) => setFounderEmail(e.target.value)}
                placeholder="founder1@club.edu"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={founderPassword}
                onChange={(e) => setFounderPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <button
              onClick={handleFounderLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/25"
            >
              {loading ? 'Authenticating...' : 'Founder Sign In'}
            </button>
          </div>
        )}

        {/* TAB 3: VOLUNTEER LOGIN */}
        {activeTab === 'VOLUNTEER' && (
          <div className="space-y-4">
            {!volunteerRequestId ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Volunteer Email</label>
                  <input
                    type="email"
                    value={volunteerEmail}
                    onChange={(e) => setVolunteerEmail(e.target.value)}
                    placeholder="volunteer1@club.edu"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    value={volunteerPassword}
                    onChange={(e) => setVolunteerPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <button
                  onClick={handleVolunteerLoginRequest}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/25"
                >
                  {loading ? 'Submitting Request...' : 'Submit Login Approval Request'}
                </button>
              </>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  <p className="font-bold text-sm mb-1">Login Request Pending Approval</p>
                  <p>A founder must approve your session. Request expires in 10 minutes.</p>
                </div>

                <div className="flex justify-center space-x-2">
                  <button
                    onClick={handlePollVolunteerStatus}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md"
                  >
                    {loading ? 'Checking...' : 'Check Founder Approval Status'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
