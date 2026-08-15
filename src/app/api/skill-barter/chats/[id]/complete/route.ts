import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(['STUDENT', 'FOUNDER']);
    const chatId = params.id;

    const chat = await db.skillChat.findUnique({
      where: { id: chatId },
      include: {
        request: true,
        mentor: true,
        requester: true,
      },
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    if (chat.requester_id !== session.id && chat.mentor_id !== session.id && session.role !== 'FOUNDER') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // Update session status
    await db.skillChat.update({
      where: { id: chatId },
      data: { status: 'COMPLETED' },
    });

    await db.skillRequest.update({
      where: { id: chat.request_id },
      data: { status: 'COMPLETED' },
    });

    // Auto-update mentor's topics_taught list
    let mentorProfile = await db.mentorProfile.findUnique({
      where: { student_id: chat.mentor_id },
    });

    if (!mentorProfile) {
      mentorProfile = await db.mentorProfile.create({
        data: { student_id: chat.mentor_id, domain: 'DOMAIN_1' },
      });
    }

    let existingTopics: string[] = [];
    try {
      existingTopics = JSON.parse(mentorProfile.topics_taught);
    } catch (e) {
      existingTopics = [];
    }

    if (!existingTopics.includes(chat.request.skill)) {
      existingTopics.push(chat.request.skill);
      await db.mentorProfile.update({
        where: { student_id: chat.mentor_id },
        data: { topics_taught: JSON.stringify(existingTopics) },
      });
    }

    // Send instant notification to all 7 founders
    const founders = await db.user.findMany({ where: { role: 'FOUNDER' } });
    for (const f of founders) {
      await db.notification.create({
        data: {
          user_id: f.id,
          type: 'MENTORSHIP',
          title: 'Mentorship Session Completed',
          message: `${chat.mentor.name} completed mentoring ${chat.requester.name} on '${chat.request.skill}', awaiting credit report.`,
        },
      });
    }

    return NextResponse.json({
      message: 'Mentoring session marked complete. Topics taught updated & founders notified.',
      chat_id: chatId,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
