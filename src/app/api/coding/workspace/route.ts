import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// Master Competition Configuration controlled by Visual Architects
let VISUAL_ARCHITECT_COMPETITION_CONFIG = {
  active_track: 'research' as 'research' | 'code_editor' | 'mcq_quiz' | 'bug_hunt', // Visual Architects allocate 1 active track
  event_started: true,
  event_ended: false,
  start_time: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // Started 15 mins ago
  duration_minutes: 60, // 60 mins total
  approved_by: 'Visual Architects Board (AIDS & AIML)',
  approved_at: '2026-08-29T12:00:00Z',

  // Option 3: Dynamic MCQ Content provided by Visual Architects
  mcq_content: {
    released: true,
    title: 'Visual Architects Algorithmic Sprint MCQ',
    description: 'Directly released from Visual Architects Control Console',
    questions: [
      {
        id: 1,
        question: 'What is the tight worst-case time complexity of quickselect on an array of size N?',
        options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(log N)'],
        correctIndex: 2,
        points: 25,
      },
      {
        id: 2,
        question: 'Which tree structure guarantees that search, insert, and delete operations take O(log N) worst-case time?',
        options: ['Binary Search Tree', 'Red-Black Tree / AVL Tree', 'Trie', 'Segment Tree'],
        correctIndex: 1,
        points: 25,
      },
      {
        id: 3,
        question: 'In graph theory, which algorithm is optimal for finding all-pairs shortest paths on dense graphs without negative cycles?',
        options: ['Bellman-Ford', 'Floyd-Warshall', 'Dijkstra with Binary Heap', 'Kruskal'],
        correctIndex: 1,
        points: 25,
      },
      {
        id: 4,
        question: 'What is the auxiliary space complexity of dynamic programming tabulation for the 0/1 Knapsack problem with capacity W and N items?',
        options: ['O(1)', 'O(N)', 'O(W)', 'O(N * W)'],
        correctIndex: 3,
        points: 25,
      },
    ],
  },

  // Option 4: Dynamic Bug Hunt Content provided by Visual Architects
  bug_hunt_content: {
    released: true,
    title: 'Visual Architects Defect Patch: Binary Search & Subarray Boundary Logic',
    defect_notice: 'This code was released by Visual Architects with intentional runtime bugs. Fix the pointer advance logic, run assertions, and submit.',
    language: 'cpp',
    buggy_code: `// Visual Architects Bug Hunt Challenge
// Fix the pointer advancement and off-by-one errors

#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int low = 0;
    int high = arr.size(); // Defect: should be arr.size() - 1
    
    while (low < high) { // Defect: should be low <= high
        int mid = (low + high) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid; // Defect: should be mid + 1
        } else {
            high = mid; // Defect: should be mid - 1
        }
    }
    return -1;
}

int main() {
    vector<int> nums = {3, 7, 11, 19, 29, 37, 43, 59, 71, 89};
    cout << "Binary Search Index for 29: " << binarySearch(nums, 29) << endl;
    return 0;
}`,
    test_cases: [
      { id: 1, name: 'Test Case 1: Exact Element Search (target = 29)', expected_output: 'Index 4' },
      { id: 2, name: 'Test Case 2: Boundary Element Search (target = 3 & 89)', expected_output: 'Index 0 and 9' },
      { id: 3, name: 'Test Case 3: Missing Target Element (target = 999)', expected_output: 'Index -1' },
    ],
  },
};

// In-memory student participant state
const WORKSPACE_PARTICIPANT_STATE: Record<string, {
  selectedTrack: 'research' | 'code_editor' | 'mcq_quiz' | 'bug_hunt' | null;
  submission: any | null;
  status: 'IN_PROGRESS' | 'SUBMITTED_LOCKED' | 'REJECTED_TIMEOUT';
  submittedAt: string | null;
}> = {};

