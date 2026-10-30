// // AI provider logic is deliberately separated from the HTTP controller.
// async function summarizeWithGemini(description) {
//   const apiKey = process.env.GEMINI_API_KEY;
//   if (!apiKey) throw new Error("GEMINI_API_KEY is missing. Add it to backend/.env.");
//   const response = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: `Summarize this task description in 1-2 concise sentences. Keep important actions and outcomes. Do not add facts.\n\nTask description:\n${description}` }] }],
//         generationConfig: { temperature: 0.2, maxOutputTokens: 120 }
//       })
//     }
//   );
//   const data = await response.json();
//   if (!response.ok) throw new Error(data.error?.message || "Gemini summary request failed.");
//   const summary = data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim();
//   if (!summary) throw new Error("The AI provider returned an empty summary.");
//   return summary;
// }

// function mockSummary(description) {
//   const cleaned = description.replace(/\s+/g, " ").trim();
//   if (cleaned.length <= 180) return cleaned;
//   const sentence = cleaned.match(/^.{1,175}?(?:[.!?](?=\s|$)|$)/);
//   return `${sentence?.[0] || cleaned.slice(0, 175).trim()}${(sentence?.[0] || cleaned.slice(0, 175)).length < cleaned.length ? "…" : ""}`;
// }

// export async function generateTaskSummary(description) {
//   const provider = (process.env.AI_PROVIDER || "mock").toLowerCase();
//   if (provider === "gemini") return summarizeWithGemini(description);
//   if (provider === "mock") return mockSummary(description);
//   throw new Error(`Unsupported AI_PROVIDER "${provider}". Use "mock" or "gemini".`);
// }




import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});



export async function summarizeTask(description) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a professional task management assistant.

Your job is to summarize the following task description.

RULES:
- Write a meaningful summary in 2 to 3 sentences.
- Keep the main objective.
- Include important deliverables and measurable targets.
- Use simple, professional English.
- Do not start with generic phrases like "This document outlines".
- Never return an incomplete sentence.
- Do not invent information.

TASK DESCRIPTION:
${description}

Return only the summary.`,
              },
            ],
          },
        ],
        generationConfig: {
          thinkingConfig: {
            thinkingLevel: "low",
          },
          maxOutputTokens: 512,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini API error:", data);
    throw new Error(
      data.error?.message || "Gemini API request failed."
    );
  }

  console.log("Gemini finish reason:", data.candidates?.[0]?.finishReason);
  console.log("Gemini usage:", data.usageMetadata);

  const candidate = data.candidates?.[0];

  const summary = candidate?.content?.parts
    ?.filter((part) => !part.thought && part.text)
    .map((part) => part.text)
    .join("")
    .trim();

  if (!summary || summary.length < 20) {
    throw new Error(
      "Gemini generated an incomplete summary. Please try again."
    );
  }

  if (candidate.finishReason === "MAX_TOKENS") {
    throw new Error("Gemini response was truncated. Please try again.");
  }

  return summary;
}
