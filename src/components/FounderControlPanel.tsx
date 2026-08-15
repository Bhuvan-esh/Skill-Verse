'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Award, 
  Sparkles, 
  ShieldAlert, 
  Search, 
  Plus, 
  Clock,
  Eye,
  Edit,
  UserPlus
} from 'lucide-react';

interface FounderPanelProps {
  user: any;
  onRefresh: () => void;
}

export default function FounderControlPanel({ user, onRefresh }: FounderPanelProps) {
  const [activeTab, setActiveTab] = useState<'APPROVALS' | 'COMPETITIONS' | 'REPORTS' | 'STUDENTS' | 'TASKS' | 'EMERGENCY' | 'ACCOUNTS'>('APPROVALS');
  
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // Data states
  const [loginRequests, setLoginRequests] = useState<any[]>([]);
  const [cancellationRequests, setCancellationRequests] = useState<any[]>([]);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  // Competition Launcher Form State
  const [compName, setCompName] = useState('');
  const [compDesc, setCompDesc] = useState('');
  const [compDomain, setCompDomain] = useState('DOMAIN_1');
  const [compCreditVal, setCompCreditVal] = useState(10);
  const [compSource, setCompSource] = useState('FOUNDERS');
  const [originIdeaId, setOriginIdeaId] = useState('');
  const [eventDate, setEventDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);

  // Declare Winners State
  const [selectedComp, setSelectedComp] = useState<any>(null);
  const [winnerRanks, setWinnerRanks] = useState<Record<string, number>>({});

  // Student Credit Lookup State
  const [searchStudentId, setSearchStudentId] = useState('');
  const [lookedUpCredits, setLookedUpCredits] = useState<any>(null);

  // Emergency Access State
  const [emergencyUsn, setEmergencyUsn] = useState('');
  const [emergencyReason, setEmergencyReason] = useState('');

  // Create Founder/Volunteer State
  const [newAccRole, setNewAccRole] = useState<'FOUNDER' | 'VOLUNTEER'>('VOLUNTEER');
  const [newAccName, setNewAccName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccPassword, setNewAccPassword] = useState('');

  // Pre-add Task State
  const [taskCompId, setTaskCompId] = useState('');
  const [taskDesc, setTaskDesc] = useState('');

  // Fetch all panel data
  const fetchData = async () => {
    try {
      const [lRes, cRes, iRes, compRes, rRes, tRes] = await Promise.all([
        fetch('/api/founder/login-requests'),
        fetch('/api/founder/cancellations'),
        fetch('/api/ideas'),
        fetch('/api/competitions'),
        fetch('/api/founder/reports'),
        fetch('/api/founder/tasks'),
      ]);

      if (lRes.ok) setLoginRequests((await lRes.json()).requests || []);
      if (cRes.ok) setCancellationRequests((await cRes.json()).requests || []);
      if (iRes.ok) setIdeas((await iRes.json()).ideas || []);
      if (compRes.ok) setCompetitions((await compRes.json()).competitions || []);
      if (rRes.ok) setReports((await rRes.json()).reports || []);
      if (tRes.ok) setTasks((await tRes.json()).tasks || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Volunteer Login Approval
  const handleDecideVolunteerLogin = async (requestId: string, decision: 'APPROVED' | 'DENIED') => {
    setMsg(''); setErr('');
    try {
      const res = await fetch('/api/founder/approve-volunteer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, decision }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg(data.message);
      fetchData();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Cancellation Request Review
  const handleDecideCancellation = async (requestId: string, decision: 'APPROVED' | 'REJECTED') => {
    setMsg(''); setErr('');
    try {
      const res = await fetch('/api/founder/cancellations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, decision }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg(data.message);
      fetchData();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Idea Approval / Rejection
  const handleDecideIdea = async (ideaId: string, decision: 'APPROVE' | 'REJECT', reason?: string) => {
    setMsg(''); setErr('');
    try {
      const res = await fetch(`/api/ideas/${ideaId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg(data.message);
      fetchData();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Create Competition
  const handleCreateCompetition = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      const res = await fetch('/api/competitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: compName,
          description: compDesc,
          domain: compDomain,
          credit_value: Number(compCreditVal),
          type: 'SCORED',
          volunteer_access: 'CLOSED',
          source: compSource,
          origin_idea_id: compSource === 'IDEA_HUB' ? originIdeaId : null,
          event_date: eventDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg('Competition created & launched successfully!');
      setCompName(''); setCompDesc('');
      fetchData();
      onRefresh();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Declare Winners & Trigger AI Credit Agent
  const handleDeclareWinners = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComp) return;
    setMsg(''); setErr('');
    try {
      const winnersPayload = Object.entries(winnerRanks).map(([student_id, rank]) => ({
        student_id,
        rank: Number(rank),
      }));

      const res = await fetch(`/api/competitions/${selectedComp.id}/declare-winners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winners: winnersPayload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg('Winners declared! AI Credit Agent report draft created for review.');
      setSelectedComp(null);
      setWinnerRanks({});
      fetchData();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Approve AI Credit Report (Idempotent)
  const handleApproveReport = async (reportId: string) => {
    setMsg(''); setErr('');
    try {
      const res = await fetch(`/api/founder/reports/${reportId}/approve`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg('Credit report approved! Real student credits updated & leaderboard refreshed.');
      fetchData();
      onRefresh();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Lookup Student Credits
  const handleLookupCredits = async (studentId: string) => {
    try {
      const res = await fetch(`/api/founder/students/${studentId}/credits`);
      const data = await res.json();
      if (res.ok) {
        setLookedUpCredits(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Grant Emergency Student Access
  const handleGrantEmergencyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      const res = await fetch('/api/founder/emergency-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usn: emergencyUsn, reason: emergencyReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg(`Emergency access granted for ${data.student.name} (${data.student.usn}).`);
      setEmergencyUsn(''); setEmergencyReason('');
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Create Founder/Volunteer Account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErr('');
    const endpoint = newAccRole === 'FOUNDER' ? '/api/auth/founder/create' : '/api/founder/create-volunteer';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newAccName, email: newAccEmail, password: newAccPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg(`New ${newAccRole} account created successfully!`);
      setNewAccName(''); setNewAccEmail(''); setNewAccPassword('');
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Toggle Competition Volunteer Access
  const handleToggleVolunteerAccess = async (compId: string, currentAccess: string) => {
    const newAccess = currentAccess === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      const res = await fetch(`/api/competitions/${compId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteer_access: newAccess }),
      });
      if (res.ok) {
        setMsg(`Volunteer access toggled to ${newAccess}.`);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Pre-add Task under Competition
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      const res = await fetch('/api/founder/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competition_id: taskCompId, description: taskDesc }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg('Task pre-added under competition.');
      setTaskDesc('');
      fetchData();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/30">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Founder Control Panel — Full System Governance</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Founder Panel</h2>
          <p className="text-sm text-slate-400">Review ideas, declare contest winners, approve AI credit drafts, manage volunteers, and grant emergency student access.</p>
        </div>
      </div>

      {msg && <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2"><CheckCircle2 className="w-4 h-4" /><span>{msg}</span></div>}
      {err && <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2"><ShieldAlert className="w-4 h-4" /><span>{err}</span></div>}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-white/5">
        {[
          { id: 'APPROVALS', label: 'Pending Approvals', count: loginRequests.filter(r => r.status === 'PENDING').length + cancellationRequests.filter(c => c.status === 'PENDING').length },
          { id: 'COMPETITIONS', label: 'Competitions & Winners', count: competitions.length },
          { id: 'REPORTS', label: 'AI Credit Drafts', count: reports.filter(r => r.status === 'PENDING').length },
          { id: 'STUDENTS', label: 'Student Credit Dashboard' },
          { id: 'TASKS', label: 'Volunteer Access & Tasks' },
          { id: 'EMERGENCY', label: 'Emergency Access' },
          { id: 'ACCOUNTS', label: 'Create Accounts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === tab.id ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[10px] font-extrabold">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: PENDING APPROVALS */}
      {activeTab === 'APPROVALS' && (
        <div className="space-y-6">
          
          {/* Volunteer Login Requests */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>Pending Volunteer Login Requests (10-Min Expiration)</span>
            </h3>

            {loginRequests.filter(r => r.status === 'PENDING').length === 0 ? (
              <p className="text-xs text-slate-400">No pending volunteer login requests.</p>
            ) : (
              <div className="space-y-3">
                {loginRequests.filter(r => r.status === 'PENDING').map((req) => (
                  <div key={req.id} className="glass-card p-4 rounded-xl flex items-center justify-between border border-white/5">
                    <div>
                      <span className="text-sm font-bold text-white">{req.volunteer?.name}</span>
                      <p className="text-xs text-slate-400">{req.volunteer?.college_email} | Requested: {new Date(req.requested_at).toLocaleTimeString()}</p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDecideVolunteerLogin(req.id, 'APPROVED')}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                      >
                        Approve Session
                      </button>
                      <button
                        onClick={() => handleDecideVolunteerLogin(req.id, 'DENIED')}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Registration Cancellation Requests */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Pending Registration Cancellation Requests (&lt;24h of Event)</span>
            </h3>

            {cancellationRequests.filter(c => c.status === 'PENDING').length === 0 ? (
              <p className="text-xs text-slate-400">No pending cancellation requests.</p>
            ) : (
              <div className="space-y-3">
                {cancellationRequests.filter(c => c.status === 'PENDING').map((c) => (
                  <div key={c.id} className="glass-card p-4 rounded-xl flex items-center justify-between border border-white/5">
                    <div>
                      <span className="text-sm font-bold text-white">{c.student?.name} ({c.student?.usn})</span>
                      <p className="text-xs text-slate-300">Competition: <strong>{c.competition?.name}</strong></p>
                      <p className="text-xs text-amber-300 mt-0.5">Reason: "{c.reason}"</p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDecideCancellation(c.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                        title="Approve (No penalty)"
                      >
                        Approve (Free)
                      </button>
                      <button
                        onClick={() => handleDecideCancellation(c.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                        title="Reject (Applies -1 credit penalty)"
                      >
                        Reject (-1 Credit Penalty)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Student Ideas Review */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Pending Student Ideas for Founder Single-Approval</span>
            </h3>

            {ideas.filter(i => i.status === 'PENDING').length === 0 ? (
              <p className="text-xs text-slate-400">No pending student ideas to review.</p>
            ) : (
              <div className="space-y-3">
                {ideas.filter(i => i.status === 'PENDING').map((idea) => (
                  <div key={idea.id} className="glass-card p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/5">
                    <div>
                      <span className="text-sm font-bold text-white">{idea.title}</span>
                      <p className="text-xs text-slate-300 mt-0.5">{idea.description}</p>
                      <p className="text-xs text-slate-400 mt-1">Proposed by: <strong>{idea.student?.name}</strong> | Category: {idea.category}</p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDecideIdea(idea.id, 'APPROVE')}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        Approve Idea
                      </button>
                      <button
                        onClick={() => {
                          const r = prompt('Reason for rejection:');
                          if (r) handleDecideIdea(idea.id, 'REJECT', r);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: COMPETITIONS & WINNER DECLARATION */}
      {activeTab === 'COMPETITIONS' && (
        <div className="space-y-6">
          
          {/* Create Competition Form */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white font-heading">Launch New Club Competition</h3>

            <form onSubmit={handleCreateCompetition} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Competition Name</label>
                  <input
                    type="text"
                    required
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    placeholder="e.g. Speed Coding Sprint"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Domain</label>
                  <select
                    value={compDomain}
                    onChange={(e) => setCompDomain(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
                  >
                    <option value="DOMAIN_1">DOMAIN_1 (Coding/Tech)</option>
                    <option value="DOMAIN_2">DOMAIN_2 (Soft Skills)</option>
                    <option value="DOMAIN_3">DOMAIN_3 (Design/UI)</option>
                    <option value="DOMAIN_4">DOMAIN_4 (Leadership)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={compDesc}
                  onChange={(e) => setCompDesc(e.target.value)}
                  placeholder="Competition overview and rules..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credit Value</label>
                  <input
                    type="number"
                    value={compCreditVal}
                    onChange={(e) => setCompCreditVal(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Source Attribution</label>
                  <select
                    value={compSource}
                    onChange={(e) => setCompSource(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
                  >
                    <option value="FOUNDERS">Founders (Standard)</option>
                    <option value="IDEA_HUB">Idea Hub (Student Origin)</option>
                  </select>
                </div>

                {compSource === 'IDEA_HUB' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Select Approved Idea</label>
                    <select
                      value={originIdeaId}
                      onChange={(e) => setOriginIdeaId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
                    >
                      <option value="">-- Choose Idea --</option>
                      {ideas.filter(i => i.status === 'APPROVED' || i.status === 'FEATURED').map((i) => (
                        <option key={i.id} value={i.id}>{i.title} ({i.student?.name})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg">
                Launch Competition
              </button>
            </form>
          </div>

          {/* Declare Winners Action List */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white font-heading">Declare Winners & Trigger AI Credit Agent</h3>
            <p className="text-xs text-slate-400">Select winners from actual registered participants. Triggers AI agent draft for founder review.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {competitions.filter(c => c.type !== 'DISPLAY_ONLY').map((comp) => (
                <div key={comp.id} className="glass-card p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{comp.name}</span>
                    <span className="text-xs font-semibold text-purple-300">{comp.domain}</span>
                  </div>
                  <p className="text-xs text-slate-400">Participants: {comp.registrations?.length || 0}</p>

                  <button
                    onClick={() => { setSelectedComp(comp); setWinnerRanks({}); }}
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow"
                  >
                    Select Winners from Registered List ({comp.registrations?.length || 0})
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Select Winners Modal */}
          {selectedComp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="w-full max-w-lg glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white font-heading">Declare Winners: {selectedComp.name}</h3>
                  <button onClick={() => setSelectedComp(null)} className="text-slate-400 hover:text-white"><XCircle className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleDeclareWinners} className="space-y-4">
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {selectedComp.registrations?.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No registered participants to select from.</p>
                    ) : (
                      selectedComp.registrations.map((reg: any) => (
                        <div key={reg.student_id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-white/5">
                          <span className="text-xs font-bold text-white">{reg.student?.name} ({reg.student?.usn})</span>
                          <select
                            value={winnerRanks[reg.student_id] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setWinnerRanks((prev) => {
                                const next = { ...prev };
                                if (val) next[reg.student_id] = Number(val);
                                else delete next[reg.student_id];
                                return next;
                              });
                            }}
                            className="px-2 py-1 rounded bg-slate-800 text-xs text-amber-300"
                          >
                            <option value="">-- No Award --</option>
                            <option value="1">Rank #1 (1.5x Credit)</option>
                            <option value="2">Rank #2 (1.2x Credit)</option>
                            <option value="3">Rank #3 (1.0x Credit)</option>
                            <option value="4">Participant (0.5x Credit)</option>
                          </select>
                        </div>
                      ))
                    )}
                  </div>

                  <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg">
                    Trigger AI Credit Agent & Save Draft
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: AI CREDIT DRAFTS REVIEW */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white font-heading">AI Credit Draft Reports (Founder Confirmation Required)</h3>
            <p className="text-xs text-slate-400">AI proposes credit updates. Nothing writes to real student_credits until a founder approves.</p>

            {reports.filter(r => r.status === 'PENDING').length === 0 ? (
              <p className="text-xs text-slate-400 italic">No pending AI credit drafts for review.</p>
            ) : (
              <div className="space-y-4">
                {reports.filter(r => r.status === 'PENDING').map((r) => (
                  <div key={r.id} className="glass-card p-5 rounded-2xl border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {r.type} DRAFT
                      </span>
                      <span className="text-xs text-slate-400">{new Date(r.created_at).toLocaleString()}</span>
                    </div>

                    <div className="space-y-2">
                      {Array.isArray(r.report_data) && r.report_data.map((p: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white">{p.student_name}</span>
                            <p className="text-slate-400 mt-0.5">{p.reason}</p>
                          </div>
                          <div className="text-right font-mono">
                            <span className="text-slate-400">{p.old_credit}</span> → <strong className="text-amber-400">{p.proposed_credit}</strong>
                            <span className="text-emerald-400 block font-bold">+{p.credit_added}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
                      <button
                        onClick={() => handleApproveReport(r.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                      >
                        Confirm & Approve Credits
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FOUNDER PER-STUDENT CREDIT DASHBOARD */}
      {activeTab === 'STUDENTS' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white font-heading">Founder Student Credit Lookup</h3>
            <p className="text-xs text-slate-400">View complete 4-domain credit breakdown for any student in one view.</p>

            <div className="flex space-x-2 max-w-md">
              <input
                type="text"
                value={searchStudentId}
                onChange={(e) => setSearchStudentId(e.target.value)}
                placeholder="Enter Student ID..."
                className="flex-1 px-4 py-2 rounded-xl glass-input text-xs"
              />
              <button
                onClick={() => handleLookupCredits(searchStudentId)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Lookup
              </button>
            </div>

            {lookedUpCredits && (
              <div className="glass-card p-5 rounded-2xl space-y-3 border border-white/10">
                <h4 className="text-sm font-bold text-white">{lookedUpCredits.student?.name} ({lookedUpCredits.student?.usn})</h4>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-900 rounded-xl"><span className="text-xs text-slate-400">Domain 1</span><p className="text-lg font-bold text-blue-400">{lookedUpCredits.credits?.domain_1}</p></div>
                  <div className="p-3 bg-slate-900 rounded-xl"><span className="text-xs text-slate-400">Domain 2</span><p className="text-lg font-bold text-purple-400">{lookedUpCredits.credits?.domain_2}</p></div>
                  <div className="p-3 bg-slate-900 rounded-xl"><span className="text-xs text-slate-400">Domain 3</span><p className="text-lg font-bold text-emerald-400">{lookedUpCredits.credits?.domain_3}</p></div>
                  <div className="p-3 bg-slate-900 rounded-xl"><span className="text-xs text-slate-400">Domain 4</span><p className="text-lg font-bold text-rose-400">{lookedUpCredits.credits?.domain_4}</p></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: VOLUNTEER ACCESS TOGGLE & TASKS */}
      {activeTab === 'TASKS' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white font-heading">Competition Volunteer Access Toggles</h3>

            <div className="space-y-3">
              {competitions.map((comp) => (
                <div key={comp.id} className="glass-card p-4 rounded-xl flex items-center justify-between border border-white/5">
                  <div>
                    <span className="text-sm font-bold text-white">{comp.name}</span>
                    <span className={`text-[10px] font-bold ml-2 px-2 py-0.5 rounded-full ${comp.volunteer_access === 'OPEN' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                      {comp.volunteer_access}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleVolunteerAccess(comp.id, comp.volunteer_access)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${comp.volunteer_access === 'OPEN' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}
                  >
                    Toggle to {comp.volunteer_access === 'OPEN' ? 'CLOSED' : 'OPEN'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-add Task Form */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white font-heading">Pre-Add Task under Competition</h3>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Competition</label>
                  <select
                    value={taskCompId}
                    onChange={(e) => setTaskCompId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
                  >
                    <option value="">-- Choose Competition --</option>
                    {competitions.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Task Description</label>
                  <input
                    type="text"
                    required
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    placeholder="e.g. Post buggy snippet 3 for Round A"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md">
                Pre-Add Volunteer Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 6: EMERGENCY ACCESS */}
      {activeTab === 'EMERGENCY' && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 max-w-lg mx-auto">
          <h3 className="text-lg font-bold text-white font-heading">Emergency Student Access Bypass</h3>
          <p className="text-xs text-slate-400">Founders can grant a one-time emergency bypass login if student OTP/email is broken. Logged in audit trail.</p>

          <form onSubmit={handleGrantEmergencyAccess} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Student USN</label>
              <input
                type="text"
                required
                value={emergencyUsn}
                onChange={(e) => setEmergencyUsn(e.target.value.toUpperCase())}
                placeholder="e.g. 1MS21CS001"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mandatory Reason</label>
              <textarea
                required
                rows={2}
                value={emergencyReason}
                onChange={(e) => setEmergencyReason(e.target.value)}
                placeholder="State reason for granting emergency access..."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <button type="submit" className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg">
              Grant Emergency Bypass Access
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: CREATE ACCOUNTS */}
      {activeTab === 'ACCOUNTS' && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 max-w-lg mx-auto">
          <h3 className="text-lg font-bold text-white font-heading">Create Founder or Volunteer Account</h3>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
              <select
                value={newAccRole}
                onChange={(e) => setNewAccRole(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
              >
                <option value="VOLUNTEER">Organizer</option>
                <option value="FOUNDER">Founder</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newAccName}
                onChange={(e) => setNewAccName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">College Email</label>
              <input
                type="email"
                required
                value={newAccEmail}
                onChange={(e) => setNewAccEmail(e.target.value)}
                placeholder="user@club.edu"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={newAccPassword}
                onChange={(e) => setNewAccPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg">
              Create Account
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