export async function GET(req: Request) {
  try {
    const user = await getSession();
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId') || 'default-event';
    const stateKey = `${user?.id || 'demo-user'}_${eventId}`;

    const userState = WORKSPACE_PARTICIPANT_STATE[stateKey] || {
      selectedTrack: VISUAL_ARCHITECT_COMPETITION_CONFIG.active_track,
      submission: null,
      status: 'IN_PROGRESS',
      submittedAt: null,
    };

    return NextResponse.json({
      success: true,
      userState,
      config: VISUAL_ARCHITECT_COMPETITION_CONFIG,
      currentUserId: user?.id,
    });
  } catch (error: any) {
    console.error('GET /api/coding/workspace error:', error);
    return NextResponse.json({ error: 'Failed to fetch workspace state' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSession();
    const body = await req.json();
    const eventId = body.eventId || 'default-event';
    const stateKey = `${user?.id || 'demo-user'}_${eventId}`;

    const currentState = WORKSPACE_PARTICIPANT_STATE[stateKey] || {
      selectedTrack: VISUAL_ARCHITECT_COMPETITION_CONFIG.active_track,
      submission: null,
      status: 'IN_PROGRESS',
      submittedAt: null,
    };

    // Action 1: Participant Track Selection
    if (body.action === 'SELECT_TRACK') {
      const { track } = body;
      
      // If event is active and not ended, enforce that participant can only select the Visual Architect Active Track
      if (!VISUAL_ARCHITECT_COMPETITION_CONFIG.event_ended && track !== VISUAL_ARCHITECT_COMPETITION_CONFIG.active_track) {
        return NextResponse.json({
          error: `This track is not active at this moment for this competition. Currently active track: '${VISUAL_ARCHITECT_COMPETITION_CONFIG.active_track}'. It will be open once approved by Visual Architects.`,
          activeTrack: VISUAL_ARCHITECT_COMPETITION_CONFIG.active_track,
        }, { status: 400 });
      }

      currentState.selectedTrack = track;
      WORKSPACE_PARTICIPANT_STATE[stateKey] = currentState;

      return NextResponse.json({
        success: true,
        userState: currentState,
      });
    }

    // Action 2: Submit Solution / Auto-Submit
    if (body.action === 'SUBMIT' || body.action === 'AUTO_SUBMIT') {
      if (currentState.status === 'SUBMITTED_LOCKED' && !VISUAL_ARCHITECT_COMPETITION_CONFIG.event_ended) {
        return NextResponse.json({
          error: 'You have already submitted for this competition. Your workspace is locked until Visual Architects end the event.',
        }, { status: 400 });
      }

      if (VISUAL_ARCHITECT_COMPETITION_CONFIG.event_ended) {
        return NextResponse.json({
          error: 'The competition event has already ended by Visual Architects.',
        }, { status: 400 });
      }

      const { track, payload, isAutoSubmit } = body;
      const submittedAt = new Date().toISOString();

      currentState.selectedTrack = track || currentState.selectedTrack;
      currentState.submission = {
        track: currentState.selectedTrack,
        payload,
        isAutoSubmit: !!isAutoSubmit,
        submittedAt,
        studentName: user?.name || payload?.teamName || 'Student Coder',
        usn: user?.usn || '1RV23CS001',
      };
      currentState.status = 'SUBMITTED_LOCKED';
      currentState.submittedAt = submittedAt;

      WORKSPACE_PARTICIPANT_STATE[stateKey] = currentState;

      // Also persist to DB if available
      try {
        if (user && eventId && eventId !== 'default-event') {
          const firstChallenge = await db.codingChallenge.findFirst({
            where: { event_id: eventId },
          });

          if (firstChallenge) {
            await db.codingSubmission.create({
              data: {
                event_id: eventId,
                challenge_id: firstChallenge.id,
                student_id: user.id,
                code_content: typeof payload === 'string' ? payload : JSON.stringify(payload),
                language: payload?.language || 'PYTHON',
                score: payload?.score || 100,
                status: 'PASSED',
              },
            });
          }
        }
      } catch (dbErr) {
        console.warn('DB submission write fallback:', dbErr);
      }

      return NextResponse.json({
        success: true,
        message: isAutoSubmit
          ? '5-Minute Auto-submit completed! Your solution has been sent to Visual Architects.'
          : 'Submission received! Your workspace is locked until Visual Architects end the event.',
        userState: currentState,
      });
    }

    // Action 3: Timeout Rejection (when timer expires without submitting)
    if (body.action === 'TIMEOUT_REJECT') {
      currentState.status = 'REJECTED_TIMEOUT';
      WORKSPACE_PARTICIPANT_STATE[stateKey] = currentState;
      return NextResponse.json({
        success: true,
        message: 'Time limit exceeded. Your slot has timed out and has been marked as Rejected by the competition referee system.',
        userState: currentState,
      });
    }

    // =========================================================================
    // VISUAL ARCHITECT CONTROL ACTIONS (For Visual Architects Admin / Testing)
    // =========================================================================
    if (body.action === 'VA_SET_ACTIVE_TRACK') {
      const { track } = body;
      VISUAL_ARCHITECT_COMPETITION_CONFIG.active_track = track;
      return NextResponse.json({
        success: true,
        config: VISUAL_ARCHITECT_COMPETITION_CONFIG,
      });
    }

    if (body.action === 'VA_START_EVENT') {
      VISUAL_ARCHITECT_COMPETITION_CONFIG.event_started = true;
      VISUAL_ARCHITECT_COMPETITION_CONFIG.event_ended = false;
      VISUAL_ARCHITECT_COMPETITION_CONFIG.start_time = new Date().toISOString();
      if (body.duration_minutes) {
        VISUAL_ARCHITECT_COMPETITION_CONFIG.duration_minutes = body.duration_minutes;
      }
      return NextResponse.json({
        success: true,
        config: VISUAL_ARCHITECT_COMPETITION_CONFIG,
      });
    }

    if (body.action === 'VA_END_EVENT') {
      VISUAL_ARCHITECT_COMPETITION_CONFIG.event_ended = true;
      return NextResponse.json({
        success: true,
        config: VISUAL_ARCHITECT_COMPETITION_CONFIG,
      });
    }

    if (body.action === 'VA_UPDATE_MCQ') {
      const { questions, title, description } = body;
      if (questions) VISUAL_ARCHITECT_COMPETITION_CONFIG.mcq_content.questions = questions;
      if (title) VISUAL_ARCHITECT_COMPETITION_CONFIG.mcq_content.title = title;
      if (description) VISUAL_ARCHITECT_COMPETITION_CONFIG.mcq_content.description = description;
      VISUAL_ARCHITECT_COMPETITION_CONFIG.mcq_content.released = true;
      return NextResponse.json({
        success: true,
        config: VISUAL_ARCHITECT_COMPETITION_CONFIG,
      });
    }

    if (body.action === 'VA_UPDATE_BUG_HUNT') {
      const { buggy_code, test_cases, defect_notice } = body;
      if (buggy_code) VISUAL_ARCHITECT_COMPETITION_CONFIG.bug_hunt_content.buggy_code = buggy_code;
      if (test_cases) VISUAL_ARCHITECT_COMPETITION_CONFIG.bug_hunt_content.test_cases = test_cases;
      if (defect_notice) VISUAL_ARCHITECT_COMPETITION_CONFIG.bug_hunt_content.defect_notice = defect_notice;
      VISUAL_ARCHITECT_COMPETITION_CONFIG.bug_hunt_content.released = true;
      return NextResponse.json({
        success: true,
        config: VISUAL_ARCHITECT_COMPETITION_CONFIG,
      });
    }

    return NextResponse.json({ error: 'Invalid workspace action' }, { status: 400 });
  } catch (error: any) {
    console.error('POST /api/coding/workspace error:', error);
    return NextResponse.json({ error: error.message || 'Operation failed' }, { status: 500 });
  }
}
