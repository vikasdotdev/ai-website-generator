import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        // 1. Authenticate user and check credits
        const clerkUser = await currentUser();
        if (!clerkUser || !clerkUser.primaryEmailAddress?.emailAddress) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = clerkUser.primaryEmailAddress.emailAddress;

        // Fetch user from DB
        const userRows = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (!userRows || userRows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = userRows[0];

        // 2. Validate credits
        if ((user.credits ?? 0) <= 0) {
            return NextResponse.json({ error: "Not enough credits" }, { status: 403 });
        }

        // 3. Deduct 1 credit
        await db
            .update(usersTable)
            .set({ credits: sql`${usersTable.credits} - 1` })
            .where(eq(usersTable.email, email));

        // 4. Proceed with AI generation
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openrouter/auto", 
                messages,
                stream: true,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "AI Website Generator",
                },
                responseType: "stream",
            }
        );

        const stream = response.data;
        const encoder = new TextEncoder();

        const readable = new ReadableStream({
            start(controller) {
                let isClosed = false;

                stream.on("data", (chunk: any) => {
                    if (isClosed) return;

                    const payloads = chunk.toString().split("\n\n");
                    for (const payload of payloads) {
                        const cleanPayload = payload.trim();
                        
                        if (cleanPayload.includes("[DONE]")) {
                            if (!isClosed) {
                                isClosed = true;
                                controller.close();
                            }
                            return;
                        }

                        if (cleanPayload.startsWith("data:")) {
                            try {
                                const data = JSON.parse(cleanPayload.replace("data:", ""));
                                const text = data.choices[0]?.delta?.content;
                                if (text) {
                                    controller.enqueue(encoder.encode(text));
                                }
                            } catch (err) {
                                // Silent catch for partial JSON chunks
                            }
                        }
                    }
                });

                stream.on("end", () => {
                    if (!isClosed) {
                        isClosed = true;
                        controller.close();
                    }
                });

                stream.on("error", (err: any) => {
                    if (!isClosed) {
                        isClosed = true;
                        controller.error(err);
                    }
                });
            },
        });

        return new NextResponse(readable, {
            headers: {
                "Content-Type": "text/event-stream; charset=utf-8",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });

    } catch (error: any) {
        // FIXED ERROR HANDLING: No more circular structure errors
        const status = error.response?.status || 500;
        const errorData = error.response?.data;
        
        console.error(`DeepSeek API Error (${status}):`, errorData || error.message);

        return NextResponse.json(
            { error: "Model busy or rate limited. Please try again." }, 
            { status: status }
        );
    }
}