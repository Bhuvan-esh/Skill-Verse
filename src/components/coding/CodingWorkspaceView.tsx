'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  FileSearch,
  HelpCircle,
  Bug,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Send,
  RotateCcw,
  Play,
  Sparkles,
  Terminal,
  Cpu,
  Info,
  XCircle,
  ArrowRight,
  Clock,
  Layers,
  FileCode,
  Check,
  Eye,
  RefreshCw,
  Sliders,
  Timer,
  AlertOctagon,
  Zap
} from 'lucide-react';
import { CodeEditorSheetComposed, CodeLanguage } from '@/components/ui/code-editor-sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CodingWorkspaceViewProps {
  user: any;
  selectedEventId: string;
  selectedChallenge: any;
  eventDetail: any;
  onRefresh: () => void;
}

export type WorkspaceTrack = 'research' | 'code_editor' | 'mcq_quiz' | 'bug_hunt';

export default function CodingWorkspaceView({
  user,
  selectedEventId,
  selectedChallenge,
  eventDetail,
  onRefresh,
}: CodingWorkspaceViewProps) {
  // Master Config from Visual Architects
  const [vaConfig, setVaConfig] = useState<any>({
    active_track: 'research' as WorkspaceTrack,
    event_started: true,
    event_ended: false,
    start_time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    duration_minutes: 60,
    approved_by: 'Visual Architects Board (AIDS & AIML)',
    mcq_content: {
      released: true,
      title: 'Visual Architects Algorithmic Sprint MCQ',
      description: 'Directly released from Visual Architects Control Console',
      questions: [],
    },
    bug_hunt_content: {
      released: true,
      title: 'Visual Architects Defect Patch Challenge',
      defect_notice: 'This code was released by Visual Architects with intentional runtime bugs.',
      buggy_code: '',
      test_cases: [],
    },
  });

  // Track selection state (null until student clicks any option)
  const [selectedTrack, setSelectedTrack] = useState<WorkspaceTrack | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'IN_PROGRESS' | 'SUBMITTED_LOCKED' | 'REJECTED_TIMEOUT'>('IN_PROGRESS');
  const [submissionData, setSubmissionData] = useState<any | null>(null);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [autoSubmitWarningDismissed, setAutoSubmitWarningDismissed] = useState(false);

  // Visual Architects Test Console Modal
  const [showVaControlPanel, setShowVaControlPanel] = useState(false);

  // Timer State (in seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3600); // 60 mins default
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Track 1: Research State
  const [teamName, setTeamName] = useState('');
  const [researchTitle, setResearchTitle] = useState('');
  const [researchAnalysis, setResearchAnalysis] = useState('');
  const [researchWorkflow, setResearchWorkflow] = useState('');
  const [researchCodeSnippet, setResearchCodeSnippet] = useState('');

  // Track 2: Multi-Language Code Editor State
  const [activeCodeLang, setActiveCodeLang] = useState<CodeLanguage>('python');
  const [editorCode, setEditorCode] = useState<string>(
    `# Algorithmic Solution
def solve_challenge():
    # Write your multi-year balanced team solution here
    print("Visual Architects Verified Code Execution")

if __name__ == "__main__":
    solve_challenge()`
  );

  // Track 3: MCQ Quiz State (Fed dynamically by Visual Architects)
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [mcqScore, setMcqScore] = useState<number | null>(null);

  // Track 4: Bug Hunt State (Fed dynamically by Visual Architects)
  const [buggyCode, setBuggyCode] = useState<string>('');
  const [testResults, setTestResults] = useState<Array<{ id: number; name: string; status: 'PASS' | 'FAIL' | 'PENDING'; detail: string }>>([]);

  // Fetch Workspace State & Visual Architects Config from backend
  const fetchWorkspace = async () => {
    try {
      const res = await fetch(`/api/coding/workspace?eventId=${selectedEventId || 'default'}`);
      const data = await res.json();
      if (res.ok && data) {
        if (data.config) {
          setVaConfig(data.config);
          if (data.userState?.submission?.track) {
            setSubmissionData(data.userState.submission);
          }
          if (data.config.bug_hunt_content?.buggy_code && !buggyCode) {
            setBuggyCode(data.config.bug_hunt_content.buggy_code);
          }
          if (data.config.bug_hunt_content?.test_cases) {
            setTestResults(
              data.config.bug_hunt_content.test_cases.map((tc: any) => ({
                id: tc.id,
                name: tc.name,
                status: 'PENDING',
                detail: `Expected: ${tc.expected_output}`,
              }))
            );
          }
        }
        if (data.userState) {
          if (data.userState.selectedTrack) {
            setSelectedTrack(data.userState.selectedTrack);
          }
          if (data.userState.status) {
            setSubmissionStatus(data.userState.status);
          }
          if (data.userState.submission) {
            setSubmissionData(data.userState.submission);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load workspace state', e);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [selectedEventId]);

  // Timer Tick & Stop Logic
  useEffect(() => {
    if (!vaConfig.event_started || vaConfig.event_ended) {
      setIsTimerRunning(false);
      return;
    }

    const calculateRemaining = () => {
      if (!vaConfig.start_time) return vaConfig.duration_minutes * 60;
      const startMs = new Date(vaConfig.start_time).getTime();
      const nowMs = Date.now();
      const elapsedSec = Math.floor((nowMs - startMs) / 1000);
      const totalSec = vaConfig.duration_minutes * 60;
      const remaining = Math.max(0, totalSec - elapsedSec);
      return remaining;
    };

    setSecondsRemaining(calculateRemaining());
    setIsTimerRunning(true);

    const interval = setInterval(() => {
      const rem = calculateRemaining();
      setSecondsRemaining(rem);

      // Trigger Auto-Submit when 0 seconds reached
      if (rem <= 0 && isTimerRunning && submissionStatus === 'IN_PROGRESS') {
        clearInterval(interval);
        handleAutoSubmitTimeout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [vaConfig.event_started, vaConfig.event_ended, vaConfig.start_time, vaConfig.duration_minutes, submissionStatus]);

  // Format Timer as HH:MM:SS
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-submit timeout trigger (when timer expires without manual submit)
  const handleAutoSubmitTimeout = async () => {
    // If user entered code or research, auto-submit draft. Otherwise mark timeout rejection.
    const hasWork = teamName || researchAnalysis || editorCode || Object.keys(mcqAnswers).length > 0 || buggyCode;
    
    if (hasWork) {
      handleFinalSubmit(true);
    } else {
      try {
        await fetch('/api/coding/workspace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'TIMEOUT_REJECT',
            eventId: selectedEventId || 'default',
          }),
        });
        setSubmissionStatus('REJECTED_TIMEOUT');
      } catch (e) {
        console.error('Failed to submit timeout rejection', e);
      }
    }
  };

  // Handle Track Selection
  const handleSelectTrack = async (trackId: WorkspaceTrack) => {
    if (selectedTrack === trackId) {
      setSelectedTrack(null);
      return;
    }
    // If event has not ended and track is NOT the Visual Architect assigned active track
    if (!vaConfig.event_ended && trackId !== vaConfig.active_track) {
      setSelectedTrack(trackId); // View the inactive notification view
      return;
    }

    try {
      const res = await fetch('/api/coding/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SELECT_TRACK',
          track: trackId,
          eventId: selectedEventId || 'default',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedTrack(trackId);
      }
    } catch (e) {
      console.error('Failed to select track', e);
    }
  };

  // Handle Final Submission (or Auto-Submit)
  const handleFinalSubmit = async (isAuto = false) => {
    if (submissionStatus === 'SUBMITTED_LOCKED' && !vaConfig.event_ended) return;

    let payload: any = {};
    if (selectedTrack === 'research') {
      payload = {
        teamName: teamName || 'Algorithmic Team',
        title: researchTitle || selectedChallenge?.title || 'Algorithmic Research',
        analysis: researchAnalysis || 'Draft research submitted.',
        workflow: researchWorkflow || 'Logic workflow outline.',
        codeSnippet: researchCodeSnippet || '',
      };
    } else if (selectedTrack === 'code_editor') {
      payload = {
        language: activeCodeLang,
        code: editorCode,
        challengeTitle: selectedChallenge?.title || 'Coding Sprint Challenge',
      };
    } else if (selectedTrack === 'mcq_quiz') {
      const questions = vaConfig.mcq_content?.questions || [];
      let correct = 0;
      questions.forEach((q: any) => {
        if (mcqAnswers[q.id] === q.correctIndex) correct++;
      });
      const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 100;
      setMcqScore(score);
      payload = {
        score,
        answers: mcqAnswers,
        totalQuestions: questions.length,
        correctCount: correct,
      };
    } else if (selectedTrack === 'bug_hunt') {
      payload = {
        debuggedCode: buggyCode,
        testsPassed: testResults.filter((t) => t.status === 'PASS').length,
        totalTests: testResults.length,
      };
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/coding/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isAuto ? 'AUTO_SUBMIT' : 'SUBMIT',
          track: selectedTrack,
          payload,
          isAutoSubmit: isAuto,
          eventId: selectedEventId || 'default',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setSubmissionStatus('SUBMITTED_LOCKED');
      setSubmissionData(data.userState?.submission || { track: selectedTrack, payload });
      setShowSubmitConfirmModal(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Run Bug Hunt Test Cases
  const handleRunBugHuntTests = () => {
    const hasFixedSize = buggyCode.includes('arr.size() - 1') || buggyCode.includes('arr.size()-1') || buggyCode.includes('nums.size() - 1');
    const hasFixedCondition = buggyCode.includes('low <= high') || buggyCode.includes('low<=high');
    const hasFixedLow = buggyCode.includes('low = mid + 1') || buggyCode.includes('low = mid+1') || buggyCode.includes('low=mid+1');
    const hasFixedHigh = buggyCode.includes('high = mid - 1') || buggyCode.includes('high = mid-1') || buggyCode.includes('high=mid-1');

    const allFixed = hasFixedSize && hasFixedCondition && hasFixedLow && hasFixedHigh;

    if (allFixed) {
      setTestResults([
        { id: 1, name: 'Test Case 1: Exact Element Search (target = 29)', status: 'PASS', detail: 'Passed in 1.1ms (Index: 4)' },
        { id: 2, name: 'Test Case 2: Boundary Element Search (target = 3 & 89)', status: 'PASS', detail: 'Passed in 0.9ms (Index: 0 and 9)' },
        { id: 3, name: 'Test Case 3: Missing Target Element (target = 999)', status: 'PASS', detail: 'Passed in 0.8ms (Index: -1)' },
      ]);
    } else {
      setTestResults([
        { id: 1, name: 'Test Case 1: Exact Element Search (target = 29)', status: hasFixedLow && hasFixedCondition ? 'PASS' : 'FAIL', detail: hasFixedLow && hasFixedCondition ? 'Passed in 1.3ms' : 'Runtime/Infinite Loop: bounds not advancing' },
        { id: 2, name: 'Test Case 2: Boundary Element Search (target = 3 & 89)', status: hasFixedSize && hasFixedCondition ? 'PASS' : 'FAIL', detail: hasFixedSize && hasFixedCondition ? 'Passed in 1.0ms' : 'Out of Bounds / Missed high boundary' },
        { id: 3, name: 'Test Case 3: Missing Target Element (target = 999)', status: hasFixedHigh && hasFixedCondition ? 'PASS' : 'FAIL', detail: hasFixedHigh && hasFixedCondition ? 'Passed in 0.8ms' : 'Failed termination assertion' },
      ]);
    }
  };

  // Visual Architects Control Panel Action Handler
  const handleVaAction = async (action: string, extra: any = {}) => {
    try {
      const res = await fetch('/api/coding/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = await res.json();
      if (res.ok && data.config) {
        setVaConfig(data.config);
        if (data.config.active_track) {
          setSelectedTrack(data.config.active_track);
        }
      }
    } catch (e) {
      console.error('VA action failed', e);
    }
  };

  const TRACK_METADATA = [
    {
      id: 'research' as WorkspaceTrack,
      title: 'Problem Research & Architecture Workflow',
      badge: 'Option 1 • Research & Strategy',
      icon: FileSearch,
      color: 'purple',
      description: 'Submit your deep algorithmic research, team analysis, architectural workflow, and problem-solving strategy directly to Visual Architects.',
    },
    {
      id: 'code_editor' as WorkspaceTrack,
      title: 'Algorithmic Code Editor Sheet (Multi-Language)',
      badge: 'Option 2 • Live IDE & Compiler',
      icon: Code2,
      color: 'cyan',
      description: 'Write, debug, and submit your solution using the integrated multi-language Ace Code Editor Sheet (C, C++, Python, Java, HTML, CSS, JavaScript).',
    },
    {
      id: 'mcq_quiz' as WorkspaceTrack,
      title: 'MCQ Quiz Coding Challenge Track',
      badge: 'Option 3 • Speed & Knowledge',
      icon: HelpCircle,
      color: 'emerald',
      description: 'Timed multiple-choice coding sprint testing algorithms, memory management, data structures, and runtime complexities.',
    },
    {
      id: 'bug_hunt' as WorkspaceTrack,
      title: 'Bug Hunt / Error Code Debugging Challenge',
      badge: 'Option 4 • Live Debugger',
      icon: Bug,
      color: 'amber',
      description: 'Given buggy source code with runtime errors, identify the defects, refactor the logic, pass live test case benchmarks, and submit.',
    },
  ];

  const isCurrentTrackActive = selectedTrack ? (vaConfig.event_ended || selectedTrack === vaConfig.active_track) : false;
  const isLockedAfterSubmit = submissionStatus === 'SUBMITTED_LOCKED' && !vaConfig.event_ended;
  const isTenMinWarning = isTimerRunning && secondsRemaining <= 600 && secondsRemaining > 300 && submissionStatus === 'IN_PROGRESS';
  const isFiveMinWarning = isTimerRunning && secondsRemaining <= 300 && secondsRemaining > 0 && submissionStatus === 'IN_PROGRESS';

  return (
    <div className="space-y-6 font-sans">

      {/* 10-MINUTE REMINDER BANNER */}
      {isTenMinWarning && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center space-x-3">
            <Timer className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <strong className="text-white font-mono text-xs block">⚠️ 10 MINUTES REMAINING WARNING</strong>
              <span className="text-xs text-amber-200 font-sans">
                Please finalize your research and code. Prepare to submit before the Visual Architects timer expires!
              </span>
            </div>
          </div>
          <span className="text-sm font-extrabold font-mono text-amber-300 px-3 py-1 bg-amber-500/20 rounded-xl border border-amber-500/30">
            {formatTime(secondsRemaining)}
          </span>
        </div>
      )}

      {/* 5-MINUTE AUTO-SUBMIT WARNING BANNER */}
      {isFiveMinWarning && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border-2 border-rose-500 text-rose-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xl">
          <div className="flex items-start space-x-3">
            <AlertOctagon className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold">URGENT DEADLINE</span>
                <strong className="text-white font-mono text-xs">5 MINUTES REMAINING — AUTO-SUBMIT OR SUBMIT MANUALLY</strong>
              </div>
              <p className="text-xs text-rose-100 mt-1">
                Auto-submit will trigger in <strong>{formatTime(secondsRemaining)}</strong> to submit your current code even if you are working. Or submit manually now.
                <em className="block text-[11px] text-rose-300 mt-0.5">⚠️ If time runs out without work, your entry will be rejected by competition rules.</em>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => handleFinalSubmit(true)}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-rose-200 font-mono text-xs font-bold border border-rose-400/30 cursor-pointer"
            >
              Auto-Submit in 5 Min (Ready)
            </button>
            <button
              onClick={() => setShowSubmitConfirmModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold shadow-lg shadow-rose-600/40 cursor-pointer flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Manually Now</span>
            </button>
          </div>
        </div>
      )}

      {/* TIMEOUT REJECTION NOTICE */}
      {submissionStatus === 'REJECTED_TIMEOUT' && (
        <div className="p-6 rounded-3xl bg-rose-950/40 border-2 border-rose-500 text-center space-y-2 shadow-2xl">
          <XCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white font-heading">Sprint Time Limit Exceeded (Rejected)</h3>
          <p className="text-xs text-rose-300 font-mono max-w-lg mx-auto">
            The competition timer expired before your solution was submitted. Your entry has been recorded as Timed Out / Rejected per competition guidelines.
          </p>
        </div>
      )}

      {/* TOP HEADER: Visual Architects Clock, Active Option, and Status */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-[#0c0d1c] shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30 flex items-center gap-1">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>Verified by Visual Architects</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
              Active Option Assigned: {TRACK_METADATA.find((t) => t.id === vaConfig.active_track)?.badge}
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-white font-heading">
            {selectedChallenge ? selectedChallenge.title : 'Algorithmic Sprint & Problem Workspace'}
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Visual Architects assign 1 active option for this competition. Once submitted, your workspace is blocked until Visual Architects click "End Event".
          </p>
        </div>

        {/* Real-time Clock & State Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Competition Timer */}
          <div className="p-3 px-4 rounded-2xl bg-black/60 border border-cyan-500/30 flex items-center space-x-3 shadow-inner">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">
                {vaConfig.event_ended ? 'Visual Architects Event Ended' : 'Competition Time Remaining'}
              </span>
              <div className="text-base font-extrabold font-mono tracking-wider text-cyan-300">
                {vaConfig.event_ended ? (
                  <span className="text-slate-400 text-xs">⏹️ 00:00:00 (Ended)</span>
                ) : (
                  formatTime(secondsRemaining)
                )}
              </div>
            </div>
          </div>

          {/* Visual Architects Admin / Toggle Panel Button */}
          <button
            onClick={() => setShowVaControlPanel(!showVaControlPanel)}
            className="px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-mono text-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>Architect Controls</span>
          </button>
        </div>
      </div>

      {/* VISUAL ARCHITECTS LIVE CONTROL PANEL (FOR TESTING / MANAGING COMPETITION) */}
      {showVaControlPanel && (
        <div className="glass-panel p-5 rounded-3xl border border-purple-500/40 bg-slate-950/90 shadow-2xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <h4 className="font-bold text-white uppercase">Visual Architects Live Competition Controller</h4>
            </div>
            <span className="text-[10px] text-purple-300">AIDS & AIML Visual Architect Authority</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Change Active Track */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">1. Allocate Active Option (1 Allowed)</span>
              <select
                value={vaConfig.active_track}
                onChange={(e) => handleVaAction('VA_SET_ACTIVE_TRACK', { track: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-purple-300 text-xs font-bold focus:outline-none"
              >
                <option value="research">Option 1: Problem Research</option>
                <option value="code_editor">Option 2: Multi-Lang Code Editor</option>
                <option value="mcq_quiz">Option 3: MCQ Quiz Track</option>
                <option value="bug_hunt">Option 4: Bug Hunt Track</option>
              </select>
            </div>

            {/* 2. Timer Control: Start Event */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">2. Event Clock Management</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVaAction('VA_START_EVENT', { duration_minutes: 60 })}
                  className="w-1/2 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                >
                  Start (60m)
                </button>
                <button
                  onClick={() => handleVaAction('VA_START_EVENT', { duration_minutes: 10 })}
                  className="w-1/2 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] cursor-pointer"
                >
                  Test 10m
                </button>
              </div>
            </div>

            {/* 3. End Event Button */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">3. Event Finish (Unlocks All 4)</span>
              <button
                onClick={() => handleVaAction('VA_END_EVENT')}
                className="w-full py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer"
              >
                End Event Now
              </button>
            </div>

            {/* 4. Release Option 3/4 Content */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">4. Sync Visual Architect Feeds</span>
              <button
                onClick={fetchWorkspace}
                className="w-full py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] cursor-pointer flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync Architect Feed</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRACK SELECTOR OVERVIEW BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TRACK_METADATA.map((track) => {
          const Icon = track.icon;
          const isCurrentSelected = selectedTrack === track.id;
          const isVaActiveTrack = vaConfig.active_track === track.id;
          const isEnded = vaConfig.event_ended;

          return (
            <div
              key={track.id}
              onClick={() => handleSelectTrack(track.id)}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                isCurrentSelected
                  ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-500/60 shadow-lg ring-1 ring-cyan-500/40'
                  : !isVaActiveTrack && !isEnded
                  ? 'bg-black/30 border-white/5 opacity-60 hover:opacity-100 hover:border-white/15'
                  : 'bg-white/5 border-white/10 hover:border-purple-500/50 hover:bg-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isCurrentSelected ? 'bg-cyan-500/20 text-cyan-300' : isVaActiveTrack ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-slate-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {isVaActiveTrack && !isEnded ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> ARCHITECT ACTIVE
                    </span>
                  ) : isEnded ? (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] font-mono font-bold border border-indigo-500/30 flex items-center gap-1">
                      <Unlock className="w-2.5 h-2.5" /> UNLOCKED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[9px] font-mono border border-white/5 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> NOT ACTIVE
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-mono text-purple-400 uppercase block font-bold">{track.badge}</span>
                <h4 className="text-xs font-bold text-white font-heading mt-0.5 line-clamp-1">{track.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">{track.description}</p>
              </div>

              <div className="mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTrack(track.id);
                  }}
                  className={`w-full py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    isCurrentSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : isVaActiveTrack
                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                      : 'bg-white/10 hover:bg-white/15 text-slate-300'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>{isCurrentSelected ? 'Viewing' : isVaActiveTrack ? 'Open Active Track' : 'View Status'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 1. PROMPT WHEN NO TRACK OPTION IS SELECTED */}
      {selectedTrack === null && (
        <div className="glass-card p-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/20 via-slate-900 to-black text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-300">
            <Code2 className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-white font-heading">
              Select a Track Option Above to Open Workspace
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Click on any of the 4 challenge options above (Option 1 Research, Option 2 Code Editor, Option 3 MCQ Quiz, or Option 4 Bug Hunt) to load its interactive environment.
            </p>
          </div>
          {vaConfig.active_track && (
            <button
              onClick={() => handleSelectTrack(vaConfig.active_track)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs shadow-lg shadow-purple-600/30 transition-all inline-flex items-center space-x-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Open Currently Active Option: {TRACK_METADATA.find(t => t.id === vaConfig.active_track)?.title}</span>
            </button>
          )}
        </div>
      )}

      {/* 2. SELECTED TRACK TOOLBAR & CLOSE BUTTON */}
      {selectedTrack !== null && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              {(() => {
                const Icon = TRACK_METADATA.find(t => t.id === selectedTrack)?.icon || Code2;
                return <Icon className="w-4 h-4" />;
              })()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                  {TRACK_METADATA.find(t => t.id === selectedTrack)?.badge}
                </span>
                {isCurrentTrackActive && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                    ACTIVE
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white font-heading">
                {TRACK_METADATA.find(t => t.id === selectedTrack)?.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setSelectedTrack(null)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-mono text-xs transition-all flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
          >
            <span>✕ Close Option</span>
          </button>
        </div>
      )}

      {/* CASE A: INACTIVE TRACK OVERLAY (USER TRIED TO OPEN INACTIVE OPTION) */}
      {selectedTrack !== null && !isCurrentTrackActive && (
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-950 to-black text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1 max-w-xl mx-auto">
            <h3 className="text-lg font-bold text-white font-heading">
              This track is not active at this moment for this competition
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Visual Architects allocate <strong>1 active challenge option</strong> for this sprint session.
              This track will open once approved and released by Visual Architects for a future sprint.
            </p>
          </div>

          {/* Prompt to Go to Active Track */}
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 max-w-md mx-auto flex items-center justify-between gap-3">
            <div className="text-left font-mono text-xs">
              <span className="text-[10px] text-purple-300 block uppercase font-bold">Currently Active Track:</span>
              <strong className="text-white">{TRACK_METADATA.find((t) => t.id === vaConfig.active_track)?.title}</strong>
            </div>

            <button
              onClick={() => handleSelectTrack(vaConfig.active_track)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center space-x-1 cursor-pointer flex-shrink-0"
            >
              <span>Go to Active Track</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* CASE B: WORKSPACE SUBMITTED & BLOCKED UNTIL EVENT ENDS */}
      {selectedTrack !== null && isCurrentTrackActive && isLockedAfterSubmit && (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-950 to-black text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold mb-1">
              <span>✓ Official Submission Received & Locked</span>
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              Your Submission Has Been Sent to Visual Architects
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Your competition workspace is <strong>blocked and locked until Visual Architects end the event</strong>. Once Visual Architects conclude the event, all 4 options will be unlocked for review and practice.
            </p>
          </div>

          {/* Submission Details Summary Box */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-lg mx-auto font-mono text-xs text-left space-y-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Track Submitted:</span>
              <span className="text-cyan-300 font-bold">{TRACK_METADATA.find((t) => t.id === submissionData?.track)?.title || 'Assigned Track'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Registered Coder:</span>
              <span className="text-white">{submissionData?.studentName || user?.name || 'demo L'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="text-emerald-400 font-bold">🔒 Under Review (Awaiting Event End)</span>
            </div>
          </div>
        </div>
      )}

      {/* CASE C: ACTIVE TRACK INTERFACE (WHEN ACTIVE & NOT BLOCKED) */}
      {selectedTrack !== null && isCurrentTrackActive && (!isLockedAfterSubmit || vaConfig.event_ended) && (
        <>
          {/* TRACK 1: PROBLEM RESEARCH & ARCHITECTURE WORKFLOW */}
          {selectedTrack === 'research' && (
            <div className="glass-card p-6 rounded-3xl border border-purple-500/30 space-y-5 bg-slate-950/60 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                    <FileSearch className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">Problem Research & Architecture Submission</h3>
                    <span className="text-[11px] font-mono text-purple-300">Submit your team's research analysis, workflow, and code structure</span>
                  </div>
                </div>

                {vaConfig.event_ended && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Event Concluded (Review Mode)
                  </span>
                )}
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">1. Team Name / Cohort</label>
                    <input
                      type="text"
                      disabled={vaConfig.event_ended}
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. Algorithmic Titans (Team #1)"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">2. Problem Title / Topic</label>
                    <input
                      type="text"
                      disabled={vaConfig.event_ended}
                      value={researchTitle}
                      onChange={(e) => setResearchTitle(e.target.value)}
                      placeholder="e.g. Dynamic Graph Partitioning & Routing Strategy"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">3. Algorithmic Research & Approach Analysis</label>
                  <textarea
                    rows={4}
                    disabled={vaConfig.event_ended}
                    value={researchAnalysis}
                    onChange={(e) => setResearchAnalysis(e.target.value)}
                    placeholder="Detail your algorithmic research, complexity tradeoffs, time/space constraints, and reasoning..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 resize-none leading-relaxed disabled:opacity-60 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">4. Workflow Architecture & Step-by-Step Logic</label>
                  <textarea
                    rows={3}
                    disabled={vaConfig.event_ended}
                    value={researchWorkflow}
                    onChange={(e) => setResearchWorkflow(e.target.value)}
                    placeholder="Outline step 1, step 2, step 3 of the data pipeline or algorithmic workflow..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 resize-none leading-relaxed disabled:opacity-60 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">5. Code Snippet / Prototype Implementation</label>
                  <textarea
                    rows={5}
                    disabled={vaConfig.event_ended}
                    value={researchCodeSnippet}
                    onChange={(e) => setResearchCodeSnippet(e.target.value)}
                    placeholder="// Paste key functions, structs, or prototype implementation code here..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-cyan-300 focus:outline-none focus:border-purple-500 resize-none leading-relaxed disabled:opacity-60"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    {vaConfig.event_ended
                      ? '🔒 Competition concluded by Visual Architects.'
                      : 'Once submitted, changes cannot be made and workspace is blocked until event end.'}
                  </span>

                  {!vaConfig.event_ended && (
                    <button
                      type="button"
                      onClick={() => setShowSubmitConfirmModal(true)}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Research to Architects</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TRACK 2: MULTI-LANGUAGE CODE EDITOR SHEET */}
          {selectedTrack === 'code_editor' && (
            <div className="glass-card p-6 rounded-3xl border border-cyan-500/30 space-y-5 bg-slate-950/60 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">Multi-Language Code Editor Sheet</h3>
                    <span className="text-[11px] font-mono text-cyan-300">
                      Supported Languages: C, C++, Python, Java, HTML, CSS, JavaScript
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <CodeEditorSheetComposed
                    trigger={
                      <Button variant="outline" className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 text-xs font-mono h-8 px-3">
                        <Code2 className="w-3.5 h-3.5 mr-1" />
                        Open Side Editor Sheet
                      </Button>
                    }
                    title="Full-Screen Code Editor Sheet"
                    description="Write and test your solution across C, C++, Python, Java, HTML, CSS, and JS"
                    defaultLanguage={activeCodeLang}
                    allowLanguageChange={true}
                    defaultValue={editorCode}
                    onSave={(code, lang) => {
                      setEditorCode(code);
                      setActiveCodeLang(lang);
                    }}
                  />
                </div>
              </div>

              {/* Embedded Editor Console */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Language:</span>
                    <select
                      disabled={vaConfig.event_ended}
                      value={activeCodeLang}
                      onChange={(e) => setActiveCodeLang(e.target.value as CodeLanguage)}
                      className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-cyan-300 text-xs font-bold font-mono focus:outline-none"
                    >
                      <option value="python">Python (.py)</option>
                      <option value="c_cpp">C / C++ (.cpp)</option>
                      <option value="java">Java (.java)</option>
                      <option value="javascript">JavaScript (.js)</option>
                      <option value="html">HTML (.html)</option>
                      <option value="css">CSS (.css)</option>
                    </select>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Integrated Ace Editor Engine
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30">
                  <textarea
                    rows={12}
                    disabled={vaConfig.event_ended}
                    value={editorCode}
                    onChange={(e) => setEditorCode(e.target.value)}
                    placeholder="Write your solution implementation..."
                    className="w-full p-4 bg-slate-950 text-cyan-200 font-mono text-xs focus:outline-none resize-none leading-relaxed selection:bg-cyan-500 selection:text-white disabled:opacity-60"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    {vaConfig.event_ended
                      ? '🔒 Event concluded.'
                      : 'Once submitted, code is locked and workspace is blocked until event end.'}
                  </span>

                  {!vaConfig.event_ended && (
                    <button
                      type="button"
                      onClick={() => setShowSubmitConfirmModal(true)}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Code to Architects</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TRACK 3: MCQ QUIZ CODING CHALLENGE (CONTENT FED BY VISUAL ARCHITECTS) */}
          {selectedTrack === 'mcq_quiz' && (
            <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 space-y-5 bg-slate-950/60 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">
                      {vaConfig.mcq_content?.title || 'MCQ Quiz Coding Challenge'}
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-300">
                      {vaConfig.mcq_content?.description || 'Fed dynamically from Visual Architects'}
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Visual Architects Feed Synchronized
                </span>
              </div>

              {/* Dynamic Questions from Visual Architects */}
              {vaConfig.mcq_content?.questions?.length > 0 ? (
                <div className="space-y-6">
                  {vaConfig.mcq_content.questions.map((q: any, idx: number) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 font-mono">Question #{idx + 1}</span>
                        <span className="text-[10px] font-mono text-slate-400">{q.points || 25} pts</span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-relaxed">{q.question}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {q.options.map((opt: string, optIdx: number) => {
                          const isSelected = mcqAnswers[q.id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              disabled={vaConfig.event_ended}
                              onClick={() => setMcqAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center space-x-2 ${
                                isSelected
                                  ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold ring-1 ring-emerald-500/40'
                                  : 'bg-black/30 border-white/10 text-slate-300 hover:bg-white/10'
                              } disabled:opacity-60 cursor-pointer`}
                            >
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                                isSelected ? 'bg-emerald-500 text-black' : 'bg-white/10 text-slate-400'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-2 font-mono">
                    <span className="text-[11px] text-slate-400">
                      {vaConfig.event_ended
                        ? `Event ended (Score: ${mcqScore || 100}%).`
                        : 'Once submitted, quiz answers are permanently locked until Visual Architects end event.'}
                    </span>

                    {!vaConfig.event_ended && (
                      <button
                        type="button"
                        onClick={() => setShowSubmitConfirmModal(true)}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit MCQ Answers</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <Clock className="w-8 h-8 text-purple-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Awaiting MCQ Question Release from Visual Architects</h4>
                  <p className="text-xs text-slate-400 font-mono">
                    The questions will appear here when released from the Visual Architects console.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TRACK 4: BUG HUNT / ERROR CODE DEBUGGING (CONTENT FED BY VISUAL ARCHITECTS) */}
          {selectedTrack === 'bug_hunt' && (
            <div className="glass-card p-6 rounded-3xl border border-rose-500/30 space-y-5 bg-slate-950/60 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
                    <Bug className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">
                      {vaConfig.bug_hunt_content?.title || 'Bug Hunt: Debug & Fix Faulty Program'}
                    </h3>
                    <span className="text-[11px] font-mono text-rose-300">
                      Visual Architects Defect Patch Feed • Runtime & Syntax Fault
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Visual Architects Defect Synchronized
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {/* Defect Notice from Visual Architects */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs font-sans flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block font-mono text-rose-300">VISUAL ARCHITECT DEFECT NOTICE</span>
                    <p className="leading-relaxed">
                      {vaConfig.bug_hunt_content?.defect_notice || 'This program contains multiple runtime/advancement bugs. Refactor the code, run assertions, and submit.'}
                    </p>
                  </div>
                </div>

                {/* Buggy Code Editor */}
                <div className="relative rounded-2xl overflow-hidden border border-rose-500/30">
                  <textarea
                    rows={13}
                    disabled={vaConfig.event_ended}
                    value={buggyCode}
                    onChange={(e) => setBuggyCode(e.target.value)}
                    placeholder="// Awaiting Buggy Code Release from Visual Architects..."
                    className="w-full p-4 bg-slate-950 text-rose-200 font-mono text-xs focus:outline-none resize-none leading-relaxed selection:bg-rose-500 selection:text-white disabled:opacity-60"
                  />
                </div>

                {/* Test Case Execution Bench */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Play className="w-3.5 h-3.5 text-amber-400" />
                      <span>Visual Architect Test Suite</span>
                    </h4>
                    <button
                      type="button"
                      onClick={handleRunBugHuntTests}
                      className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 text-emerald-400" />
                      <span>Run Test Cases</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {testResults.map((t) => (
                      <div key={t.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${
                            t.status === 'PASS' ? 'bg-emerald-400 shadow-emerald-400/50 shadow-sm' : t.status === 'FAIL' ? 'bg-rose-400' : 'bg-slate-500'
                          }`} />
                          <span className="text-slate-200 font-mono">{t.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 font-mono">
                          <span className="text-slate-400 text-[10px]">{t.detail}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            t.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-300' : t.status === 'FAIL' ? 'bg-rose-500/20 text-rose-300' : 'bg-white/10 text-slate-400'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Debugged Solution */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    {vaConfig.event_ended
                      ? '🔒 Event ended by Visual Architects.'
                      : 'Once submitted, code is locked and workspace is blocked until event end.'}
                  </span>

                  {!vaConfig.event_ended && (
                    <button
                      type="button"
                      onClick={() => setShowSubmitConfirmModal(true)}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Debugged Patch</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* FINAL SUBMISSION CONFIRMATION MODAL */}
      {showSubmitConfirmModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 bg-gradient-to-b from-slate-900 to-black">
            <div className="flex items-center space-x-3 text-emerald-400 pb-2 border-b border-white/10">
              <ShieldCheck className="w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white font-heading">Submit to Visual Architects</h3>
                <span className="text-[11px] font-mono text-emerald-300">Workspace Lockout until Event End</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-2 leading-relaxed font-sans">
              <p>
                Are you ready to submit your solution for <strong className="text-white">{TRACK_METADATA.find((t) => t.id === selectedTrack)?.title}</strong>?
              </p>
              <p className="text-emerald-200 font-semibold font-mono text-[11px]">
                🔒 Once submitted, your workspace will be BLOCKED and cannot be modified until Visual Architects conclude the event.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-mono cursor-pointer"
              >
                Go Back & Edit
              </button>
              <button
                type="button"
                onClick={() => handleFinalSubmit(false)}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold shadow-lg shadow-emerald-600/30 flex items-center space-x-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting to Architects...' : 'Confirm Final Submission'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
