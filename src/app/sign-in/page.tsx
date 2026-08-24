'use client';

import React from 'react';
import { SignInPage } from '@/components/ui/sign-in-flow-1';
import { useRouter } from 'next/navigation';

export default function SignInRoute() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-black text-white overflow-y-auto">
      <SignInPage onClose={() => router.push('/')} />
    </div>
  );
}
