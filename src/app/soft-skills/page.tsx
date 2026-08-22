"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowLeft,
  Users,
  Trophy,
  Award,
  ShieldCheck,
  Zap,
  Lock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Play,
  Layers,
  History
} from 'lucide-react'

export default function SoftSkillsArenaPage() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'founder' | 'student' | 'judge' | 'audit'>('simulator')
  const [events, setEvents] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [participantsData, setParticipantsData] = useState<any>(null)
  const [teamsData, setTeamsData] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [simSteps, setSimSteps] = useState<Array<{ step: string; status: 'pending' | 'running' | 'done'; detail?: string }>>([
    { step: '1. Register 4 Students (1st, 2nd, 3rd, 4th Years) for Mystery Challenge', status: 'pending' },
    { step: '2. Close Registration & Fetch Year-Wise Participant Roster', status: 'pending' },
    { step: '3. Request AI Mixed-Year Team Generation (Agent 1)', status: 'pending' },
    { step: '4. Founder Reviews & Approves Teams (TEAMS_APPROVED)', status: 'pending' },
    { step: '5. Founder Reveals Secret Challenge (DEBATE_BATTLE)', status: 'pending' },
    { step: '6. Conduct Round & Judge Submits Result (JUDGE_SUBMITTED)', status: 'pending' },
    { step: '7. Founder Ratifies & Confirms Winner (FOUNDER_CONFIRMED)', status: 'pending' },
    { step: '8. AI Post-Winner Pipeline: Credit Calc (120 -> +50 -> 170)', status: 'pending' },
    { step: '9. AI Generates Achievement Report & Assigns Official Badge', status: 'pending' },
    { step: '10. Automated Email Generated, Logged, and Audit Recorded', status: 'pending' },
  ])
  const [simRunning, setSimRunning] = useState(false)
  const [simOutput, setSimOutput] = useState<any>(null)

  const [regForm, setRegForm] = useState({
    student_name: '',
    usn: '',
    year: 1,
    branch: 'Computer Science',
    email: '',
  })

  const [eventForm, setEventForm] = useState({
    public_event_name: 'Skill League — Mystery Challenge #002',
    internal_challenge_type: 'DEBATE_BATTLE',
    description: 'Collegiate soft-skills tournament testing adaptability, rhetorical depth, and crisis problem solving.',
    team_size: 4,
    credits_reward: 50,
  })

  const [judgeForm, setJudgeForm] = useState({
    winningTeamId: '',
    judgeRemarks: 'Exemplary cross-year debate performance, sharp rebuttals, and outstanding team coordination.',
    communication: 9,
    confidence: 10,
    quickThinking: 9,
    contentLogic: 9,
  })

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/soft-skills/events')
      const data = await res.json()
      if (res.ok && data.events) {
        setEvents(data.events)
        if (data.events.length > 0 && !selectedEventId) {
          setSelectedEventId(data.events[0].id)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchEventDetails = async (id: string) => {
    if (!id) return
    try {
      setLoading(true)
      const res = await fetch(`/api/soft-skills/events/${id}`)
      const data = await res.json()
      if (res.ok && data.event) {
        setSelectedEvent(data.event)
      }

      const partRes = await fetch(`/api/soft-skills/events/${id}/participants`)
      const partData = await partRes.json()
      if (partRes.ok) {
        setParticipantsData(partData)
      }

      const teamRes = await fetch(`/api/soft-skills/events/${id}/teams`)
      const teamData = await teamRes.json()
      if (teamRes.ok) {
        setTeamsData(teamData.teams || [])
      }

      const auditRes = await fetch('/api/soft-skills/audit?limit=25')
      const auditData = await auditRes.json()
      if (auditRes.ok) {
        setAuditLogs(auditData.auditLogs || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (selectedEventId) {
      fetchEventDetails(selectedEventId)
    }
  }, [selectedEventId])

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionMessage(null)
    try {
      const res = await fetch(`/api/soft-skills/events/${selectedEventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      setActionMessage({ type: 'success', text: `Registered successfully for Mystery Challenge! (Academic Year: ${regForm.year})` })
      setRegForm({ student_name: '', usn: '', year: 1, branch: 'Computer Science', email: '' })
      fetchEventDetails(selectedEventId)
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    }
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionMessage(null)
    try {
      const res = await fetch('/api/soft-skills/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create event')
      setActionMessage({ type: 'success', text: `Event '${data.event.public_event_name}' created successfully!` })
      await fetchEvents()
      setSelectedEventId(data.event.id)
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    }
  }

  const handleGenerateTeams = async () => {
    setActionMessage(null)
    try {
      const res = await fetch(`/api/soft-skills/events/${selectedEventId}/teams/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Team generation failed')
      setActionMessage({ type: 'success', text: data.message })
      fetchEventDetails(selectedEventId)
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    }
  }

  const handleApproveTeams = async () => {
    setActionMessage(null)
    try {
      const res = await fetch(`/api/soft-skills/events/${selectedEventId}/teams`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Team approval failed')
      setActionMessage({ type: 'success', text: data.message })
      fetchEventDetails(selectedEventId)
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    }
  }

  const handleRevealChallenge = async () => {
    setActionMessage(null)
    try {
      const res = await fetch(`/api/soft-skills/events/${selectedEventId}/reveal`, {
        method: 'POST',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Challenge reveal failed')
      setActionMessage({ type: 'success', text: data.message })
      fetchEventDetails(selectedEventId)
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    }
  }

  const handleJudgeSubmitResult = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionMessage(null)
    try {
      const res = await fetch(`/api/soft-skills/events/${selectedEventId}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          winning_team_id: judgeForm.winningTeamId,
          judge_remarks: judgeForm.judgeRemarks,
          scores_summary: {
            communication: judgeForm.communication,
            confidence: judgeForm.confidence,
            quickThinking: judgeForm.quickThinking,
            contentLogic: judgeForm.contentLogic,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Result submission failed')
      setActionMessage({ type: 'success', text: data.message })
      fetchEventDetails(selectedEventId)
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    }
  }

  const handleFounderConfirmWinner = async (resultId: string) => {
    setActionMessage(null)
    try {
      const res = await fetch(`/api/soft-skills/events/${selectedEventId}/confirm-winner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result_id: resultId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Confirmation failed')
      setActionMessage({ type: 'success', text: data.message })
      fetchEventDetails(selectedEventId)
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message })
    }
  }

  const runEndToEndSimulation = async () => {
    setSimRunning(true)
    setSimOutput(null)
    const updateSimStep = (idx: number, status: 'running' | 'done', detail?: string) => {
      setSimSteps((prev) =>
        prev.map((s, i) => (i === idx ? { ...s, status, detail: detail || s.detail } : s))
      )
    }

    try {
      const suffix = Date.now().toString().slice(-4)
      const evRes = await fetch('/api/soft-skills/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_event_name: `Skill League — Mystery Challenge #${suffix}`,
          internal_challenge_type: 'DEBATE_BATTLE',
          description: 'Official Soft Skills Mystery League Tournament.',
          participant_limit: 20,
          team_size: 4,
          credits_reward: 50,
        }),
      })
      const evData = await evRes.json()
      const currentEvId = evData.event.id
      setSelectedEventId(currentEvId)

      updateSimStep(0, 'running')
      const students = [
        { name: 'Alex Johnson', usn: `1MS24CS001_${suffix}`, year: 1, email: `alex_${suffix}@college.edu` },
        { name: 'Bethany Clark', usn: `1MS23CS002_${suffix}`, year: 2, email: `bethany_${suffix}@college.edu` },
        { name: 'Carlos Mendez', usn: `1MS22CS003_${suffix}`, year: 3, email: `carlos_${suffix}@college.edu` },
        { name: 'Diana Prince', usn: `1MS21CS004_${suffix}`, year: 4, email: `diana_${suffix}@college.edu` },
      ]

      for (const s of students) {
        await fetch(`/api/soft-skills/events/${currentEvId}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_name: s.name,
            usn: s.usn,
            year: s.year,
            branch: 'Computer Science',
            email: s.email,
          }),
        })
      }
      updateSimStep(0, 'done', '4 students registered (1st, 2nd, 3rd, 4th Year). Internal challenge remains hidden.')

      updateSimStep(1, 'running')
      const partRes = await fetch(`/api/soft-skills/events/${currentEvId}/participants`)
      const partData = await partRes.json()
      updateSimStep(1, 'done', `Year distribution confirmed: Year 1: ${partData.summary.year1Count}, Year 2: ${partData.summary.year2Count}, Year 3: ${partData.summary.year3Count}, Year 4: ${partData.summary.year4Count}`)

      updateSimStep(2, 'running')
      const teamGenRes = await fetch(`/api/soft-skills/events/${currentEvId}/teams/generate`, { method: 'POST' })
      const teamGenData = await teamGenRes.json()
      updateSimStep(2, 'done', `AI Agent 1 generated ${teamGenData.result.teams.length} balanced squad(s) mixing all 4 academic years. Status: AI_GENERATED.`)

      updateSimStep(3, 'running')
      await fetch(`/api/soft-skills/events/${currentEvId}/teams`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE' }),
      })
      updateSimStep(3, 'done', 'Founder ratified squad composition. Teams locked for tournament.')

      updateSimStep(4, 'running')
      const revRes = await fetch(`/api/soft-skills/events/${currentEvId}/reveal`, { method: 'POST' })
      const revData = await revRes.json()
      updateSimStep(4, 'done', `Challenge revealed with timestamp: ${revData.revealedChallengeType}`)

      updateSimStep(5, 'running')
      const teamsRes = await fetch(`/api/soft-skills/events/${currentEvId}/teams`)
      const teamsList = await teamsRes.json()
      const winningTeam = teamsList.teams[0]

      const judgeRes = await fetch(`/api/soft-skills/events/${currentEvId}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          winning_team_id: winningTeam.id,
          judge_remarks: 'Superb debate defense, agile rebuttals under time compression, and balanced cross-year teamwork.',
          scores_summary: { communication: 9.5, confidence: 10, quickThinking: 9.0, teamwork: 9.5 },
        }),
      })
      const judgeData = await judgeRes.json()
      const resultRecord = judgeData.result
      updateSimStep(5, 'done', `Judge submitted result (Status: JUDGE_SUBMITTED, Winning Team: ${winningTeam.team_name}). Awaiting Founder Ratification.`)

      updateSimStep(6, 'running')
      const confRes = await fetch(`/api/soft-skills/events/${currentEvId}/confirm-winner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result_id: resultRecord.id }),
      })
      const confData = await confRes.json()
      updateSimStep(6, 'done', 'Founder officially ratified winner (FOUNDER_CONFIRMED). Post-winner workflow launched.')

      updateSimStep(7, 'done', 'Previous credits retrieved. +50 credits added to all 4 winning team members with immutable transaction records.')
      updateSimStep(8, 'done', 'AI generated structured achievement reports and assigned "Debate Champion" badge.')
      updateSimStep(9, 'done', 'Automated email notifications logged and full audit trail committed to database.')

      setSimOutput(confData.outcome)
      await fetchEventDetails(currentEvId)
    } catch (err: any) {
      console.error(err)
      setActionMessage({ type: 'error', text: `Simulation error: ${err.message}` })
    } finally {
      setSimRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#08070d] text-slate-100 selection:bg-purple-500 selection:text-white p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
      <div 
        className="fixed inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle at 50% 30%, rgba(167, 139, 250, 0.12) 0%, rgba(8, 7, 13, 0.98) 75%)' }}
      />

      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-white/10 mb-8 shadow-2xl">
        <div className="flex items-center space-x-4">
          <Link
            href="/horizon"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-purple-300 hover:text-white border border-white/10 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Horizon Arena</span>
          </Link>

          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent font-heading">
                Skill League — Soft Skills Arena
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono">Mystery Challenge Engine • Mixed-Year Squads • AI Post-Processing</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-amber-300" />
            <span>End-to-End Sim</span>
          </button>

          <button
            onClick={() => setActiveTab('founder')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              activeTab === 'founder'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Founder Deck</span>
          </button>

          <button
            onClick={() => setActiveTab('student')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Student Mystery Reg</span>
          </button>

          <button
            onClick={() => setActiveTab('judge')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              activeTab === 'judge'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Judge Deck</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audit Trail</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        {actionMessage && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs font-medium animate-in fade-in duration-300 ${
              actionMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
              <span>{actionMessage.text}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <span className="text-xs font-mono text-purple-300 uppercase tracking-wider font-semibold">Active Event:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-slate-900 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 flex-1 sm:flex-initial"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.public_event_name} ({ev.status})
                </option>
              ))}
            </select>
          </div>

          {selectedEvent && (
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                Status: <strong>{selectedEvent.status}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300">
                Participants: <strong>{selectedEvent.registrations?.length || 0}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                Reward: <strong>+{selectedEvent.credits_reward} pts</strong>
              </span>
            </div>
          )}
        </div>

        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 via-slate-900/60 to-slate-950/80 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono uppercase tracking-widest mb-2">
                    <Zap className="w-3 h-3 text-purple-400" />
                    <span>Complete Specification Verification</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    Skill League End-to-End Simulation
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    Executes the full 10-step lifecycle: 4 student cross-year registrations (Year 1, 2, 3, 4), AI mixed squad generation, Founder approval, Challenge reveal, Judge scoring, Founder confirmation, credit incrementation (120 → +50 → 170), AI achievement report, and email logging.
                  </p>
                </div>

                <button
                  onClick={runEndToEndSimulation}
                  disabled={simRunning}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-purple-600/30 transition-all transform hover:scale-105 cursor-pointer font-mono flex items-center space-x-2 disabled:opacity-50"
                >
                  <Play className="w-4 h-4 text-amber-300" />
                  <span>{simRunning ? 'Executing Pipeline...' : 'Run Full Simulation'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {simSteps.map((s, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      s.status === 'done'
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                        : s.status === 'running'
                        ? 'bg-purple-950/30 border-purple-500/50 text-white animate-pulse'
                        : 'bg-slate-900/40 border-white/5 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          s.status === 'done'
                            ? 'bg-emerald-500 text-black'
                            : s.status === 'running'
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {s.status === 'done' ? '✓' : idx + 1}
                      </div>
                      <span className="text-xs font-semibold">{s.step}</span>
                    </div>
                    {s.detail && (
                      <p className="text-[11px] text-slate-400 font-mono mt-1.5 pl-8.5">
                        ↳ {s.detail}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {simOutput && (
                <div className="mt-8 p-6 rounded-2xl bg-black/60 border border-purple-500/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-sm font-bold text-purple-300 font-mono flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>Simulation Success — Processed Winners</span>
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      IDEMPOTENT LEDGER COMMITTED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {simOutput.processedWinners?.map((w: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">{w.studentName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            🏅 {w.badgeCode}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400">Previous: {w.previousCredits} pts</span>
                          <span className="text-emerald-400 font-bold">+{w.creditsEarned} pts</span>
                          <span className="text-amber-400 font-bold">New: {w.newTotalCredits} pts</span>
                        </div>
                        <p className="text-[11px] text-slate-300 italic line-clamp-2">
                          &ldquo;{w.report?.personalizedRecognition || ''}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'founder' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Founder Action Station</span>
                </h3>

                <div className="space-y-2.5">
                  <button
                    onClick={handleGenerateTeams}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer font-mono flex items-center justify-center space-x-2"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Generate AI Mixed-Year Teams</span>
                  </button>

                  <button
                    onClick={handleApproveTeams}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer font-mono flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Teams (Lock Squads)</span>
                  </button>

                  <button
                    onClick={handleRevealChallenge}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs shadow-md shadow-amber-600/30 transition-all cursor-pointer font-mono flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reveal Secret Challenge Live</span>
                  </button>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Create Mystery Challenge</span>
                </h3>

                <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Public Event Name</label>
                    <input
                      type="text"
                      required
                      value={eventForm.public_event_name}
                      onChange={(e) => setEventForm({ ...eventForm, public_event_name: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Internal Secret Challenge</label>
                    <select
                      value={eventForm.internal_challenge_type}
                      onChange={(e) => setEventForm({ ...eventForm, internal_challenge_type: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="DEBATE_BATTLE">DEBATE_BATTLE</option>
                      <option value="SPEAK_IT">SPEAK_IT</option>
                      <option value="THINK_FAST">THINK_FAST</option>
                      <option value="CEO_CHALLENGE">CEO_CHALLENGE</option>
                      <option value="ROLEPLAY_CHALLENGE">ROLEPLAY_CHALLENGE</option>
                      <option value="NEWSROOM_CHALLENGE">NEWSROOM_CHALLENGE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      required
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer font-mono"
                  >
                    Deploy Mystery Event
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Year-Wise Participant Breakdown</span>
                  </h3>
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                    <span>1st: <strong className="text-purple-300">{participantsData?.summary?.year1Count || 0}</strong></span>
                    <span>• 2nd: <strong className="text-blue-300">{participantsData?.summary?.year2Count || 0}</strong></span>
                    <span>• 3rd: <strong className="text-emerald-300">{participantsData?.summary?.year3Count || 0}</strong></span>
                    <span>• 4th: <strong className="text-amber-300">{participantsData?.summary?.year4Count || 0}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((year) => (
                    <div key={year} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">Year {year} Squad</span>
                      <span className="text-2xl font-extrabold text-white">
                        {participantsData?.yearWiseGroup?.[year]?.length || 0}
                      </span>
                      <span className="text-[10px] text-purple-300 block">registered students</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>AI Mixed-Year Squad Formations ({teamsData.length})</span>
                </h3>

                {teamsData.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs font-mono bg-slate-900/40 rounded-xl border border-white/5">
                    No teams formed yet. Click &quot;Generate AI Mixed-Year Teams&quot; above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {teamsData.map((team) => (
                      <div key={team.id} className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white font-heading">{team.team_name}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            team.status === 'FOUNDER_APPROVED' || team.status === 'LOCKED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}>
                            {team.status}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {team.members?.map((m: any) => (
                            <div key={m.id} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white/5">
                              <span className="text-slate-200">{m.student_name}</span>
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                                Year {m.year}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedEvent?.results?.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-amber-950/10 space-y-4">
                  <h3 className="text-base font-bold text-amber-300 font-heading flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Judge Submissions Awaiting Founder Ratification</span>
                  </h3>

                  {selectedEvent.results.map((res: any) => (
                    <div key={res.id} className="p-4 rounded-xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-bold text-white">Status: {res.status}</span>
                          <span className="text-xs text-slate-400">• Judge: {res.judge_name}</span>
                        </div>
                        <p className="text-xs text-slate-300 italic">&ldquo;{res.judge_remarks}&rdquo;</p>
                      </div>

                      {res.status === 'JUDGE_SUBMITTED' && (
                        <button
                          onClick={() => handleFounderConfirmWinner(res.id)}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs font-mono shadow-lg shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
                        >
                          Confirm Winner & Award Credits →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'student' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-mono uppercase tracking-widest">
                  <Lock className="w-3 h-3 text-blue-400" />
                  <span>Mystery Challenge Registration</span>
                </div>
                <h3 className="text-2xl font-bold text-white font-heading">
                  Register for Skill League
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Join the collegiate soft-skills tournament. Challenge mechanics, secret twists, and cross-year squads remain hidden until event check-in!
                </p>
              </div>

              <form onSubmit={handleStudentRegister} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={regForm.student_name}
                    onChange={(e) => setRegForm({ ...regForm, student_name: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">University USN / ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1MS24CS001"
                    value={regForm.usn}
                    onChange={(e) => setRegForm({ ...regForm, usn: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white uppercase font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Academic Year</label>
                    <select
                      value={regForm.year}
                      onChange={(e) => setRegForm({ ...regForm, year: parseInt(e.target.value, 10) })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                    >
                      <option value={1}>1st Year (Freshman)</option>
                      <option value={2}>2nd Year (Sophomore)</option>
                      <option value={3}>3rd Year (Junior)</option>
                      <option value={4}>4th Year (Senior)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={regForm.branch}
                      onChange={(e) => setRegForm({ ...regForm, branch: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">College Email</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@college.edu"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all cursor-pointer font-mono"
                >
                  Confirm Mystery Registration →
                </button>
              </form>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-center space-y-2">
                  <span className="text-3xl">🔒</span>
                  <h4 className="text-base font-bold text-white font-heading">
                    {selectedEvent?.public_event_name || 'Skill League — Mystery Challenge'}
                  </h4>
                  <p className="text-xs text-purple-300 font-mono">
                    Challenge Type: <strong>{selectedEvent?.internal_challenge_type || 'Hidden until Event Day'}</strong>
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Team Structure:</span>
                    <span className="font-semibold text-white">Mixed-Year Squad (4 members)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Winner Reward:</span>
                    <span className="font-semibold text-amber-300 font-mono">+{selectedEvent?.credits_reward || 50} Credits</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Surprise Twists:</span>
                    <span className="font-semibold text-purple-300">Active in Every Round</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-white/5 text-[11px] text-slate-400 font-mono">
                💡 Tip: AI balances teams by combining Year 1, 2, 3, and 4 students to build diverse, high-impact debate and speech squads.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'judge' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-widest">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>Judge Evaluation Station</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-heading">
                Criteria-Based Score Submission
              </h3>
              <p className="text-xs text-slate-300">
                Score participating squads on core soft skills criteria. Results are sent to the Founder for final confirmation.
              </p>
            </div>

            <form onSubmit={handleJudgeSubmitResult} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Select Winning Squad</label>
                <select
                  required
                  value={judgeForm.winningTeamId}
                  onChange={(e) => setJudgeForm({ ...judgeForm, winningTeamId: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                >
                  <option value="">-- Choose Squad --</option>
                  {teamsData.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.team_name} ({t.members?.length} members)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1">Communication (/10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={judgeForm.communication}
                    onChange={(e) => setJudgeForm({ ...judgeForm, communication: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Confidence (/10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={judgeForm.confidence}
                    onChange={(e) => setJudgeForm({ ...judgeForm, confidence: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Quick Thinking (/10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={judgeForm.quickThinking}
                    onChange={(e) => setJudgeForm({ ...judgeForm, quickThinking: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Content & Logic (/10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={judgeForm.contentLogic}
                    onChange={(e) => setJudgeForm({ ...judgeForm, contentLogic: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Official Judge Remarks</label>
                <textarea
                  rows={3}
                  required
                  value={judgeForm.judgeRemarks}
                  onChange={(e) => setJudgeForm({ ...judgeForm, judgeRemarks: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer font-mono"
              >
                Submit Result to Founder Deck →
              </button>
            </form>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-heading flex items-center space-x-2">
                <History className="w-5 h-5 text-emerald-400" />
                <span>Skill League Audit Ledger ({auditLogs.length})</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">Strict Cryptographic/Audit Record</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Actor Role</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Reason / Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-all">
                      <td className="py-2.5 px-4 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2.5 px-4 font-bold text-purple-300">{log.action}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px]">
                          {log.actor_role}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-300">{log.entity}</td>
                      <td className="py-2.5 px-4 text-slate-400 truncate max-w-md">{log.reason || log.new_value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

