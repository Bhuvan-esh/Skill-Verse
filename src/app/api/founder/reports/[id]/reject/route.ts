import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const founderSession = await requireAuth(['FOUNDER']);
    const reportId = params.id;

    const report = await db.pendingReport.findUnique({ where: { id: reportId } });
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const updated = await db.pendingReport.update({
      where: { id: reportId },
      data: {
        status: 'REJECTED',
        reviewed_by: founderSession.id,
        reviewed_at: new Date(),
      },
    });

    return NextResponse.json({ message: 'Credit report draft rejected.', report: updated });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
