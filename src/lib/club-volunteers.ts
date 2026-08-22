import { db } from '@/lib/db';
import { sendVolunteerAccessStartedEmail } from '@/lib/email-service';

/**
 * Add an approved student as a volunteer to an event
 */
export async function addEventVolunteer(eventId: string, studentId: string, founderUid: string) {
  const event = await db.clubEvent.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  const student = await db.user.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new Error('Student not found');
  }

  if (student.approval_status !== 'APPROVED') {
    throw new Error('Only approved students can be assigned as event volunteers');
  }

  const volunteer = await db.eventVolunteer.upsert({
    where: {
      event_id_student_id: {
        event_id: eventId,
        student_id: studentId,
      },
    },
    create: {
      event_id: eventId,
      student_id: studentId,
      name: student.name,
      usn: student.usn,
      email: student.college_email,
      is_finalized: false,
    },
    update: {
      name: student.name,
      usn: student.usn,
      email: student.college_email,
    },
  });

  return volunteer;
}

/**
 * Finalize Volunteer List for an Event
 */
export async function finalizeVolunteerList(eventId: string, founderUid: string, founderName = 'Founder / Coordinator') {
  await db.eventVolunteer.updateMany({
    where: { event_id: eventId },
    data: { is_finalized: true },
  });

  await db.adminAuditLog.create({
    data: {
      actor_uid: founderUid,
      actor_name: founderName,
      action: 'VOLUNTEER_LIST_FINALIZED',
      target_type: 'VOLUNTEER',
      target_id: eventId,
    },
  });

  return { success: true };
}

/**
 * START VOLUNTEER ACCESS — Activates access and emails finalized volunteers ONLY
 */
export async function startVolunteerAccess(eventId: string, founderUid: string, founderName = 'Founder / Coordinator') {
  const event = await db.clubEvent.findUnique({
    where: { id: eventId },
    include: {
      volunteers: {
        where: { is_finalized: true },
        include: { student: true },
      },
    },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  if (event.volunteer_access_status === 'ACTIVE') {
    return { success: true, alreadyActive: true, event };
  }

  // 1. Activate access status
  const updatedEvent = await db.clubEvent.update({
    where: { id: eventId },
    data: { volunteer_access_status: 'ACTIVE' },
  });

  // 2. Record in audit log
  await db.adminAuditLog.create({
    data: {
      actor_uid: founderUid,
      actor_name: founderName,
      action: 'VOLUNTEER_ACCESS_STARTED',
      target_type: 'EVENT',
      target_id: eventId,
    },
  });

  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // 3. Dispatch volunteer email ONLY to finalized event volunteers
  const emailPromises = event.volunteers.map((vol) =>
    sendVolunteerAccessStartedEmail({
      recipientEmail: vol.email,
      studentName: vol.name,
      eventName: event.title,
      date: formattedDate,
      time: event.start_time,
      venue: event.venue,
      eventId: event.id,
    }).catch((e) => console.error('[Volunteer Email Error]:', e))
  );

  Promise.all(emailPromises).catch((e) => console.error('[Batch Volunteer Email Error]:', e));

  return {
    success: true,
    alreadyActive: false,
    event: updatedEvent,
    volunteersNotified: event.volunteers.length,
  };
}

/**
 * Backend authorization verification for volunteer endpoints
 */
export async function verifyVolunteerAccess(studentId: string, eventId: string): Promise<boolean> {
  const volunteer = await db.eventVolunteer.findUnique({
    where: {
      event_id_student_id: {
        event_id: eventId,
        student_id: studentId,
      },
    },
    include: {
      event: true,
      student: true,
    },
  });

  if (!volunteer) return false;
  if (volunteer.student.approval_status !== 'APPROVED') return false;
  if (!volunteer.is_finalized) return false;
  if (volunteer.event.volunteer_access_status !== 'ACTIVE') return false;

  return true;
}

