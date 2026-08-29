import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const videoId = params.id;
    const body = await req.json();
    const { reviewer_name, rating, feedback_text } = body;

    const numRating = Number(rating) || 5;

    if (!reviewer_name || !feedback_text) {
      return NextResponse.json({ error: 'Reviewer name and feedback text are required' }, { status: 400 });
    }

    // Determine credit & progress impact
    let credit_impact = 15;
    let sentiment: 'POSITIVE' | 'NEUTRAL' | 'CRITICAL' = 'POSITIVE';

    if (numRating >= 4) {
      credit_impact = 15; // Positive boost
      sentiment = 'POSITIVE';
    } else if (numRating === 3) {
      credit_impact = 5; // Neutral
      sentiment = 'NEUTRAL';
    } else {
      credit_impact = -10; // Critical penalty
      sentiment = 'CRITICAL';
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      reviewer_name: reviewer_name.trim(),
      rating: numRating,
      sentiment,
      feedback_text: feedback_text.trim(),
      created_at: new Date().toISOString(),
      credit_impact,
    };

    return NextResponse.json({
      success: true,
      review: newReview,
      credit_impact,
      message: credit_impact > 0
        ? `✓ Positive review posted! +${credit_impact} Credits awarded to the author.`
        : `✓ Review posted. ${credit_impact} Credits applied to the author.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit review' }, { status: 500 });
  }
}
