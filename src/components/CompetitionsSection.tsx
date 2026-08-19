'use client';

import React from 'react';
import StudentCodingHub from '@/components/coding/StudentCodingHub';

interface CompetitionsSectionProps {
  user: any;
  onRefresh: () => void;
  subTab?: string;
  setSubTab?: (subTab: string) => void;
}

export default function CompetitionsSection({ user, onRefresh, subTab, setSubTab }: CompetitionsSectionProps) {
  // Render complete Student Coding Arena Hub for participants
  return <StudentCodingHub user={user} onRefresh={onRefresh} subTab={subTab} setSubTab={setSubTab} />;
}
