import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mistral-7b-instruct:free", 
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