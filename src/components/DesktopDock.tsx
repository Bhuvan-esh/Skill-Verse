'use client';

import React from 'react';
import { 
  KeyRound, 
  UserCheck, 
  Zap, 
  Users, 
  GraduationCap, 
  Lightbulb, 
  Code, 
  Mic, 
  Plus
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

export interface DockItem {
  id: string;
  title: string;
  type: string;
  isMinimized: boolean;
  isOpen: boolean;
}

interface DesktopDockProps {
  items: DockItem[];
  onToggleWindow: (id: string) => void;
  onOpenNewWindow: (type: string) => void;
}

export default function DesktopDock({ items, onToggleWindow, onOpenNewWindow }: DesktopDockProps) {
  const { user } = useAuth();

  const getIcon = (type: string) => {
    switch (type) {
      case 'LOGIN':
        return <KeyRound className="w-5 h-5 text-amber-400" />;
      case 'ROLE_SELECT':
        return <UserCheck className="w-5 h-5 text-purple-400" />;
      case 'FOUNDER_DASHBOARD':
        return <Zap className="w-5 h-5 text-amber-300" />;
      case 'ORGANIZER_DASHBOARD':
        return <UserCheck className="w-5 h-5 text-cyan-400" />;
      case 'PARTICIPANT_DASHBOARD':
        return <GraduationCap className="w-5 h-5 text-purple-400" />;
      case 'MENTOR_DASHBOARD':
        return <Users className="w-5 h-5 text-emerald-400" />;
      case 'SKILL_BARTER':
        return <Users className="w-5 h-5 text-amber-400" />;
      case 'IDEA_HUB':
        return <Lightbulb className="w-5 h-5 text-purple-400" />;
      case 'CODING_CHALLENGE':
        return <Code className="w-5 h-5 text-cyan-400" />;
      case 'SOFT_SKILL':
        return <Mic className="w-5 h-5 text-emerald-400" />;
      default:
        return <Lightbulb className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-2xl glass-panel border border-white/20 shadow-2xl backdrop-blur-2xl">
      {/* Quick Launch Icons */}
      <button
        onClick={() => onOpenNewWindow('LOGIN')}
        className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-amber-500/40 transition-all group relative"
        title="Open Login Access Gate"
      >
        <KeyRound className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono-code text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Login Gate
        </span>
      </button>

      {!user ? (
        <button
          onClick={() => onOpenNewWindow('ROLE_SELECT')}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-purple-500/40 transition-all group relative"
          title="Open Role Selection"
        >
          <UserCheck className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono-code text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Select Role
          </span>
        </button>
      ) : (
        <div
          className="px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1 select-none"
          title={`Session bound to ${user.role} role.`}
        >
          <span>🔒 {user.role} LOCKED</span>
        </div>
      )}

      <div className="w-px h-6 bg-white/10 my-auto mx-1" />

      {/* Active Windows Items */}
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onToggleWindow(item.id)}
          className={`p-2.5 rounded-xl border transition-all group relative ${
            item.isMinimized 
              ? 'bg-slate-900/40 border-white/5 opacity-60' 
              : 'bg-purple-950/40 border-purple-500/40 shadow-lg shadow-purple-500/20'
          }`}
          title={item.title}
        >
          {getIcon(item.type)}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono-code text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {item.title}
          </span>
          <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${item.isMinimized ? 'bg-amber-400' : 'bg-purple-400'}`} />
        </button>
      ))}
    </footer>
  );
}
