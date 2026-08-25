'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  Lock,
  Sparkles,
  Clock,
  CheckCircle2,
  HelpCircle,
  Users,
  Eye,
  EyeOff,
  User,
  Layers,
  ChevronRight,
  Filter,
  AlertCircle,
  Search,
  X,
  Lightbulb,
  Check,
} from 'lucide-react';

interface PrivateChannelProps {
  user: any;
}

interface OpenDeskQuery {
  id: string;
  student_id: string;
  student_name: string;
  student_usn?: string;
  category: string;
  topic: string;
  query: string;
  created_at: string;
  status: 'PENDING' | 'ANSWERED';
  is_public: boolean;
  reply?: string;
  replied_by?: string;
  replied_at?: string;
}

export default function PrivateFounderChannel({ user }: PrivateChannelProps) {
  // Main view tabs: 'query_desk' | 'direct_chat'
  const [activeViewTab, setActiveViewTab] = useState<'query_desk' | 'direct_chat'>('query_desk');

  // Query Desk Filter: 'public_answered' | 'my_queries' | 'pending_queue'
  const [queryFilter, setQueryFilter] = useState<'public_answered' | 'my_queries' | 'pending_queue'>('public_answered');

  // Search in Knowledge Desk
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState('ALL');

  // Check if current user is Visual Architect / Founder
  const roleStr = (user?.role || '').toUpperCase();
  const nameStr = (user?.name || '').toUpperCase();
  const isVisualArchitect = roleStr === 'FOUNDER' || nameStr.includes('ARCHITECT') || nameStr.includes('FOUNDER');

  // Queries state
  const [queries, setQueries] = useState<OpenDeskQuery[]>([]);
  const [loadingQueries, setLoadingQueries] = useState(true);

  // New Query Form state
  const [newCategory, setNewCategory] = useState('SkillBarter & Exchanges');
  const [newTopic, setNewTopic] = useState('');
  const [newQueryText, setNewQueryText] = useState('');
  const [submittingQuery, setSubmittingQuery] = useState(false);
  const [querySuccessMsg, setQuerySuccessMsg] = useState('');
  const [queryErrorMsg, setQueryErrorMsg] = useState('');

  // Visual Architect Reply Form state
  const [replyingQueryId, setReplyingQueryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // 1:1 Direct Chat state (Preserved)
  const [channel, setChannel] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingChat, setLoadingChat] = useState(true);

  /* ── Fetch Open Desk Queries ─────────────────────────────────────────────── */
  const fetchQueries = async () => {
    try {
      setLoadingQueries(true);
      const res = await fetch('/api/open-desk/queries');
      const data = await res.json();
      if (res.ok && data.queries) {
        setQueries(data.queries);
      }
    } catch (e) {
      console.error('Failed to fetch open desk queries:', e);
    } finally {
      setLoadingQueries(false);
    }
  };

  /* ── Fetch Direct Chat Channel ───────────────────────────────────────────── */
  const fetchChannel = async () => {
    try {
      setLoadingChat(true);
      const res = await fetch('/api/ideas/channel');
      const data = await res.json();
      if (res.ok) {
        setChannel(data.channel);
        if (data.channel) {
          fetchMessages(data.channel.id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingChat(false);
    }
  };

  const fetchMessages = async (channelId: string) => {
    try {
      const res = await fetch(`/api/ideas/channel/${channelId}/messages`);
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchQueries();
    fetchChannel();
  }, []);

  /* ── Submit Query by Student ─────────────────────────────────────────────── */
  const handlePostQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuerySuccessMsg('');
    setQueryErrorMsg('');

    if (!newTopic.trim() || !newQueryText.trim()) {
      setQueryErrorMsg('Please fill in both the query topic and detailed message.');
      return;
    }

    try {
      setSubmittingQuery(true);
      const res = await fetch('/api/open-desk/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newCategory,
          topic: newTopic.trim(),
          query: newQueryText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setQuerySuccessMsg('Your query has been sent to the Visual Architects! Guaranteed response within 24 hours.');
        setNewTopic('');
        setNewQueryText('');
        fetchQueries();
      } else {
        setQueryErrorMsg(data.error || 'Failed to submit query.');
      }
    } catch (e: any) {
      setQueryErrorMsg(e.message || 'An error occurred while submitting query.');
    } finally {
      setSubmittingQuery(false);
    }
  };

  /* ── Submit Official Reply by Visual Architect ───────────────────────────── */
  const handleReplyQuery = async (queryId: string) => {
    if (!replyText.trim()) return;

    try {
      setSubmittingReply(true);
      const res = await fetch('/api/open-desk/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REPLY',
          queryId,
          replyText: replyText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReplyingQueryId(null);
        setReplyText('');
        fetchQueries();
      } else {
        alert(data.error || 'Failed to publish reply.');
      }
    } catch (e: any) {
      alert(e.message || 'An error occurred while replying.');
    } finally {
      setSubmittingReply(false);
    }
  };

  /* ── Send Message in Direct Chat ─────────────────────────────────────────── */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channel || !inputText.trim()) return;
    try {
      const res = await fetch(`/api/ideas/channel/${channel.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
        setInputText('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered queries based on active tab
  const publicAnsweredQueries = useMemo(
    () => queries.filter((q) => q.status === 'ANSWERED' && q.is_public),
    [queries]
  );
  const myQueries = queries.filter(
    (q) => q.student_id === user?.id || q.student_name === user?.name
  );
  const pendingQueries = queries.filter((q) => q.status === 'PENDING');

  // Search filtered answered queries
  const filteredAnsweredQueries = useMemo(() => {
    return publicAnsweredQueries.filter((q) => {
      const matchCat =
        selectedSearchCategory === 'ALL' || q.category.toLowerCase().includes(selectedSearchCategory.toLowerCase());
      const queryStr = searchKeyword.toLowerCase().trim();
      if (!queryStr) return matchCat;

      const matchTopic = q.topic.toLowerCase().includes(queryStr);
      const matchQuery = q.query.toLowerCase().includes(queryStr);
      const matchReply = (q.reply || '').toLowerCase().includes(queryStr);
      const matchCategory = q.category.toLowerCase().includes(queryStr);

      return matchCat && (matchTopic || matchQuery || matchReply || matchCategory);
    });
  }, [publicAnsweredQueries, searchKeyword, selectedSearchCategory]);

  // Real-time duplicate check when student types a query
  const duplicateMatches = useMemo(() => {
    const combinedInput = `${newTopic} ${newQueryText}`.trim().toLowerCase();
    if (combinedInput.length < 3) return [];

    const words = combinedInput
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z0-9]/g, ''))
      .filter((w) => w.length >= 3 && !['the', 'and', 'for', 'with', 'this', 'that', 'from', 'what', 'have', 'how'].includes(w));

    if (words.length === 0) return [];

    return publicAnsweredQueries.filter((q) => {
      const corpus = `${q.topic} ${q.query} ${q.category} ${q.reply || ''}`.toLowerCase();
      return words.some((word) => corpus.includes(word));
    });
  }, [newTopic, newQueryText, publicAnsweredQueries]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Open Desk Header ─────────────────────────────────────────────── */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Visual Architect Open Desk</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Open Desk Channel</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Direct communication link with Visual Architects. Search answered questions or ask a new verified query.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-white/10 rounded-xl shrink-0">
          <button
            onClick={() => setActiveViewTab('query_desk')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeViewTab === 'query_desk'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Visual Architect Query Desk</span>
          </button>
          <button
            onClick={() => setActiveViewTab('direct_chat')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeViewTab === 'direct_chat'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>1:1 Encrypted Line</span>
          </button>
        </div>
      </div>

      {/* ── 24-HOUR RESPONSE PROMISE BANNER ───────────────────────────────── */}
      <div className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-indigo-950/40 to-blue-950/50 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-purple-300 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-bold text-white tracking-wide">
              Visual Architect will reply to your query within 24 hours.
            </p>
            <p className="text-[11px] text-purple-200/70">
              Check the Answered Knowledge Desk below before asking to see if your question is already answered!
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-300 text-[10px] font-mono font-bold tracking-wider uppercase shrink-0">
          Guaranteed SLA
        </span>
      </div>

      {/* =================================================================== */}
      {/* VIEW 1: VISUAL ARCHITECT QUERY DESK                                 */}
      {/* =================================================================== */}
      {activeViewTab === 'query_desk' && (
        <div className="space-y-6">
          {/* Submit a Query Box */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span>Ask a Query to Visual Architects</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                🔒 Private until answered
              </span>
            </div>

            {querySuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{querySuccessMsg}</span>
              </div>
            )}

            {queryErrorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{queryErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePostQuery} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="SkillBarter & Exchanges">SkillBarter & Exchanges</option>
                    <option value="Architecture & Credits">Architecture & Credits</option>
                    <option value="Session Guidelines">Session Guidelines</option>
                    <option value="Reputation Marks">Reputation Marks</option>
                    <option value="Technical Question">Technical Question</option>
                    <option value="General Open Desk">General Open Desk</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Topic / Question Subject</label>
                  <input
                    type="text"
                    required
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="e.g. How are SkillBarter credits synced with Domain 4?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* ── REAL-TIME DUPLICATE / SIMILAR ANSWER PREVIEW ────────────── */}
              {duplicateMatches.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                      <span>Found Similar Answered Questions in Knowledge Desk:</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                      {duplicateMatches.length} Match{duplicateMatches.length > 1 ? 'es' : ''} Found
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Visual Architects have already answered a related question. Check if the solution below answers your query immediately:
                  </p>

                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {duplicateMatches.slice(0, 3).map((match) => (
                      <div key={match.id} className="p-3 rounded-xl bg-slate-950/90 border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{match.topic}</span>
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                            ✓ Answered
                          </span>
                        </div>
                        <p className="text-xs text-purple-200 bg-purple-950/40 p-2.5 rounded-lg border border-purple-500/20 leading-relaxed">
                          {match.reply}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-amber-500/20">
                    <button
                      type="button"
                      onClick={() => {
                        setNewTopic('');
                        setNewQueryText('');
                        setQuerySuccessMsg('Great! Your question was already answered in the Knowledge Desk.');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>My Question is Answered! (Clear Form)</span>
                    </button>
                    <span className="text-[10px] text-slate-400">
                      Or continue typing below if you still need a custom answer
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Your Detailed Query</label>
                <textarea
                  required
                  rows={3}
                  value={newQueryText}
                  onChange={(e) => setNewQueryText(e.target.value)}
                  placeholder="Explain your question or topic in detail. Visual Architects will review and post an official response within 24 hours..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                  <span>Only Visual Architects can reply. Once replied, your query helps other participants.</span>
                </div>

                <button
                  type="submit"
                  disabled={submittingQuery}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingQuery ? 'Sending...' : 'Send Query to Visual Architect'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* ── KNOWLEDGE DESK SEARCH & INSTANT QUERY CHECKER ─────────────── */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Instant Knowledge Search & Recent Queries
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Check before asking · Avoid duplicate questions
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 items-center">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search answered questions by keyword (e.g. credits, barter, domain 4, rating)..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-950/90 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                {searchKeyword && (
                  <button
                    onClick={() => setSearchKeyword('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={selectedSearchCategory}
                onChange={(e) => setSelectedSearchCategory(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-blue-500 shrink-0"
              >
                <option value="ALL">All Categories</option>
                <option value="SkillBarter">SkillBarter & Exchanges</option>
                <option value="Architecture">Architecture & Credits</option>
                <option value="Guidelines">Session Guidelines</option>
                <option value="Reputation">Reputation Marks</option>
              </select>
            </div>

            {searchKeyword && (
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>
                  Found <strong className="text-white">{filteredAnsweredQueries.length}</strong> answered{' '}
                  {filteredAnsweredQueries.length === 1 ? 'question' : 'questions'} matching &ldquo;
                  <span className="text-blue-300">{searchKeyword}</span>&rdquo;
                </span>
                <button
                  onClick={() => {
                    setSearchKeyword('');
                    setSelectedSearchCategory('ALL');
                  }}
                  className="text-blue-400 hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Queries Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQueryFilter('public_answered')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  queryFilter === 'public_answered'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Answered Knowledge Desk ({publicAnsweredQueries.length})</span>
              </button>

              <button
                onClick={() => setQueryFilter('my_queries')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  queryFilter === 'my_queries'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>My Queries ({myQueries.length})</span>
              </button>

              {isVisualArchitect && (
                <button
                  onClick={() => setQueryFilter('pending_queue')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    queryFilter === 'pending_queue'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-amber-500/10 text-amber-300 hover:text-white border border-amber-500/20'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pending Queue ({pendingQueries.length})</span>
                </button>
              )}
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              {queryFilter === 'public_answered' && 'Showing official answers visible to all participants'}
              {queryFilter === 'my_queries' && 'Showing your private & answered queries'}
              {queryFilter === 'pending_queue' && 'Visual Architect Review Workspace'}
            </span>
          </div>

          {/* Queries List */}
          <div className="space-y-4">
            {loadingQueries ? (
              <div className="p-12 text-center text-sm text-slate-400 glass-panel rounded-2xl border border-white/10">
                Loading Open Desk queries...
              </div>
            ) : (
              (() => {
                const currentList =
                  queryFilter === 'public_answered'
                    ? filteredAnsweredQueries
                    : queryFilter === 'my_queries'
                    ? myQueries
                    : pendingQueries;

                if (currentList.length === 0) {
                  return (
                    <div className="p-12 text-center text-sm text-slate-400 glass-panel rounded-2xl border border-white/10 space-y-2">
                      <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
                      <p>
                        {queryFilter === 'public_answered' && searchKeyword
                          ? `No answered queries found matching "${searchKeyword}". You can ask your query above!`
                          : queryFilter === 'public_answered'
                          ? 'No public answered queries yet. Ask a query above!'
                          : queryFilter === 'my_queries'
                          ? 'You have not submitted any queries yet.'
                          : 'No pending queries awaiting reply. All caught up!'}
                      </p>
                    </div>
                  );
                }

                return currentList.map((q) => {
                  const isReplyingThis = replyingQueryId === q.id;

                  return (
                    <div
                      key={q.id}
                      className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden"
                    >
                      {/* Query Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs shadow-md">
                            {q.student_name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{q.student_name}</p>
                            <p className="text-[10px] font-mono text-slate-500">
                              {new Date(q.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {new Date(q.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-mono font-semibold">
                            {q.category}
                          </span>

                          {q.status === 'ANSWERED' ? (
                            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>ANSWERED · VISIBLE TO ALL</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3 animate-pulse" />
                              <span>AWAITING REPLY (24h SLA)</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Query Body */}
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                          <span>{q.topic}</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.04]">
                          {q.query}
                        </p>
                      </div>

                      {/* Official Visual Architect Reply */}
                      {q.reply && (
                        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 via-[#101222] to-slate-900 border border-purple-500/30 space-y-2 shadow-inner">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center text-xs text-white font-bold shadow-md">
                                VA
                              </div>
                              <div>
                                <span className="text-xs font-bold text-purple-200">
                                  {q.replied_by || 'Visual Architect'}
                                </span>
                                <span className="ml-2 px-2 py-0.2 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  OFFICIAL RESPONSE
                                </span>
                              </div>
                            </div>

                            {q.replied_at && (
                              <span className="text-[10px] font-mono text-purple-300/70">
                                {new Date(q.replied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {new Date(q.replied_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-purple-100/90 leading-relaxed pt-1 pl-8">
                            {q.reply}
                          </p>

                          <div className="pt-2 pl-8 border-t border-purple-500/20 flex items-center justify-between text-[10px] text-purple-300/60 font-mono">
                            <span>✓ Verified Knowledge Item</span>
                            <span>🔒 Participant replies are disabled on official answers</span>
                          </div>
                        </div>
                      )}

                      {/* Visual Architect Reply Form (Only for Visual Architects / Founders) */}
                      {isVisualArchitect && q.status === 'PENDING' && (
                        <div className="pt-2 border-t border-white/[0.06]">
                          {!isReplyingThis ? (
                            <button
                              onClick={() => {
                                setReplyingQueryId(q.id);
                                setReplyText('');
                              }}
                              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Write Official Visual Architect Reply</span>
                            </button>
                          ) : (
                            <div className="space-y-3 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30">
                              <label className="text-[10px] font-mono uppercase text-purple-300 font-bold">
                                Official Answer (Will be broadcasted to all participants)
                              </label>
                              <textarea
                                rows={3}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type the official answer for this query..."
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-purple-500/40 text-xs text-white placeholder-slate-500 focus:outline-none"
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setReplyingQueryId(null)}
                                  className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={submittingReply || !replyText.trim()}
                                  onClick={() => handleReplyQuery(q.id)}
                                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                                >
                                  {submittingReply ? 'Publishing...' : 'Publish Answer to All Participants'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                });
              })()
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW 2: 1:1 DIRECT ENCRYPTED FOUNDER CHANNEL (PRESERVED)             */}
      {/* =================================================================== */}
      {activeViewTab === 'direct_chat' && (
        <div className="glass-panel rounded-2xl border border-white/10 flex flex-col h-[520px] overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Encrypted 1:1 Channel | Visible strictly to <strong>{user?.name}</strong> and Club Founders</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live Connection
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {loadingChat ? (
              <div className="text-center py-8 text-slate-400 text-sm">Loading channel messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-2 opacity-50" />
                <span>No messages yet. Send a message to start a discussion with the founders!</span>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = user && m.sender_id === user.id;
                const isFounder = m.sender?.role === 'FOUNDER';
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className="text-[11px] font-bold text-slate-300">{m.sender?.name}</span>
                      {isFounder && (
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">
                          FOUNDER
                        </span>
                      )}
                    </div>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                        : isFounder
                        ? 'bg-purple-950/80 text-purple-100 border border-purple-500/30 rounded-tl-none'
                        : 'bg-slate-800 text-slate-200 border border-white/10 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1">{new Date(m.sent_at).toLocaleTimeString()}</span>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-white/10 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message to founders..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md cursor-pointer transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
