import { db } from "@/config/db";
import { chatTable, frameTable, projectTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { projectId, frameId, messages, name } = await req.json();
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Create Project
  const projectResult = await db.insert(projectTable).values({
    projectId: projectId,
    name: name || 'Untitled Project',
    createdBy: email
  });

  // Create Frame
  const frameResult = await db.insert(frameTable).values({
    frameId: frameId,
    projectId: projectId,
  });

  // Save user Msg
  const chatResult = await db.insert(chatTable).values({
    chatMessage: messages,
    createdBy: email,
    frameId: frameId
  });

  return NextResponse.json({
    projectId, frameId, messages, name
  });
}

export async function GET(req: NextRequest) {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch projects created by this user and join with their first frame so we can build the PlayGround URL
  const projects = await db
    .select({
      id: projectTable.id,
      projectId: projectTable.projectId,
      name: projectTable.name,
      createdOn: projectTable.createdOn,
      frameId: frameTable.frameId
    })
    .from(projectTable)
    .leftJoin(frameTable, eq(projectTable.projectId, frameTable.projectId))
    .where(eq(projectTable.createdBy, email))
    .orderBy(desc(projectTable.createdOn));

  // Deduplicate frames if necessary (grabbing the most recent frame per project)
  const uniqueProjects = projects.reduce((acc: any[], current) => {
    const x = acc.find((item) => item.projectId === current.projectId);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  return NextResponse.json(uniqueProjects);
}

export async function PUT(req: NextRequest) {
  const { projectId, name } = await req.json();
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!projectId || !name) {
    return NextResponse.json({ error: 'Missing Data' }, { status: 400 });
  }

  await db
    .update(projectTable)
    .set({ name })
    .where(eq(projectTable.projectId, projectId));

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  try {
    const { projectId } = await req.json();
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!projectId) {
      return NextResponse.json({ error: 'Missing Data' }, { status: 400 });
    }

    // 1. First find the frameIds associated with the project to delete chats
    const frames = await db
      .select({ frameId: frameTable.frameId })
      .from(frameTable)
      .where(eq(frameTable.projectId, projectId));

    const frameIds = frames.map(f => f.frameId).filter(Boolean) as string[];

    // 2. Delete chats linked to those frames
    for (const fId of frameIds) {
      await db.delete(chatTable).where(eq(chatTable.frameId, fId));
    }

    // 3. Delete frames linked to the project
    await db.delete(frameTable).where(eq(frameTable.projectId, projectId));

    // 4. Finally delete the project itself
    await db.delete(projectTable).where(eq(projectTable.projectId, projectId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Project Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
