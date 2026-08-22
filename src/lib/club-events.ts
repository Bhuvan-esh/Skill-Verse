import { db } from '@/lib/db';
import {
  sendEventAnnouncementEmail,
  sendRegistrationConfirmationEmail,
  send3DayReminderEmail,
  send1DayReminderEmail,
} from '@/lib/email-service';
import { ClubDomain } from '@/lib/credit-engine';

export interface CreateEventParams {
  title: string;
  description: string;
  domain: ClubDomain;
  eventDate: string | Date;
  startTime: string;
  endTime?: string;
  venue: string;
  creditValue?: number;
  registrationDeadline?: string | Date;
  createdBy: string;
}

/**
 * Create a new event (in DRAFT mode)
 */
export async function createClubEvent(params: CreateEventParams) {
  const {
    title,
    description,
    domain,
    eventDate,
    startTime,
    endTime,
    venue,
    creditValue = 30,
    registrationDeadline,
    createdBy,
  } = params;

  const event = await db.clubEvent.create({
    data: {
      title,
      description,
      domain,
      event_date: new Date(eventDate),
      start_time: startTime,
      end_time: endTime,
      venue,
      credit_value: creditValue,
      registration_deadline: registrationDeadline ? new Date(registrationDeadline) : null,
      status: 'DRAFT',
      created_by: createdBy,
    },
  });

  return event;
}

/**
 * Publish an Event & Trigger Automated Broadcast Email to all Approved Students
 */
export async function publishClubEvent(eventId: string, founderUid: string, founderName = 'Founder / Coordinator') {
  const event = await db.clubEvent.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  if (event.status === 'PUBLISHED') {
    return { success: true, alreadyPublished: true, event };
  }

  // 1. Update status
  const updatedEvent = await db.clubEvent.update({
    where: { id: eventId },
    data: {
      status: 'PUBLISHED',
      published_at: new Date(),
    },
  });

  // 2. Audit log
  await db.adminAuditLog.create({
    data: {
      actor_uid: founderUid,
      actor_name: founderName,
      action: 'EVENT_PUBLISHED',
      target_type: 'EVENT',
      target_id: eventId,
      metadata: JSON.stringify({ title: event.title, domain: event.domain }),
    },
  });

  // 3. Find all approved club members to broadcast announcement email
  const approvedMembers = await db.user.findMany({
    where: {
      approval_status: 'APPROVED',
      college_email: { not: '' },
    },
    select: { id: true, name: true, college_email: true },
  });

  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // 4. Send announcement email to all approved students in the background
  const emailPromises = approvedMembers.map((member) =>
    sendEventAnnouncementEmail({
      recipientEmail: member.college_email,
      studentName: member.name,
      eventName: event.title,
      date: formattedDate,
      time: event.start_time,
      venue: event.venue,
      domain: event.domain,
      credits: event.credit_value,
      eventId: event.id,
    }).catch((e) => console.error(`[Event Broadcast Email Error]:`, e))
  );

  Promise.all(emailPromises).catch((e) => console.error('[Batch Broadcast Error]:', e));

  return {
    success: true,
    alreadyPublished: false,
    event: updatedEvent,
    broadcastCount: approvedMembers.length,
  };
}

/**
 * Student Event Registration with Duplicate Protection & Confirmation Email
 */
export async function registerForClubEvent(eventId: string, studentId: string) {
  const event = await db.clubEvent.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  if (event.status !== 'PUBLISHED') {
    throw new Error('Event is not open for registration');
  }

  const student = await db.user.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new Error('Student account not found');
  }

  if (student.approval_status !== 'APPROVED') {
    throw new Error('Account pending approval — please wait for founder verification before registering for events');
  }

  // Check duplicate registration
  const existingReg = await db.clubEventRegistration.findUnique({
    where: {
      student_id_event_id: {
        student_id: studentId,
        event_id: eventId,
      },
    },
  });

  if (existingReg) {
    return {
      success: true,
      alreadyRegistered: true,
      registration: existingReg,
    };
  }

  const idempotencyKey = `REG_${eventId}_${studentId}`;

  const registration = await db.clubEventRegistration.create({
    data: {
      event_id: eventId,
      student_id: studentId,
      name: student.name,
      usn: student.usn,
      email: student.college_email,
      domain: event.domain,
      status: 'CONFIRMED',
      idempotency_key: idempotencyKey,
    },
  });

  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Send confirmation email ONLY to that registering student
  if (student.college_email) {
    sendRegistrationConfirmationEmail({
      recipientEmail: student.college_email,
      studentName: student.name,
      eventName: event.title,
      date: formattedDate,
      time: event.start_time,
      venue: event.venue,
      domain: event.domain,
      credits: event.credit_value,
      registrationId: registration.id,
    }).catch((e) => console.error('[Registration Email Error]:', e));
  }

  return {
    success: true,
    alreadyRegistered: false,
    registration,
  };
}

/**
 * Automated 3-Day and 1-Day Reminder Scheduler Engine
 */
export async function processEventReminders() {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const oneDayFromNow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

  // Find all active published events
  const publishedEvents = await db.clubEvent.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      registrations: {
        where: { status: 'CONFIRMED' },
        include: { student: true },
      },
    },
  });

  let threeDayCount = 0;
  let oneDayCount = 0;

  for (const event of publishedEvents) {
    const eventTime = new Date(event.event_date).getTime();
    const diffMs = eventTime - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    // 1-Day Reminder Window (between 0.5 and 1.5 days away)
    if (diffDays >= 0.5 && diffDays <= 1.5) {
      for (const reg of event.registrations) {
        if (reg.email) {
          await send1DayReminderEmail({
            recipientEmail: reg.email,
            studentName: reg.name,
            eventName: event.title,
            date: formattedDate,
            time: event.start_time,
            venue: event.venue,
            registrationId: reg.id,
          });
          oneDayCount++;
        }
      }
    }
    // 3-Day Reminder Window (between 2.5 and 3.5 days away)
    else if (diffDays >= 2.5 && diffDays <= 3.5) {
      for (const reg of event.registrations) {
        if (reg.email) {
          await send3DayReminderEmail({
            recipientEmail: reg.email,
            studentName: reg.name,
            eventName: event.title,
            date: formattedDate,
            time: event.start_time,
            venue: event.venue,
            registrationId: reg.id,
          });
          threeDayCount++;
        }
      }
    }
  }

  return {
    success: true,
    processedAt: new Date().toISOString(),
    threeDayRemindersSent: threeDayCount,
    oneDayRemindersSent: oneDayCount,
  };
}

