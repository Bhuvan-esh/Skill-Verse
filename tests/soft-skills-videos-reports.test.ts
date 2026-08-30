import { describe, it, expect } from 'vitest';
import { db } from '../src/lib/db';

describe('Soft Skills Video Learning & Weekly Reports System', () => {
  let createdVideoId: string;
  let createdReportId: string;

  it('1. Mentors and Visual Architects can share a curated video with "What to Notice" note', async () => {
    const video = await db.softSkillsVideo.create({
      data: {
        title: 'Mastering Stage Presence & Pitching Under Pressure',
        video_url: 'https://www.youtube.com/watch?v=eIho2S0ZahI',
        video_type: 'TED_TALK',
        shared_by_name: 'Visual Architects Lead',
        shared_by_role: 'Visual Architect',
        what_to_notice: 'Observe how the speaker uses purposeful 2-second pauses before the punchline rather than filler words.',
        topic_tags: 'Public Speaking, Pitching, Rhetoric',
        duration: '11:20',
      },
    });

    expect(video.id).toBeDefined();
    expect(video.what_to_notice).toContain('2-second pauses');
    createdVideoId = video.id;
  });

  it('2. Participant can submit a weekly reflection report referencing the video and pitch a stage talk topic', async () => {
    const report = await db.softSkillsWeeklyReport.create({
      data: {
        student_id: 'stu-test-participant',
        student_name: 'Kavya Sharma',
        usn: '1MS23CS101',
        academic_year: 3,
        department: 'Computer Science & Engineering',
        video_id: createdVideoId,
        video_title: 'Mastering Stage Presence & Pitching Under Pressure',
        report_title: 'Strategic Pacing & The Elimination of Verbal Crutches in High-Stakes Presentations',
        what_watched_summary: 'Reviewed Julian Treasure and Amy Cuddy communication principles.',
        key_learnings: '1. Silence signals cognitive control.\n2. Diaphragmatic breathing prevents voice pitch elevation.',
        communication_techniques: 'Open chest posture, deliberate silence, and modulated vocal register.',
        proposed_stage_topic: '“Engineering Persuasive Arguments in Technical Keynotes”',
        status: 'SUBMITTED',
        is_public: false,
      },
    });

    expect(report.id).toBeDefined();
    expect(report.status).toBe('SUBMITTED');
    expect(report.is_public).toBe(false);
    createdReportId = report.id;
  });

  it('3. Visual Architects can select the best report for Live Stage Performance and publish it to the Public Showcase', async () => {
    const updated = await db.softSkillsWeeklyReport.update({
      where: { id: createdReportId },
      data: {
        status: 'SELECTED_FOR_STAGE',
        is_public: true,
        visual_architect_feedback: '🏆 Outstanding analysis! Selected for Live Stage Performance Keynote at Horizon Stage.',
        stage_performance_date: 'March 20, 2026 • Main Horizon Stage',
        credits_awarded: 100,
        selected_at: new Date(),
      },
    });

    expect(updated.status).toBe('SELECTED_FOR_STAGE');
    expect(updated.is_public).toBe(true);
    expect(updated.credits_awarded).toBe(100);
    expect(updated.visual_architect_feedback).toContain('Selected for Live Stage Performance');
  });

  it('4. Public Showcase queries retrieve only approved public reports', async () => {
    const publicReports = await db.softSkillsWeeklyReport.findMany({
      where: { is_public: true },
    });

    expect(publicReports.length).toBeGreaterThan(0);
    const myPublicReport = publicReports.find((r) => r.id === createdReportId);
    expect(myPublicReport).toBeDefined();
    expect(myPublicReport?.student_name).toBe('Kavya Sharma');
  });
});
