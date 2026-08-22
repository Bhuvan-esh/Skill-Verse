import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getStudentCreditBalance } from '@/lib/soft-skills/creditService';

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const balance = await getStudentCreditBalance(params.studentId);
    
    const transactions = await db.skillLeagueCreditTransaction.findMany({
      where: { student_id: params.studentId },
      orderBy: { timestamp: 'desc' },
    });

    return NextResponse.json({
      studentId: params.studentId,
      currentBalance: balance,
      transactionCount: transactions.length,
      transactions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch student credits' }, { status: 500 });
  }
}
