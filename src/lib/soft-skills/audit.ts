import { db } from '@/lib/db';

export interface AuditLogPayload {
  actorId: string;
  actorRole: string; // STUDENT, JUDGE, FOUNDER, ADMIN
  action: string;
  entity: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
}

export async function createAuditLog(payload: AuditLogPayload): Promise<void> {
  try {
    await db.skillLeagueAuditLog.create({
      data: {
        actor_id: payload.actorId,
        actor_role: payload.actorRole,
        action: payload.action,
        entity: payload.entity,
        entity_id: payload.entityId,
        old_value: payload.oldValue !== undefined ? (typeof payload.oldValue === 'string' ? payload.oldValue : JSON.stringify(payload.oldValue)) : null,
        new_value: payload.newValue !== undefined ? (typeof payload.newValue === 'string' ? payload.newValue : JSON.stringify(payload.newValue)) : null,
        reason: payload.reason || null,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to create Skill League audit log:', error);
  }
}
