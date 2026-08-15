'use client';

import React from 'react';

export interface FloatingGlassCardProps {
  index: string; // e.g. "01 / 03"
  label: string; // e.g. "IDEA HUB"
  heading: React.ReactNode; // e.g. "An idea shouldn't die in your notes."
  bodyText: string;
  pills: string[];
  metaLabel?: string; // e.g. "STUDENT CLUB"
  totalItems?: number; // e.g. 3
  activeIndex?: number; // 0-indexed
  leftPeek?: {
    index: string;
    heading: React.ReactNode;
  };
  rightPeek?: {
    index: string;
    heading: React.ReactNode;
  };
  onPrev?: () => void;
  onNext?: () => void;
  actionButton?: React.ReactNode;
}

export default function FloatingGlassCard({
  index,
  label,
  heading,
  bodyText,
  pills,
  metaLabel = 'STUDENT CLUB',
  totalItems = 3,
  activeIndex = 0,
  leftPeek,
  rightPeek,
  onPrev,
  onNext,
  actionButton,
}: FloatingGlassCardProps) {
  return (
    <div className="stage">
      {/* Left Peeking Side-Card */}
      {leftPeek && (
        <div onClick={onPrev} className="side-card left hidden sm:block cursor-pointer hover:opacity-80 transition-opacity" title="Previous Card">
          <div className="peek-label">{leftPeek.index}</div>
          <div className="peek-heading">{leftPeek.heading}</div>
        </div>
      )}

      {/* Right Peeking Side-Card */}
      {rightPeek && (
        <div onClick={onNext} className="side-card right hidden sm:block cursor-pointer hover:opacity-80 transition-opacity" title="Next Card">
          <div className="peek-label">{rightPeek.index}</div>
          <div className="peek-heading">{rightPeek.heading}</div>
        </div>
      )}

      {/* Center Main Card Wrap */}
      <div className="card-wrap">
        <div className="card">
          <div className="card-top">
            <span className="index">{index}</span>
            <span className="live">
              <span className="live-dot" />
              LIVE
            </span>
          </div>
          <span className="sparkle">✦</span>

          <div className="label-row">
            <span className="label-dot" />
            <span className="label">{label}</span>
          </div>

          <h2 className="heading">{heading}</h2>

          <p className="body-text">{bodyText}</p>

          <div className="pills">
            {pills.map((pill, i) => (
              <span key={i} className="pill">
                {pill}
              </span>
            ))}
          </div>

          {actionButton && <div className="mb-4">{actionButton}</div>}

          <div className="card-bottom">
            <span className="meta-label">{metaLabel}</span>
            <div className="progress">
              <div className="dashes">
                {Array.from({ length: totalItems }).map((_, i) => (
                  <span
                    key={i}
                    className={`dash ${i === activeIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
              <span className="count">0{activeIndex + 1}</span>
            </div>
          </div>
        </div>

        {/* Arrow Controls */}
        {(onPrev || onNext) && (
          <div className="nav-arrows">
            <button
              onClick={onPrev}
              className="arrow-btn"
              title="Previous Card"
              type="button"
            >
              ‹
            </button>
            <button
              onClick={onNext}
              className="arrow-btn"
              title="Next Card"
              type="button"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
