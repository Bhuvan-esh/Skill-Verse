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
  initialTab?: 'requests' | 'sessions' | 'discover' | 'achievements' | 'profile';
}

export default function SkillBarterSection({ user, onRefresh, initialTab }: SkillBarterProps) {
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
    return <StudentSkillBarterView user={user} onRefresh={onRefresh} initialTab={initialTab} />;
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
        <div className="p-12 sm:p-16 rounded-2xl border border-white/[0.08] min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 shadow-2xl bg-[#12162A]/80 backdrop-blur-md font-sans transition-all hover:border-[#6D3DF5]/40">
          <div className="w-14 h-14 rounded-2xl bg-[#6D3DF5]/15 border border-[#6D3DF5]/30 flex items-center justify-center text-[#A78BFA] transition-transform shadow-lg shadow-[#6D3DF5]/20">
            <MousePointerClick className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-2 max-w-md">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#6D3DF5]/15 border border-[#6D3DF5]/30 text-[#A78BFA] text-xs font-semibold">
              <span>{roleName} Portal</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              SkillBarter Entry Gate
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              SkillBarter content for <strong className="text-white font-semibold">{roleName}</strong> accounts is restricted.<br />
              <strong className="text-[#A78BFA] font-semibold">Double-click anywhere on this page</strong> to enter SkillBarter.
            </p>
          </div>
          <span className="text-[11px] text-slate-400 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
            🖱️ Double-click page to enter SkillBarter
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#6D3DF5]/15 border border-[#6D3DF5]/30 text-xs text-[#A78BFA]">
            <span className="font-semibold">✨ Entered SkillBarter View ({roleName})</span>
            <span className="text-[11px] opacity-75">Double-click page anytime to return</span>
          </div>
          {renderNonParticipantContent()}
        </div>
      )}
    </div>
  );
}
