import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const DEFAULT_VIDEOS = [
  {
    title: 'How to Speak So That People Want to Listen',
    video_url: 'https://www.youtube.com/watch?v=eIho2S0ZahI',
    video_type: 'TED_TALK',
    shared_by_name: 'Visual Architects Core Team',
    shared_by_role: 'Visual Architect',
    what_to_notice: 'Notice the HAIL framework (Honesty, Authenticity, Integrity, Love), the 7 deadly sins of speaking, and how intentional vocal pauses create dramatic tension rather than filler words.',
    topic_tags: 'Public Speaking, Vocal Register, Persuasion, Pitching',
    duration: '9:58',
  },
  {
    title: 'Your Body Language May Shape Who You Are',
    video_url: 'https://www.youtube.com/watch?v=Ks-_Mh1QhMc',
    video_type: 'TED_TALK',
    shared_by_name: 'Prof. Arvind Kumar',
    shared_by_role: 'Faculty Mentor',
    what_to_notice: 'Observe the physiological feedback loop between posture and cortisol/testosterone levels. Notice how open non-verbal gestures project natural authority before uttering a single sentence.',
    topic_tags: 'Body Language, Stage Confidence, Presence, Interview Prep',
    duration: '21:02',
  },
  {
    title: 'Executive Whiteboard Storytelling & Technical Rhetoric',
    video_url: 'https://www.youtube.com/watch?v=Unzc731iCUY',
    video_type: 'MENTOR_UPLOAD',
    shared_by_name: 'Ananya Rao',
    shared_by_role: 'Senior Visual Architect',
    what_to_notice: 'Pay close attention to how multi-layered distributed engineering concepts are translated into a 3-act narrative arc that keeps both technical peers and executive founders locked in.',
    topic_tags: 'Executive Storytelling, Whiteboard Pitch, Technical Rhetoric',
    duration: '14:15',
  },
];

export async function GET(req: NextRequest) {
  try {
    let videos = await db.softSkillsVideo.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        reports: {
          where: { is_public: true },
          select: { id: true, student_name: true, report_title: true },
        },
      },
    });

    if (videos.length === 0) {
      for (const v of DEFAULT_VIDEOS) {
        await db.softSkillsVideo.create({ data: v });
      }
      videos = await db.softSkillsVideo.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          reports: {
            where: { is_public: true },
            select: { id: true, student_name: true, report_title: true },
          },
        },
      });
    }

    return NextResponse.json({ success: true, videos });
  } catch (error: any) {
    console.error('Error fetching soft skills videos:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      video_url,
      video_type,
      shared_by_name,
      shared_by_role,
      what_to_notice,
      topic_tags,
      duration,
    } = body;

    if (!title || !video_url || !what_to_notice) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, video_url, what_to_notice' },
        { status: 400 }
      );
    }

    const newVideo = await db.softSkillsVideo.create({
      data: {
        title,
        video_url,
        video_type: video_type || 'TED_TALK',
        shared_by_name: shared_by_name || 'Visual Architect',
        shared_by_role: shared_by_role || 'Visual Architect',
        what_to_notice,
        topic_tags: topic_tags || 'Soft Skills, Communication',
        duration: duration || '10:00',
      },
    });

    return NextResponse.json({ success: true, video: newVideo }, { status: 201 });
  } catch (error: any) {
    console.error('Error sharing soft skills video:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
