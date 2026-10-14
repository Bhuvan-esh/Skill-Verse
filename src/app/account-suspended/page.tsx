'use client';

import React from 'react';
import { ShieldOff, LogOut } from 'lucide-react';
import { logOut } from '@/lib/authService';
import { useRouter } from 'next/navigation';

export default function AccountSuspendedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#08070d] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center mx-auto">
          <ShieldOff className="w-8 h-8 text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Account suspended</h1>
          <p className="text-sm text-slate-400 mt-2">
            Your account has been temporarily suspended. Please contact the Visual Architect team for assistance.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0F1220] border border-orange-500/15">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500/15 border border-orange-500/25 text-orange-400 text-sm font-semibold hover:bg-orange-500/25 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
