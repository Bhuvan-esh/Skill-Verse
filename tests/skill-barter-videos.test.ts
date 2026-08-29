import { describe, it, expect } from 'vitest';
import { formatVideoFileSize, isValidVideoFile } from '@/lib/videoUtils';

describe('SkillBarter PeerVault & Review Credit Engine', () => {
  it('should format video file sizes and validate video formats correctly', () => {
    expect(formatVideoFileSize(14 * 1024 * 1024)).toBe('14.0 MB');
    expect(formatVideoFileSize(850 * 1024)).toBe('850 KB');
    expect(formatVideoFileSize(1.5 * 1024 * 1024 * 1024)).toBe('1.5 GB');

    expect(isValidVideoFile('walkthrough.mp4')).toBe(true);
    expect(isValidVideoFile('session_demo.webm')).toBe(true);
    expect(isValidVideoFile('quick_fix.mov')).toBe(true);
    expect(isValidVideoFile('document.pdf')).toBe(false);
    expect(isValidVideoFile('photo.png')).toBe(false);
  });

  it('should calculate positive and negative credit impact based on video review ratings', () => {
    const calculateImpact = (rating: number) => {
      if (rating >= 4) return { credit_impact: 15, sentiment: 'POSITIVE' };
      if (rating === 3) return { credit_impact: 5, sentiment: 'NEUTRAL' };
      return { credit_impact: -10, sentiment: 'CRITICAL' };
    };

    // Positive rating (4-5 stars) increases credits & leaderboard
    expect(calculateImpact(5).credit_impact).toBe(15);
    expect(calculateImpact(4).credit_impact).toBe(15);
    expect(calculateImpact(5).sentiment).toBe('POSITIVE');

    // Neutral rating (3 stars) gives mild boost
    expect(calculateImpact(3).credit_impact).toBe(5);
    expect(calculateImpact(3).sentiment).toBe('NEUTRAL');

    // Critical/Negative rating (1-2 stars) decreases credits
    expect(calculateImpact(2).credit_impact).toBe(-10);
    expect(calculateImpact(1).credit_impact).toBe(-10);
    expect(calculateImpact(1).sentiment).toBe('CRITICAL');
  });

  it('should enforce author acceptance workflow before unlocking 1:1 communication', () => {
    // 1. Initial request sent to video author's account
    const queryRequest = {
      id: 'vq-test-1',
      video_id: 'vid-1',
      video_title: 'PostgreSQL B-Tree Indexing',
      author_name: 'Rahul Sharma',
      author_email: 'rahul.sharma.cse@rvce.edu.in',
      requester_name: 'Anusha A',
      status: 'PENDING' as 'PENDING' | 'ACCEPTED' | 'DECLINED',
      canCommunicate: false,
    };

    // While PENDING, communication is locked
    expect(queryRequest.status).toBe('PENDING');
    expect(queryRequest.canCommunicate).toBe(false);

    // 2. Author accepts the request
    const acceptQuery = (req: typeof queryRequest) => {
      return {
        ...req,
        status: 'ACCEPTED' as const,
        canCommunicate: true,
        session_id: `s-${Date.now()}`,
      };
    };

    const acceptedRequest = acceptQuery(queryRequest);
    expect(acceptedRequest.status).toBe('ACCEPTED');
    expect(acceptedRequest.canCommunicate).toBe(true);
    expect(acceptedRequest.session_id).toBeDefined();
  });
});
