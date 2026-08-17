import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const KNOWLEDGE_BASE: Record<string, string> = {
  barter: "In Skill Barter, you can trade your skills with peers! Offer mentorship in topics like React, Python, or UI Design, and learn new skills from fellow students.",
  skill: "In Skill Barter, you can trade your skills with peers! Offer mentorship in topics like React, Python, or UI Design, and learn new skills from fellow students.",
  idea: "In the Idea Hub, you can submit innovative project ideas, recruit team members, and get mentorship and credits from Founders!",
  project: "In the Idea Hub, you can submit innovative project ideas, recruit team members, and get mentorship and credits from Founders!",
  credit: "Credits are earned through competition rankings, completing skill-barter mentorship sessions, and contributing to student projects. Check the Leaderboard to see top ranks!",
  contact: "You can reach support via email at b.11.08.bandana@gmail.com, or phone at +91 8197613412 (Professor), +91 9110412394, +91 9483379575, or +91 9148481986 (Student).",
  phone: "Contact phone numbers: +91 8197613412 (Professor), +91 9110412394 (Student), +91 9483379575 (Student), +91 9148481986 (Student).",
  number: "Contact phone numbers: +91 8197613412 (Professor), +91 9110412394 (Student), +91 9483379575 (Student), +91 9148481986 (Student).",
  leaderboard: "The Leaderboard showcases student ranks, total credits earned, and badges across Domain 1, 2, 3, and 4.",
  rank: "The Leaderboard showcases student ranks, total credits earned, and badges across Domain 1, 2, 3, and 4.",
  login: "Click 'Sign In/Up' in the menu, enter your registered college email, and verify with OTP or password to access your dashboard.",
  sign: "Click 'Sign In/Up' in the menu, enter your registered college email, and verify with OTP or password to access your dashboard.",
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ reply: "Hello! I'm your ANVAYA 3D AI Assistant. How can I help you today?" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'mock-or-real-gemini-key') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `You are ANVAYA AI Assistant, a friendly 3D robot assistant for the ANVAYA Student Club Digital Ecosystem.
Your goal is to assist students with navigation, skill barter, idea hub, coding challenges, leaderboards, credits, and support.
Keep your response concise (2-4 sentences max), friendly, and helpful.

User query: "${message}"`;
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        if (text) {
          return NextResponse.json({ reply: text });
        }
      } catch (err) {
        console.warn('Gemini API call failed, using local AI knowledge engine:', err);
      }
    }

    // Smart Local AI Engine fallback
    const lower = message.toLowerCase();
    for (const [key, answer] of Object.entries(KNOWLEDGE_BASE)) {
      if (lower.includes(key)) {
        return NextResponse.json({ reply: answer });
      }
    }

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return NextResponse.json({
        reply: "Hello there! 👋 I'm your ANVAYA 3D AI Assistant. Ask me anything about Skill Barter, Idea Hub, Leaderboards, or Support!"
      });
    }

    return NextResponse.json({
      reply: "I'm here to assist you with ANVAYA! You can ask me about Skill Barter, submitting Project Ideas, earning Credits, checking Leaderboards, or reaching Support."
    });
  } catch (error) {
    console.error('AI Assistant API error:', error);
    return NextResponse.json({ reply: "I'm having a brief glitch, but I'm here! Try asking about Skill Barter or Project Ideas." });
  }
}
