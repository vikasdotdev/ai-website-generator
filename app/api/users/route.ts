// app/api/users/route.ts
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // log request body for debugging
    const body = await req.json().catch(() => ({}));
    console.log("/api/users POST body:", body);

    const clerkUser = await currentUser();
    console.log("/api/users currentUser():", clerkUser);

    if (!clerkUser || !clerkUser.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "No clerk user or email found" }, { status: 400 });
    }

    const email = clerkUser.primaryEmailAddress.emailAddress;
    const name = clerkUser.fullName ?? "NA";
    const defaultCredits = 2;

    // Try to find existing user and select the full row (id, credits, etc.)
    const existingRows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    console.log("existing user rows:", existingRows);

    let created = false;
    // If not exist, insert with credits
    if (!existingRows || existingRows.length === 0) {
      await db.insert(usersTable).values({
        name,
        email,
        credits: defaultCredits,
      });
      created = true;
    }

    // Fetch the user row (fresh) so we can return id and credits reliably
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!rows || rows.length === 0) {
      // This should not happen; return an error if it does
      console.error("User insert seemed to succeed but row not found for email:", email);
      return NextResponse.json({ error: "User not found after insert" }, { status: 500 });
    }

    const userRow = rows[0];

    // Return the important fields (id, email, name, credits) + created flag
    return NextResponse.json({
      id: userRow.id,
      email: userRow.email,
      name: userRow.name,
      credits: userRow.credits,
      created,
    });
  } catch (err) {
    console.error("POST /api/users error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
