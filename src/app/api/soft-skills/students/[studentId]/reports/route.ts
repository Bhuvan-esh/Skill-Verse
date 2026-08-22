import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const reports = await db.skillLeagueReport.findMany({
      where: { student_id: params.studentId },
      orderBy: { generated_at: 'desc' },
      include: {
        event: {
          select: { id: true, public_event_name: true, internal_challenge_type: true },
        },
      },
    });

    const parsedReports = reports.map((r) => {
      let parsed = null;
      try {
        parsed = JSON.parse(r.report_json);
      } catch (_) {}
      return {
        id: r.id,
        eventId: r.event_id,
        eventName: r.event.public_event_name,
        challengeType: r.event.internal_challenge_type,
        personalizedMessage: r.personalized_message,
        founderConfirmedBy: r.founder_confirmed_by,
        generatedAt: r.generated_at,
        structuredReport: parsed,
      };
    });

    return NextResponse.json({
      studentId: params.studentId,
      reportCount: parsedReports.length,
      reports: parsedReports,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch student reports' }, { status: 500 });
  }
}
