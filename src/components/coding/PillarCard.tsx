'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface PillarCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: 'dark' | 'light';
  className?: string;
}

export const PillarCard: React.FC<PillarCardProps> = ({
  icon: Icon,
  title,
  description,
  variant = 'dark',
  className = '',
}) => {
  const isDark = variant === 'dark';

  return (
    <div
      className={`rounded-3xl p-6 transition-all duration-300 border shadow-xl flex flex-col justify-between hover:scale-[1.02] ${
        isDark
          ? 'bg-slate-950/85 border-purple-500/30 text-white hover:border-purple-500/60 hover:shadow-purple-500/20'
          : 'bg-gradient-to-b from-slate-900 to-purple-950/60 border-purple-400/40 text-slate-100 hover:border-amber-400/60 hover:shadow-amber-500/20'
      } ${className}`}
    >
      <div className="space-y-3">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
            isDark
              ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}
        >
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>

        <h3 className="text-base font-extrabold font-heading tracking-tight text-white">
          {title}
        </h3>

        <p className="text-xs font-sans text-slate-300 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-white/10 text-[10px] font-mono text-purple-300 uppercase tracking-wider">
        <span>Core Pillar</span>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      </div>
    </div>
  );
};

export default PillarCard;
