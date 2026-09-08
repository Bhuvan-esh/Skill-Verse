'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import ScrollHero from '@/components/ui/ethereal';

const RobotOnly = dynamic(() => import('@/components/ui/robot-only'), { ssr: false });

export default function OrzyaLandingPage() {
  const router = useRouter();
  const [entered, setEntered] = useState(false);
  const [openingPlaying, setOpeningPlaying] = useState(true);
  const [openingFading, setOpeningFading] = useState(false);

  useEffect(() => {
    // 4.2s reveal duration, then smooth 0.8s fade out (5.0s total)
    const fadeTimer = setTimeout(() => {
      setOpeningFading(true);
    }, 4200);

    const endTimer = setTimeout(() => {
      setOpeningPlaying(false);
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, []);

  const skipOpening = () => {
    setOpeningFading(true);
    setTimeout(() => {
      setOpeningPlaying(false);
    }, 250);
  };

  useEffect(() => {
    // Always start fresh from the starting landing page on initial visit/load
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setEntered(false);

    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        if (window.location.hash !== '#club') {
          setEntered(false);
        } else {
          setEntered(true);
        }
      }
    };

    const handleTourEvent = (e: any) => {
      if (e.detail?.type === 'enter-club' || e.detail?.type === 'user-clicked-enter') {
        setEntered(true);
        if (typeof window !== 'undefined' && window.location.hash !== '#club') {
          window.history.pushState({ view: 'club' }, '', '#club');
        }
      } else if (e.detail?.type === 'back-to-landing') {
        setEntered(false);
        if (typeof window !== 'undefined' && window.location.hash === '#club') {
          window.history.pushState(null, '', window.location.pathname);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('orzya-tour-event', handleTourEvent);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('orzya-tour-event', handleTourEvent);
    };
  }, []);

  const handleEnterClub = () => {
    setEntered(true);
    if (typeof window !== 'undefined') {
      if (window.location.hash !== '#club') {
        window.history.pushState({ view: 'club' }, '', '#club');
      }
      window.dispatchEvent(new CustomEvent('orzya-tour-event', { detail: { type: 'enter-club' } }));
      window.dispatchEvent(new CustomEvent('orzya-tour-event', { detail: { type: 'user-clicked-enter' } }));
    }
  };

  const handleBackToLanding = () => {
    setEntered(false);
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#club') {
        window.history.pushState(null, '', window.location.pathname);
      }
      window.dispatchEvent(new CustomEvent('orzya-tour-event', { detail: { type: 'back-to-landing' } }));
    }
  };

  if (entered) {
    return (
      <div className="relative min-h-screen bg-[#111713]">
        <ScrollHero
          logo="ORZYA"
          onBack={handleBackToLanding}
          colorPalette={{
            primary: '#6366f1',
            secondary: '#8b5cf6',
            tertiary: '#ec4899',
            accent: '#06ffa5',
            dark: '#111713'
          }}
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
    <div className="orzya-landing-root min-h-screen flex flex-col selection:bg-[#9C5233] selection:text-[#F6F3EC]">
      <style jsx global>{`
        :root {
          --bg-linen: #F6F3EC;
          --color-ink: #191715;
          --color-ink-muted: #5C5850;
          --color-rust: #9C5233;
          --color-border: #E3DDCE;
        }

        .orzya-landing-root {
          background-color: var(--bg-linen);
          background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
          background-size: 24px 24px;
          color: var(--color-ink);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .font-fraunces {
          font-family: 'Fraunces', Georgia, serif;
        }

        /* Hardware-accelerated 60FPS letter reveal animations */
        @keyframes revealLetterO {
          0% {
            opacity: 0;
            clip-path: inset(100% 0 0 0);
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            clip-path: inset(0% 0 0 0);
            transform: translateY(0);
          }
        }

        @keyframes revealLetterR {
          0% {
            opacity: 0;
            clip-path: inset(100% 0 0 0);
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            clip-path: inset(0% 0 0 0);
            transform: translateY(0);
          }
        }

        @keyframes revealLetterZ {
          0% {
            opacity: 0;
            clip-path: inset(100% 0 0 0);
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            clip-path: inset(0% 0 0 0);
            transform: translateY(0);
          }
        }

        @keyframes revealLetterY {
          0% {
            opacity: 0;
            clip-path: inset(100% 0 0 0);
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            clip-path: inset(0% 0 0 0);
            transform: translateY(0);
          }
        }

        @keyframes revealLetterA {
          0% {
            opacity: 0;
            clip-path: inset(100% 0 0 0);
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            clip-path: inset(0% 0 0 0);
            transform: translateY(0);
          }
        }

        .anim-O {
          animation: revealLetterO 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        .anim-R {
          animation: revealLetterR 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.95s both;
        }

        .anim-Z {
          animation: revealLetterZ 0.75s cubic-bezier(0.16, 1, 0.3, 1) 1.6s both;
        }

        .anim-Y {
          animation: revealLetterY 0.75s cubic-bezier(0.16, 1, 0.3, 1) 2.25s both;
        }

        .anim-A {
          animation: revealLetterA 0.75s cubic-bezier(0.16, 1, 0.3, 1) 2.9s both;
        }

        @keyframes orzyaHoverFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .animate-orzya-hover {
          animation: orzyaHoverFloat 3.5s ease-in-out infinite;
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .animate-orzya-hover:hover {
          transform: translateY(-2px) scale(1.02);
          filter: drop-shadow(0 4px 12px rgba(156, 82, 51, 0.15));
        }

        .focus-ring:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--bg-linen), 0 0 0 4px var(--color-rust);
        }
      `}</style>

      {/* =========================================================================
          INITIAL BRAND REVEAL SPLASH OVERLAY (Only BIG ORZYA Letter-by-Letter)
      ========================================================================= */}
      {openingPlaying && (
        <div
          onClick={skipOpening}
          className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center cursor-pointer transition-opacity duration-700 ease-out select-none will-change-[opacity] ${
            openingFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{
            backgroundColor: '#F6F3EC',
            backgroundImage: 'radial-gradient(#E3DDCE 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          {/* Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              skipOpening();
            }}
            className="absolute top-6 right-6 px-4 py-2 rounded-full bg-[#191715]/30 hover:bg-[#191715]/50 backdrop-blur-xl border border-white/30 hover:border-white/50 text-xs font-medium text-[#F6F3EC] transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span className="font-semibold tracking-wide">Skip</span>
            <span className="text-[10px] text-[#9C5233] font-bold">✕</span>
          </button>

          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 px-4 select-none">
            {/* Big Letter O */}
            <span className="font-fraunces text-7xl sm:text-8xl md:text-9xl font-medium tracking-tight text-[#191715] anim-O inline-block">
              O
            </span>
            {/* Big Letter R */}
            <span className="font-fraunces text-7xl sm:text-8xl md:text-9xl font-medium tracking-tight text-[#191715] anim-R inline-block">
              R
            </span>
            {/* Big Letter Z */}
            <span className="font-fraunces text-7xl sm:text-8xl md:text-9xl font-medium tracking-tight text-[#191715] anim-Z inline-block">
              Z
            </span>
            {/* Big Letter Y */}
            <span className="font-fraunces text-7xl sm:text-8xl md:text-9xl font-medium tracking-tight text-[#191715] anim-Y inline-block">
              Y
            </span>
            {/* Big Letter A */}
            <span className="font-fraunces text-7xl sm:text-8xl md:text-9xl font-medium tracking-tight text-[#191715] anim-A inline-block">
              A
            </span>
          </div>
        </div>
      )}

      {/* =========================================================================
          HERO & WHAT YOU CAN DO (Editorial Capability Band & Balanced Spacing)
      ========================================================================= */}
      <main className="w-full flex-1 flex flex-col relative overflow-hidden">
        {/* Subtle Editorial Architectural Background Geometry (Upper Hero Framing) */}
        <div
          className="absolute top-0 left-0 right-0 h-[480px] pointer-events-none overflow-hidden select-none z-0 opacity-85"
          aria-hidden="true"
        >
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMin slice"
            viewBox="0 0 1440 480"
          >
            {/* Upper-Left: Large Terracotta Arcs & Editorial Crosshair Datum */}
            <circle
              cx="100"
              cy="-30"
              r="300"
              fill="none"
              stroke="#9C5233"
              strokeWidth="1"
              strokeDasharray="5 5"
              opacity="0.22"
            />
            <circle
              cx="100"
              cy="-30"
              r="430"
              fill="none"
              stroke="#E3DDCE"
              strokeWidth="1"
              opacity="0.65"
            />
            <circle
              cx="100"
              cy="-30"
              r="560"
              fill="none"
              stroke="#9C5233"
              strokeWidth="0.75"
              opacity="0.12"
            />

            {/* Upper-Left Editorial Axis / Rule */}
            <line
              x1="30"
              y1="120"
              x2="210"
              y2="120"
              stroke="#9C5233"
              strokeWidth="0.75"
              strokeDasharray="3 3"
              opacity="0.18"
            />
            <line
              x1="100"
              y1="40"
              x2="100"
              y2="200"
              stroke="#9C5233"
              strokeWidth="0.75"
              strokeDasharray="3 3"
              opacity="0.18"
            />

            {/* Upper-Right: Large Terracotta Geometry & Framing Arc */}
            <circle
              cx="1350"
              cy="30"
              r="360"
              fill="none"
              stroke="#9C5233"
              strokeWidth="1"
              opacity="0.18"
            />
            <circle
              cx="1350"
              cy="30"
              r="480"
              fill="none"
              stroke="#E3DDCE"
              strokeWidth="1"
              strokeDasharray="6 4"
              opacity="0.6"
            />
            <circle
              cx="1350"
              cy="30"
              r="240"
              fill="none"
              stroke="#9C5233"
              strokeWidth="0.75"
              strokeDasharray="4 4"
              opacity="0.15"
            />

            {/* Upper-Right Editorial Datum Line */}
            <line
              x1="1180"
              y1="140"
              x2="1390"
              y2="140"
              stroke="#9C5233"
              strokeWidth="0.75"
              strokeDasharray="3 3"
              opacity="0.18"
            />
          </svg>
        </div>

        {/* Content Container (z-10) */}
        <div className="relative z-10 flex flex-col flex-1">
          {/* Top-Left Nav */}
          <header className="w-full max-w-5xl mx-auto px-6 sm:px-10 pt-5 sm:pt-7 pb-1">
            <div className="flex items-center gap-3">
              {/* Small Pixel/Dot-Matrix Inspired Logomark in Ink */}
              <div
                className="w-8 h-8 rounded-lg bg-[#191715] flex items-center justify-center flex-shrink-0 shadow-sm"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  fill="currentColor"
                  className="text-[#F6F3EC]"
                >
                  <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z" />
                </svg>
              </div>

              {/* Wordmark in Fraunces Serif */}
              <span className="font-fraunces text-xl font-medium tracking-tight text-[#191715] select-none hover:text-[#9C5233] transition-colors cursor-pointer">
                ORZYA
              </span>
            </div>
          </header>

          {/* Centered Hero Composition (~620px max-width) */}
          <div className="w-full max-w-[620px] mx-auto px-6 pt-4 sm:pt-5 pb-5 sm:pb-6 flex flex-col items-center text-center">
            {/* Pill Badge with Rust Dot */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E3DDCE] bg-white/80 backdrop-blur-sm text-xs font-medium text-[#5C5850] shadow-sm mb-3">
              <span className="w-2 h-2 rounded-full bg-[#9C5233] flex-shrink-0" aria-hidden="true" />
              <span>Student club ecosystem</span>
            </div>

            {/* Primary Headline in Serif (Fraunces ~58px) with ambient hovering and cursor interaction */}
            <div className="w-full flex justify-center items-center my-0.5">
              <OrzyaHoverWordmark text="ORZYA" />
            </div>

            {/* Hand-drawn Wavy Stitch-Line SVG Divider in Rust */}
            <div className="w-full flex justify-center my-2.5" aria-hidden="true">
              <svg
                width="170"
                height="14"
                viewBox="0 0 170 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[140px] sm:w-[160px]"
              >
                <path
                  d="M 2 7 C 16 1.5, 29 12.5, 43 7 C 57 1.5, 71 12.5, 85 7 C 99 1.5, 113 12.5, 127 7 C 141 1.5, 155 12.5, 168 7"
                  stroke="#9C5233"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="4.5 3"
                />
              </svg>
            </div>

            {/* Italic Serif Tagline in Rust */}
            <p className="font-fraunces italic font-normal text-2xl sm:text-3xl text-[#9C5233] tracking-tight mb-2">
              The thread that connects it all
            </p>

            {/* One Description Sentence in Inter, Muted Ink */}
            <p className="text-[#5C5850] text-[15px] sm:text-base font-normal leading-relaxed max-w-[540px] mb-5">
              Learn from your peers, find people to build with, sharpen your skills, and put them to the test — all in one student ecosystem.
            </p>

            {/* Glassy CTA Button */}
            <div>
              <button
                type="button"
                onClick={handleEnterClub}
                className="focus-ring group inline-flex items-center justify-center gap-2 bg-[#191715]/15 hover:bg-[#191715]/25 text-[#191715] hover:text-[#9C5233] px-8 py-3.5 rounded-2xl font-semibold text-sm backdrop-blur-xl border border-[#191715]/20 hover:border-[#9C5233]/50 shadow-[0_8px_30px_rgba(25,23,21,0.06),inset_0_1px_1.5px_rgba(255,255,255,0.85)] hover:shadow-[0_12px_36px_rgba(156,82,51,0.18),inset_0_1px_1.5px_rgba(255,255,255,0.95)] transition-all duration-300 cursor-pointer active:scale-95"
              >
                <span className="tracking-wide">Enter the student club →</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              SECTION 2: WHAT YOU CAN DO (Refined Editorial Capability Band)
          ========================================================================= */}
          <section className="w-full border-t border-[#E3DDCE] bg-[#F6F3EC] mt-5 sm:mt-6">
            <div className="max-w-5xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
              <div className="text-center sm:text-left mb-5 sm:mb-7">
                <h2 className="font-fraunces text-2xl sm:text-3xl font-medium text-[#191715] tracking-tight">
                  What you can do
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#E3DDCE] rounded-2xl divide-y sm:divide-y-0 sm:divide-x divide-[#E3DDCE] bg-white/40 overflow-hidden">
                {/* 01. Skill Exchange */}
                <div className="p-6 sm:p-7 lg:p-8 flex flex-col justify-start hover:bg-white/70 transition-colors">
                  <span className="text-xs font-mono font-semibold text-[#9C5233] tracking-wider mb-4 block">
                    01
                  </span>
                  <h3 className="font-fraunces text-lg sm:text-xl font-medium text-[#191715] tracking-tight mb-2.5">
                    Skill Exchange
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5850] leading-relaxed">
                    Learn from peers and share what you know.
                  </p>
                </div>

                {/* 02. Idea Hub */}
                <div className="p-6 sm:p-7 lg:p-8 flex flex-col justify-start hover:bg-white/70 transition-colors">
                  <span className="text-xs font-mono font-semibold text-[#9C5233] tracking-wider mb-4 block">
                    02
                  </span>
                  <h3 className="font-fraunces text-lg sm:text-xl font-medium text-[#191715] tracking-tight mb-2.5">
                    Idea Hub
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5850] leading-relaxed">
                    Discover ideas, find collaborators, and build projects.
                  </p>
                </div>

                {/* 03. Code Arena */}
                <div className="p-6 sm:p-7 lg:p-8 flex flex-col justify-start hover:bg-white/70 transition-colors">
                  <span className="text-xs font-mono font-semibold text-[#9C5233] tracking-wider mb-4 block">
                    03
                  </span>
                  <h3 className="font-fraunces text-lg sm:text-xl font-medium text-[#191715] tracking-tight mb-2.5">
                    Code Arena
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5850] leading-relaxed">
                    Take on algorithmic challenges and sharpen your problem-solving.
                  </p>
                </div>

                {/* 04. Soft-Skill Contests */}
                <div className="p-6 sm:p-7 lg:p-8 flex flex-col justify-start hover:bg-white/70 transition-colors">
                  <span className="text-xs font-mono font-semibold text-[#9C5233] tracking-wider mb-4 block">
                    04
                  </span>
                  <h3 className="font-fraunces text-lg sm:text-xl font-medium text-[#191715] tracking-tight mb-2.5">
                    Soft-Skill Contests
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5850] leading-relaxed">
                    Participate in contests designed to build communication and confidence.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* =========================================================================
          FOOTER (Quiet Editorial Bookend)
      ========================================================================= */}
      {/* =========================================================================
          FOOTER (Pinned at the bottom with mt-auto)
      ========================================================================= */}
      <footer className="w-full border-t border-[#E3DDCE] py-8 text-center mt-auto bg-[#F6F3EC]">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs text-[#5C5850] tracking-normal">
            © 2026 Club Idea Hub — enforced session and role architecture.
          </p>
        </div>
      </footer>

      {/* =========================================================================
          PRE-ENTRY WELCOME ASSISTANT (Landing Digital Concierge)
      ========================================================================= */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-end gap-3 pointer-events-auto select-none">
        {/* Editorial Welcome Concierge Card */}
        <div className="hidden sm:flex flex-col bg-white/90 backdrop-blur-md border border-[#E3DDCE] px-4 py-2.5 rounded-2xl shadow-lg shadow-[#191715]/5 max-w-[220px] mb-2 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9C5233] animate-pulse" />
            <span className="text-[11px] font-fraunces font-medium text-[#191715]">
              ORZYA Concierge
            </span>
          </div>
          <p className="text-xs font-semibold text-[#191715] leading-snug">
            Welcome to ORZYA.
          </p>
          <p className="text-[11px] text-[#5C5850] leading-tight mt-0.5">
            Your student club ecosystem starts here.
          </p>
        </div>

        {/* Small 3D Chic Robot Assistant */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 relative drop-shadow-[0_8px_20px_rgba(0,0,0,0.14)] cursor-pointer">
          {!openingPlaying && (
            <RobotOnly
              color="#ffffff"
              pantallaColor="#00e5ff"
              pantallaBrillo={2.0}
              metalness={0.2}
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * OrzyaHoverWordmark:
 * Renders the headline "Orzya" with Fraunces serif typography,
 * continuous ambient floating physics, and interactive cursor hover dispersion.
 */
function OrzyaHoverWordmark({ text }: { text: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      originX: number;
      originY: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      dispersion: number;
      returnSpd: number;
    }> = [];

    let mouseX = -1000;
    let mouseY = -1000;
    let isVisible = true;

    const init = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth || 320;
      const containerHeight = container.clientHeight || 85;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, containerWidth, containerHeight);

      const fontSize = Math.min(58, containerWidth * 0.22);
      ctx.fillStyle = '#191715';
      ctx.font = `600 ${fontSize}px "Fraunces", Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, containerWidth / 2, containerHeight / 2);

      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
      particles = [];

      const step = Math.max(2, Math.floor(2.2 * dpr));

      for (let y = 0; y < textCoordinates.height; y += step) {
        for (let x = 0; x < textCoordinates.width; x += step) {
          const index = (y * textCoordinates.width + x) * 4;
          const alpha = textCoordinates.data[index + 3] || 0;

          if (alpha > 120) {
            particles.push({
              x: x / dpr + (Math.random() - 0.5) * 4,
              y: y / dpr + (Math.random() - 0.5) * 4,
              originX: x / dpr,
              originY: y / dpr,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              size: 1.25,
              color: '#191715',
              dispersion: 12,
              returnSpd: 0.08,
            });
          }
        }
      }
    };

    let isAnimating = false;
    const startAnimation = () => {
      if (!isAnimating && isVisible) {
        isAnimating = true;
        animate();
      }
    };

    const animate = () => {
      if (!isVisible) {
        isAnimating = false;
        return;
      }
      const containerWidth = canvas.clientWidth;
      const containerHeight = canvas.clientHeight;
      ctx.clearRect(0, 0, containerWidth, containerHeight);

      const count = particles.length;
      let activeMovement = false;

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        if (mouseX >= 0 && mouseY >= 0) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const distSq = dx * dx + dy * dy;
          const interactionRadius = 90;

          if (distSq < interactionRadius * interactionRadius) {
            const distance = Math.sqrt(distSq) || 0.001;
            const force = (interactionRadius - distance) / interactionRadius;
            p.vx -= (dx / distance) * force * p.dispersion;
            p.vy -= (dy / distance) * force * p.dispersion;
          }
        }

        p.vx += (p.originX - p.x) * p.returnSpd;
        p.vy += (p.originY - p.y) * p.returnSpd;
        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;

        if (Math.abs(p.vx) > 0.01 || Math.abs(p.vy) > 0.01) {
          activeMovement = true;
        }
      }

      if (count > 0) {
        ctx.fillStyle = '#191715';
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const p = particles[i];
          ctx.moveTo(p.x + p.size, p.y);
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      if (mouseX < 0 && !activeMovement) {
        isAnimating = false;
        return;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      startAnimation();
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      startAnimation();
    };

    const timeout = setTimeout(init, 60);
    window.addEventListener('resize', init);
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', init);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [text]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[340px] h-[75px] sm:h-[85px] relative flex items-center justify-center animate-orzya-hover cursor-pointer"
      title="Hover over ORZYA"
    >
      <h1 className="sr-only">ORZYA</h1>
      <canvas ref={canvasRef} className="block w-full h-full select-none" />
    </div>
  );
}
