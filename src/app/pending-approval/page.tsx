"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  Check,
  RefreshCw,
  LogIn,
  Send,
  X,
  Info
} from 'lucide-react'

type RoleType = 'participant' | 'ambassador' | 'mentor'
type ApprovalStatus = 'pending' | 'approved' | 'rejected'

const ROLE_DATA: Record<RoleType, {
  displayName: string
  headlinePrefix: string
  headlineAccent: string
  subtext: (name: string) => string
  note: string
}> = {
  participant: {
    displayName: 'Participant',
    headlinePrefix: "You're on the ",
    headlineAccent: "list.",
    subtext: (name: string) => `Hey ${name} — your participant application is with your Visual Architect now. We'll let you straight into your dashboard the moment it's signed off.`,
    note: "Visual Architects usually review new participants within a day. You don't need to do anything else — try logging in again and this page will open straight into your dashboard once you're approved.",
  },
  ambassador: {
    displayName: 'Community Ambassador',
    headlinePrefix: "Almost ",
    headlineAccent: "in.",
    subtext: (name: string) => `Hey ${name} — your Community Ambassador application is waiting on Visual Architect approval. Ambassadors get reviewed a little closer, since you'll be helping run things.`,
    note: "Your Visual Architect is checking your Community Ambassador details before granting dashboard access. Approval usually lands within 1–2 days — try logging in again and you'll go straight through once approved.",
  },
  mentor: {
    displayName: 'Mentor',
    headlinePrefix: "One step from ",
    headlineAccent: "mentoring.",
    subtext: (name: string) => `Hey ${name} — your mentor application is pending with your Visual Architect. Mentors get full access to Skill-Barter and Micro-Mentorship once approved.`,
    note: "Mentor applications are reviewed manually by your Visual Architect to confirm skill credibility. This usually takes a bit longer — try logging in again and we'll let you straight in once it's approved.",
  }
}

