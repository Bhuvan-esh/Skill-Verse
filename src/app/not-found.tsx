'use client';

import React from 'react';
import Link from 'next/link';
import { Lightbulb, ArrowLeft, Home, UserCheck } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent font-heading">
              Club Idea Hub
            </h1>
            <p className="text-xs text-slate-400 font-medium">Page Not Found</p>
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-md w-full mx-auto my-auto py-12 text-center">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Lightbulb className="w-8 h-8 opacity-60" />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-extrabold text-white font-heading">404</h2>
            <h3 className="text-lg font-bold text-slate-200">Page Not Found</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              The page or route you are looking for does not exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/"
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2 border border-white/10"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/join"
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20"
            >
              <UserCheck className="w-4 h-4" />
              <span>Role Selection</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 py-4">
        © 2026 Club Idea Hub — Ecosystem
      </footer>
    </div>
  );
}
