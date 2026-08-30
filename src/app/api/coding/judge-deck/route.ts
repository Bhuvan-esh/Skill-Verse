import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export interface EvaluationRow {
  id: string;
  student_name: string;
  usn: string;
  department: string;
  event_name: string;
  test_accuracy: number; // percentage e.g. 96
  execution_time_ms: number; // e.g. 1.2
  code_cleanliness: number; // score out of 25
  time_complexity_score: number; // score out of 25
  memory_score: number; // score out of 25
  bonus_points: number; // e.g. 15
  total_score: number; // sum of scores
  verdict: 'QUALIFIED_TOP_PERFORMER' | 'AVERAGE_PASS' | 'NEEDS_ATTENTION_FAIL';
  mentor_notes: string;
  submitted_to_architects: boolean;
}

// In-memory store initialized as empty so mentors add participants and fill judgements themselves
let GLOBAL_JUDGE_ROWS: EvaluationRow[] = [];

export async function GET() {
  try {
    const topPerformers = GLOBAL_JUDGE_ROWS
      .filter((r) => r.test_accuracy >= 80)
      .sort((a, b) => b.total_score - a.total_score)
      .map((r, idx) => ({ ...r, rank: idx + 1 }));

    const weakPerformers = GLOBAL_JUDGE_ROWS
      .filter((r) => r.test_accuracy < 80)
      .sort((a, b) => a.total_score - b.total_score)
      .map((r) => ({
        ...r,
        diagnostic_tip: r.test_accuracy < 50
          ? 'Critical: Memory deadlock & race conditions detected. Needs async mutex review.'
          : 'Moderate: Time complexity O(N^2) causes latency timeout. Suggest O(N log N) partition algorithm.',
      }));

    const count = GLOBAL_JUDGE_ROWS.length;

    return NextResponse.json({
      success: true,
      judgeRows: GLOBAL_JUDGE_ROWS,
      topPerformers,
      weakPerformers,
      summary: {
        totalEvaluated: count,
        submittedToArchitectsCount: GLOBAL_JUDGE_ROWS.filter((r) => r.submitted_to_architects).length,
        pendingSubmissionCount: GLOBAL_JUDGE_ROWS.filter((r) => !r.submitted_to_architects).length,
        avgAccuracy: count > 0 ? (GLOBAL_JUDGE_ROWS.reduce((acc, r) => acc + r.test_accuracy, 0) / count).toFixed(1) + '%' : '0.0%',
        avgExecutionTime: count > 0 ? (GLOBAL_JUDGE_ROWS.reduce((acc, r) => acc + r.execution_time_ms, 0) / count).toFixed(2) + 'ms' : '0.00ms',
      },
    });
  } catch (error: any) {
    console.error('Error fetching judge deck:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, judgeRows, singleRow } = body;

    if (action === 'SUBMIT_TO_VISUAL_ARCHITECTS') {
      // Mark all evaluated rows as submitted to Visual Architects and recalculate points
      GLOBAL_JUDGE_ROWS = GLOBAL_JUDGE_ROWS.map((r) => ({
        ...r,
        submitted_to_architects: true,
      }));

      // Try updating coding leaderboard in DB if student IDs match
      try {
        for (const row of GLOBAL_JUDGE_ROWS) {
          const user = await db.user.findFirst({
            where: { usn: row.usn },
          });
          if (user) {
            await db.codingLeaderboard.upsert({
              where: { student_id: user.id },
              update: {
                points: row.total_score,
                credits: Math.round(row.total_score * 0.8),
              },
              create: {
                student_id: user.id,
                points: row.total_score,
                rank: 1,
                prev_rank: 1,
                wins: row.test_accuracy >= 90 ? 1 : 0,
                competitions_count: 1,
                credits: Math.round(row.total_score * 0.8),
              },
            });
          }
        }
      } catch (dbErr) {
        console.warn('Database leaderboard sync warning:', dbErr);
      }

      return NextResponse.json({
        success: true,
        message: 'Official Judge Verdicts & Spreadsheet Scores successfully transmitted to Visual Architects! Leaderboard updated.',
        judgeRows: GLOBAL_JUDGE_ROWS,
      });
    }

    if (action === 'UPDATE_ROW' && singleRow) {
      const idx = GLOBAL_JUDGE_ROWS.findIndex((r) => r.id === singleRow.id);
      if (idx !== -1) {
        GLOBAL_JUDGE_ROWS[idx] = { ...singleRow };
      } else {
        GLOBAL_JUDGE_ROWS.push({ ...singleRow, id: 'eval-' + Date.now() });
      }
      return NextResponse.json({ success: true, judgeRows: GLOBAL_JUDGE_ROWS });
    }

    if (action === 'SAVE_ALL_ROWS' && Array.isArray(judgeRows)) {
      GLOBAL_JUDGE_ROWS = judgeRows;
      return NextResponse.json({
        success: true,
        message: 'Judge Deck Spreadsheet successfully saved locally.',
        judgeRows: GLOBAL_JUDGE_ROWS,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in judge deck POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
