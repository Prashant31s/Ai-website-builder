import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req : NextRequest) {
    try {
        const { messages } = await req.json();

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                // model: "deepseek/deepseek-chat-v3.1:free", // or any deepsseek
                // model: "google/gemini-2.5-flash-preview-09-2025", //gemini paid working
                // model: "google/gemini-2.0-flash-exp:free", //gemini free not working
                // model: 'openai/gpt-oss-20b:free', //free not working
                // model: 'deepseek/deepseek-v3.2-exp', deepseel paid slow resp
                model: 'meta-llama/llama-3.2-3b-instruct:free', //working
                messages,
                stream: true, // enable streaming
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000", // optional
                    "X-Title": "My Next.js App", // optional
                },
                responseType: "stream", // important for streaming
            }
        );

        const stream = response.data;

        // Return as a web stream so frontend can consume
        const encoder = new TextEncoder();

        const readable = new ReadableStream({
            async start(controller) {
                stream.on("data", (chunk: any) => {
                    const payloads = chunk.toString().split("\n\n");
                    for (const payload of payloads) {
                        if (payload.includes("[DONE]")) {
                            controller.close();
                            return;
                        }
                        if (payload.startsWith("data:")) {
                            try {
                                const data = JSON.parse(payload.replace("data:", ""));
                                const text = data.choices[0]?.delta?.content;
                                if (text) {
                                    controller.enqueue(encoder.encode(text));
                                }
                            } catch (err) {
                                console.error("Error parsing stream", err);
                            }
                        }
                    }
                });

                stream.on("end", () => {
                    controller.close();
                });

                stream.on("error", (err: any) => {
                    console.error("Stream error", err);
                    controller.error(err);
                });
            },
        });

        return new NextResponse(readable, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
            },
        });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
