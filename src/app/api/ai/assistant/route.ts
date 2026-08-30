import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const KNOWLEDGE_BASE: Array<{ keywords: string[]; answer: string }> = [
  // 1. Skill Barter
  {
    keywords: ['skill barter', 'barter', 'peer mentorship', 'trade skill', 'teach skill', 'swap skill', 'skill exchange'],
    answer: "In Skill Barter (🤝), students trade skills with peers! You can offer micro-mentorship in web development (React, Next.js), Python, AI/ML, UI/UX design, or DSA. You can schedule 1-on-1 sessions, explore peer video masterclasses, earn Domain 3 credits upon completed reviews, and track peers helped on your profile!",
  },
  {
    keywords: ['barter video', 'masterclass', 'barter chat', 'schedule session'],
    answer: "In Skill Barter, you can browse curated peer masterclasses, chat in real-time with fellow student builders, and schedule live peer learning sessions with automatic credit rewards upon completion!",
  },

  // 2. Soft Skills & Learn Quest
  {
    keywords: ['soft skill', 'soft skills', 'learn quest', 'reflection report', 'stage keynote', 'visual architect', 'ted talk'],
    answer: "Soft Skill features 4 core sections: 1. Competitions (Live debate battles & mystery challenges), 2. Learn Quest (Curated mentor & TED talk video stream with 'What to Notice' guidance), 3. Leaderboard (Live dynamic sprint standings), and 4. Profile (Interactive August 2026 Event Calendar, 12 Grand Master Prestige Badges, and 20 Soft Skills Milestone Badges).",
  },
  {
    keywords: ['weekly report', 'submit report', 'reflection report', 'stage topic', 'evidence vault', 'dossier'],
    answer: "In Learn Quest, watch any mentor or TED talk video and submit your Weekly Reflection Report. Document your summary, deep insights, rhetoric techniques, connected books & movies (like Never Split the Difference or The King's Speech), your unique perspective angle, and attach evidence/media. Top reports approved by Visual Architects win +100 Credits and a 3-minute Live Stage Keynote at Horizon Arena!",
  },
  {
    keywords: ['soft skill badges', 'milestone badges', 'grand master badges', 'badge ladder', 'first voice', 'soft skill legend'],
    answer: "The Soft Skills Achievement Ladder features 32 progressive badges: 12 Grand Master Prestige Badges (Keynote Virtuoso, Impromptu Maestro, Rhetoric Grand Master, etc.) and 20 Soft Skills Milestones (from Level #1 First Voice to Level #20 Soft Skill Legend). You can tap any badge icon to inspect criteria, tier, and credit rewards!",
  },
  {
    keywords: ['soft skills calendar', 'event calendar', 'august 2026', 'sprint round', 'r1 live', 'r2 live', 'r3 live'],
    answer: "The Soft Skills Event Calendar (August 2026) highlights your registered sprint rounds: ⚡ Aug 15 R1 Live Concurrency Sprint (+150 Pts), ⚡ Aug 20 R2 SpeedCode Championship (+80 Pts), and ⚡ Aug 28 R3 Debate Battle Finals (+120 Pts). Tapping any booked date reveals your assigned squad and sprint window!",
  },

  // 3. Coding Challenge / Coding Arena
  {
    keywords: ['coding', 'coding challenge', 'coding arena', 'speed code', 'bug hunt', 'algorithmic', 'test assertion'],
    answer: "The Coding Arena (💻) hosts real-time algorithmic sprints, speed coding, and bug hunt tournaments. Built around 7 software engineering pillars, submissions are benchmarked against live test assertions (e.g. 24/25 assertions, 98.4% coverage, sub-millisecond execution). Earn Domain 2 credits and climb the Algorithmic Leaderboard!",
  },
  {
    keywords: ['coder profile', 'sprint score', 'test suite coverage', 'execution time', 'benchmarked'],
    answer: "Your Coder Profile tracks Arena Rank (#1), Sprint Score (193+ Pts), Test Suite Coverage (98.4%), Avg Execution Time (1.2ms on O(N log N)), Bugs Solved (12/12), and rank bonus points.",
  },

  // 4. Idea Hub
  {
    keywords: ['idea hub', 'idea', 'project idea', 'submit idea', 'founder', 'incubator'],
    answer: "In the Idea Hub (💡), students pitch innovative hardware and software project concepts, recruit interdisciplinary builder squads, receive guidance from Founders and Visual Architects, complete milestones, and earn Domain 1 Credits!",
  },

  // 5. Leaderboards & Credits
  {
    keywords: ['credit', 'credits', 'how to earn credits', 'domain 1', 'domain 2', 'domain 3', 'domain 4'],
    answer: "Credits power the Student Innovation & Credit Engine across 4 domains: Domain 1 (Idea Hub Projects), Domain 2 (Coding Arena Sprints), Domain 3 (Skill Barter Mentorship), and Domain 4 (Soft Skills, Learn Quest & Stage Keynotes). Points dynamically update in real-time when Visual Architects confirm approvals!",
  },
  {
    keywords: ['leaderboard', 'standings', 'rank', 'sprint standings', 'top rank'],
    answer: "The Leaderboard dynamically aggregates student performance across competitions attended/won (+80 to +150 Credits) and Learn Quest weekly reflection reports (+100 Credits). Rankings and sprint scores update in real-time upon Visual Architect confirmation!",
  },

  // 6. Profile & Authentication
  {
    keywords: ['profile', 'extract from skill barter', 'edit profile', 'my submissions'],
    answer: "Your Profile view lets you 1-click sync info via 'Extract from Skill Barter', view telemetry stats (Credits, Peers Helped, Sessions Done, Rating), view collapsible verified reflection report dossiers, book calendar sprint rounds, and inspect your 32 achievement badges!",
  },
  {
    keywords: ['login', 'sign in', 'sign up', 'auth', 'otp', 'register'],
    answer: "Click 'Sign In/Up' in the navigation menu, enter your registered college email, and verify with OTP or password to access your personalized student dashboard, Idea Hub, Coding Arena, Skill Barter, and Soft Skills!",
  },

  // 7. Contact & Support
  {
    keywords: ['contact', 'support', 'help', 'email', 'phone', 'coordinator'],
    answer: "Reach club support via email at b.11.08.bandana@gmail.com. Professor Coordinators: +91 8197613412, +91 8904752677. Student Coordinators: +91 9110412394, +91 9483379575, +91 9148481986.",
  },
];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ reply: "Hello! I'm your ORZYA 3D AI Assistant. How can I help you navigate Skill Barter, Soft Skills, Coding Arena, or Idea Hub today?" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'mock-or-real-gemini-key') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `You are ORZYA AI Assistant, the intelligent 3D robot assistant for the ORZYA Student Club Digital Ecosystem.
You have comprehensive mastery over all 4 club pillars:
1. Skill Barter: Peer skill trading (React, Python, UI/UX, DSA), 1-on-1 scheduling, video masterclasses, peer ratings (★), and Domain 3 credits.
2. Soft Skills & Learn Quest:
   - Competitions: Live debate battles, mystery challenges, and mixed-year squads.
   - Learn Quest: Mentor & TED talk video stream with "What to Notice" guidance, weekly reflection reports with cross-domain book/movie synthesis, evidence media vault, and Visual Architect-approved +100 Credits Live Stage Keynotes at Horizon Arena.
   - Profile & Calendar: August 2026 Sprint Calendar, 12 Grand Master Badges + 20 Soft Skills Milestones (tap-to-inspect).
   - Leaderboard: Dynamic standings computed from competitions attended/won (+80 to +150) and confirmed reports (+100).
3. Coding Challenge / Coding Arena: Algorithmic tournaments, 7 software engineering pillars, speed coding, bug hunts, live test assertions (98.4% coverage, 1.2ms benchmark), and Domain 2 credits.
4. Idea Hub: Student project incubator, founder mentorship, squad recruitment, and Domain 1 credits.
5. Credits & Leaderboard: 4-Domain Credit Engine, real-time recalculation upon Visual Architect confirmation.
6. Support: Contact email b.11.08.bandana@gmail.com and coordinators.

Keep your answers informative, friendly, structured, and concise (2-4 sentences or bullet points).

User query: "${message}"`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        if (text) {
          return NextResponse.json({ reply: text });
        }
      } catch (err) {
        console.warn('Gemini API call failed, using comprehensive local AI knowledge engine:', err);
      }
    }

    // Smart Local AI Engine Matcher
    const lower = message.toLowerCase();
    
    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some((kw) => lower.includes(kw))) {
        return NextResponse.json({ reply: item.answer });
      }
    }

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return NextResponse.json({
        reply: "Hello there! 👋 I'm your ORZYA 3D AI Assistant. I can answer any questions about Skill Barter (🤝), Soft Skills & Learn Quest (🎤), Coding Arena (💻), Idea Hub (💡), or Credits & Leaderboards!"
      });
    }

    return NextResponse.json({
      reply: "I'm here to help you across all ORZYA pillars! You can ask me about Skill Barter micro-mentorship, Soft Skills & Learn Quest reflection reports, Coding Arena algorithmic sprints, Idea Hub projects, earning credits, or checking the leaderboard."
    });
  } catch (error) {
    console.error('AI Assistant API error:', error);
    return NextResponse.json({ reply: "I'm here to help! Ask me anything about Skill Barter, Soft Skills, Coding Challenges, or Idea Hub." });
  }
}
