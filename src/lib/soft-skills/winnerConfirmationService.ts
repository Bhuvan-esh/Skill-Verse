import { db } from '@/lib/db';
import { createAuditLog } from './audit';
import { executePostWinnerWorkflow } from './postWinnerWorkflow';

export interface ConfirmWinnerInput {
  resultId: string;
  founderId: string;
  founderName?: string;
  founderRemarks?: string;
}

export async function confirmWinnerByFounder(input: ConfirmWinnerInput): Promise<any> {
  const result = await db.skillLeagueResult.findUnique({
    where: { id: input.resultId },
    include: { event: true },
  });

  if (!result) {
    throw new Error('Competition result not found');
  }

  if (result.status === 'FOUNDER_CONFIRMED') {
    return {
      result,
      message: 'Result was already confirmed.',
    };
  }

  // Update result record to FOUNDER_CONFIRMED
  const updatedResult = await db.skillLeagueResult.update({
    where: { id: input.resultId },
    data: {
      status: 'FOUNDER_CONFIRMED',
      founder_id: input.founderId,
      founder_name: input.founderName || 'Lead Founder',
      founder_remarks: input.founderRemarks || 'Official winner confirmation approved.',
      confirmed_at: new Date(),
    },
    include: {
      event: true,
      winning_team: { include: { members: true } },
    },
  });

  // Update Event Status to WINNER_CONFIRMED
  await db.skillLeagueEvent.update({
    where: { id: result.event_id },
    data: { status: 'WINNER_CONFIRMED' },
  });

  await createAuditLog({
    actorId: input.founderId,
    actorRole: 'FOUNDER',
    action: 'WINNER_CONFIRMED',
    entity: 'RESULT',
    entityId: result.id,
    oldValue: { status: result.status },
    newValue: { status: 'FOUNDER_CONFIRMED', confirmedAt: new Date() },
    reason: input.founderRemarks || 'Founder officially ratified judge competition result.',
  });

  // Trigger post-winner processing immediately and reliably
  const workflowRes = await executePostWinnerWorkflow(
    input.resultId,
    input.founderId,
    input.founderName || 'Lead Founder'
  );

  return {
    result: updatedResult,
    postWinnerWorkflow: workflowRes,
  };
}

export async function rejectOrReviewResult(
  resultId: string,
  action: 'REJECTED' | 'REVIEW_REQUIRED',
  founderId: string,
  founderRemarks: string
): Promise<any> {
  const updated = await db.skillLeagueResult.update({
    where: { id: resultId },
    data: {
      status: action,
      founder_id: founderId,
      founder_remarks: founderRemarks,
    },
  });

  await db.skillLeagueEvent.update({
    where: { id: updated.event_id },
    data: { status: action === 'REJECTED' ? 'JUDGING' : 'FOUNDER_REVIEW' },
  });

  await createAuditLog({
    actorId: founderId,
    actorRole: 'FOUNDER',
    action: action === 'REJECTED' ? 'RESULT_REJECTED' : 'RESULT_REVIEW_REQUESTED',
    entity: 'RESULT',
    entityId: resultId,
    newValue: { status: action, remarks: founderRemarks },
    reason: founderRemarks,
  });

  return updated;
}
