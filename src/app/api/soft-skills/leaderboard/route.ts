import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'demo-current-user';

    // 1. Fetch competition registrations
    let compRegistrations: any[] = [];
    try {
      compRegistrations = await db.skillLeagueRegistration.findMany({
        include: {
          event: {
            select: { public_event_name: true, credits_reward: true, status: true },
          },
        },
      });
    } catch (e) {
      console.warn('Error querying registrations:', e);
    }

    // 2. Fetch weekly reports
    let weeklyReports: any[] = [];
    try {
      weeklyReports = await db.softSkillsWeeklyReport.findMany();
    } catch (e) {
      console.warn('Error querying weekly reports:', e);
    }

    // Baseline coders as requested by user
    const defaultCoders = [
      {
        id: 'coder-1',
        rank: 1,
        student_name: 'Alex Johnson',
        department_usn: 'CSE(1MS21CS001)',
        test_accuracy: '96%',
        execution_time: '1.4ms',
        base_sprint_points: 1350,
        competitions_attended: 4,
        competitions_won: 3,
        video_reports_approved: 2,
      },
      {
        id: 'coder-2',
        rank: 2,
        student_name: 'Student Participant',
        alias: 'Demo L',
        department_usn: 'CSE(1RV23CS001)',
        test_accuracy: '96%',
        execution_time: '1.4ms',
        base_sprint_points: 1100,
        competitions_attended: 3,
        competitions_won: 2,
        video_reports_approved: 1,
      },
      {
        id: 'coder-3',
        rank: 3,
        student_name: 'Prior Smith',
        department_usn: 'CSE(1MS21CS002)',
        test_accuracy: '96%',
        execution_time: '1.4ms',
        base_sprint_points: 850,
        competitions_attended: 2,
        competitions_won: 1,
        video_reports_approved: 1,
      },
      {
        id: 'coder-4',
        rank: 4,
        student_name: 'Student Participant',
        department_usn: 'CSE(1RV23IS089)',
        test_accuracy: '96%',
        execution_time: '1.4ms',
        base_sprint_points: 600,
        competitions_attended: 1,
        competitions_won: 0,
        video_reports_approved: 1,
      },
    ];

    // Compute dynamic scores based on registered events and Visual Architect confirmed reports
    const extraCompCredits = compRegistrations.length * 80;
    const approvedReportsCount = weeklyReports.filter((r) => r.is_public || r.status === 'SELECTED_FOR_STAGE').length;
    const extraReportCredits = approvedReportsCount * 100;

    const dynamicStandings = defaultCoders
      .map((coder) => {
        let totalBonus = 0;
        let reportsApproved = coder.video_reports_approved;
        let compsAttended = coder.competitions_attended;

        if (coder.alias === 'Demo L' || coder.student_name.includes('Student Participant')) {
          reportsApproved = Math.max(coder.video_reports_approved, approvedReportsCount);
          compsAttended = Math.max(coder.competitions_attended, compRegistrations.length);
          totalBonus = (compsAttended * 80) + (reportsApproved * 100);
        }

        const finalScore = coder.base_sprint_points + totalBonus;
        return {
          ...coder,
          competitions_attended: compsAttended,
          video_reports_approved: reportsApproved,
          sprint_points: `${finalScore} Pts`,
          raw_points: finalScore,
        };
      })
      .sort((a, b) => b.raw_points - a.raw_points)
      .map((coder, idx) => ({
        ...coder,
        rank: idx + 1,
      }));

    const myPosition = dynamicStandings.find((c) => c.alias === 'Demo L' || c.student_name.includes('Student Participant')) || dynamicStandings[0];

    // Profile summary for Demo L / current user
    const userProfile = {
      name: 'Demo L',
      arena_rank: `#${myPosition.rank}`,
      sprint_score: `${myPosition.raw_points} Pts`,
      test_suite_coverage: '98.4%',
      test_assertions_detail: '24/25 test assertions pass',
      avg_execution_time: '1.2ms',
      execution_benchmark: 'Benchmarked on O(N log N)',
      bugs_solved: '12 / 12',
      bug_hunter_badge: 'Bug Hunter Specialist',
      domain_credits_earned: `+${myPosition.raw_points} Pts`,
      rank_bonus_label: `Rank #${myPosition.rank} Leaderboard Standing`,
      competitions_credit_contrib: extraCompCredits > 0 ? `+${extraCompCredits} Pts (Comps)` : '+80 Pts (Comps)',
      video_learning_credit_contrib: `+${extraReportCredits || 100} Pts (Learn Quest & Stage)`,
    };

    return NextResponse.json({
      success: true,
      profile: userProfile,
      standings: dynamicStandings,
    });
  } catch (error: any) {
    console.error('Error fetching soft skills leaderboard:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
