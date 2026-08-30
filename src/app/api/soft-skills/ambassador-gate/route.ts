import { NextRequest, NextResponse } from 'next/server';

interface ArchitectDispatch {
  id: string;
  title: string;
  sender: string;
  category: 'STAGE_RELEASE' | 'DEBATE_MOTION' | 'AUDIO_VISUAL' | 'CHECKLIST';
  message: string;
  timestamp: string;
  priority: 'HIGH' | 'CRITICAL' | 'NORMAL';
  action_items?: string[];
}

// In-memory state synchronized across Visual Architects and Community Ambassadors
let SOFT_SKILLS_GATE_STATE = {
  isUnlocked: true, // Default unlocked in Demo Mode for full UI experience
  lastLockedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  lastUnlockedAt: new Date().toISOString(),
  governingCouncil: 'Visual Architects (The 7 Founders)',
  activeRound: {
    roundNumber: 'Stage #01 · Mystery Keynote & Debate Arena 2026',
    theme: 'Persuasive Rhetoric & High-Pressure Rebuttal',
    startTime: '2026-08-30T21:00:00.000Z',
    duration: '60 Minutes',
    totalParticipantsTarget: 48,
    stageVenues: ['Main Auditorium Hall A', 'Media Lab Stage 02', 'Executive Seminar Room'],
  },
  dispatches: [
    {
      id: 'disp-ss-1',
      title: 'Collegiate Keynote Motions & Stage Timing Protocol Released',
      sender: 'Visual Architect Governance Council (Alex & Founders)',
      category: 'STAGE_RELEASE',
      message: 'The unannounced debate motions and keynote prompts have been signed off. Please distribute speech topic envelopes and verify podium microphones.',
      timestamp: 'Today at 08:30 PM',
      priority: 'CRITICAL',
      action_items: [
        'Perform wireless lavalier microphone soundcheck in Auditorium Hall A',
        'Distribute sealed mystery speech topic cards to participant waiting pen',
        'Verify digital stopwatch timer displays on front stage monitor',
      ],
    },
    {
      id: 'disp-ss-2',
      title: 'Vocal Modulation & Rebuttal Judge Rubrics Active',
      sender: 'Visual Architect Lead (Founder #1)',
      category: 'DEBATE_MOTION',
      message: 'Judges will evaluate speech clarity, presence, debate rebuttal, and structural delivery. Ensure judge table consoles have active Excel Judge Deck sync.',
      timestamp: 'Today at 08:45 PM',
      priority: 'HIGH',
      action_items: [
        'Confirm Mentor Judges are seated with active Judge Deck spreadsheets',
        'Brief participants on 3-minute strict keynote countdown bell',
      ],
    },
  ] as ArchitectDispatch[],
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      gate: SOFT_SKILLS_GATE_STATE,
    });
  } catch (error: any) {
    console.error('Error fetching soft skills ambassador gate state:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, isUnlocked, newDispatch } = body;

    if (action === 'TOGGLE_GATE') {
      const nextUnlocked = typeof isUnlocked === 'boolean' ? isUnlocked : !SOFT_SKILLS_GATE_STATE.isUnlocked;
      SOFT_SKILLS_GATE_STATE.isUnlocked = nextUnlocked;
      if (nextUnlocked) {
        SOFT_SKILLS_GATE_STATE.lastUnlockedAt = new Date().toISOString();
      } else {
        SOFT_SKILLS_GATE_STATE.lastLockedAt = new Date().toISOString();
      }

      return NextResponse.json({
        success: true,
        message: nextUnlocked
          ? 'Visual Architects have released the key! Soft Skills stage unlocked for Community Ambassadors.'
          : 'Visual Architects have locked the stage. Access restricted.',
        gate: SOFT_SKILLS_GATE_STATE,
      });
    }

    if (action === 'SEND_DISPATCH' && newDispatch) {
      const dispatch: ArchitectDispatch = {
        id: 'disp-ss-' + Date.now(),
        title: newDispatch.title || 'Visual Architect Soft Skills Directive',
        sender: newDispatch.sender || 'Visual Architect Governance Council',
        category: newDispatch.category || 'STAGE_RELEASE',
        message: newDispatch.message || 'Operational stage guidance updated.',
        timestamp: 'Just now',
        priority: newDispatch.priority || 'HIGH',
        action_items: newDispatch.action_items || [],
      };

      SOFT_SKILLS_GATE_STATE.dispatches.unshift(dispatch);

      return NextResponse.json({
        success: true,
        message: 'Directive successfully transmitted to all Community Ambassador stage consoles.',
        gate: SOFT_SKILLS_GATE_STATE,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating soft skills ambassador gate:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
