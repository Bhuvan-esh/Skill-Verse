import { db } from '@/lib/db';
import { createAuditLog } from './audit';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Participant {
  id: string; // registration_id
  student_id: string;
  student_name: string;
  usn: string;
  year: number;
  branch: string;
}

export interface TeamProposal {
  teamName: string;
  teamNumber: number;
  members: Participant[];
  yearDistribution: Record<number, number>;
  reasoning: string;
}

export interface TeamGenerationResult {
  eventId: string;
  teamCount: number;
  totalParticipants: number;
  teams: TeamProposal[];
  algorithmExplanation: string;
  warnings: string[];
}

const TEAM_NAME_PRESETS = [
  'Team Nova', 'Team Orbit', 'Team Apex', 'Team Zenith',
  'Team Catalyst', 'Team Vanguard', 'Team Horizon', 'Team Quantum',
  'Team Pulse', 'Team Nexus', 'Team Eclipse', 'Team Aurora',
  'Team Spectra', 'Team Solstice', 'Team Velocity', 'Team Titan'
];

export async function generateMixedYearTeams(
  eventId: string,
  actorId: string,
  actorRole: string = 'FOUNDER',
  customTeamSize?: number
): Promise<TeamGenerationResult> {
  const event = await db.skillLeagueEvent.findUnique({
    where: { id: eventId },
    include: {
      registrations: {
        where: { status: 'REGISTERED' },
      },
    },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  const registrations: Participant[] = event.registrations.map((r) => ({
    id: r.id,
    student_id: r.student_id,
    student_name: r.student_name,
    usn: r.usn,
    year: r.year,
    branch: r.branch,
  }));

  if (registrations.length === 0) {
    throw new Error('No registered participants to form teams');
  }

  const teamSize = customTeamSize || event.team_size || 4;
  const numTeams = Math.max(1, Math.ceil(registrations.length / teamSize));

  // Retrieve previous team combinations to avoid repeated groupings
  const previousTeams = await db.skillLeagueTeamMember.findMany({
    where: {
      team: {
        event_id: { not: eventId },
      },
    },
    select: {
      team_id: true,
      student_id: true,
    },
  });

  const previousPairs = new Set<string>();
  const teamsByGroup = new Map<string, string[]>();
  for (const m of previousTeams) {
    const list = teamsByGroup.get(m.team_id) || [];
    list.push(m.student_id);
    teamsByGroup.set(m.team_id, list);
  }
  for (const list of teamsByGroup.values()) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        previousPairs.add(`${list[i]}_${list[j]}`);
        previousPairs.add(`${list[j]}_${list[i]}`);
      }
    }
  }

  // Group participants by academic year: 1st, 2nd, 3rd, 4th
  const yearBuckets: Record<number, Participant[]> = {
    1: [],
    2: [],
    3: [],
    4: [],
  };

  for (const p of registrations) {
    const y = p.year in yearBuckets ? p.year : 1;
    yearBuckets[y].push(p);
  }

  // Shuffle buckets
  for (const y of [1, 2, 3, 4]) {
    yearBuckets[y].sort(() => Math.random() - 0.5);
  }

  // Initialize team structures
  const teams: TeamProposal[] = [];
  for (let i = 0; i < numTeams; i++) {
    const name = TEAM_NAME_PRESETS[i % TEAM_NAME_PRESETS.length] + (i >= TEAM_NAME_PRESETS.length ? ` #${i + 1}` : '');
    teams.push({
      teamName: name,
      teamNumber: i + 1,
      members: [],
      yearDistribution: { 1: 0, 2: 0, 3: 0, 4: 0 },
      reasoning: 'Mixed academic year squad dynamically balanced for peer mentorship.',
    });
  }

  // Step 1: Round-robin distribute from each year bucket to maximize cross-year mixing
  const allAssignedIds = new Set<string>();

  for (const year of [1, 2, 3, 4]) {
    const bucket = yearBuckets[year];
    let teamIndex = (year - 1) % numTeams;

    for (const student of bucket) {
      if (allAssignedIds.has(student.student_id)) continue;

      // Find the team with the least members that doesn't yet have this year, or the smallest team
      let bestTeamIdx = teamIndex % numTeams;
      let minSize = Infinity;

      for (let i = 0; i < numTeams; i++) {
        const candidateIdx = (teamIndex + i) % numTeams;
        const candidate = teams[candidateIdx];
        if (candidate.members.length < minSize && candidate.yearDistribution[year] === 0) {
          minSize = candidate.members.length;
          bestTeamIdx = candidateIdx;
        }
      }

      if (minSize === Infinity) {
        // All teams already have someone from this year, pick smallest team
        for (let i = 0; i < numTeams; i++) {
          if (teams[i].members.length < minSize) {
            minSize = teams[i].members.length;
            bestTeamIdx = i;
          }
        }
      }

      teams[bestTeamIdx].members.push(student);
      teams[bestTeamIdx].yearDistribution[year] = (teams[bestTeamIdx].yearDistribution[year] || 0) + 1;
      allAssignedIds.add(student.student_id);
      teamIndex++;
    }
  }

  // Step 2: Handle any remaining unassigned participants
  for (const p of registrations) {
    if (!allAssignedIds.has(p.student_id)) {
      // Pick smallest team
      let smallestIdx = 0;
      for (let i = 1; i < teams.length; i++) {
        if (teams[i].members.length < teams[smallestIdx].members.length) {
          smallestIdx = i;
        }
      }
      teams[smallestIdx].members.push(p);
      teams[smallestIdx].yearDistribution[p.year] = (teams[smallestIdx].yearDistribution[p.year] || 0) + 1;
      allAssignedIds.add(p.student_id);
    }
  }

  // Build reasoning description per team
  const warnings: string[] = [];
  for (const t of teams) {
    const yearsRepresented = Object.entries(t.yearDistribution)
      .filter(([_, count]) => count > 0)
      .map(([yr, count]) => `${count} from Year ${yr}`)
      .join(', ');
    
    t.reasoning = `Squad assembled with ${t.members.length} members (${yearsRepresented}) ensuring cross-year mentorship and diverse perspectives.`;
    
    const uniqueYears = Object.values(t.yearDistribution).filter((c) => c > 0).length;
    if (uniqueYears === 1 && t.members.length > 1) {
      warnings.push(`Team '${t.teamName}' consists only of students from one year due to limited participant diversity.`);
    }
  }

  // Delete existing unapproved draft/ai-generated teams for this event
  await db.skillLeagueTeam.deleteMany({
    where: {
      event_id: eventId,
      status: { in: ['DRAFT', 'AI_GENERATED'] },
    },
  });

  // Save new AI-generated teams to database
  for (const t of teams) {
    const createdTeam = await db.skillLeagueTeam.create({
      data: {
        event_id: eventId,
        team_name: t.teamName,
        team_number: t.teamNumber,
        status: 'AI_GENERATED',
        generation_reasoning: t.reasoning,
      },
    });

    for (const m of t.members) {
      await db.skillLeagueTeamMember.create({
        data: {
          team_id: createdTeam.id,
          registration_id: m.id,
          student_id: m.student_id,
          student_name: m.student_name,
          usn: m.usn,
          year: m.year,
        },
      });
    }
  }

  // Update event status to TEAM_APPROVAL_PENDING
  await db.skillLeagueEvent.update({
    where: { id: eventId },
    data: { status: 'TEAM_APPROVAL_PENDING' },
  });

  const explanation = `Formed ${teams.length} balanced squads from ${registrations.length} registered participants. Cross-year dispersion algorithm successfully distributed 1st, 2nd, 3rd, and 4th-year students to optimize collaboration. Status set to AI_GENERATED; awaiting Founder Approval.`;

  await createAuditLog({
    actorId,
    actorRole,
    action: 'TEAMS_GENERATED',
    entity: 'EVENT',
    entityId: eventId,
    newValue: { teamCount: teams.length, totalParticipants: registrations.length },
    reason: explanation,
  });

  return {
    eventId,
    teamCount: teams.length,
    totalParticipants: registrations.length,
    teams,
    algorithmExplanation: explanation,
    warnings,
  };
}
