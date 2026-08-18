'use client';

import React, { useState } from 'react';
import { Users, Plus, XCircle, User, BookOpen, Layers, GraduationCap, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SkilloraProps {
  user: any;
  onRefresh: () => void;
}

export default function SkillBarterSection({ user, onRefresh }: SkilloraProps) {
  // Sample Post Session Requests
  const [postSessionRequests, setPostSessionRequests] = useState([
    {
      id: 'req-1',
      name: 'Rahul Sharma',
      branch: 'Computer Science & Engineering (CSE)',
      year: '4th Year',
      domain: 'Database Systems & Backend',
      topic: 'PostgreSQL Query Optimization & Indexing Walkthrough',
      message: 'Need an interactive 1:1 session explaining indexing strategies and EXPLAIN ANALYZE on complex SQL joins.',
    },
    {
      id: 'req-2',
      name: 'Meera K',
      branch: 'Artificial Intelligence & Data Science',
      year: '3rd Year',
      domain: 'Python & Web Frameworks',
      topic: 'Django REST Framework & JWT Authentication Setup',
      message: 'Looking for a mentor to guide through setting up nested serializers and CORS handling in Django.',
    },
    {
      id: 'req-3',
      name: 'Sanjay V',
      branch: 'Information Science & Engineering (ISE)',
      year: '3rd Year',
      domain: 'DevOps & Containerization',
      topic: 'Docker Compose & Multi-Container App Deployment',
      message: 'Seeking hands-on assistance containerizing a React frontend and Node.js backend with PostgreSQL.',
    },
  ]);

  // Selected Request Detail Modal State
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // New Post Session Request Modal State
  const [showPostModal, setShowPostModal] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year');
  const [domain, setDomain] = useState('Web Development');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handlePostRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErr('');

    if (!topic || !message) {
      setErr('Please fill in all required fields.');
      return;
    }

    const newReq = {
      id: `req-${Date.now()}`,
      name: name || user?.name || 'Student Participant',
      branch,
      year,
      domain,
      topic,
      message,
    };

    setPostSessionRequests([newReq, ...postSessionRequests]);
    setMsg('Post Session Request published successfully!');
    setTopic('');
    setMessage('');
    setShowPostModal(false);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Peer Learning Hub</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Skillora — Mentorship & Session Requests</h2>
          <p className="text-sm text-slate-400">
            Browse post session requests, view student domain details, and offer mentoring assistance.
          </p>
        </div>

        {user && user.role === 'STUDENT' && (
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Post Session Request</span>
          </button>
        )}
      </div>

      {msg && <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2"><CheckCircle2 className="w-4 h-4" /><span>{msg}</span></div>}
      {err && <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2"><ShieldAlert className="w-4 h-4" /><span>{err}</span></div>}

      {/* Post Session Requests List Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-heading flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span>Post Session Requests</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {postSessionRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelectedRequest(req)}
              className="glass-card p-5 rounded-2xl border border-white/10 hover:border-indigo-500/50 cursor-pointer transition-all flex flex-col justify-between space-y-3 shadow-md group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {req.domain}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{req.year}</span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {req.topic}
                </h4>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {req.message}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <strong className="text-slate-200">{req.name}</strong>
                </div>
                <span className="text-[11px] text-indigo-300 font-semibold underline">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel p-6 rounded-2xl border border-white/10 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white font-heading flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>Post Session Request Details</span>
              </h3>
              <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900 border border-white/5">
                <User className="w-4 h-4 text-indigo-400 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Name</span>
                  <span className="font-bold text-white text-base">{selectedRequest.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900 border border-white/5">
                  <GraduationCap className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">Branch</span>
                    <span className="font-bold text-slate-200 text-xs">{selectedRequest.branch}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900 border border-white/5">
                  <Layers className="w-4 h-4 text-amber-400 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">Year</span>
                    <span className="font-bold text-slate-200 text-xs">{selectedRequest.year}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900 border border-white/5">
                <BookOpen className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Domain</span>
                  <span className="font-bold text-emerald-300 text-xs">{selectedRequest.domain}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1">
                <span className="text-xs font-bold text-indigo-300 block uppercase">Topic</span>
                <span className="font-bold text-white text-sm block">{selectedRequest.topic}</span>
                <p className="text-xs text-slate-300 pt-1 leading-relaxed">{selectedRequest.message}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setMsg(`Offered to mentor ${selectedRequest.name} for topic "${selectedRequest.topic}"!`);
                setSelectedRequest(null);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25"
            >
              Offer Mentoring Assistance
            </button>
          </div>
        </div>
      )}

      {/* New Post Session Request Modal Form */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white font-heading">Post New Session Request</h3>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Branch</label>
                  <input
                    type="text"
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. CSE / ISE / AI & DS"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Domain</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                    <option value="Cloud DevOps">Cloud DevOps</option>
                    <option value="Database Systems">Database Systems</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Topic</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. React Hooks & State Management"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Message</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe what help or session you need..."
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25"
              >
                Publish Session Request
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
