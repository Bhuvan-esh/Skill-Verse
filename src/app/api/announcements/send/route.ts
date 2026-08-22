import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendAdminAnnouncementEmail } from '@/lib/email-service';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const senderUid = session?.id || 'founder-system';
    const senderName = session?.name || 'Visual Architect';

    const body = await req.json();
    const { subject, title, message, ctaText, ctaUrl, audience = 'ALL_CLUB_MEMBERS', eventId } = body;

    if (!subject || !title || !message) {
      return NextResponse.json({ error: 'subject, title, and message are required' }, { status: 400 });
    }

    let targetEmails: { email: string; name: string }[] = [];

    if (audience === 'ALL_CLUB_MEMBERS') {
      const users = await db.user.findMany({
        where: { approval_status: 'APPROVED', college_email: { not: '' } },
        select: { college_email: true, name: true },
      });
      targetEmails = users.map((u) => ({ email: u.college_email, name: u.name }));
    } else if (audience === 'EVENT_REGISTERED_STUDENTS' && eventId) {
      const registrations = await db.clubEventRegistration.findMany({
        where: { event_id: eventId, email: { not: '' } },
        select: { email: true, name: true },
      });
      targetEmails = registrations.map((r) => ({ email: r.email, name: r.name }));
    } else if (audience === 'VOLUNTEERS') {
      const volunteers = await db.eventVolunteer.findMany({
        where: { email: { not: '' } },
        select: { email: true, name: true },
      });
      targetEmails = volunteers.map((v) => ({ email: v.email, name: v.name }));
    } else {
      const users = await db.user.findMany({
        where: { approval_status: 'APPROVED', college_email: { not: '' } },
        select: { college_email: true, name: true },
      });
      targetEmails = users.map((u) => ({ email: u.college_email, name: u.name }));
    }

    // Dispatch emails in background
    const emailPromises = targetEmails.map((item) =>
      sendAdminAnnouncementEmail({
        recipientEmail: item.email,
        studentName: item.name,
        title,
        message,
        ctaText,
        ctaUrl,
      }).catch((e) => console.error('[Announcement Email Error]:', e))
    );

    Promise.all(emailPromises).catch((e) => console.error('[Announcement Batch Error]:', e));

    // Record in ClubAnnouncement
    const announcement = await db.clubAnnouncement.create({
      data: {
        subject,
        title,
        message,
        cta_text: ctaText,
        cta_url: ctaUrl,
        audience,
        event_id: eventId,
        sender_uid: senderUid,
        sent_count: targetEmails.length,
      },
    });

    // Record in AdminAuditLog
    await db.adminAuditLog.create({
      data: {
        actor_uid: senderUid,
        actor_name: senderName,
        action: 'ANNOUNCEMENT_SENT',
        target_type: 'ANNOUNCEMENT',
        target_id: announcement.id,
        metadata: JSON.stringify({ subject, audience, count: targetEmails.length }),
      },
    });

    return NextResponse.json({
      success: true,
      announcement,
      sentCount: targetEmails.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send announcement' }, { status: 500 });
  }
}
