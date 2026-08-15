'use client';

import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, Send, CheckCircle2, XCircle, Award, MessageSquare, Plus, Check } from 'lucide-react';

interface IdeaHubProps {
  user: any;
  onRefresh: () => void;
}

export default function IdeaHubSection({ user, onRefresh }: IdeaHubProps) {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [headcounts, setHeadcounts] = useState<Record<string, number>>({});
  const [ideaOfTheDay, setIdeaOfTheDay] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Idea Submission Form state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Skill League');
  const [lectureId, setLectureId] = useState('CS-Lec-1');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Fetch Ideas
  const fetchIdeas = async () => {
    try {
      const res = await fetch('/api/ideas');
      const data = await res.json();
      if (res.ok) {
        setIdeas(data.ideas || []);
        setHeadcounts(data.lectureHeadcounts || {});
        setIdeaOfTheDay(data.ideaOfTheDay);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, lecture_id: lectureId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSubmitSuccess('Idea submitted successfully! Check your private Founder Channel for updates.');
      setTitle('');
      setDescription('');
      fetchIdeas();
      onRefresh();
      setTimeout(() => setShowSubmitModal(false), 2000);
    } catch (err: any) {
      setSubmitError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Banner & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Club Student Innovation Hub</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Submit & Explore Club Ideas</h2>
          <p className="text-sm text-slate-400">Transform student concepts into live club competitions and earned credits.</p>
        </div>

        {user && user.role === 'STUDENT' && (
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Idea</span>
          </button>
        )}
      </div>

      {/* Idea of the Day Spotlight Card */}
      {ideaOfTheDay && (
        <div className="relative overflow-hidden glass-panel p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 glow-gold">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>Idea of the Day — Featured Spotlight</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{ideaOfTheDay.title}</h3>
          <p className="text-sm text-slate-300 mb-3">{ideaOfTheDay.description}</p>
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span>Proposed by: <strong className="text-amber-300">{ideaOfTheDay.student?.name}</strong></span>
            <span>Category: <strong className="text-slate-200">{ideaOfTheDay.category}</strong></span>
            <span>Lecture: <strong className="text-slate-200">{ideaOfTheDay.lecture_id}</strong></span>
          </div>
        </div>
      )}

      {/* Lecture Headcount Tally Section */}
      <div className="glass-panel p-5 rounded-2xl">
        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Lecture Headcount Tallies</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['CS-Lec-1', 'CS-Lec-2', 'CS-Lec-3', 'CS-Lec-4'].map((lec) => (
            <div key={lec} className="glass-card p-3 rounded-xl text-center border border-white/5">
              <span className="text-xs text-slate-400 font-medium">{lec}</span>
              <div className="text-xl font-extrabold text-blue-400 font-heading">
                {headcounts[lec] || 0} <span className="text-xs font-normal text-slate-400">submissions</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Public Ideas List Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-heading flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-blue-400" />
          <span>Public Idea Submissions Feed</span>
        </h3>

        {loading ? (
          <div className="text-center py-8 text-slate-400 text-sm">Loading ideas feed...</div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm glass-card rounded-2xl">No ideas submitted yet. Be the first!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideas.map((idea) => (
              <div key={idea.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-blue-300 border border-blue-500/20">
                      {idea.category}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        idea.status === 'APPROVED' || idea.status === 'FEATURED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : idea.status === 'REJECTED'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {idea.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">{idea.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{idea.description}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>By: <strong className="text-slate-200">{idea.student?.name}</strong></span>
                  <span className="bg-slate-900 px-2 py-1 rounded text-[11px]">{idea.lecture_id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Idea Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xl font-bold text-white font-heading">Submit Idea to Hub</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {submitError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">{submitError}</div>}
            {submitSuccess && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">{submitSuccess}</div>}

            <form onSubmit={handleSubmitIdea} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Idea Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI Code Review Hackathon"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your idea concept and objectives..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
                  >
                    <option value="Skill League">Skill League</option>
                    <option value="Coding Challenge">Coding Challenge</option>
                    <option value="Micro-Mentorship">Micro-Mentorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lecture</label>
                  <select
                    value={lectureId}
                    onChange={(e) => setLectureId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
                  >
                    <option value="CS-Lec-1">CS-Lec-1</option>
                    <option value="CS-Lec-2">CS-Lec-2</option>
                    <option value="CS-Lec-3">CS-Lec-3</option>
                    <option value="CS-Lec-4">CS-Lec-4</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/25"
              >
                Submit Idea
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
