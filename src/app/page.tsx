'use client';

import React, { useState, useEffect } from 'react';
import ScrollHero from '@/components/ui/ethereal';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { CursorDrivenParticleTypography } from '@/components/ui/cursor-driven-particles-typography';

export default function LandingPage() {
  const [entered, setEntered] = useState(false);
  const [openingPlaying, setOpeningPlaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpeningPlaying(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const skipOpening = () => {
    setOpeningPlaying(false);
  };

  if (entered) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0a]">
        <button
          onClick={() => setEntered(false)}
          className="fixed top-6 left-6 z-50 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono-code text-slate-400 hover:text-white border border-white/10 flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <span>← Back</span>
        </button>
        <ScrollHero
          logo="ANVAYA"
          menuItems={['About', 'Sign In/Up', 'Contact Us']}
          sections={[
            { id: 'hero', headline: 'Ethereal', subheadline: 'Beyond Reality', body: 'Immersive experiences through computational artistry' },
            { id: 'about', headline: 'Innovation', subheadline: 'Through Design', body: 'Pushing boundaries of digital experiences' },
            { id: 'services', headline: 'Crafted', subheadline: 'With Purpose', body: 'Every pixel serves a greater vision' },
            { id: 'connect', headline: 'Connect', subheadline: 'Create Together', body: "Let's build something extraordinary" },
            { id: 'future', headline: 'Limitless', subheadline: 'Unbound Potential', body: 'Pioneering tomorrow through creative engineering' }
          ]}
        />
      </div>
    );
  }

  return (
    <div 
      onClick={openingPlaying ? skipOpening : undefined}
      className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white relative overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:p-8"
    >
      {/* Background Aura Radial Glow */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-1000 -z-10"
        style={{ background: 'radial-gradient(circle at 50% 40%, rgba(139, 92, 246, 0.2) 0%, rgba(5, 7, 14, 0.98) 75%)' }}
      />

      {/* Heroic Entry Animation Splash Overlay */}
      {openingPlaying && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center space-y-6 cursor-pointer animate-fadeIn">
          <button
            onClick={(e) => {
              e.stopPropagation();
              skipOpening();
            }}
            className="absolute top-6 right-6 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono-code text-slate-400 hover:text-white border border-white/10 flex items-center space-x-1 transition-all"
          >
            <span>Skip</span>
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-amber-400 p-1 shadow-2xl shadow-purple-500/40 animate-stroke-reveal">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
              </div>
            </div>
            <div className="absolute inset-0 -m-6 rounded-full bg-purple-500/30 blur-2xl animate-particle-bloom pointer-events-none" />
          </div>

          <div className="space-y-3 max-w-xl">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-wider font-heading animate-text-stagger-1">
              ANVAYA
            </h1>
            <p className="text-xl sm:text-2xl font-playfair italic text-purple-300 animate-text-stagger-2">
              The thread that connects it all
            </p>
            <p className="text-xs font-mono-code text-slate-400 animate-text-stagger-3">
              ✦ Student Club Digital Ecosystem ✦
            </p>
          </div>
        </div>
      )}

      <header className="max-w-7xl w-full mx-auto flex items-center justify-between z-40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-amber-400 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-purple-400 animate-pulse" />
            </div>
          </div>
          <span className="text-sm font-extrabold bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent font-heading tracking-wider">
            ANVAYA
          </span>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto my-auto py-6 relative perspective-scene flex items-center justify-center min-h-[520px]">
        <div className="max-w-3xl w-full text-center space-y-8 z-40 animate-fadeIn">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold font-mono-code">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Student Club Ecosystem</span>
          </div>

          {/* Cursor-Driven Moving Particle Typography ABOVE Tagline */}
          <div className="w-full max-w-2xl mx-auto min-h-[160px] h-[160px] relative z-30 -my-2">
            <CursorDrivenParticleTypography
              text="ANVAYA"
              fontSize={100}
              particleDensity={5}
              dispersionStrength={20}
              color="#c084fc"
              className="w-full h-full min-h-[160px]"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-normal tracking-tight font-playfair leading-[1.1]">
              <span className="italic font-normal bg-gradient-to-r from-purple-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                The thread that connects it all
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl mx-auto">
              A unified digital ecosystem for peer skill exchange, student project ideas, algorithmic coding challenges, and soft-skill contests.
            </p>
          </div>

          <div className="pt-2 flex justify-center space-x-4">
            <button
              onClick={() => setEntered(true)}
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-2xl shadow-purple-500/25 flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-0.5 font-mono-code cursor-pointer"
            >
              <span>ENTER THE STUDENT CLUB</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl w-full mx-auto text-center text-xs font-mono-code text-slate-500 py-4 z-40">
        © 2026 Club Idea Hub — Enforced Session & Role Architecture
      </footer>
    </div>
  );
}
