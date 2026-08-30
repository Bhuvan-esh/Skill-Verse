import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export interface SoftSkillEvaluationRow {
  id: string;
  student_name: string;
  usn: string;
  department: string;
  event_name: string;
  speech_clarity: number; // score out of 25
  presence_body_language: number; // score out of 25
  debate_rebuttal: number; // score out of 25
  structure_delivery: number; // score out of 25
  bonus_points: number; // e.g. 10
  total_score: number; // sum of scores
  verdict: 'QUALIFIED_TOP_PERFORMER' | 'AVERAGE_PASS' | 'NEEDS_ATTENTION_FAIL';
  mentor_notes: string;
  submitted_to_architects: boolean;
}

// In-memory backing store initialized as empty so mentors add participants and fill judgements themselves
let GLOBAL_SOFT_SKILL_JUDGE_ROWS: SoftSkillEvaluationRow[] = [];

export async function GET() {
  try {
    const topPerformers = GLOBAL_SOFT_SKILL_JUDGE_ROWS
      .filter((r) => r.total_score >= 80)
      .sort((a, b) => b.total_score - a.total_score)
      .map((r, idx) => ({ ...r, rank: idx + 1 }));

    const weakPerformers = GLOBAL_SOFT_SKILL_JUDGE_ROWS
      .filter((r) => r.total_score < 80)
      .sort((a, b) => a.total_score - b.total_score)
      .map((r) => ({
        ...r,
        diagnostic_tip: r.total_score < 50
          ? 'Critical: Pacing rushed with frequent filler words. Recommend 1:1 vocal modulation & pause drills.'
          : 'Moderate: Strong content structure but needs improved eye contact and stage movement.',
      }));

    const count = GLOBAL_SOFT_SKILL_JUDGE_ROWS.length;

    return NextResponse.json({
      success: true,
      judgeRows: GLOBAL_SOFT_SKILL_JUDGE_ROWS,
      topPerformers,
      weakPerformers,
      summary: {
        totalEvaluated: count,
        submittedToArchitectsCount: GLOBAL_SOFT_SKILL_JUDGE_ROWS.filter((r) => r.submitted_to_architects).length,
        pendingSubmissionCount: GLOBAL_SOFT_SKILL_JUDGE_ROWS.filter((r) => !r.submitted_to_architects).length,
        avgScore: count > 0 ? (GLOBAL_SOFT_SKILL_JUDGE_ROWS.reduce((acc, r) => acc + r.total_score, 0) / count).toFixed(1) + ' Pts' : '0.0 Pts',
      },
    });
  } catch (error: any) {
    console.error('Error fetching soft skills judge deck:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, judgeRows, singleRow } = body;

    if (action === 'SUBMIT_TO_VISUAL_ARCHITECTS') {
      GLOBAL_SOFT_SKILL_JUDGE_ROWS = GLOBAL_SOFT_SKILL_JUDGE_ROWS.map((r) => ({
        ...r,
        submitted_to_architects: true,
      }));

      // Update soft skills database / points if matching student records exist
      try {
        for (const row of GLOBAL_SOFT_SKILL_JUDGE_ROWS) {
          const user = await db.user.findFirst({
            where: { usn: row.usn },
          });
          if (user) {
            await db.studentCredit.upsert({
              where: { student_id: user.id },
              update: {
                domain_2: { increment: Math.round(row.total_score * 0.5) },
              },
              create: {
                student_id: user.id,
                domain_1: 0,
                domain_2: Math.round(row.total_score * 0.5),
                domain_3: 0,
                domain_4: 0,
                total_credits: Math.round(row.total_score * 0.5),
              },
            });
          }
        }
      } catch (dbErr) {
        console.warn('Database soft skill leaderboard sync warning:', dbErr);
      }

      return NextResponse.json({
        success: true,
        message: 'Official Soft Skill Scores & Judge Verdicts successfully transmitted to Visual Architects! Domain 2 Credits updated.',
        judgeRows: GLOBAL_SOFT_SKILL_JUDGE_ROWS,
      });
    }

    if (action === 'UPDATE_ROW' && singleRow) {
      const idx = GLOBAL_SOFT_SKILL_JUDGE_ROWS.findIndex((r) => r.id === singleRow.id);
      if (idx !== -1) {
        GLOBAL_SOFT_SKILL_JUDGE_ROWS[idx] = { ...singleRow };
      } else {
        GLOBAL_SOFT_SKILL_JUDGE_ROWS.push({ ...singleRow, id: 'eval-ss-' + Date.now() });
      }
      return NextResponse.json({ success: true, judgeRows: GLOBAL_SOFT_SKILL_JUDGE_ROWS });
    }

    if (action === 'SAVE_ALL_ROWS' && Array.isArray(judgeRows)) {
      GLOBAL_SOFT_SKILL_JUDGE_ROWS = judgeRows;
      return NextResponse.json({
        success: true,
        message: 'Soft Skills Judge Deck Spreadsheet saved locally.',
        judgeRows: GLOBAL_SOFT_SKILL_JUDGE_ROWS,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in soft skills judge deck POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
