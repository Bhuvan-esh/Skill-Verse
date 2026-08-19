'use client';

import React from 'react';
import PillarCard from './PillarCard';
import {
  Globe,
  Zap,
  Bug,
  Bot,
  Users,
  Sparkles,
  Presentation
} from 'lucide-react';

export const SevenPillarsIntro: React.FC = () => {
  const pillars = [
    {
      icon: Globe,
      title: '1. Real-World Problems',
      description: 'Solve practical production systems, high-concurrency microservices, and database bottlenecks instead of standard DSA questions.',
      variant: 'dark' as const,
    },
    {
      icon: Zap,
      title: '2. Unexpected Twists',
      description: 'Adapt to random resource constraints, mid-challenge spec changes, network latency simulations, and memory limits.',
      variant: 'light' as const,
    },
    {
      icon: Bug,
      title: '3. Debugging Battles',
      description: 'Race against the clock to locate, diagnose, and repair intentionally broken production codebases under time pressure.',
      variant: 'dark' as const,
    },
    {
      icon: Bot,
      title: '4. AI vs Human',
      description: 'Compete to identify hallucinations, benchmark LLM-generated code, and optimize machine-generated code pipelines.',
      variant: 'light' as const,
    },
    {
      icon: Users,
      title: '5. Team-Based Challenges',
      description: 'Collaborate with peer builders on system architecture, modular design, git branching, and joint execution strategy.',
      variant: 'dark' as const,
    },
    {
      icon: Sparkles,
      title: '6. Fun Recognition',
      description: 'Win specialized category honors like "Most Creative Solution", "Fastest Debug", and "Best AI Improvement" beyond plain rankings.',
      variant: 'light' as const,
    },
    {
      icon: Presentation,
      title: '7. Build & Demo',
      description: 'Construct a working prototype and present a live working demo to student club mentors to cap off the competition.',
      variant: 'dark' as const,
    },
  ];

  return (
    <section className="space-y-6 glass-panel p-8 rounded-3xl border border-purple-500/30 bg-slate-950/60 shadow-2xl">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>What Makes It Different</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
          The 7 Pillars of Coding Challenge
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
          Beyond standard syntax drills, our Student Coding Arena is built around 7 real-world pillars that mirror actual software engineering teams.
        </p>
      </div>

      {/* Top Row: 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.slice(0, 4).map((pillar, idx) => (
          <PillarCard
            key={idx}
            icon={pillar.icon}
            title={pillar.title}
            description={pillar.description}
            variant={pillar.variant}
          />
        ))}
      </div>

      {/* Second Row: 3 Centered Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {pillars.slice(4, 7).map((pillar, idx) => (
          <PillarCard
            key={idx + 4}
            icon={pillar.icon}
            title={pillar.title}
            description={pillar.description}
            variant={pillar.variant}
          />
        ))}
      </div>
    </section>
  );
};

export default SevenPillarsIntro;
