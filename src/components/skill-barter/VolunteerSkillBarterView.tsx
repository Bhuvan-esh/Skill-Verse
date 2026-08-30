'use client';

import React from 'react';
import LockedWaitingForKey from '@/components/events/LockedWaitingForKey';

interface ViewProps {
  user?: any;
  onRefresh?: () => void;
}

export default function VolunteerSkillBarterView({ user, onRefresh }: ViewProps) {
  return (
    <div className="w-full flex items-center justify-center">
      <LockedWaitingForKey
        backHref="/horizon"
        customPillarTitle="Skill Barter · Community Ambassador"
      />
    </div>
  );
}
