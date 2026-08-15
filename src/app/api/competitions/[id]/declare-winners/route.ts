import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { generateAICreditDraft } from '@/lib/ai';

const DeclareWinnersSchema = z.object({
  winners: z.array(
    z.object({
      student_id: z.string(),
      rank: z.number().int().positive(),
    })
  ),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(['FOUNDER']);
    const compId = params.id;

    const competition = await db.competition.findUnique({
      where: { id: compId },
      include: { registrations: { include: { student: true } } },
    });

    if (!competition) {
      return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
    }

    if (competition.type === 'DISPLAY_ONLY') {
      return NextResponse.json({ error: 'Display-only competitions skip the winner/credit flow.' }, { status: 400 });
    }

    const body = await req.json();
    const { winners } = DeclareWinnersSchema.parse(body);

    // Validate that all winners belong to the actual participant list
    const participantMap = new Map(competition.registrations.map((r) => [r.student_id, r.student]));
    const invalidWinner = winners.find((w) => !participantMap.has(w.student_id));

    if (invalidWinner) {
      return NextResponse.json(
        { error: 'All declared winners must be selected from the actual participant list.' },
        { status: 400 }
      );
    }

    // Fetch current credits for each winner
    const participantsData = await Promise.all(
      winners.map(async (w) => {
        const student = participantMap.get(w.student_id)!;
        let credits = await db.studentCredit.findUnique({ where: { student_id: student.id } });
        if (!credits) {
          credits = await db.studentCredit.create({ data: { student_id: student.id } });
        }

        const domainKey = competition.domain.toLowerCase() as 'domain_1' | 'domain_2' | 'domain_3' | 'domain_4';
        const currentCredit = credits[domainKey];

        return {
          student_id: student.id,
          student_name: student.name,
          current_credit: currentCredit,
          rank: w.rank,
        };
      })
    );

    // Trigger AI Credit Agent to synthesize structured proposals
    const draftProposals = await generateAICreditDraft({
      competition_name: competition.name,
      domain: competition.domain as any,
      configured_credit_value: competition.credit_value,
      participants: participantsData,
    });

    // Save as Pending Report for Founder Review
    const report = await db.pendingReport.create({
      data: {
        type: 'COMPETITION',
        competition_id: compId,
        report_data: JSON.stringify(draftProposals),
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      message: 'Winners declared. AI Credit report draft generated for founder review.',
      report_id: report.id,
      draft_proposals: draftProposals,
    });
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
