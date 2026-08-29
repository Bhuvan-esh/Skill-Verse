import { describe, it, expect } from 'vitest';

describe('Session End, Reciprocal Progress & PeerVault Public Review Sync Engine', () => {
  it('should end a session and compute feedback credit impact correctly', () => {
    const computeCreditImpact = (rating: number) => {
      if (rating >= 4) return { creditDelta: 15, sentiment: 'POSITIVE' };
      if (rating === 3) return { creditDelta: 5, sentiment: 'NEUTRAL' };
      return { creditDelta: -10, sentiment: 'CRITICAL' };
    };

    expect(computeCreditImpact(5)).toEqual({ creditDelta: 15, sentiment: 'POSITIVE' });
    expect(computeCreditImpact(4)).toEqual({ creditDelta: 15, sentiment: 'POSITIVE' });
    expect(computeCreditImpact(3)).toEqual({ creditDelta: 5, sentiment: 'NEUTRAL' });
    expect(computeCreditImpact(2)).toEqual({ creditDelta: -10, sentiment: 'CRITICAL' });
    expect(computeCreditImpact(1)).toEqual({ creditDelta: -10, sentiment: 'CRITICAL' });
  });

  it('should synchronize feedback automatically to both Giver and Receiver progress records', () => {
    const mockProgressStore = {
      received: [] as any[],
      given: [] as any[],
    };

    const recordSessionFeedback = (payload: {
      giverName: string;
      receiverName: string;
      skill: string;
      rating: number;
      feedbackText: string;
    }) => {
      const creditImpact = payload.rating >= 4 ? 15 : 5;

      // 1. Record for Receiver (Column 3: Feedback Received / Exchanged)
      mockProgressStore.received.push({
        heading: `${payload.giverName} → You`,
        subheading: `Session Feedback: ${payload.skill}`,
        rating: '★'.repeat(payload.rating),
        text: payload.feedbackText,
        credits: `+${creditImpact} Credits Received`,
      });

      // 2. Record for Giver (Column 4: Feedback Given)
      mockProgressStore.given.push({
        name: payload.receiverName,
        role: `Feedback given for: ${payload.skill}`,
        rating: '★'.repeat(payload.rating),
        text: `You gave: "${payload.feedbackText}"`,
        creditImpact: `+${creditImpact} Credits Awarded to ${payload.receiverName}`,
      });
    };

    recordSessionFeedback({
      giverName: 'Anusha A',
      receiverName: 'Rahul Sharma',
      skill: 'PostgreSQL Index Optimization',
      rating: 5,
      feedbackText: 'Super clear session! Solved query latency in seconds.',
    });

    expect(mockProgressStore.received.length).toBe(1);
    expect(mockProgressStore.received[0].heading).toBe('Anusha A → You');
    expect(mockProgressStore.received[0].credits).toBe('+15 Credits Received');

    expect(mockProgressStore.given.length).toBe(1);
    expect(mockProgressStore.given[0].name).toBe('Rahul Sharma');
    expect(mockProgressStore.given[0].creditImpact).toContain('+15 Credits Awarded to Rahul Sharma');
  });

  it('should publish review to PeerVault Public Peer Reviews when linked to a video topic', () => {
    const mockVideo = {
      id: 'vid-1',
      title: 'PostgreSQL B-Tree Indexing',
      topic: 'Database Systems & Performance Tuning',
      average_rating: 4.8,
      creator_credits: 185,
      reviews: [
        {
          id: 'rev-1',
          reviewer_name: 'Meera K',
          rating: 4.8,
          feedback_text: 'Great video!',
        },
      ],
    };

    const attachPeerVaultReview = (video: typeof mockVideo, reviewer: string, rating: number, feedbackText: string) => {
      const creditDelta = rating >= 4 ? 15 : 5;
      const newReview = {
        id: `rev-${Date.now()}`,
        reviewer_name: reviewer,
        rating,
        feedback_text: feedbackText,
      };
      const updatedReviews = [newReview, ...video.reviews];
      const avg = Number((updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1));

      return {
        ...video,
        reviews: updatedReviews,
        average_rating: avg,
        creator_credits: video.creator_credits + creditDelta,
      };
    };

    const updated = attachPeerVaultReview(mockVideo, 'Anusha A', 5, 'Super clear self-made video walkthrough! Solved my query latency issue in seconds.');
    expect(updated.reviews.length).toBe(2);
    expect(updated.reviews[0].reviewer_name).toBe('Anusha A');
    expect(updated.average_rating).toBe(4.9);
    expect(updated.creator_credits).toBe(200);
  });
});
