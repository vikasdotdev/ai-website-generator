import { db } from "@/config/db";
import { chatTable, frameTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const frameId = searchParams.get('frameId');
  const projectId = searchParams.get('projectId');

  // Validate inputs
  if (!frameId) {
    return NextResponse.json({ error: "Frame ID is required" }, { status: 400 });
  }

  const frameResult = await db.select().from(frameTable)
    //@ts-ignore
    .where(eq(frameTable.frameId, frameId));

  //@ts-ignore
  const chatResult = await db.select().from(chatTable).where(eq(chatTable.frameId, frameId));

  const finalResult = {
    ...frameResult[0],
    chatMessages: chatResult[0]?.chatMessage || []
  };

  return NextResponse.json(finalResult);
}

// ✅ UPDATED PUT FUNCTION TO SAVE DESIGN CODE
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, frameId, designCode } = body; // ✅ Destructure designCode

    if (!frameId || !messages) {
      return NextResponse.json({ error: "Frame ID and messages are required" }, { status: 400 });
    }

    // 1. Update Chat History
    //@ts-ignore
    const existingChat = await db.select().from(chatTable).where(eq(chatTable.frameId, frameId));

    if (existingChat.length > 0) {
      await db.update(chatTable)
        //@ts-ignore
        .set({ chatMessage: messages })
        //@ts-ignore
        .where(eq(chatTable.frameId, frameId));
    } else {
      await db.insert(chatTable).values({
        //@ts-ignore
        frameId: frameId,
        //@ts-ignore
        chatMessage: messages
      });
    }

    // 2. ✅ Update Generated Code in frameTable if it exists
    if (designCode) {
      await db.update(frameTable)
        //@ts-ignore
        .set({ designCode: designCode })
        //@ts-ignore
        .where(eq(frameTable.frameId, frameId));
    }

    return NextResponse.json({ message: "Chat and Design updated successfully" });

  } catch (error) {
    console.error("Error updating chat:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}