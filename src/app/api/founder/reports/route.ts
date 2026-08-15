import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth(['FOUNDER']);

    const reports = await db.pendingReport.findMany({
      include: {
        competition: { select: { id: true, name: true, domain: true } },
        chat: { include: { request: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    const parsedReports = reports.map((r) => ({
      ...r,
      report_data: JSON.parse(r.report_data),
    }));

    return NextResponse.json({ reports: parsedReports });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
