
import api from "./axios.js";

export async function generateTaskSummary(description) {
  const { data } = await api.post("/ai/summarize", {
    description,
  });

  return data.summary;
}
