'use client';

import React, { useState } from 'react';
import StudentSkillBarterView from './StudentSkillBarterView';
import FounderSkillBarterView from './FounderSkillBarterView';
import MentorSkillBarterView from './MentorSkillBarterView';
import VolunteerSkillBarterView from './VolunteerSkillBarterView';
import { MousePointerClick, ShieldX } from 'lucide-react';

interface SkillBarterProps {
  user: any;
  onRefresh: () => void;
}

export default function SkillBarterSection({ user, onRefresh }: SkillBarterProps) {
  const roleStr = (user?.role || '').toUpperCase();
  const nameStr = (user?.name || '').toUpperCase();

  // Strict role classification
  const isFounder = roleStr === 'FOUNDER' || nameStr.includes('ARCHITECT') || nameStr.includes('FOUNDER');
  const isMentor = roleStr === 'MENTOR' || nameStr.includes('MENTOR');
  const isVolunteer = roleStr === 'VOLUNTEER' || nameStr.includes('AMBASSADOR') || nameStr.includes('VOLUNTEER');

  const isNonParticipant = isFounder || isVolunteer || isMentor;
  const isParticipant = !isNonParticipant;

  // Double click toggle state for non-participant roles
  const [showDefaultPage, setShowDefaultPage] = useState(false);

  // If logged in as Participant (Student): Show full participant contents immediately
  if (isParticipant) {
    return <StudentSkillBarterView user={user} onRefresh={onRefresh} />;
  }

  // Determine role display name for non-participants
  const getRoleDisplayName = () => {
    if (isFounder) return 'Visual Architect';
    if (isMentor) return 'Mentor';
    return 'Community Ambassador';
  };

  const roleName = getRoleDisplayName();

  // Render non-participant view (content removed)
  const renderNonParticipantContent = () => {
    if (isFounder) {
      return <FounderSkillBarterView user={user} onRefresh={onRefresh} />;
    }
    if (isMentor) {
      return <MentorSkillBarterView user={user} onRefresh={onRefresh} />;
    }
    return <VolunteerSkillBarterView user={user} onRefresh={onRefresh} />;
  };

  return (
    <div
      onDoubleClick={() => setShowDefaultPage((prev) => !prev)}
      className="cursor-pointer select-none transition-all space-y-4"
      title="Double-click anywhere on the page to toggle view"
    >
      {!showDefaultPage ? (
        <div className="glass-panel p-16 rounded-2xl border border-white/10 min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 shadow-2xl group hover:border-purple-500/40 transition-all bg-slate-950/80">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
            <MousePointerClick className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-2 max-w-md">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-bold">
              <span>{roleName} Portal</span>
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              SkillBarter Entry Gate
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              SkillBarter content for <strong className="text-purple-300 font-semibold">{roleName}</strong> accounts is restricted.<br />
              <strong className="text-purple-300 font-bold">Double-click anywhere on this page</strong> to enter SkillBarter.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 px-3.5 py-1.5 rounded-full bg-slate-900 border border-white/10">
            🖱️ Double-click page to enter SkillBarter
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
            <span className="font-semibold">✨ Entered SkillBarter View ({roleName})</span>
            <span className="text-[10px] font-mono opacity-75">Double-click page anytime to return</span>
          </div>
          {renderNonParticipantContent()}
        </div>
      )}
    </div>
  );
}
