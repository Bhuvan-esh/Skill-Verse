const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.softSkillsWeeklyReport.deleteMany({ where: { is_public: true } });
  const rep = await prisma.softSkillsWeeklyReport.create({
    data: {
      student_id: 'stu-sample-kavya',
      student_name: 'Kavya Sharma',
      usn: '1MS23AI042',
      academic_year: 3,
      department: 'Artificial Intelligence & Machine Learning (AIML / AIDS)',
      video_title: 'Mastering Stage Presence & Pitching Under Pressure',
      report_title: 'Strategic Pacing & The Elimination of Verbal Crutches in High-Stakes Presentations',
      what_watched_summary: 'Reviewed Julian Treasure and Amy Cuddy communication principles.',
      key_learnings: '1. Silence signals cognitive control.\n2. Diaphragmatic breathing prevents voice pitch elevation.',
      communication_techniques: 'Open chest posture, deliberate silence, and modulated vocal register.',
      proposed_stage_topic: '“Engineering Persuasive Arguments in Technical Keynotes”',
      why_selected_rationale: 'I synthesize physiological autonomic nervous system control with algorithmic rhetoric, enabling engineers to anchor boardroom authority without aggressive posturing.',
      external_references: '• Book: "Never Split the Difference" by Chris Voss — Tactical empathy and late-night FM DJ vocal pacing.\n• Movie: "The King’s Speech" (2010) — Mechanics of overcoming diaphragmatic constriction under immense public scrutiny.',
      attachments: JSON.stringify([
        { name: 'Kavya_Vocal_Pacing_Research.pdf', type: 'application/pdf', size: '2.4 MB' },
        { name: 'Rhetoric_Posture_Blueprint.png', type: 'image/png', size: '850 KB' },
        { name: 'Diaphragmatic_Pitch_Notes.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: '320 KB' },
      ]),
      status: 'SELECTED_FOR_STAGE',
      is_public: true,
      visual_architect_feedback: '🏆 Outstanding analysis of vocal authority, cross-domain book synthesis, and diaphragmatic stability! Selected for Live Stage Performance Keynote at Horizon Stage.',
      stage_performance_date: 'March 20, 2026 • Main Horizon Stage',
      credits_awarded: 100
    }
  });
  console.log('Successfully seeded Kavya Sharma with attachments and references:', rep.student_name);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
