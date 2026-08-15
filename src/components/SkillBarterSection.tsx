'use client';

import React, { useState, useEffect } from 'react';
import { Users, Star, MessageSquare, CheckCircle2, Award, Plus, Send, XCircle, ShieldAlert, Sparkles, ThumbsUp } from 'lucide-react';

interface SkillBarterProps {
  user: any;
  onRefresh: () => void;
}

export default function SkillBarterSection({ user, onRefresh }: SkillBarterProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  // Post Request Modal state
  const [showPostModal, setShowPostModal] = useState(false);
  const [skill, setSkill] = useState('');
  const [message, setMessage] = useState('');

  // Active 1:1 Chat Drawer state
  const [activeChat, setActiveChat] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Feedback Modal state
  const [feedbackChat, setFeedbackChat] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchSkillRequests = async () => {
    try {
      const res = await fetch('/api/skill-barter/requests');
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillRequests();
  }, []);

  const handlePostRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      const res = await fetch('/api/skill-barter/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg('Skill help request posted to public hub!');
      setSkill(''); setMessage('');
      setShowPostModal(false);
      fetchSkillRequests();
      onRefresh();
    } catch (error: any) {
      setErr(error.message);
    }
  };

  const handleOfferHelp = async (requestId: string) => {
    setMsg(''); setErr('');
    try {
      const res = await fetch(`/api/skill-barter/requests/${requestId}/respond`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg('Your offer to mentor has been posted with your public stats!');
      fetchSkillRequests();
    } catch (error: any) {
      setErr(error.message);
    }
  };

  const handleSelectMentor = async (requestId: string, mentorId: string) => {
    setMsg(''); setErr('');
    try {
      const res = await fetch(`/api/skill-barter/requests/${requestId}/select-mentor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentor_id: mentorId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg('Mentor selected! Private 1:1 chat established.');
      fetchSkillRequests();
      openChat(data.chat_id);
    } catch (error: any) {
      setErr(error.message);
    }
  };

  const openChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/skill-barter/chats/${chatId}/messages`);
      const data = await res.json();
      if (res.ok) {
        setActiveChat(data.chat);
        setChatMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !chatInput.trim()) return;
    try {
      const res = await fetch(`/api/skill-barter/chats/${activeChat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: chatInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setChatMessages((prev) => [...prev, data.message]);
        setChatInput('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompleteSession = async (chatId: string) => {
    try {
      const res = await fetch(`/api/skill-barter/chats/${chatId}/complete`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMsg('Session marked complete! Founders notified & topics taught auto-updated.');
        setFeedbackChat(activeChat);
        setActiveChat(null);
        fetchSkillRequests();
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackChat) return;
    try {
      const res = await fetch(`/api/skill-barter/chats/${feedbackChat.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Mentee feedback & rating submitted successfully!');
        setFeedbackChat(null);
        fetchSkillRequests();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Peer Learning Marketplace</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Skill-Barter & Micro-Mentorship</h2>
          <p className="text-sm text-slate-400">Post public learning requests, evaluate mentor stats, and connect via private 1:1 sessions.</p>
        </div>

        {user && user.role === 'STUDENT' && (
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post Help Request</span>
          </button>
        )}
      </div>

      {msg && <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2"><CheckCircle2 className="w-4 h-4" /><span>{msg}</span></div>}
      {err && <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2"><ShieldAlert className="w-4 h-4" /><span>{err}</span></div>}

      {/* Requests Feed */}
      {loading ? (
        <div className="text-center py-8 text-slate-400 text-sm">Loading skill requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm glass-card rounded-2xl">No skill requests posted yet.</div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => {
            const isRequester = user && req.requester_id === user.id;
            const hasResponded = user && req.responses?.some((r: any) => r.responder.id === user.id);
            const activeChatSession = req.chats?.find((c: any) => c.status === 'ACTIVE');

            return (
              <div key={req.id} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Wants to learn: {req.skill}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2">{req.message}</h3>
                    <p className="text-xs text-slate-400">Posted by <strong>{req.requester?.name}</strong> ({req.requester?.usn})</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                      req.status === 'MATCHED' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {req.status}
                    </span>
                    {activeChatSession && (isRequester || activeChatSession.mentor_id === user?.id) && (
                      <button
                        onClick={() => openChat(activeChatSession.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center space-x-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Open 1:1 Chat</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Responders Comparison Feed */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Offers to Mentor ({req.responses?.length || 0})
                  </h4>

                  {req.responses?.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No mentors have offered help yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {req.responses.map((resp: any) => {
                        const rStudent = resp.responder;
                        return (
                          <div key={resp.id} className="glass-panel p-4 rounded-xl border border-white/5 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-white">{rStudent.name}</span>
                              <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <span>{rStudent.average_rating} ({rStudent.feedback_count})</span>
                              </div>
                            </div>

                            <div className="text-xs text-slate-300 space-y-1">
                              <p>Total Credits: <strong className="text-blue-400">{rStudent.credits ? rStudent.credits.domain_1 + rStudent.credits.domain_2 + rStudent.credits.domain_3 + rStudent.credits.domain_4 : 0}</strong></p>
                              <p>Topics Taught: <span className="text-purple-300">{rStudent.topics_taught?.join(', ') || 'None yet'}</span></p>
                            </div>

                            {/* Requester Select Mentor Action */}
                            {isRequester && req.status === 'OPEN' && (
                              <button
                                onClick={() => handleSelectMentor(req.id, rStudent.id)}
                                className="w-full mt-2 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md"
                              >
                                Accept & Start 1:1 Chat
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!isRequester && !hasResponded && req.status === 'OPEN' && (
                    <button
                      onClick={() => handleOfferHelp(req.id)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                    >
                      Offer to Mentor this Student
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Skill Request Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white font-heading">Post Skill Help Request</h3>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-white"><XCircle className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handlePostRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic / Skill Needed</label>
                <input
                  type="text"
                  required
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="e.g. Python AsyncIO / React Hooks"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Request Message</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain what specific concept you want to learn..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg">
                Post Request to Marketplace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Active 1:1 Chat Drawer Modal */}
      {activeChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl glass-panel rounded-2xl border border-white/10 flex flex-col h-[550px] shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-heading">Private 1:1 Mentor Chat</h3>
                <p className="text-xs text-slate-400">
                  Requester: <strong>{activeChat.requester?.name}</strong> | Mentor: <strong>{activeChat.mentor?.name}</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCompleteSession(activeChat.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
                >
                  Mark Session Complete
                </button>
                <button onClick={() => setActiveChat(null)} className="text-slate-400 hover:text-white p-1">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((m) => {
                const isMe = user && m.sender_id === user.id;
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-slate-400 mb-0.5">{m.sender?.name}</span>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs ${
                      isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-white/10 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-slate-900 border-t border-white/10 flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message..."
                className="flex-1 px-4 py-2 rounded-xl glass-input text-xs"
              />
              <button type="submit" className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mentee Feedback Modal */}
      {feedbackChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-white font-heading">Rate Your Mentor</h3>
              <p className="text-xs text-slate-400">Leave feedback for your mentorship session</p>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Star Rating (1 - 5 Stars)</label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-xl transition-all ${
                        rating >= star ? 'text-amber-400 bg-amber-500/20' : 'text-slate-600 bg-slate-900'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Comment (Optional)</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share feedback on your mentor's explanation & guidance..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg">
                Submit Mentor Feedback
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
