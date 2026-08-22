import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../src/lib/db';
import { awardCredits, getStudentCreditProfile, getVerifiedClubLeaderboard } from '../src/lib/credit-engine';
import { createClubEvent, publishClubEvent, registerForClubEvent, processEventReminders } from '../src/lib/club-events';
import { addEventVolunteer, finalizeVolunteerList, startVolunteerAccess, verifyVolunteerAccess } from '../src/lib/club-volunteers';
import {
  sendAccountApprovalEmail,
  sendLoginSecurityEmail,
  sendAdminAccessRequestEmail,
  sendEventAnnouncementEmail,
  sendRegistrationConfirmationEmail,
  sendCreditUpdatedEmail,
  sendVolunteerAccessStartedEmail,
} from '../src/lib/email-service';

describe('Student Club & Idea Hub Centralized Backend Suite', () => {
  const testStudentEmail = `test.student.${Date.now()}@club.edu`;
  const testFounderEmail = `test.founder.${Date.now()}@club.edu`;
  let studentId = '';
  let founderId = '';
  let eventId = '';

  beforeAll(async () => {
    // Create test founder
    const founder = await db.user.create({
      data: {
        name: 'Lead Visual Architect',
        college_email: testFounderEmail,
        role: 'FOUNDER',
        approval_status: 'APPROVED',
      },
    });
    founderId = founder.id;

    // Create test student (simulating first-time registration: PENDING)
    const student = await db.user.create({
      data: {
        name: 'Anusha Test Student',
        college_email: testStudentEmail,
        usn: `1RV23CS${Math.floor(100 + Math.random() * 900)}`,
        role: 'STUDENT',
        approval_status: 'PENDING',
        approval_requested_at: new Date(),
      },
    });
    studentId = student.id;

    await db.studentCredit.create({
      data: { student_id: student.id },
    });
  });

  describe('1. Authentication & Approval Flow', () => {
    it('Should register new student in PENDING state initially', async () => {
      const student = await db.user.findUnique({ where: { id: studentId } });
      expect(student).toBeDefined();
      expect(student?.approval_status).toBe('PENDING');
    });

    it('Should trigger admin alert email for new pending student', async () => {
      const emailRes = await sendAdminAccessRequestEmail({
        adminEmail: testFounderEmail,
        studentName: 'Anusha Test Student',
        studentEmail: testStudentEmail,
        usn: '1RV23CS999',
      });
      expect(emailRes.success).toBe(true);
    });

    it('Should allow Founder to approve student and send approval email', async () => {
      const updated = await db.user.update({
        where: { id: studentId },
        data: {
          approval_status: 'APPROVED',
          approved_at: new Date(),
          approved_by: founderId,
        },
      });
      expect(updated.approval_status).toBe('APPROVED');

      const emailRes = await sendAccountApprovalEmail({
        recipientEmail: testStudentEmail,
        studentName: 'Anusha Test Student',
      });
      expect(emailRes.success).toBe(true);
    });

    it('Should allow repeat login of approved student directly and send login security email', async () => {
      const student = await db.user.findUnique({ where: { id: studentId } });
      expect(student?.approval_status).toBe('APPROVED'); // Directly approved, no pending page!

      const emailRes = await sendLoginSecurityEmail({
        recipientEmail: testStudentEmail,
        studentName: student!.name,
        device: 'MacBook Pro',
        browser: 'Chrome 120',
      });
      expect(emailRes.success).toBe(true);
    });
  });

  describe('2. Four-Domain Unified Credit Engine', () => {
    it('Should award Idea Hub credits (+40) atomically', async () => {
      const res = await awardCredits({
        studentId,
        domain: 'IDEA_HUB',
        activityId: 'idea-pitch-001',
        activityName: 'Autonomous Agent Platform Pitch',
        creditAmount: 40,
        approvingFounderUid: founderId,
      });

      expect(res.success).toBe(true);
      expect(res.isDuplicate).toBe(false);
      expect(res.domainCredits).toBe(40);
      expect(res.totalCredits).toBe(40);
    });

    it('Should award Coding credits (+50) atomically', async () => {
      const res = await awardCredits({
        studentId,
        domain: 'CODING',
        activityId: 'hack-contest-001',
        activityName: 'Bug Hunt Arena Championship',
        creditAmount: 50,
        approvingFounderUid: founderId,
      });

      expect(res.success).toBe(true);
      expect(res.domainCredits).toBe(50);
      expect(res.totalCredits).toBe(90); // 40 + 50
    });

    it('Should award Soft Skills (+30) and Skill Barter (+20) credits', async () => {
      await awardCredits({
        studentId,
        domain: 'SOFT_SKILLS',
        activityId: 'debate-001',
        activityName: 'Mystery League Parliamentary Debate',
        creditAmount: 30,
        approvingFounderUid: founderId,
      });

      const res = await awardCredits({
        studentId,
        domain: 'SKILL_BARTER',
        activityId: 'barter-001',
        activityName: 'FullStack React Mentorship Trade',
        creditAmount: 20,
        approvingFounderUid: founderId,
      });

      expect(res.success).toBe(true);
      expect(res.totalCredits).toBe(140); // 40 + 50 + 30 + 20
    });

    it('Should strictly PREVENT duplicate credit awards (Idempotency)', async () => {
      // Trying to award the exact same Idea Hub credit activity again
      const dupRes = await awardCredits({
        studentId,
        domain: 'IDEA_HUB',
        activityId: 'idea-pitch-001',
        activityName: 'Autonomous Agent Platform Pitch',
        creditAmount: 40,
        approvingFounderUid: founderId,
      });

      expect(dupRes.success).toBe(true);
      expect(dupRes.isDuplicate).toBe(true);
      expect(dupRes.totalCredits).toBe(140); // Did not add another 40!
    });

    it('Should retrieve accurate student profile & domain breakdown', async () => {
      const profile = await getStudentCreditProfile(studentId);
      expect(profile.totalCredits).toBe(140);
      expect(profile.domainCredits.ideaHub).toBe(40);
      expect(profile.domainCredits.coding).toBe(50);
      expect(profile.domainCredits.softSkills).toBe(30);
      expect(profile.domainCredits.skillBarter).toBe(20);
      expect(profile.transactions.length).toBe(4);
    });

    it('Should accurately compute verified leaderboard', async () => {
      const leaderboard = await getVerifiedClubLeaderboard();
      const entry = leaderboard.find((l) => l.studentId === studentId);
      expect(entry).toBeDefined();
      expect(entry?.totalCredits).toBe(140);
    });
  });

  describe('3. Event Management, Publishing Broadcast & Registration', () => {
    it('Should create a draft event', async () => {
      const event = await createClubEvent({
        title: 'AI Full-Stack Hackathon 2026',
        description: 'Build agentic full-stack applications with AI tools.',
        domain: 'CODING',
        eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // in 3 days
        startTime: '10:00 AM',
        venue: 'Main Auditorium',
        creditValue: 50,
        createdBy: founderId,
      });

      expect(event).toBeDefined();
      expect(event.status).toBe('DRAFT');
      eventId = event.id;
    });

    it('Should publish event and broadcast announcement email to all approved students', async () => {
      const pubRes = await publishClubEvent(eventId, founderId);
      expect(pubRes.success).toBe(true);
      expect(pubRes.event.status).toBe('PUBLISHED');
      expect(pubRes.broadcastCount).toBeGreaterThan(0);
    });

    it('Should handle duplicate publish calls safely (Idempotency)', async () => {
      const dupPub = await publishClubEvent(eventId, founderId);
      expect(dupPub.success).toBe(true);
      expect(dupPub.alreadyPublished).toBe(true);
    });

    it('Should register student for event and trigger confirmation email', async () => {
      const regRes = await registerForClubEvent(eventId, studentId);
      expect(regRes.success).toBe(true);
      expect(regRes.alreadyRegistered).toBe(false);
      expect(regRes.registration.status).toBe('CONFIRMED');
    });

    it('Should prevent duplicate event registrations', async () => {
      const dupReg = await registerForClubEvent(eventId, studentId);
      expect(dupReg.success).toBe(true);
      expect(dupReg.alreadyRegistered).toBe(true);
    });

    it('Should process automated 3-day and 1-day reminders without errors', async () => {
      const reminderRes = await processEventReminders();
      expect(reminderRes.success).toBe(true);
    });
  });

  describe('4. Volunteer Management & Access Start', () => {
    it('Should assign student as event volunteer', async () => {
      const vol = await addEventVolunteer(eventId, studentId, founderId);
      expect(vol).toBeDefined();
      expect(vol.student_id).toBe(studentId);
    });

    it('Should finalize volunteer list', async () => {
      const fin = await finalizeVolunteerList(eventId, founderId);
      expect(fin.success).toBe(true);
    });

    it('Should reject volunteer operations before access is activated', async () => {
      const isAllowed = await verifyVolunteerAccess(studentId, eventId);
      expect(isAllowed).toBe(false); // Event volunteerAccessStatus is NOT_STARTED
    });

    it('Should start volunteer access and email finalized volunteers only', async () => {
      const startRes = await startVolunteerAccess(eventId, founderId);
      expect(startRes.success).toBe(true);
      expect(startRes.event.volunteer_access_status).toBe('ACTIVE');
      expect(startRes.volunteersNotified).toBe(1);

      const isAllowed = await verifyVolunteerAccess(studentId, eventId);
      expect(isAllowed).toBe(true); // Now access is active!
    });
  });

  afterAll(async () => {
    await db.$disconnect();
  });
});
