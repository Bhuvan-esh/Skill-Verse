"use client"

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  Crown,
  GraduationCap,
  Palette,
  Users,
  Sparkles,
  Layers,
  PlusCircle,
  Code2,
  BrainCircuit,
  Lightbulb,
  Repeat,
  Compass
} from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import MentorSkillBarterView from '@/components/skill-barter/MentorSkillBarterView'
import FounderSkillBarterView from '@/components/skill-barter/FounderSkillBarterView'
import VolunteerSkillBarterView from '@/components/skill-barter/VolunteerSkillBarterView'
import MentorCodingJudgeDeck from '@/components/coding/MentorCodingJudgeDeck'
import MentorSoftSkillsJudgeDeck from '@/components/soft-skills/MentorSoftSkillsJudgeDeck'
import LockedWaitingForKey from '@/components/events/LockedWaitingForKey'

type WorkspaceRole = 'FOUNDER' | 'MENTOR' | 'AMBASSADOR'
type WorkspaceSection = 'skill-barter' | 'coding-challenge' | 'soft-skills' | 'idea-hub'

const ROLE_META = {
  FOUNDER: {
    title: 'Visual Architect',
    badge: 'Club Leadership & Governance',
    icon: Crown,
    color: 'from-purple-600 via-indigo-600 to-amber-500',
    textColor: 'text-purple-300',
    borderColor: 'border-purple-500/40',
    bgGlow: 'rgba(167, 139, 250, 0.15)',
  },
  MENTOR: {
    title: 'Mentor',
    badge: 'Technical & Skill Reviewer',
    icon: GraduationCap,
    color: 'from-emerald-600 via-teal-600 to-cyan-500',
    textColor: 'text-emerald-300',
    borderColor: 'border-emerald-500/40',
    bgGlow: 'rgba(52, 211, 153, 0.15)',
  },
  AMBASSADOR: {
    title: 'Community Ambassador',
    badge: 'Community & Outreach Lead',
    icon: Palette,
    color: 'from-pink-600 via-purple-600 to-amber-500',
    textColor: 'text-pink-300',
    borderColor: 'border-pink-500/40',
    bgGlow: 'rgba(244, 114, 182, 0.15)',
  },
}

const SECTION_META = {
  'skill-barter': {
    title: 'Skill Barter',
    icon: Repeat,
    description: 'Peer-to-peer barter, trade audits, and skill exchange operations.',
  },
  'coding-challenge': {
    title: 'Coding Challenge',
    icon: Code2,
    description: 'Algorithmic competitions, test runners, and telemetry operations.',
  },
  'soft-skills': {
    title: 'Soft Skills',
    icon: BrainCircuit,
    description: 'Mystery Skill League tournaments, speech challenges, and judge scoring.',
  },
  'idea-hub': {
    title: 'Idea Hub',
    icon: Lightbulb,
    description: 'Student project incubation, grant curation, and demo day showcases.',
  },
}

function HorizonWorkspaceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const [activeRole, setActiveRole] = useState<WorkspaceRole>('FOUNDER')
  const [activeSection, setActiveSection] = useState<WorkspaceSection>('skill-barter')

  useEffect(() => {
    // Strictly lock workspace role to authenticated user's session role
    if (user) {
      if (user.role === 'FOUNDER') {
        setActiveRole('FOUNDER')
      } else if ((user as any).role === 'MENTOR') {
        setActiveRole('MENTOR')
      } else if (user.role === 'VOLUNTEER' || (user as any).role === 'AMBASSADOR') {
        setActiveRole('AMBASSADOR')
      } else {
        // Participants use their dashboard
        router.push('/dashboard')
        return
      }
    } else {
      const roleQuery = searchParams.get('role')?.toUpperCase()
      if (roleQuery === 'MENTOR') {
        setActiveRole('MENTOR')
      } else if (roleQuery === 'AMBASSADOR' || roleQuery === 'VOLUNTEER') {
        setActiveRole('AMBASSADOR')
      } else {
        setActiveRole('FOUNDER')
      }
    }

    const secQuery = searchParams.get('section') as WorkspaceSection
    if (secQuery && SECTION_META[secQuery]) {
      setActiveSection(secQuery)
    }
  }, [user, searchParams, router])

  const roleInfo = ROLE_META[activeRole]
  const sectionInfo = SECTION_META[activeSection]
  const RoleIcon = roleInfo.icon
  const SectionIcon = sectionInfo.icon

  return (
    <div className="min-h-screen bg-[#08070d] text-slate-100 selection:bg-purple-500 selection:text-white p-4 sm:p-6 lg:p-8 relative overflow-x-hidden flex flex-col justify-between">
      {/* Background Radial Glow */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${roleInfo.bgGlow} 0%, rgba(8, 7, 13, 0.98) 70%)`,
        }}
      />

      {/* 42px Background Grid */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />

      {/* Top Header Bar */}
      <header className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 shadow-2xl mb-8">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            href="/horizon"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-purple-300 hover:text-white border border-white/10 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Horizon Arena</span>
          </Link>

          <div>
            <div className="flex items-center space-x-2">
              <RoleIcon className={`w-4 h-4 ${roleInfo.textColor}`} />
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent font-heading">
                {roleInfo.title} Workspace
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {activeRole === 'MENTOR' ? 'Mentor Portal • Skill Barter Console' : `Dedicated Workspace • ${sectionInfo.title}`}
            </p>
          </div>
        </div>

        {/* Section Switcher Tabs (Only for Multi-Pillar Roles like Founder/Ambassador) */}
        {activeRole !== 'MENTOR' && (
          <div className="flex flex-wrap items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10">
            {(Object.keys(SECTION_META) as WorkspaceSection[]).map((secKey) => {
              const isSelected = activeSection === secKey
              const sMeta = SECTION_META[secKey]
              const SIcon = sMeta.icon
              return (
                <button
                  key={secKey}
                  type="button"
                  onClick={() => setActiveSection(secKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? `bg-gradient-to-r ${roleInfo.color} text-white shadow-md`
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <SIcon className="w-3 h-3" />
                  <span>{sMeta.title}</span>
                </button>
              )
            })}
          </div>
        )}
      </header>

      {/* Main Content View */}
      <main className="max-w-7xl w-full mx-auto flex-1 my-4">
        {activeSection === 'skill-barter' ? (
          activeRole === 'MENTOR' ? (
            <MentorSkillBarterView user={user} onRefresh={() => {}} />
          ) : activeRole === 'FOUNDER' ? (
            <FounderSkillBarterView user={user} onRefresh={() => {}} />
          ) : (
            <VolunteerSkillBarterView user={user} onRefresh={() => {}} />
          )
        ) : activeSection === 'coding-challenge' && activeRole === 'MENTOR' ? (
          <MentorCodingJudgeDeck user={user} onBack={() => {}} />
        ) : activeSection === 'soft-skills' && activeRole === 'MENTOR' ? (
          <MentorSoftSkillsJudgeDeck user={user} onBack={() => {}} />
        ) : (
          <div className="flex items-center justify-center">
            <LockedWaitingForKey
              backHref="/horizon"
              customPillarTitle={sectionInfo.title}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto text-center text-xs font-mono text-slate-500 py-4">
        SkillVerse Platform • {roleInfo.title} Mode
      </footer>
    </div>
  )
}

export default function HorizonWorkspacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#08070d] flex items-center justify-center text-purple-300 text-xs font-mono">Loading workspace...</div>}>
      <HorizonWorkspaceContent />
    </Suspense>
  )
}

