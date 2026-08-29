import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * GET /api/skill-barter/chats
 * Returns all SkillChat sessions where the logged-in student is either
 * the requester or the mentor, with last message and partner info.
 */
export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const chats = await db.skillChat.findMany({
      where: {
        OR: [
          { requester_id: user.id },
          { mentor_id: user.id },
        ],
      },
      include: {
        requester: { select: { id: true, name: true } },
        mentor: { select: { id: true, name: true } },
        request: { select: { id: true, skill: true } },
        messages: {
          orderBy: { sent_at: "desc" },
          take: 1,
          include: { sender: { select: { id: true, name: true } } },
        },
      },
      orderBy: { created_at: "desc" },
    });

    const formatted = chats.map((chat) => {
      const isRequester = chat.requester_id === user.id;
      const partner = isRequester ? chat.mentor : chat.requester;
      const lastMsg = chat.messages[0] || null;

      return {
        id: chat.id,
        status: chat.status,
        skill: chat.request.skill,
        type: isRequester ? "LEARNING" : "TEACHING",
        partner: {
          id: partner.id,
          name: partner.name,
        },
        lastMessage: lastMsg ? lastMsg.text : "Session started — say hello!",
        lastMessageAt: lastMsg ? lastMsg.sent_at : chat.created_at,
        requestId: chat.request_id,
      };
    });

    return NextResponse.json({ chats: formatted });
  } catch (error: any) {
    console.error("GET /api/skill-barter/chats error:", error);
    return NextResponse.json({ error: "Failed to fetch chat sessions" }, { status: 500 });
  }
}
