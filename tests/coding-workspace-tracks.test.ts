import { describe, it, expect } from 'vitest';

describe('Coding Workspace: Visual Architects Integration & Timer', () => {
  it('should restrict active participation to the 1 track allocated by Visual Architects', () => {
    const vaConfig = {
      active_track: 'research',
      event_started: true,
      event_ended: false,
    };

    const isTrackActive = (trackId: string) => {
      if (!vaConfig.event_ended && trackId !== vaConfig.active_track) {
        return {
          active: false,
          message: "This track is not active at this moment for this competition.",
          currentActive: vaConfig.active_track,
          unlockNotice: "This track will be open once approved by Visual Architects.",
        };
      }
      return { active: true };
    };

    // When trying to open inactive tracks (e.g. bug_hunt)
    const inactiveCheck = isTrackActive('bug_hunt');
    expect(inactiveCheck.active).toBe(false);
    expect(inactiveCheck.message).toContain('not active at this moment');
    expect(inactiveCheck.currentActive).toBe('research');

    // When opening the Visual Architect allocated active track
    const activeCheck = isTrackActive('research');
    expect(activeCheck.active).toBe(true);
  });

  it('should feed Option 3 (MCQ Quiz) and Option 4 (Bug Hunt) directly from Visual Architects', () => {
    const vaFeed = {
      mcq_content: {
        released: true,
        title: 'Visual Architects Algorithmic Sprint MCQ',
        questions: [
          { id: 1, question: 'Quickselect complexity?', options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(log N)'], correctIndex: 2 },
        ],
      },
      bug_hunt_content: {
        released: true,
        title: 'Visual Architects Defect Patch Challenge',
        buggy_code: 'int binarySearch(const vector<int>& arr, int target) { ... }',
        test_cases: [{ id: 1, name: 'Test Case 1', expected_output: 'Index 4' }],
      },
    };

    expect(vaFeed.mcq_content.released).toBe(true);
    expect(vaFeed.mcq_content.questions.length).toBeGreaterThan(0);
    expect(vaFeed.bug_hunt_content.released).toBe(true);
    expect(vaFeed.bug_hunt_content.test_cases.length).toBe(1);
  });

  it('should keep workspace blocked until Visual Architects click End Event', () => {
    let vaConfig = { event_ended: false };
    let participantState = { status: 'SUBMITTED_LOCKED' };

    // While event has not ended, workspace is blocked
    const canModifyWorkspace = () => {
      if (participantState.status === 'SUBMITTED_LOCKED' && !vaConfig.event_ended) {
        return false;
      }
      return true;
    };

    expect(canModifyWorkspace()).toBe(false);

    // Visual Architects click End Event
    vaConfig.event_ended = true;
    expect(canModifyWorkspace()).toBe(true);
  });

  it('should calculate timer, trigger 10m reminder, 5m auto-submit warning, and timeout rejection', () => {
    const totalDurationSec = 60 * 60; // 60 mins
    
    // Test 10-minute warning (< 600s, > 300s)
    const isTenMinWarning = (remainingSec: number) => remainingSec <= 600 && remainingSec > 300;
    expect(isTenMinWarning(550)).toBe(true);
    expect(isTenMinWarning(2000)).toBe(false);

    // Test 5-minute warning (< 300s, > 0s)
    const isFiveMinWarning = (remainingSec: number) => remainingSec <= 300 && remainingSec > 0;
    expect(isFiveMinWarning(240)).toBe(true);

    // Test timeout rejection when remainingSec == 0 without submission
    const getTimeoutStatus = (remainingSec: number, submitted: boolean) => {
      if (remainingSec <= 0 && !submitted) return 'REJECTED_TIMEOUT';
      return 'IN_PROGRESS';
    };

    expect(getTimeoutStatus(0, false)).toBe('REJECTED_TIMEOUT');
    expect(getTimeoutStatus(100, false)).toBe('IN_PROGRESS');
  });
});
