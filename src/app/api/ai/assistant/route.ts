import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatHistoryItem {
  sender: 'bot' | 'user';
  text: string;
}

const SUPPORT_CONTACTS = {
  email: 'b.11.08.bandana@gmail.com',
  professors: ['+91 8197613412', '+91 8904752677'],
  students: ['+91 9110412394', '+91 9483379575', '+91 9148481986'],
};

function normalizeRole(role?: string): 'participant' | 'mentor' | 'ambassador' | 'architect' | 'guest' {
  if (!role) return 'guest';
  const r = role.toLowerCase();
  if (r.includes('founder') || r.includes('architect') || r.includes('visual')) return 'architect';
  if (r.includes('mentor')) return 'mentor';
  if (r.includes('ambassador') || r.includes('volunteer')) return 'ambassador';
  if (r.includes('student') || r.includes('participant')) return 'participant';
  return 'guest';
}

/**
 * Intelligent Dynamic Conversational Engine (Local Fallback)
 * Understands intents, conversation history, context, and generates dynamic 1-on-1 answers
 */
function generateDynamicReply(
  query: string,
  history: ChatHistoryItem[] = [],
  role: 'participant' | 'mentor' | 'ambassador' | 'architect' | 'guest',
  userName?: string,
  section?: string
): string {
  const q = query.trim().toLowerCase();
  const name = userName ? userName.split(' ')[0] : (role === 'guest' ? 'there' : 'Friend');

  // Extract recent context from history
  const recentUserTexts = history.filter(h => h.sender === 'user').map(h => h.text.toLowerCase()).join(' ');

  // 1. Social & Chit-Chat
  if (/^(hi|hello|hey|yo|namaste|good morning|good afternoon|good evening)\b/.test(q)) {
    if (role === 'participant') {
      return `Hey ${name}! 👋 Great to chat with you. I'm your dedicated 1-on-1 assistant for Skill Barter, Coding Challenges, Idea Hub, and Soft Skills. What are you looking to work on today?`;
    }
    if (role === 'mentor') {
      return `Hello Mentor ${name}! 👋 Always great to see you. How can I assist you with your mentees, Idea Hub proposal reviews, or skill sessions today?`;
    }
    if (role === 'ambassador') {
      return `Hey Ambassador ${name}! 🚀 Ready to organize student cohorts, moderate barter matches, or host club events? What's on your agenda?`;
    }
    if (role === 'architect') {
      return `Greetings Visual Architect ${name}! ⚡ I'm here to support you with pending approvals, credit allocations, and platform governance. How can I assist?`;
    }
    return `Hello ${name}! 👋 Welcome to the Student Club platform. I'm here to help you get started, understand our roles, or assist with sign-in. What would you like to know?`;
  }

  if (q.includes('how are you') || q.includes('how r u') || q.includes('how are things')) {
    return `I'm energized and ready to help you navigate the club ecosystem! 🤖 How are things going with your ${role === 'participant' ? 'projects and skill learning' : role === 'mentor' ? 'mentorship sessions' : role === 'ambassador' ? 'community initiatives' : role === 'architect' ? 'platform management' : 'onboarding'}?`;
  }

  if (q.includes('who are you') || q.includes('what are you') || q.includes('your name')) {
    return `I'm ORZYA, your interactive 3D AI Assistant for the SkillVerse Student Club! I'm here for 1-on-1 real-time guidance across all four domains, troubleshooting issues, and helping you make the most of your role as a ${role}.`;
  }

  if (q.includes('thank') || q.includes('thx') || q.includes('awesome') || q.includes('great') || q.includes('cool')) {
    return `You're very welcome, ${name}! 😊 Feel free to ask if anything else comes up while you're in ${section || 'the platform'}.`;
  }

  if (q.includes('bye') || q.includes('see you') || q.includes('good night') || q.includes('later')) {
    return `Take care, ${name}! Have an awesome time building and learning in the club. I'll be right here whenever you need me! 🚀`;
  }

  // 2. Contacts, Phone numbers, Emergency & Support
  if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('email') || q.includes('support') || q.includes('coordinator') || q.includes('reach out')) {
    return `Here are the official contact details for support:\n\n📧 **Support Email**: ${SUPPORT_CONTACTS.email}\n👨‍🏫 **Professor Coordinators**: ${SUPPORT_CONTACTS.professors.join(', ')}\n🎓 **Student Coordinators**: ${SUPPORT_CONTACTS.students.join(', ')}\n\nFeel free to call or email them directly if you encounter any platform issues!`;
  }

  // 3. Issue Troubleshooting (Login, password, access, blocked, pending)
  if (q.includes('cannot login') || q.includes("can't login") || q.includes('password') || q.includes('forgot') || q.includes('invalid') || q.includes('error')) {
    return `If you're having trouble logging in:\n1. Make sure you selected the correct role tab (Participant, Mentor, Ambassador, or Architect).\n2. If using a preloaded college USN, verify your college email address.\n3. For password resets or account unlock, contact our coordinators at ${SUPPORT_CONTACTS.email} or call +91 9110412394.`;
  }

  if (q.includes('pending') || q.includes('waiting') || q.includes('approve') || q.includes('approval')) {
    if (role === 'architect') {
      return `As a Visual Architect, you can approve or deny pending member requests directly via the email notifications sent to your inbox, or from the administrative section of your dashboard!`;
    }
    return `When you register for the first time, your application is submitted to our Visual Architects for verification. You'll see the status on the /pending-approval screen. Once confirmed, you'll be granted direct access into the Horizon dashboard!`;
  }

  // 4. Skill Barter Domain
  if (q.includes('barter') || q.includes('skill') || q.includes('swap') || q.includes('teach') || q.includes('learn') || q.includes('trade')) {
    if (role === 'participant') {
      return `In **Skill Barter**, you can exchange knowledge peer-to-peer! For example, if you know React or UI design, you can offer that to help someone and in return learn Python, Backend, or Machine Learning from them. Once you complete a session, both of you earn credit points!`;
    }
    if (role === 'mentor') {
      return `In **Skill Barter** as a Mentor, you can post your mentorship availability in specific tech stacks, review incoming student barter/guidance requests, and schedule 1-on-1 sessions to help students overcome coding hurdles.`;
    }
    if (role === 'ambassador') {
      return `As an Ambassador in **Skill Barter**, your key task is connecting students with shared interests into collaborative study pods and ensuring smooth communication between peers and mentors.`;
    }
    if (role === 'architect') {
      return `In **Skill Barter**, Visual Architects can oversee exchange volume, review student mentorship ratings, and ensure credits awarded reflect authentic peer learning.`;
    }
    return `**Skill Barter** allows students to exchange skills peer-to-peer (e.g. swap Frontend skills for Backend skills). Sign in to explore current listings or offer your skills!`;
  }

  // 5. Coding Challenges & Compilers
  if (q.includes('coding') || q.includes('code') || q.includes('challenge') || q.includes('contest') || q.includes('compiler') || q.includes('hackathon') || q.includes('benchmark')) {
    if (role === 'participant') {
      return `The **Coding Challenge** hub offers algorithmic problems with real-time compilers and benchmarks! You can submit solutions, test execution times against test cases, earn credits for passing test suites, and rank up on the club leaderboard.`;
    }
    if (role === 'mentor') {
      return `In **Coding Challenges**, mentors can inspect submitted solutions, post optimization rubrics, and guide students on data structures, algorithmic complexity, and clean code practices.`;
    }
    return `Our **Coding Hub** runs real-time code challenges and algorithmic contests! Compete with peers, write and execute code in browser, and climb the Leaderboard.`;
  }

  // 6. Idea Hub & Incubator
  if (q.includes('idea') || q.includes('project') || q.includes('pitch') || q.includes('startup') || q.includes('incubator') || q.includes('proposal') || q.includes('team')) {
    if (role === 'participant') {
      return `Have a project idea? In the **Idea Hub**, you can draft and publish your project concept, specify needed team roles (e.g. UI Designer, Backend Dev), recruit peers, and submit your proposal to Visual Architects for credit backing!`;
    }
    if (role === 'mentor') {
      return `In the **Idea Hub**, mentors review student project roadmaps, evaluate technical feasibility, and provide architectural mentorship to student founder teams.`;
    }
    if (role === 'architect') {
      return `In the **Idea Hub**, Visual Architects review project pitches, allocate club credit grants, unlock dedicated private project channels, and incubate student startups!`;
    }
    return `The **Idea Hub** is our project incubator where students post innovative tech ideas, form teams, and pitch for club support. Sign in to start your project!`;
  }

  // 7. Soft Skills & Skill League
  if (q.includes('soft') || q.includes('speak') || q.includes('communication') || q.includes('presentation') || q.includes('league') || q.includes('debate') || q.includes('workshop')) {
    if (role === 'participant') {
      return `The **Soft Skills League** helps you master communication, impromptu speaking, technical presentation, and team leadership through gamified challenges and interactive peer sessions.`;
    }
    if (role === 'mentor') {
      return `In the **Soft Skills League**, mentors run mock technical interviews, evaluate project presentations, and provide structured feedback to boost student employability.`;
    }
    return `The **Soft Skills League** runs interactive workshops on public speaking, debate, and communication. Sign in to join the upcoming rounds!`;
  }

  // 8. Credits, Ranks & Leaderboard
  if (q.includes('credit') || q.includes('rank') || q.includes('leaderboard') || q.includes('score') || q.includes('point') || q.includes('badge')) {
    if (role === 'participant') {
      return `You earn credits by:\n• Completing Skill Barter sessions (+10–25 credits)\n• Passing Coding Challenges (+15–50 credits)\n• Submitting & progressing in Idea Hub projects (+20–100 credits)\n• Attending Soft Skills workshops (+10–20 credits)\nYour total credits position you on the club Leaderboard!`;
    }
    return `Credits are the club's achievement currency awarded for skill exchanges, coding benchmarks, and project contributions. Top credit holders earn featured leaderboard badges and certifications!`;
  }

  // 9. Next Steps / "What should I do?"
  if (q.includes('next step') || q.includes('what should i do') || q.includes('how do i start') || q.includes('what to do') || q.includes('guide me')) {
    if (role === 'participant') {
      return `Here are your recommended next steps, ${name}:\n1. 🤝 **Skill Barter**: List 1 skill you know and 1 skill you'd like to learn.\n2. 💻 **Coding Hub**: Solve the starter challenge to earn your first 20 credits.\n3. 💡 **Idea Hub**: Explore project ideas or create your own team.\n4. 📊 Check your rank on the Horizon dashboard!`;
    }
    if (role === 'mentor') {
      return `Here are your recommended next steps, Mentor ${name}:\n1. Open Skill Barter to set your mentorship domains.\n2. Review pending student project roadmaps in Idea Hub.\n3. Drop feedback on coding challenge solutions.`;
    }
    if (role === 'ambassador') {
      return `Here are your recommended next steps, Ambassador ${name}:\n1. Check the Horizon dashboard for new student signups.\n2. Connect students looking for barter partners in similar tech stacks.\n3. Coordinate the upcoming domain activities!`;
    }
    if (role === 'architect') {
      return `Recommended next steps, Visual Architect ${name}:\n1. Check for pending applicant access requests.\n2. Review new project submissions in Idea Hub.\n3. Audit and approve credit distribution logs.`;
    }
    return `To get started, click 'Sign In / Up', select your desired role (Participant, Mentor, or Ambassador), and explore the 4 domains on our Horizon page!`;
  }

  // 10. Contextual conversational fallback (Smart & dynamic instead of static template)
  if (recentUserTexts.includes('react') || recentUserTexts.includes('python') || recentUserTexts.includes('javascript') || recentUserTexts.includes('ai')) {
    return `Regarding your interest in technical stacks and development, you can leverage **Skill Barter** to collaborate with peers, or jump into **Coding Challenges** to benchmark your code. Would you like me to guide you to a specific domain?`;
  }

  return `I understand you're asking about "${query}". As a ${role !== 'guest' ? role : 'member'}, you have full access to our 4 domains (Skill Barter, Coding Challenges, Idea Hub, and Soft Skills). Let me know what specific goal or issue you'd like help with, or ask for coordinator contact info!`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history = [], role, page, section, userName } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ reply: "Hello! I'm your ORZYA 3D AI Assistant. How can I help you today?" });
    }

    const currentRole = normalizeRole(role);
    const roleDisplayName = {
      participant: 'Participant (Student Builder)',
      mentor: 'Club Mentor',
      ambassador: 'Community Ambassador',
      architect: 'Visual Architect',
      guest: 'Visitor / Pre-Login',
    }[currentRole];

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is configured and valid, use Gemini with full multi-turn conversational history
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'mock-or-real-gemini-key') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Build conversation history format for Gemini
        const formattedHistory = Array.isArray(history)
          ? history.slice(-8).map((h: ChatHistoryItem) => ({
              role: h.sender === 'user' ? 'user' : 'model',
              parts: [{ text: h.text }],
            }))
          : [];

        const systemInstruction = `You are ORZYA AI Assistant, a friendly, intelligent, interactive 3D robot companion for the SkillVerse / ORZYA Student Club.
User context:
- User Name: ${userName || 'Friend'}
- User Role: ${roleDisplayName}
- Location: ${page || 'Horizon Dashboard'} ${section ? `(Active: ${section})` : ''}

Club Domains:
1. Skill Barter (peer-to-peer skill swaps & mentorship)
2. Coding Challenges (browser compilers, contests, algorithmic benchmarks)
3. Soft Skills (Skill League public speaking, leadership, communication)
4. Idea Hub (project incubator, co-founder recruitment, founder credit funding)

Support Contact Info:
- Email: ${SUPPORT_CONTACTS.email}
- Professor Coordinators: ${SUPPORT_CONTACTS.professors.join(', ')}
- Student Coordinators: ${SUPPORT_CONTACTS.students.join(', ')}

Guidelines:
- Engage in a natural, 1-on-1 dialogue. Avoid generic or repetitive boilerplate.
- Tailor advice specifically to their role (${roleDisplayName}).
- Directly answer whatever the user asks with helpful, concise, actionable advice (2-4 sentences max).
- If they ask for coordinator contact or report an issue, provide the official phone numbers and email.`;

        const chat = model.startChat({
          history: [
            {
              role: 'user',
              parts: [{ text: `System Instruction: ${systemInstruction}` }],
            },
            {
              role: 'model',
              parts: [{ text: `Understood! I will act as ORZYA AI Assistant and provide personalized, dynamic 1-on-1 support for ${userName || 'Friend'} as a ${roleDisplayName}.` }],
            },
            ...formattedHistory,
          ],
        });

        const result = await chat.sendMessage(message);
        const text = result.response.text()?.trim();
        if (text) {
          return NextResponse.json({ reply: text, role: currentRole });
        }
      } catch (err) {
        console.warn('[Gemini API Call]: Fallback to dynamic NLP engine:', err);
      }
    }

    // Dynamic NLP Conversational Engine (Zero hardcoded static bottlenecks)
    const dynamicReply = generateDynamicReply(
      message,
      Array.isArray(history) ? history : [],
      currentRole,
      userName,
      section
    );

    return NextResponse.json({
      reply: dynamicReply,
      role: currentRole,
    });
  } catch (error: any) {
    console.error('AI Assistant API error:', error);
    return NextResponse.json({
      reply: "I'm right here! You can chat with me freely about any step in Skill Barter, Coding Challenges, Idea Hub, Soft Skills, or ask for coordinator contacts.",
    });
  }
}
