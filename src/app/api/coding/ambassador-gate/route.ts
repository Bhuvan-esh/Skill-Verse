import { NextRequest, NextResponse } from 'next/server';

interface ArchitectDispatch {
  id: string;
  title: string;
  sender: string;
  category: 'ROUND_RELEASE' | 'TEST_PARAMETERS' | 'EMERGENCY_INSTRUCTION' | 'CHECKLIST';
  message: string;
  timestamp: string;
  priority: 'HIGH' | 'CRITICAL' | 'NORMAL';
  action_items?: string[];
}

// In-memory state synchronized across Visual Architects and Community Ambassadors
let GATE_STATE = {
  isUnlocked: true, // Visual Architects have given access for demo / live UI operations
  lastLockedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  lastUnlockedAt: new Date().toISOString(),
  governingCouncil: 'Visual Architects (The 7 Founders)',
  activeRound: {
    roundNumber: 'Round #02 · Algorithmic Sprint 2026',
    theme: 'Distributed Concurrency & Ring Buffers',
    startTime: '2026-08-30T20:30:00.000Z',
    duration: '90 Minutes',
    totalParticipantsTarget: 120,
    labVenues: ['CSE Lab 04', 'AIML Innovation Center', 'ISE Server Room B'],
  },
  dispatches: [
    {
      id: 'disp-1',
      title: 'Official Round #02 Directives & Test Harness Released',
      sender: 'Visual Architect Governance Council (Alex & Founders)',
      category: 'ROUND_RELEASE',
      message: 'The concurrency challenge repository and test runner suite has been signed off. Please verify local terminal compilers in CSE Lab 04 and unlock participant seating.',
      timestamp: 'Today at 07:45 PM',
      priority: 'CRITICAL',
      action_items: [
        'Verify high-speed LAN ethernet links in CSE Lab 04',
        'Distribute participant badge cards & USN seat assignments',
        'Ensure test runner daemon port 4000 is open on local cluster',
      ],
    },
    {
      id: 'disp-2',
      title: 'Automated Test Assertions Matrix & Latency Thresholds',
      sender: 'Visual Architect Lead (Founder #1)',
      category: 'TEST_PARAMETERS',
      message: 'All test benchmarks must execute under 5.0ms. Timeout exceptions will be automatically flagged for Mentor Judge inspection.',
      timestamp: 'Today at 08:10 PM',
      priority: 'HIGH',
      action_items: [
        'Monitor live telemetry for timeout spikes (>8.0ms)',
        'Flag concurrency deadlocks to on-duty Mentor Judges',
      ],
    },
  ] as ArchitectDispatch[],
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      gate: GATE_STATE,
    });
  } catch (error: any) {
    console.error('Error fetching ambassador gate state:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, isUnlocked, newDispatch } = body;

    if (action === 'TOGGLE_GATE') {
      const nextUnlocked = typeof isUnlocked === 'boolean' ? isUnlocked : !GATE_STATE.isUnlocked;
      GATE_STATE.isUnlocked = nextUnlocked;
      if (nextUnlocked) {
        GATE_STATE.lastUnlockedAt = new Date().toISOString();
      } else {
        GATE_STATE.lastLockedAt = new Date().toISOString();
      }

      return NextResponse.json({
        success: true,
        message: nextUnlocked
          ? 'Visual Architects have released the key! Platform unlocked for Community Ambassadors.'
          : 'Visual Architects have locked the platform. Access restricted.',
        gate: GATE_STATE,
      });
    }

    if (action === 'SEND_DISPATCH' && newDispatch) {
      const dispatch: ArchitectDispatch = {
        id: 'disp-' + Date.now(),
        title: newDispatch.title || 'Visual Architect Dispatch Directive',
        sender: newDispatch.sender || 'Visual Architect Governing Council',
        category: newDispatch.category || 'ROUND_RELEASE',
        message: newDispatch.message || 'Operational guidance updated.',
        timestamp: 'Just now',
        priority: newDispatch.priority || 'HIGH',
        action_items: newDispatch.action_items || [],
      };

      GATE_STATE.dispatches.unshift(dispatch);

      return NextResponse.json({
        success: true,
        message: 'Directive successfully transmitted to all Community Ambassador terminals.',
        gate: GATE_STATE,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating ambassador gate:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
