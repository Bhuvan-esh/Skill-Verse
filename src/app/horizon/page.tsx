'use client';

import React from 'react';
import { Component as HorizonHeroSection } from '@/components/ui/horizon-hero-section';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function HorizonPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
    router.push('/join');
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-y-auto selection:bg-purple-500 selection:text-white">
      <HorizonHeroSection onLogout={handleLogout} />
    </div>
  );
}
