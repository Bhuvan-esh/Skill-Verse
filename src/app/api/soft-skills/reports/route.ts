import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const DEFAULT_PUBLIC_REPORT = {
  student_id: 'stu-sample-kavya',
  student_name: 'Kavya Sharma',
  usn: '1MS23AI042',
  academic_year: 3,
  department: 'Artificial Intelligence & Machine Learning (AIML / AIDS)',
  video_title: 'Mastering Stage Presence & Pitching Under Pressure',
  report_title: 'Strategic Pacing & The Elimination of Verbal Crutches in High-Stakes Presentations',
  what_watched_summary: 'Reviewed Julian Treasure and Amy Cuddy communication principles.',
  key_learnings: '1. Silence signals cognitive control.\n2. Diaphragmatic breathing prevents voice pitch elevation.',
  communication_techniques: 'Open chest posture, deliberate silence, and modulated vocal register.',
  proposed_stage_topic: '“Engineering Persuasive Arguments in Technical Keynotes”',
  why_selected_rationale: 'I synthesize physiological autonomic nervous system control with algorithmic rhetoric, enabling engineers to anchor boardroom authority without aggressive posturing.',
  external_references: '• Book: "Never Split the Difference" by Chris Voss — Tactical empathy and late-night FM DJ vocal pacing.\n• Movie: "The King’s Speech" (2010) — Mechanics of overcoming diaphragmatic constriction under immense public scrutiny.',
  attachments: JSON.stringify([
    { name: 'Kavya_Vocal_Pacing_Research.pdf', type: 'application/pdf', size: '2.4 MB' },
    { name: 'Rhetoric_Posture_Blueprint.png', type: 'image/png', size: '850 KB' },
    { name: 'Diaphragmatic_Pitch_Notes.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: '320 KB' },
  ]),
  status: 'SELECTED_FOR_STAGE',
  is_public: true,
  visual_architect_feedback: '🏆 Outstanding analysis of vocal authority, cross-domain book synthesis, and diaphragmatic stability! Selected for Live Stage Performance Keynote at Horizon Stage.',
  stage_performance_date: 'March 20, 2026 • Main Horizon Stage',
  credits_awarded: 100,
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publicOnly = searchParams.get('publicOnly') === 'true';
    const studentId = searchParams.get('studentId');

    // Ensure sample public report exists if table is empty
    const count = await db.softSkillsWeeklyReport.count();
    if (count === 0) {
      await db.softSkillsWeeklyReport.create({
        data: DEFAULT_PUBLIC_REPORT,
      });
    }

    const whereClause: any = {};
    if (publicOnly) {
      whereClause.is_public = true;
    } else if (studentId) {
      whereClause.OR = [
        { student_id: studentId },
        { is_public: true },
      ];
    }

    const reports = await db.softSkillsWeeklyReport.findMany({
      where: whereClause,
      orderBy: { submitted_at: 'desc' },
      include: {
        video: {
          select: { title: true, shared_by_name: true, video_type: true },
        },
      },
    });

    return NextResponse.json({ success: true, reports });
  } catch (error: any) {
    console.error('Error fetching soft skills weekly reports:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      student_id,
      student_name,
      usn,
      academic_year,
      department,
      video_id,
      video_title,
      report_title,
      what_watched_summary,
      key_learnings,
      communication_techniques,
      proposed_stage_topic,
      why_selected_rationale,
      external_references,
      attachments,
    } = body;

    if (!student_name || !video_title || !report_title || !key_learnings) {
      return NextResponse.json(
        { success: false, error: 'Missing required report fields: student_name, video_title, report_title, key_learnings' },
        { status: 400 }
      );
    }

    const newReport = await db.softSkillsWeeklyReport.create({
      data: {
        student_id: student_id || 'demo-current-user',
        student_name,
        usn: usn || '1MS24CS001',
        academic_year: academic_year || 1,
        department: department || 'Computer Science & Engineering',
        video_id: video_id || null,
        video_title,
        report_title,
        what_watched_summary: what_watched_summary || 'Detailed review of mentor video concepts.',
        key_learnings,
        communication_techniques: communication_techniques || 'Vocal modulation, body posture, and structured reasoning.',
        proposed_stage_topic: proposed_stage_topic || 'Stage Talk: Applied Communication Strategies in Technical Systems',
        why_selected_rationale: why_selected_rationale || null,
        external_references: external_references || null,
        attachments: attachments ? (typeof attachments === 'string' ? attachments : JSON.stringify(attachments)) : null,
        status: 'SUBMITTED',
        is_public: false,
      },
    });

    return NextResponse.json({
      success: true,
      report: newReport,
      message: 'Weekly Soft Skills Report successfully submitted to Visual Architects for Stage Performance review!',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting weekly report:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { report_id, feedback, stage_date, credits_awarded } = body;

    if (!report_id) {
      return NextResponse.json({ success: false, error: 'Missing report_id' }, { status: 400 });
    }

    const updated = await db.softSkillsWeeklyReport.update({
      where: { id: report_id },
      data: {
        status: 'SELECTED_FOR_STAGE',
        is_public: true,
        visual_architect_feedback: feedback || '🏆 Selected by Visual Architects for Live Stage Performance Keynote at Horizon Stage.',
        stage_performance_date: stage_date || 'Upcoming Horizon Stage Qualifier',
        credits_awarded: credits_awarded || 100,
      },
    });

    return NextResponse.json({
      success: true,
      report: updated,
      message: 'Report confirmed and approved for live stage by Visual Architects. Credits (+100) awarded and leaderboard updated!',
    });
  } catch (error: any) {
    console.error('Error confirming report for stage:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