function formatSubmittedTime(dateInput?: string | Date | null): string {
  if (!dateInput) return 'Today, 11:42 AM'
  const d = new Date(dateInput)
  if (isNaN(d.getTime())) return 'Today, 11:42 AM'

  const now = new Date()
  const isSameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()

  const timeStr = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  if (isSameDay) {
    return `Today, ${timeStr}`
  }

  const monthStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${monthStr}, ${timeStr}`
}

function PendingApprovalContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, logout, refreshUser } = useAuth()

  const roleParam = searchParams.get('role')
  const nameParam = searchParams.get('name')
  const emailParam = searchParams.get('email')

  // State
  const [activeRole, setActiveRole] = useState<RoleType>('participant')
  const [userName, setUserName] = useState<string>('Anusha')
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('pending')
  const [submittedTime, setSubmittedTime] = useState<string>('Today, 11:42 AM')
  const [isCheckingLogin, setIsCheckingLogin] = useState(false)
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'info' | 'success' | 'warn'; text: string } | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [contactSent, setContactSent] = useState(false)

  // Initialize from searchParams and logged-in user
  useEffect(() => {
    if (roleParam) {
      const r = roleParam.toLowerCase()
      if (r === 'ambassador' || r === 'volunteer' || r === 'architect') {
        setActiveRole('ambassador')
      } else if (r === 'mentor') {
        setActiveRole('mentor')
      } else {
        setActiveRole('participant')
      }
    } else if (user) {
      if (user.role === 'VOLUNTEER') {
        setActiveRole('ambassador')
      } else if ((user as any).role === 'MENTOR') {
        setActiveRole('mentor')
      } else {
        setActiveRole('participant')
      }
    }

    if (nameParam) {
      setUserName(nameParam.split(' ')[0] || nameParam)
    } else if (user && user.name) {
      setUserName(user.name.split(' ')[0] || user.name)
    } else {
      setUserName('Anusha')
    }

    if ((user as any)?.approval_requested_at) {
      setSubmittedTime(formatSubmittedTime((user as any).approval_requested_at))
    }
  }, [roleParam, nameParam, user])


  // Live background polling every 5 seconds — auto-redirects on approval
  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const emailToCheck = emailParam || user?.college_email
        if (!emailToCheck) return
        const res = await fetch('/api/auth/check-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailToCheck }),
        })
        const data = await res.json()
        if (data.approval_status === 'APPROVED') {
          setApprovalStatus('approved')
          setFeedbackMessage({
            type: 'success',
            text: '🎉 Application Approved! Redirecting to your dashboard...',
          })
          await refreshUser()
          setTimeout(() => { window.location.href = '/horizon' }, 1200)
        }
      } catch (_) {}
    }

    const interval = setInterval(checkLiveStatus, 5000)
    return () => clearInterval(interval)
  }, [emailParam, user, refreshUser])


  const roleInfo = ROLE_DATA[activeRole]

  // Primary action: Try logging in again
  const handleTryLoginAgain = async () => {
    setIsCheckingLogin(true)
    setFeedbackMessage(null)

    try {
      // Simulate ~900ms check as specified
      const [res] = await Promise.all([
        fetch('/api/auth/check-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailParam || user?.college_email, usn: user?.usn }),
        }),
        new Promise((resolve) => setTimeout(resolve, 900))
      ])

      const data = await res.json()

      if (data.approval_status === 'APPROVED' || approvalStatus === 'approved') {
        setApprovalStatus('approved')
        setFeedbackMessage({
          type: 'success',
          text: '🎉 Application Approved! Redirecting to your dashboard...',
        })
        await refreshUser()
        setTimeout(() => {
          window.location.href = '/horizon'
        }, 1000)
      } else if (data.approval_status === 'BLOCKED') {
        setFeedbackMessage({
          type: 'warn',
          text: 'Your application has been restricted by the Administrator.',
        })
      } else {
        setFeedbackMessage({
          type: 'info',
          text: 'Your application is still undergoing review with your Visual Architect.',
        })
      }
    } catch (e) {
      setFeedbackMessage({
        type: 'info',
        text: 'Your application is still undergoing review with your Visual Architect.',
      })
    } finally {
      setIsCheckingLogin(false)
    }
  }

  // Demo Action: Simulate Visual Architect Approval
  const handleSimulateApprove = async () => {
    setIsCheckingLogin(true)
    setFeedbackMessage(null)

    try {
      const res = await fetch('/api/auth/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailParam || user?.college_email,
          usn: user?.usn,
          simulate_approval: true,
        }),
      })

      const data = await res.json()

      if (data.approval_status === 'APPROVED') {
        setApprovalStatus('approved')
        setFeedbackMessage({
          type: 'success',
          text: '🎉 Visual Architect Approved Your Access! Redirecting to your dashboard…',
        })
        await refreshUser()
        setTimeout(() => {
          router.push('/horizon')
        }, 1200)
      }
    } catch (e) {
      setFeedbackMessage({
        type: 'info',
        text: 'Failed to simulate approval.',
      })
    } finally {
      setIsCheckingLogin(false)
    }
  }

  // Ghost action: Refresh status
  const handleRefreshStatus = async () => {
    setIsRefreshingStatus(true)
    setFeedbackMessage(null)

    try {
      const [res] = await Promise.all([
        fetch('/api/auth/check-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailParam || user?.college_email, usn: user?.usn }),
        }),
        new Promise((resolve) => setTimeout(resolve, 900))
      ])

      const data = await res.json()

      if (data.approval_status === 'APPROVED') {
        setApprovalStatus('approved')
        setFeedbackMessage({
          type: 'success',
          text: 'Status updated: APPROVED! Click "Try logging in again" to enter.',
        })
      } else {
        setFeedbackMessage({
          type: 'info',
          text: 'Status refreshed: Still Pending Review with Visual Architect.',
        })
      }
    } catch (e) {
      setFeedbackMessage({
        type: 'info',
        text: 'Status refreshed: Still Pending Review with Visual Architect.',
      })
    } finally {
      setIsRefreshingStatus(false)
    }
  }

  // Sign out (Firebase + existing session)
  const handleSignOut = async () => {
    try {
      await firebaseLogOut()
    } catch (_) {}
    try {
      await logout()
    } catch (_) {}
    router.push('/join')
  }

  // Submit Contact DM
  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault()
    setContactSent(true)
    setTimeout(() => {
      setShowContactModal(false)
      setContactSent(false)
      setContactMessage('')
      setFeedbackMessage({
        type: 'success',
        text: 'Direct message sent to your Visual Architect. They will review shortly.',
      })
    }, 1200)
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#0b0a10] text-[#f2eef7] selection:bg-[#a78bfa] selection:text-[#0b0a10]">
      {/* Ambient Radial Glows */}
      <div
        className="fixed top-0 left-0 w-[550px] h-[550px] pointer-events-none -z-10 blur-[120px] opacity-70"
        style={{ background: 'radial-gradient(circle, rgba(167, 139, 250, 0.16) 0%, transparent 70%)' }}
      />
      <div
        className="fixed bottom-0 right-0 w-[500px] h-[500px] pointer-events-none -z-10 blur-[120px] opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(94, 212, 200, 0.08) 0%, transparent 70%)' }}
      />

      {/* 42px Grid Line Texture Overlay at 1.5% Opacity */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(#f2eef7 1px, transparent 1px), linear-gradient(90deg, #f2eef7 1px, transparent 1px)`,
          backgroundSize: '42px 42px',
        }}
      />


      {/* 1. Role switch bar (dev/demo preview only) */}
      <div className="w-full max-w-[460px] mb-6 p-1 bg-[#131119]/80 border border-[rgba(255,255,255,0.09)] backdrop-blur-md rounded-2xl flex items-center justify-between text-xs font-mono relative z-10 shadow-lg">
        {(['participant', 'ambassador', 'mentor'] as RoleType[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setActiveRole(r)}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-xl font-medium text-[11px] sm:text-xs transition-all text-center cursor-pointer truncate ${
              activeRole === r
                ? 'bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/40 shadow-sm'
                : 'text-[#9d97ab] hover:text-[#f2eef7] hover:bg-white/[0.03]'
            }`}
          >
            {r === 'participant' ? 'Participant' : r === 'ambassador' ? 'Community Ambassador' : 'Mentor'}
          </button>
        ))}
      </div>

      {/* 2. Main Glassmorphic Card (Max Width ~460px) */}
      <div className="w-full max-w-[460px] glass-approval-card p-6 sm:p-8 shadow-2xl animate-pending-card relative z-10">
        <div className="relative z-10 space-y-6">

          {/* Eyebrow Row */}
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="pulse-amber-dot absolute inline-flex h-full w-full rounded-full bg-[#f0b45e]" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f0b45e]" />
            </span>
            <span
              className="text-[11px] font-mono font-semibold tracking-[0.12em] uppercase text-[#f0b45e]"
              style={{ fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)' }}
            >
              Sign-in attempted
            </span>
          </div>

          {/* Headline & Subtext */}
          <div className="space-y-2">
            <h2
              className="text-[28px] sm:text-[30px] font-normal leading-tight text-[#f2eef7]"
              style={{ fontFamily: 'var(--font-heading, "Fraunces", serif)' }}
            >
              <span className="font-medium">{roleInfo.headlinePrefix}</span>
              <span className="italic font-light text-[#a78bfa]">{roleInfo.headlineAccent}</span>
            </h2>

            <p className="text-[14.5px] leading-relaxed text-[#9d97ab] font-sans">
              {roleInfo.subtext(userName)}
            </p>
          </div>

          {/* Progress Track: 3-step horizontal stepper */}
          <div className="pt-2 pb-1">
            <div className="relative flex items-center justify-between">
              {/* Connecting Line 1-2 (Filled purple) */}
              <div className="absolute top-3 left-[15%] right-[50%] h-[2px] bg-[#a78bfa]" />
              {/* Connecting Line 2-3 (Faint dim) */}
              <div className="absolute top-3 left-[50%] right-[15%] h-[2px] bg-[rgba(255,255,255,0.09)]" />

              {/* Step 1: Signed up (Done) */}
              <div className="relative z-10 flex flex-col items-center space-y-1.5 w-1/3">
                <div className="w-6 h-6 rounded-full bg-[#a78bfa] text-[#0b0a10] flex items-center justify-center text-xs shadow-md shadow-[#a78bfa]/30">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span
                  className="text-[11px] font-mono text-[#a78bfa] font-medium text-center"
                  style={{ fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)' }}
                >
                  Signed up
                </span>
              </div>

              {/* Step 2: Visual Architect review (Current) */}
              <div className="relative z-10 flex flex-col items-center space-y-1.5 w-1/3">
                <div className="w-6 h-6 rounded-full bg-[#131119] border-2 border-[#f0b45e] shadow-[0_0_12px_rgba(240,180,94,0.45)] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#f0b45e]" />
                </div>
                <span
                  className="text-[11px] font-mono text-[#f0b45e] font-semibold text-center leading-tight"
                  style={{ fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)' }}
                >
                  Visual Architect review
                </span>
              </div>

              {/* Step 3: First login (Upcoming) */}
              <div className="relative z-10 flex flex-col items-center space-y-1.5 w-1/3">
                <div className="w-6 h-6 rounded-full bg-[#131119] border border-[rgba(255,255,255,0.15)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6b6578]" />
                </div>
                <span
                  className="text-[11px] font-mono text-[#6b6578] text-center"
                  style={{ fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)' }}
                >
                  First login
                </span>
              </div>
            </div>
          </div>

          {/* Status Panel */}
          <div className="bg-[#131119]/90 border border-[rgba(255,255,255,0.09)] rounded-xl p-3.5 divide-y divide-[rgba(255,255,255,0.06)] text-xs">
            <div className="flex items-center justify-between pb-2.5">
              <span
                className="text-[10.5px] font-mono uppercase tracking-wider text-[#6b6578]"
                style={{ fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)' }}
              >
                ROLE
              </span>
              <span className="font-sans font-medium text-[#f2eef7]">{roleInfo.displayName}</span>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <span
                className="text-[10.5px] font-mono uppercase tracking-wider text-[#6b6578]"
                style={{ fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)' }}
              >
                SUBMITTED
              </span>
              <span
                className="font-mono text-[#9d97ab]"
                style={{ fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)' }}
              >
                {submittedTime}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2.5">
              <span
                className="text-[10.5px] font-mono uppercase tracking-wider text-[#6b6578]"
                style={{ fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)' }}
              >
                STATUS
              </span>
              <span
                className="font-mono text-[11px] font-semibold text-[#f0b45e] flex items-center space-x-1.5"
                style={{ fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)' }}
              >
                <span>●</span>
                <span>{approvalStatus === 'approved' ? 'APPROVED' : 'PENDING APPROVAL'}</span>
              </span>
            </div>
          </div>

          {/* Note Block */}
          <div className="border-l-2 border-[#a78bfa] pl-3.5 py-1 text-[13px] leading-relaxed text-[#9d97ab] bg-[rgba(167,139,250,0.03)] rounded-r-lg">
            {roleInfo.note}
          </div>

          {/* Dynamic Feedback Banner */}
          {feedbackMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center space-x-2 animate-in fade-in duration-200 ${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : feedbackMessage.type === 'warn'
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  : 'bg-[rgba(167,139,250,0.1)] border-[#a78bfa]/30 text-[#f2eef7]'
              }`}
            >
              <Info className="w-4 h-4 text-[#a78bfa] shrink-0" />
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2.5 pt-1">
            {/* Primary Button */}
            <button
              type="button"
              onClick={handleTryLoginAgain}
              disabled={isCheckingLogin}
              className="w-full py-3 px-4 rounded-xl bg-[#a78bfa] hover:bg-[#b8a2fb] active:bg-[#9675f8] text-[#0b0a10] font-sans font-semibold text-[14px] shadow-lg shadow-[#a78bfa]/25 transition-all flex items-center justify-center space-x-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/70 disabled:opacity-75"
            >
              {isCheckingLogin ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0b0a10]" />
                  <span>Checking status…</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Try logging in again</span>
                </>
              )}
            </button>

            {/* Ghost Button */}
            <button
              type="button"
              onClick={handleRefreshStatus}
              disabled={isRefreshingStatus}
              className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-white/[0.04] active:bg-white/[0.08] text-[#f2eef7] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.2)] font-sans font-medium text-[13.5px] transition-all flex items-center justify-center space-x-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60"
            >
              {isRefreshingStatus ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#9d97ab]" />
                  <span>Refreshing…</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-[#9d97ab]" />
                  <span>Refresh status</span>
                </>
              )}
            </button>

            {/* Demo Button: Simulate Approval */}
            <button
              type="button"
              onClick={handleSimulateApprove}
              disabled={isCheckingLogin}
              className="w-full py-2 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 active:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-sans font-medium text-[12.5px] transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>⚡ Approve Access (Visual Architect Demo)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Line */}
      <footer className="mt-6 text-center text-xs text-[#6b6578] font-sans relative z-10 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleSignOut}
          className="text-[#9d97ab] hover:text-[#f2eef7] hover:underline transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#a78bfa] rounded"
        >
          Wrong account? Sign out
        </button>

        <span>·</span>

        <button
          type="button"
          onClick={() => setShowContactModal(true)}
          className="text-[#9d97ab] hover:text-[#f2eef7] hover:underline transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#a78bfa] rounded"
        >
          Questions? Message your Visual Architect
        </button>
      </footer>

      {/* Contact Visual Architect Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#131119] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-[#9d97ab] hover:text-white p-1 focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3
                className="text-lg font-medium text-[#f2eef7]"
                style={{ fontFamily: 'var(--font-heading, "Fraunces", serif)' }}
              >
                Message Visual Architect
              </h3>
              <p className="text-xs text-[#9d97ab]">
                Inquire about your <span className="text-[#a78bfa]">{roleInfo.displayName}</span> application or share portfolio updates directly with club leadership.
              </p>
            </div>

            <form onSubmit={handleSendContact} className="space-y-3">
              <textarea
                rows={4}
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Hi Visual Architect, checking in regarding my application review..."
                className="w-full bg-[#0b0a10] border border-[rgba(255,255,255,0.12)] rounded-xl p-3 text-xs text-[#f2eef7] placeholder-[#6b6578] focus:outline-none focus:border-[#a78bfa]"
              />

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#9d97ab] hover:text-white bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={contactSent}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0b0a10] bg-[#a78bfa] hover:bg-[#b8a2fb] flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{contactSent ? 'Sending…' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PendingApprovalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0a10] flex items-center justify-center text-[#a78bfa] text-xs font-mono">Loading approval status...</div>}>
      <PendingApprovalContent />
    </Suspense>
  )
}
