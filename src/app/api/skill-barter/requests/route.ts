import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';

const CreateSkillRequestSchema = z.object({
  skill: z.string().min(2),
  message: z.string().min(5),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth(['STUDENT', 'FOUNDER']);

    const body = await req.json();
    const { skill, message } = CreateSkillRequestSchema.parse(body);

    const request = await db.skillRequest.create({
      data: {
        requester_id: session.id,
        skill,
        message,
        status: 'OPEN',
      },
    });

    return NextResponse.json({ message: 'Skill request posted to public hub.', request });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function GET() {
  try {
    const requests = await db.skillRequest.findMany({
      include: {
        requester: { select: { id: true, name: true, usn: true } },
        responses: {
          include: {
            responder: {
              select: {
                id: true,
                name: true,
                usn: true,
                student_credits: true,
                mentor_profile: true,
                received_feedback: {
                  select: { rating: true, comment: true, submitted_at: true },
                },
              },
            },
          },
        },
        chats: { select: { id: true, mentor_id: true, status: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    // Format response so mentor stats (credits, topics_taught array, average rating, feedback list) are ready for comparison
    const formattedRequests = requests.map((req) => ({
      ...req,
      responses: req.responses.map((resp) => {
        const profile = resp.responder.mentor_profile;
        const feedbackList = resp.responder.received_feedback;
        const avgRating =
          feedbackList.length > 0
            ? feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length
            : 0;

        let topicsTaught = [];
        try {
          topicsTaught = profile ? JSON.parse(profile.topics_taught) : [];
        } catch (e) {
          topicsTaught = [];
        }

        return {
          id: resp.id,
          request_id: resp.request_id,
          status: resp.status,
          created_at: resp.created_at,
          responder: {
            id: resp.responder.id,
            name: resp.responder.name,
            usn: resp.responder.usn,
            credits: resp.responder.student_credits,
            domain: profile?.domain || 'DOMAIN_1',
            topics_taught: topicsTaught,
            average_rating: Number(avgRating.toFixed(1)),
            feedback_count: feedbackList.length,
            feedback: feedbackList,
          },
        };
      }),
    }));

    return NextResponse.json({ requests: formattedRequests });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch skill requests' }, { status: 500 });
  }
}
