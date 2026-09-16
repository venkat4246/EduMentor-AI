import { GoogleGenAI } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("Note: GEMINI_API_KEY is not set in environment. High-availability fallbacks will be used.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key-fallback",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Ordered by availability and resilience to high-demand spikes
// gemini-3.1-flash-lite has the highest throughput capacity and lowest 503 congestion rate
export const GEMINI_MODEL = "gemini-3.1-flash-lite";
export const GEMINI_FALLBACK_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash",
];

export function cleanErrorMessage(err: any): string {
  if (!err) return "Service temporarily unavailable.";
  let msg = err.message || String(err);
  try {
    const parsed = JSON.parse(msg);
    if (parsed?.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // not JSON formatted
  }
  return msg;
}

export async function generateContentWithFallback(params: {
  contents: any;
  config?: any;
}) {
  const ai = getGeminiClient();
  const modelsToTry = [GEMINI_MODEL, ...GEMINI_FALLBACK_MODELS];

  let lastError: any = null;

  for (const model of modelsToTry) {
    // Try up to 2 attempts per model with short backoff
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        if (response) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const msg = cleanErrorMessage(err);
        const isUnavailable = msg.includes("high demand") || msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("429");

        // If it's a temporary demand spike, wait briefly before retrying or switching
        if (isUnavailable && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 250));
          continue;
        }
        // Move to next model
        break;
      }
    }
  }

  throw new Error(cleanErrorMessage(lastError));
}
