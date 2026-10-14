'use client';

import React from 'react';
import { XCircle, LogOut } from 'lucide-react';
import { logOut } from '@/lib/authService';
import { useRouter } from 'next/navigation';

export default function ApplicationRejectedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#08070d] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mx-auto">
          <XCircle className="w-8 h-8 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Application not approved</h1>
          <p className="text-sm text-slate-400 mt-2">
            Your access request was reviewed by a Visual Architect and could not be approved at this time.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0F1220] border border-red-500/15 space-y-4">
          <p className="text-xs text-slate-400">
            If you believe this decision was made in error or have questions, please reach out to the Visual Architect
            team directly.
          </p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 text-sm font-semibold hover:bg-red-500/25 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
