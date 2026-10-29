// AI provider logic is deliberately separated from the HTTP controller.
async function summarizeWithGemini(description) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing. Add it to backend/.env.");
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Summarize this task description in 1-2 concise sentences. Keep important actions and outcomes. Do not add facts.\n\nTask description:\n${description}` }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 120 }
      })
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Gemini summary request failed.");
  const summary = data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim();
  if (!summary) throw new Error("The AI provider returned an empty summary.");
  return summary;
}

function mockSummary(description) {
  const cleaned = description.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 180) return cleaned;
  const sentence = cleaned.match(/^.{1,175}?(?:[.!?](?=\s|$)|$)/);
  return `${sentence?.[0] || cleaned.slice(0, 175).trim()}${(sentence?.[0] || cleaned.slice(0, 175)).length < cleaned.length ? "…" : ""}`;
}

export async function generateTaskSummary(description) {
  const provider = (process.env.AI_PROVIDER || "mock").toLowerCase();
  if (provider === "gemini") return summarizeWithGemini(description);
  if (provider === "mock") return mockSummary(description);
  throw new Error(`Unsupported AI_PROVIDER "${provider}". Use "mock" or "gemini".`);
}
