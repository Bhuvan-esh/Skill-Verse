import { db } from '@/lib/db';
import { createAuditLog } from './audit';

export const DEFAULT_TWISTS = [
  {
    title: 'Forbidden Word Nexus',
    description: 'Participants are forbidden from uttering designated buzzwords (e.g., "technology", "solution", "money"). 5 points deducted per violation.',
    category: 'FORBIDDEN_WORD',
  },
  {
    title: 'Sudden Position Flip',
    description: 'Midway through the round, teams must immediately reverse their arguments and defend the opposing viewpoint.',
    category: 'CHANGE_POSITION',
  },
  {
    title: 'Hyper-Compression Clock',
    description: 'Time limit reduced by 50% without warning. The speaker must conclude their core thesis in 30 seconds.',
    category: 'TIME_REDUCTION',
  },
  {
    title: 'Black Swan Crisis Alert',
    description: 'An emergency real-time complication is injected (e.g., server outage, sudden product recall). Teams must adapt their strategy live.',
    category: 'EMERGENCY_SITUATION',
  },
  {
    title: 'Opponent Role Reversal',
    description: 'Lead speakers trade roles with their opponent debater for the rebuttal phase.',
    category: 'ROLE_CHANGE',
  },
  {
    title: 'Zero-Budget Constraint',
    description: 'Assume capital and external resources are slashed to zero. How do you pivot immediately?',
    category: 'BUDGET_REDUCTION',
  },
  {
    title: 'Hostile Stakeholder Inquiry',
    description: 'Judges inject a sharp, unpredictable counter-inquiry that must be answered in under 20 seconds.',
    category: 'UNEXPECTED_QUESTION',
  },
  {
    title: 'Reverse Argument Gambit',
    description: 'Teams must argue why their own proposal could catastrophically fail and present a counter-fail-safe.',
    category: 'REVERSE_ARGUMENT',
  },
];

export async function seedDefaultTwistsIfNeeded(): Promise<void> {
  const count = await db.skillLeagueTwist.count();
  if (count === 0) {
    for (const t of DEFAULT_TWISTS) {
      await db.skillLeagueTwist.create({
        data: t,
      });
    }
  }
}

export async function attachTwistsToEvent(
  eventId: string,
  twistIds: string[],
  actorId: string,
  actorRole: string = 'FOUNDER'
): Promise<void> {
  for (let i = 0; i < twistIds.length; i++) {
    const twistId = twistIds[i];
    await db.skillLeagueEventTwist.create({
      data: {
        event_id: eventId,
        twist_id: twistId,
        round_number: i + 1,
        is_revealed: false,
      },
    });
  }

  await createAuditLog({
    actorId,
    actorRole,
    action: 'TWISTS_CONFIGURED',
    entity: 'EVENT',
    entityId: eventId,
    newValue: { twistCount: twistIds.length },
    reason: 'Configured secret event twists for upcoming rounds',
  });
}

export async function revealRoundTwist(
  eventTwistId: string,
  actorId: string,
  actorRole: string = 'FOUNDER'
): Promise<any> {
  const eventTwist = await db.skillLeagueEventTwist.update({
    where: { id: eventTwistId },
    data: {
      is_revealed: true,
      revealed_at: new Date(),
    },
    include: {
      twist: true,
      event: true,
    },
  });

  await createAuditLog({
    actorId,
    actorRole,
    action: 'TWIST_REVEALED',
    entity: 'EVENT_TWIST',
    entityId: eventTwistId,
    newValue: { twistTitle: eventTwist.twist.title, round: eventTwist.round_number },
    reason: `Revealed twist '${eventTwist.twist.title}' for round ${eventTwist.round_number}`,
  });

  return eventTwist;
}
