import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

export const CreditReportSchema = z.object({
  student_id: z.string(),
  student_name: z.string(),
  domain: z.enum(['DOMAIN_1', 'DOMAIN_2', 'DOMAIN_3', 'DOMAIN_4']),
  old_credit: z.number().int().min(0),
  proposed_credit: z.number().int().min(0),
  credit_added: z.number().int(),
  reason: z.string(),
});

export const ReportBatchSchema = z.array(CreditReportSchema);

export type CreditReportProposal = z.infer<typeof CreditReportSchema>;

export async function generateAICreditDraft(input: {
  competition_name: string;
  domain: 'DOMAIN_1' | 'DOMAIN_2' | 'DOMAIN_3' | 'DOMAIN_4';
  configured_credit_value: number;
  participants: Array<{
    student_id: string;
    student_name: string;
    current_credit: number;
    rank?: number;
    role_in_event?: string;
  }>;
}): Promise<CreditReportProposal[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'mock-or-real-gemini-key') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are the Club Idea Hub AI Credit Agent.
You calculate credit awards for students based on competition results.

Input Data:
Competition: ${input.competition_name}
Domain: ${input.domain}
Configured Credit Value: ${input.configured_credit_value}
Participants: ${JSON.stringify(input.participants, null, 2)}

Return a strict JSON array of objects, with NO Markdown formatting, matching this format:
[
  {
    "student_id": "string",
    "student_name": "string",
    "domain": "${input.domain}",
    "old_credit": number,
    "proposed_credit": number,
    "credit_added": number,
    "reason": "Detailed explanation of why credits were awarded"
  }
]`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/```json/g, '').replace(/```/g, '');
      const rawJson = JSON.parse(text);
      
      const parsed = ReportBatchSchema.safeParse(rawJson);
      if (parsed.success) {
        return parsed.data;
      }
    } catch (error) {
      console.warn('Gemini API call failed, falling back to deterministic AI agent engine:', error);
    }
  }

  // Deterministic Fallback Engine (guarantees schema adherence and reliability)
  return input.participants.map((p) => {
    let creditAdded = input.configured_credit_value;
    if (p.rank === 1) {
      creditAdded = Math.round(input.configured_credit_value * 1.5);
    } else if (p.rank === 2) {
      creditAdded = Math.round(input.configured_credit_value * 1.2);
    } else if (p.rank === 3) {
      creditAdded = input.configured_credit_value;
    } else if (p.rank && p.rank > 3) {
      creditAdded = Math.max(1, Math.round(input.configured_credit_value * 0.5));
    }

    const proposedCredit = p.current_credit + creditAdded;
    const reason = p.rank
      ? `Awarded ${creditAdded} credits for Rank #${p.rank} in '${input.competition_name}' (${input.domain}).`
      : `Awarded ${creditAdded} credits for participation and performance in '${input.competition_name}' (${input.domain}).`;

    return {
      student_id: p.student_id,
      student_name: p.student_name,
      domain: input.domain,
      old_credit: p.current_credit,
      proposed_credit: proposedCredit,
      credit_added: creditAdded,
      reason,
    };
  });
}
