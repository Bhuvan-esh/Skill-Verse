import { db } from '@/lib/db';
import { sendCreditUpdatedEmail } from '@/lib/email-service';

export type ClubDomain = 'IDEA_HUB' | 'CODING' | 'SOFT_SKILLS' | 'SKILL_BARTER';

export interface AwardCreditsParams {
  studentId: string;
  domain: ClubDomain;
  activityId: string;
  activityName: string;
  creditAmount: number;
  approvingFounderUid: string;
  approvingFounderName?: string;
  registrationId?: string;
  idempotencyKey?: string;
}

export interface AwardCreditsResult {
  success: boolean;
  isDuplicate?: boolean;
  totalCredits?: number;
  domainCredits?: number;
  transactionId?: string;
  error?: string;
}

/**
 * Unified, Atomic, Idempotent Credit Awarding Engine
 */
export async function awardCredits(params: AwardCreditsParams): Promise<AwardCreditsResult> {
  const {
    studentId,
    domain,
    activityId,
    activityName,
    creditAmount,
    approvingFounderUid,
    approvingFounderName = 'Founder / Coordinator',
    registrationId,
  } = params;

  if (creditAmount <= 0) {
    return { success: false, error: 'Credit amount must be greater than zero' };
  }

  const generatedKey = params.idempotencyKey || `CREDIT_${domain}_${activityId}_${studentId}`;

  try {
    // 1. Check idempotency / duplicate award
    const existingTx = await db.clubCreditTransaction.findUnique({
      where: { idempotency_key: generatedKey },
    });

    if (existingTx) {
      console.log(`[Credit Engine] Duplicate credit award blocked by idempotency key: ${generatedKey}`);
      const studentCredit = await db.studentCredit.findUnique({
        where: { student_id: studentId },
      });
      return {
        success: true,
        isDuplicate: true,
        totalCredits: studentCredit?.total_credits || 0,
        transactionId: existingTx.id,
      };
    }

    // 2. Fetch student details
    const student = await db.user.findUnique({
      where: { id: studentId },
      include: { student_credits: true },
    });

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    // 3. Execute atomic transaction: update credits + record transaction
    const result = await db.$transaction(async (tx) => {
      // Upsert student credit record
      const currentCredits = student.student_credits || {
        domain_1: 0,
        domain_2: 0,
        domain_3: 0,
        domain_4: 0,
        total_credits: 0,
      };

      const domainField =
        domain === 'IDEA_HUB'
          ? 'domain_1'
          : domain === 'CODING'
          ? 'domain_2'
          : domain === 'SOFT_SKILLS'
          ? 'domain_3'
          : 'domain_4';

      const newDomainTotal = (currentCredits[domainField] || 0) + creditAmount;
      const newTotal = (currentCredits.total_credits || 0) + creditAmount;

      await tx.studentCredit.upsert({
        where: { student_id: studentId },
        create: {
          student_id: studentId,
          domain_1: domain === 'IDEA_HUB' ? creditAmount : 0,
          domain_2: domain === 'CODING' ? creditAmount : 0,
          domain_3: domain === 'SOFT_SKILLS' ? creditAmount : 0,
          domain_4: domain === 'SKILL_BARTER' ? creditAmount : 0,
          total_credits: creditAmount,
        },
        update: {
          [domainField]: newDomainTotal,
          total_credits: newTotal,
        },
      });

      // Create transaction log
      const creditTx = await tx.clubCreditTransaction.create({
        data: {
          student_id: studentId,
          student_name: student.name,
          usn: student.usn,
          domain,
          activity_id: activityId,
          activity_name: activityName,
          credits: creditAmount,
          approved_by: approvingFounderUid,
          idempotency_key: generatedKey,
        },
      });

      // Update registration record if applicable
      if (registrationId) {
        await tx.clubEventRegistration.update({
          where: { id: registrationId },
          data: {
            founder_confirmed: true,
            credits_awarded: true,
            credits_awarded_at: new Date(),
            approved_by: approvingFounderUid,
          },
        });
      }

      // Record in AdminAuditLog
      await tx.adminAuditLog.create({
        data: {
          actor_uid: approvingFounderUid,
          actor_name: approvingFounderName,
          action: 'CREDIT_AWARDED',
          target_type: 'CREDIT',
          target_id: creditTx.id,
          metadata: JSON.stringify({
            studentId,
            studentName: student.name,
            domain,
            activityName,
            creditAmount,
            newTotal,
          }),
        },
      });

      return {
        transactionId: creditTx.id,
        totalCredits: newTotal,
        domainCredits: newDomainTotal,
      };
    });

    // 4. Send personal credit notification email to that student ONLY
    if (student.college_email) {
      sendCreditUpdatedEmail({
        recipientEmail: student.college_email,
        studentName: student.name,
        activityName,
        domain,
        creditsEarned: creditAmount,
        totalCredits: result.totalCredits,
        idempotencyKey: `EMAIL_CREDIT_${result.transactionId}`,
      }).catch((e) => console.error('[Credit Email Error]:', e));
    }

    return {
      success: true,
      isDuplicate: false,
      totalCredits: result.totalCredits,
      domainCredits: result.domainCredits,
      transactionId: result.transactionId,
    };
  } catch (err: any) {
    console.error('[Credit Engine Error]:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Get student verified credit breakdown
 */
export async function getStudentCreditProfile(studentId: string) {
  const credits = await db.studentCredit.findUnique({
    where: { student_id: studentId },
  });

  const transactions = await db.clubCreditTransaction.findMany({
    where: { student_id: studentId },
    orderBy: { approved_at: 'desc' },
    take: 50,
  });

  return {
    totalCredits: credits?.total_credits || 0,
    domainCredits: {
      ideaHub: credits?.domain_1 || 0,
      coding: credits?.domain_2 || 0,
      softSkills: credits?.domain_3 || 0,
      skillBarter: credits?.domain_4 || 0,
    },
    transactions,
  };
}

/**
 * Recalculate and fetch verified club leaderboard
 */
export async function getVerifiedClubLeaderboard(limit = 100) {
  const leaders = await db.studentCredit.findMany({
    where: { total_credits: { gt: 0 } },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          usn: true,
          college_email: true,
          role: true,
        },
      },
    },
    orderBy: { total_credits: 'desc' },
    take: limit,
  });

  return leaders.map((entry, index) => ({
    rank: index + 1,
    studentId: entry.student_id,
    studentName: entry.student.name,
    usn: entry.student.usn,
    totalCredits: entry.total_credits,
    domainCredits: {
      ideaHub: entry.domain_1,
      coding: entry.domain_2,
      softSkills: entry.domain_3,
      skillBarter: entry.domain_4,
    },
  }));
}

