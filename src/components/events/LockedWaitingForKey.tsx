'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Sparkles, Bell } from 'lucide-react';

interface LockedWaitingForKeyProps {
  onBack?: () => void;
  showBackButton?: boolean;
  backHref?: string;
  customPillarTitle?: string;
}

export default function LockedWaitingForKey({
  onBack,
  showBackButton = true,
  backHref = '/horizon',
  customPillarTitle,
}: LockedWaitingForKeyProps) {
  return (
    <div className="w-full flex items-center justify-center p-4 sm:p-6 my-4 font-sans relative">
      {/* Embedded Animation Styles matching exact design system & prefers-reduced-motion */}
      <style jsx>{`
        @keyframes lockWiggle {
          0%, 100% {
            transform: rotate(0deg) translateY(0);
          }
          25% {
            transform: rotate(-3.5deg) translateY(-2px);
          }
          75% {
            transform: rotate(3.5deg) translateY(-2px);
          }
        }

        @keyframes keyOrbit {
          0% {
            transform: translate(65px, -35px) rotate(-25deg) scale(0.95);
            opacity: 0.85;
          }
          40% {
            transform: translate(16px, 12px) rotate(8deg) scale(1.05);
            opacity: 1;
          }
          55% {
            transform: translate(14px, 15px) rotate(5deg) scale(1.02);
            opacity: 1;
          }
          70% {
            transform: translate(22px, 8px) rotate(-10deg) scale(0.98);
            opacity: 0.9;
          }
          100% {
            transform: translate(65px, -35px) rotate(-25deg) scale(0.95);
            opacity: 0.85;
          }
        }

        @keyframes sparkleTwinkle {
          0%, 100% {
            transform: scale(0.6) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.15) rotate(45deg);
            opacity: 1;
          }
        }

        @keyframes eyeBlink {
          0%, 90%, 100% {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0.1);
          }
        }

        @keyframes coralPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 138, 115, 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(255, 138, 115, 0);
            transform: scale(1.15);
          }
        }

        .animated-lock {
          animation: lockWiggle 3.6s ease-in-out infinite;
          transform-origin: 50% 85%;
        }

        .animated-key {
          animation: keyOrbit 4.2s ease-in-out infinite;
        }

        .animated-sparkle-1 {
          animation: sparkleTwinkle 2.4s ease-in-out infinite;
        }

        .animated-sparkle-2 {
          animation: sparkleTwinkle 3.1s ease-in-out infinite 0.8s;
        }

        .animated-sparkle-3 {
          animation: sparkleTwinkle 2.8s ease-in-out infinite 1.4s;
        }

        .animated-eye {
          animation: eyeBlink 4.5s infinite;
          transform-origin: center;
        }

        .coral-pulse-dot {
          animation: coralPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animated-lock,
          .animated-key,
          .animated-sparkle-1,
          .animated-sparkle-2,
          .animated-sparkle-3,
          .animated-eye,
          .coral-pulse-dot {
            animation: none !important;
          }
        }
      `}</style>

      {/* Main Glassmorphism Panel Card (#1c1530 with rgba(210,190,255,0.10) hairline border) */}
      <div
        className="w-full max-w-xl p-8 sm:p-12 rounded-[28px] relative overflow-hidden shadow-2xl text-center space-y-7"
        style={{
          backgroundColor: '#1c1530',
          borderColor: 'rgba(210, 190, 255, 0.10)',
          borderWidth: '1px',
          borderStyle: 'solid',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 50px rgba(166, 132, 255, 0.08)',
        }}
      >
        {/* Soft Ambient Glows behind lock */}
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(166, 132, 255, 0.22) 0%, rgba(95, 216, 196, 0.12) 50%, rgba(28, 21, 48, 0) 75%)',
          }}
        />

        {/* 1. Eyebrow Label (JetBrains Mono · #a684ff) */}
        <div className="flex items-center justify-center">
          <div
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest"
            style={{
              backgroundColor: 'rgba(166, 132, 255, 0.12)',
              borderColor: 'rgba(166, 132, 255, 0.35)',
              borderWidth: '1px',
              borderStyle: 'solid',
              color: '#a684ff',
            }}
          >
            <Lock className="w-3 h-3" style={{ color: '#a684ff' }} />
            <span>MYSTERY EVENT · ACCESS RESTRICTED</span>
          </div>
        </div>

        {/* 2. Signature Animated Cartoon Lock Rig with Orbiting Key & Sparkles */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center select-none py-2">
          {/* Twinkling Sparkles Accent */}
          <div className="absolute top-2 left-6 text-xl animated-sparkle-1 pointer-events-none" style={{ color: '#f4b860' }}>
            ✦
          </div>
          <div className="absolute top-10 right-4 text-sm animated-sparkle-2 pointer-events-none" style={{ color: '#5fd8c4' }}>
            ✧
          </div>
          <div className="absolute bottom-4 left-4 text-xs animated-sparkle-3 pointer-events-none" style={{ color: '#a684ff' }}>
            ✦
          </div>

          <svg
            viewBox="0 0 200 200"
            className="w-40 h-40 overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Shackle Gradient */}
              <linearGradient id="shackleGrad" x1="50" y1="20" x2="150" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e9d5ff" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6b21a8" />
              </linearGradient>

              {/* Lock Body Gradient */}
              <linearGradient id="bodyGrad" x1="40" y1="70" x2="160" y2="175" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="60%" stopColor="#581c87" />
                <stop offset="100%" stopColor="#3b0764" />
              </linearGradient>

              {/* Golden Key Gradient */}
              <linearGradient id="goldKeyGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f4b860" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>

              {/* Lock Inner Shadow */}
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Lock Rig (Wiggles Gently) */}
            <g className="animated-lock">
              {/* Heavy Metal Curved Shackle */}
              <path
                d="M 64 85 V 50 C 64 30, 136 30, 136 50 V 85"
                stroke="url(#shackleGrad)"
                strokeWidth="18"
                strokeLinecap="round"
              />

              {/* Shackle Inner Highlight */}
              <path
                d="M 72 80 V 50 C 72 38, 128 38, 128 50 V 80"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Lock Body (Cute Rounded Rectangle) */}
              <rect
                x="42"
                y="75"
                width="116"
                height="95"
                rx="24"
                fill="url(#bodyGrad)"
                stroke="#c084fc"
                strokeWidth="3.5"
                filter="url(#softGlow)"
              />

              {/* Lock Top Gloss Arc */}
              <path
                d="M 52 87 Q 100 78 148 87"
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Friendly Face: Rosy Cheeks */}
              <circle cx="62" cy="115" r="7" fill="#ff8a73" opacity="0.5" />
              <circle cx="138" cy="115" r="7" fill="#ff8a73" opacity="0.5" />

              {/* Friendly Face: Left Eye */}
              <g className="animated-eye" style={{ transformOrigin: '76px 108px' }}>
                <circle cx="76" cy="108" r="8.5" fill="#ffffff" />
                <circle cx="78" cy="108" r="4.8" fill="#1e1b4b" />
                <circle cx="80" cy="106" r="2.2" fill="#ffffff" />
              </g>

              {/* Friendly Face: Right Eye */}
              <g className="animated-eye" style={{ transformOrigin: '124px 108px' }}>
                <circle cx="124" cy="108" r="8.5" fill="#ffffff" />
                <circle cx="126" cy="108" r="4.8" fill="#1e1b4b" />
                <circle cx="128" cy="106" r="2.2" fill="#ffffff" />
              </g>

              {/* Friendly Face: Curved Smile */}
              <path
                d="M 90 120 Q 100 128 110 120"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Belly Keyhole */}
              <g>
                <circle cx="100" cy="142" r="5" fill="#0f0920" stroke="#f4b860" strokeWidth="1.5" />
                <path
                  d="M 97.5 143 L 102.5 143 L 104.5 155 L 95.5 155 Z"
                  fill="#0f0920"
                  stroke="#f4b860"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </g>
            </g>

            {/* Golden Key Orbiting Loop (Never fully inserting) */}
            <g className="animated-key" style={{ transformOrigin: '100px 145px' }}>
              <g transform="translate(100, 120)">
                {/* Key Bow / Head */}
                <circle cx="0" cy="0" r="10" fill="url(#goldKeyGrad)" stroke="#fef08a" strokeWidth="2" />
                <circle cx="0" cy="0" r="4.5" fill="#1c1530" />
                {/* Key Blade / Shaft */}
                <rect x="0" y="-3.5" width="28" height="7" rx="2" fill="url(#goldKeyGrad)" />
                {/* Key Bits / Teeth */}
                <rect x="16" y="3.5" width="5" height="7" rx="1" fill="url(#goldKeyGrad)" />
                <rect x="23" y="3.5" width="5" height="5" rx="1" fill="url(#goldKeyGrad)" />
              </g>
            </g>
          </svg>
        </div>

        {/* 3. Headline (Fraunces / Display Font with "opening soon" in amber #f4b860) */}
        <div className="space-y-3">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight"
            style={{ fontFamily: 'var(--font-heading, "Fraunces", serif)' }}
          >
            Locked for now —{' '}
            <span style={{ color: '#f4b860' }}>opening soon</span>
          </h2>

          {/* 4. Subtext (Inter / Body Font) */}
          <p
            className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed"
            style={{ color: '#cbd5e1' }}
          >
            Something&apos;s brewing behind this door. The Visual Architects hold the key — check back shortly and it&apos;ll swing open.
          </p>
        </div>

        {/* 5. Status Row with Pulsing Coral (#ff8a73) Dot */}
        <div className="pt-2 flex items-center justify-center">
          <div
            className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wide"
            style={{
              backgroundColor: 'rgba(255, 138, 115, 0.08)',
              borderColor: 'rgba(255, 138, 115, 0.30)',
              borderWidth: '1px',
              borderStyle: 'solid',
              color: '#e2e8f0',
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full coral-pulse-dot shrink-0"
              style={{ backgroundColor: '#ff8a73' }}
            />
            <span className="text-[11px] sm:text-xs">
              WAITING FOR KEY FROM VISUAL ARCHITECTS…
            </span>
          </div>
        </div>

        {/* 6. Navigation / Action Buttons */}
        {showBackButton && (
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold transition-all border border-white/10 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Horizon</span>
              </button>
            ) : (
              <Link
                href={backHref}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold transition-all border border-white/10 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Horizon</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
