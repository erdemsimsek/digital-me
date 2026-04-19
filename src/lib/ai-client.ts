import { z } from "zod";
import { getSettings } from "./config";

const OpenRouterResponseSchema = z.object({
  id: z.string(),
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string().nullable(),
      }),
    })
  ),
  usage: z
    .object({
      prompt_tokens: z.number().optional(),
      completion_tokens: z.number().optional(),
      total_tokens: z.number().optional(),
    })
    .optional(),
  model: z.string(),
});

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

export interface AIResponse {
  text: string;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  model: string;
  degraded: boolean;
}

export async function generateResponse(
  messages: Array<{ role: string; content: string }>,
): Promise<AIResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return {
      text: "I'm currently unavailable. The site owner needs to configure the API key.",
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      model: "none",
      degraded: true,
    };
  }

  const settings = getSettings();
  const { model, temperature, maxTokens, maxRetries } = settings.ai;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.SITE_URL ?? "https://digital-me.dev",
            "X-Title": process.env.SITE_NAME ?? "Digital Me",
          },
          body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens }),
        },
        15000
      );

      if (!response.ok) {
        if (isRetryableStatus(response.status) && attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
          continue;
        }
        const errorBody = await response.text().catch(() => "Unknown error");
        throw new Error(`OpenRouter API error: ${response.status} - ${errorBody}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`OpenRouter error: ${data.error.message || JSON.stringify(data.error)}`);
      }

      const parsed = OpenRouterResponseSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`Invalid response format: ${parsed.error.message}`);
      }

      return {
        text: parsed.data.choices[0]?.message?.content ?? "",
        usage: {
          promptTokens: parsed.data.usage?.prompt_tokens ?? 0,
          completionTokens: parsed.data.usage?.completion_tokens ?? 0,
          totalTokens: parsed.data.usage?.total_tokens ?? 0,
        },
        model: parsed.data.model,
        degraded: false,
      };
    } catch (error) {
      if (attempt >= maxRetries) {
        console.error("[ai-client] All retries failed:", error);
        return {
          text: "I'm experiencing technical difficulties. Please try again in a moment.",
          usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
          model: "none",
          degraded: true,
        };
      }
    }
  }

  // Should never reach here, but TypeScript needs it
  return {
    text: "An unexpected error occurred. Please try again.",
    usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    model: "none",
    degraded: true,
  };
}
