'use client';

import React from 'react';
import { ShieldCheck, ShieldX, Info } from 'lucide-react';

interface ViewProps {
  user: any;
  onRefresh: () => void;
}

export default function FounderSkillBarterView({ user }: ViewProps) {
  return (
    <div className="space-y-6">
      
      {/* Visual Architect Header */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Visual Architect (Founder) Portal</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">SkillBarter — Visual Architect View</h2>
          <p className="text-sm text-slate-400">
            Platform governance and oversight for peer skill barter systems.
          </p>
        </div>
      </div>

      {/* Content Removed State */}
      <div className="glass-panel p-12 rounded-2xl border border-purple-500/20 bg-slate-950/90 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <ShieldX className="w-7 h-7" />
        </div>
        <div className="space-y-2 max-w-lg mx-auto">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-bold">
            Content Removed for Visual Architects
          </span>
          <h3 className="text-lg font-bold text-white font-heading">
            SkillBarter Active Content Removed
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            SkillBarter session requests, active mentorship queues, and credit exchange forms have been removed for <strong className="text-purple-300">Visual Architect</strong> accounts.<br />
            All active SkillBarter session features remain intact exclusively for <strong className="text-emerald-300">Participants</strong>.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-400 font-mono">
          <Info className="w-4 h-4 text-purple-400" />
          <span>Double-click anywhere on this page to exit this view.</span>
        </div>
      </div>

    </div>
  );
}
