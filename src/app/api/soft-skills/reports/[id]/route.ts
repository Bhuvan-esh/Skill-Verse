import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const {
      action,
      visual_architect_feedback,
      stage_performance_date,
      credits_awarded,
    } = body;

    const existingReport = await db.softSkillsWeeklyReport.findUnique({
      where: { id },
    });

    if (!existingReport) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    if (action === 'SELECT_FOR_STAGE') {
      const updated = await db.softSkillsWeeklyReport.update({
        where: { id },
        data: {
          status: 'SELECTED_FOR_STAGE',
          is_public: true,
          visual_architect_feedback: visual_architect_feedback || 'Selected by Visual Architects for Live Stage Performance Keynote!',
          stage_performance_date: stage_performance_date || 'Upcoming Horizon Stage Showcase',
          credits_awarded: credits_awarded || 100,
          selected_at: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        report: updated,
        message: `Report by ${updated.student_name} selected for Live Stage Performance & published to Public Showcase!`,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating report status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
