'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, ShieldCheck, Lock, Sparkles } from 'lucide-react';

interface PrivateChannelProps {
  user: any;
}

export default function PrivateFounderChannel({ user }: PrivateChannelProps) {
  const [channel, setChannel] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchChannel = async () => {
    try {
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
      setLoading(false);
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
    fetchChannel();
  }, []);

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Private Student ↔ Founders Hotline</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Direct Founder Idea Channel</h2>
          <p className="text-sm text-slate-400">Direct private line to all 7 club founders. Share confidential idea proposals or follow up on reviews.</p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="glass-panel rounded-2xl border border-white/10 flex flex-col h-[500px] overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-900/90 border-b border-white/10 flex items-center space-x-2 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted 1:1 Channel | Visible strictly to <strong>{user?.name}</strong> and 7 Club Founders</span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {loading ? (
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
            className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs"
          />
          <button type="submit" className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
