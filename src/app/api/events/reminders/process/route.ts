import { NextResponse } from 'next/server';
import { processEventReminders } from '@/lib/club-events';

export async function POST() {
  try {
    const result = await processEventReminders();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process reminders' }, { status: 500 });
  }
}
