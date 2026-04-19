import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { generateResponse } from "@/lib/ai-client";
import { detectJailbreakAttempt } from "@/lib/jailbreak-detector";
import { checkRateLimit } from "@/lib/rate-limiter";
import { getSettings } from "@/lib/config";

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(500),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .default([]),
});

export async function POST(request: NextRequest) {
  // Rate limiting by IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: `You're sending messages too quickly. Please wait ${rateCheck.retryAfterSeconds} seconds.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
      }
    );
  }

  // Parse and validate request body
  let body;
  try {
    body = ChatRequestSchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "invalid_request", message: "Invalid request body" },
      { status: 400 }
    );
  }

  // Jailbreak detection
  const jailbreakResult = detectJailbreakAttempt(body.message);
  if (jailbreakResult.detected) {
    return NextResponse.json(
      { error: "blocked", message: jailbreakResult.suggestedResponse },
      { status: 400 }
    );
  }

  // Build messages for the LLM
  const settings = getSettings();
  const systemPrompt = buildSystemPrompt();

  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  // Add conversation history (trimmed to max)
  const historySlice = body.history.slice(
    -settings.chat.maxHistoryMessages
  );
  for (const msg of historySlice) {
    messages.push({ role: msg.role, content: msg.content });
  }

  // Add current message
  messages.push({ role: "user", content: body.message });

  // Generate response
  const aiResponse = await generateResponse(messages);

  return NextResponse.json({
    answer: aiResponse.text,
    tokensUsed: {
      input: aiResponse.usage.promptTokens,
      output: aiResponse.usage.completionTokens,
    },
  });
}
