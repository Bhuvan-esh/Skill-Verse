import { db } from '@/lib/db';
import { createAuditLog } from './audit';
import { TransactionType } from './types';

export interface AwardCreditsInput {
  studentId: string;
  studentName: string;
  eventId: string;
  resultId: string;
  transactionType: TransactionType;
  creditsToAward: number;
  reason: string;
  confirmedBy: string;
}

export interface CreditAwardResult {
  transactionId: string;
  studentId: string;
  previousBalance: number;
  creditsEarned: number;
  newBalance: number;
  isDuplicate: boolean;
}

export async function getStudentCreditBalance(studentId: string): Promise<number> {
  const account = await db.skillLeagueCreditAccount.findUnique({
    where: { student_id: studentId },
  });

  if (account) {
    return account.current_balance;
  }

  // Check general studentCredit domain balance fallback if available
  const generalCredit = await db.studentCredit.findUnique({
    where: { student_id: studentId },
  });

  if (generalCredit) {
    return (generalCredit.domain_1 || 0) + (generalCredit.domain_2 || 0) + (generalCredit.domain_3 || 0) + (generalCredit.domain_4 || 0);
  }

  return 0;
}

export async function processCreditTransaction(input: AwardCreditsInput): Promise<CreditAwardResult> {
  const idempotencyKey = `${input.eventId}_${input.studentId}_${input.resultId}_${input.transactionType}`;

  // IDEMPOTENCY CHECK: Ensure credits cannot be double-awarded
  const existingTransaction = await db.skillLeagueCreditTransaction.findUnique({
    where: { idempotency_key: idempotencyKey },
  });

  if (existingTransaction) {
    return {
      transactionId: existingTransaction.id,
      studentId: input.studentId,
      previousBalance: existingTransaction.previous_balance,
      creditsEarned: existingTransaction.credits_earned,
      newBalance: existingTransaction.new_balance,
      isDuplicate: true,
    };
  }

  // Retrieve previous balance safely
  let account = await db.skillLeagueCreditAccount.findUnique({
    where: { student_id: input.studentId },
  });

  const previousBalance = account ? account.current_balance : await getStudentCreditBalance(input.studentId);
  const newBalance = previousBalance + input.creditsToAward;

  // Upsert account
  if (account) {
    await db.skillLeagueCreditAccount.update({
      where: { student_id: input.studentId },
      data: {
        student_name: input.studentName,
        current_balance: newBalance,
      },
    });
  } else {
    await db.skillLeagueCreditAccount.create({
      data: {
        student_id: input.studentId,
        student_name: input.studentName,
        current_balance: newBalance,
      },
    });
  }

  // Create immutable transaction ledger record
  const transaction = await db.skillLeagueCreditTransaction.create({
    data: {
      idempotency_key: idempotencyKey,
      student_id: input.studentId,
      student_name: input.studentName,
      event_id: input.eventId,
      result_id: input.resultId,
      transaction_type: input.transactionType,
      previous_balance: previousBalance,
      credits_earned: input.creditsToAward,
      new_balance: newBalance,
      reason: input.reason,
      confirmed_by: input.confirmedBy,
      timestamp: new Date(),
    },
  });

  await createAuditLog({
    actorId: input.confirmedBy,
    actorRole: 'FOUNDER',
    action: 'CREDITS_AWARDED',
    entity: 'CREDIT_TRANSACTION',
    entityId: transaction.id,
    oldValue: { balance: previousBalance },
    newValue: { balance: newBalance, added: input.creditsToAward },
    reason: input.reason,
  });

  return {
    transactionId: transaction.id,
    studentId: input.studentId,
    previousBalance,
    creditsEarned: input.creditsToAward,
    newBalance,
    isDuplicate: false,
  };
}
