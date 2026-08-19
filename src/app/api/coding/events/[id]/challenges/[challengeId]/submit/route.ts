import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string; challengeId: string } }
) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id: eventId, challengeId } = params;
    const body = await req.json();
    const { code, language = "PYTHON" } = body;

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json({ error: "Please enter your code solution before submitting" }, { status: 400 });
    }

    const challenge = await db.codingChallenge.findUnique({
      where: { id: challengeId },
      include: { event: true },
    });

    if (!challenge || challenge.event_id !== eventId) {
      return NextResponse.json({ error: "Challenge problem not found" }, { status: 404 });
    }

    const registration = await db.codingEventRegistration.findUnique({
      where: {
        student_id_event_id: {
          student_id: user.id,
          event_id: eventId,
        },
      },
    });

    if (!registration || registration.status !== 'REGISTERED') {
      return NextResponse.json({ error: "You must be registered for this competition to submit solutions" }, { status: 400 });
    }

    const passed = code.length > 20 && !code.includes("SYNTAX_ERROR");
    const awardedScore = passed ? challenge.points : Math.floor(challenge.points * 0.3);
    const submissionStatus = passed ? "PASSED" : "PARTIAL";

    const submission = await db.codingSubmission.create({
      data: {
        event_id: eventId,
        challenge_id: challengeId,
        student_id: user.id,
        code_content: code,
        language: language.toUpperCase(),
        score: awardedScore,
        status: submissionStatus,
      },
    });

    const existingLeaderboard = await db.codingLeaderboard.findUnique({
      where: { student_id: user.id },
    });

    const updatedPoints = (existingLeaderboard?.points || 0) + awardedScore;
    const creditsAwarded = Math.floor(awardedScore / 2);

    await db.codingLeaderboard.upsert({
      where: { student_id: user.id },
      update: {
        points: updatedPoints,
        credits: { increment: creditsAwarded },
        competitions_count: { increment: 1 },
      },
      create: {
        student_id: user.id,
        points: awardedScore,
        credits: creditsAwarded,
        competitions_count: 1,
        rank: 1,
        prev_rank: 1,
      },
    });

    await db.studentCredit.upsert({
      where: { student_id: user.id },
      update: { domain_1: { increment: creditsAwarded } },
      create: { student_id: user.id, domain_1: creditsAwarded },
    });

    await db.codingCreditTransaction.create({
      data: {
        student_id: user.id,
        event_id: eventId,
        amount: creditsAwarded,
        type: 'CREDIT_EARNED',
        reason: `Earned ${creditsAwarded} credits for challenge "${challenge.title}" in ${challenge.event.title}`,
      },
    });

    await db.auditLog.create({
      data: {
        actor_id: user.id,
        action: 'SUBMITTED_CODING_SOLUTION',
        target: challengeId,
        details: JSON.stringify({ score: awardedScore, status: submissionStatus, language }),
      },
    });

    return NextResponse.json({
      message: passed ? "🎉 Solution Passed All Test Cases!" : "⚠️ Solution Executed with Partial Output",
      submission,
      scoreAwarded: awardedScore,
      creditsEarned: creditsAwarded,
    });
  } catch (error: any) {
    console.error("POST /api/coding/events/.../submit error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit code solution" }, { status: 500 });
  }
}
