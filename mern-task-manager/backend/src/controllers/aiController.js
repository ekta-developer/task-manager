// import { generateTaskSummary } from "../services/aiSummaryService.js";

// export async function summarizeTask(req, res) {
//   try {
//     const { description } = req.body;
//     if (typeof description !== "string" || !description.trim()) {
//       return res.status(400).json({ message: "Provide a task description to summarize." });
//     }
//     if (description.length > 10000) return res.status(400).json({ message: "Description must be 10,000 characters or fewer." });
//     const summary = await generateTaskSummary(description.trim());
//     res.json({ summary });
//   } catch (error) {
//     console.error("AI summary error:", error.message);
//     res.status(502).json({ message: error.message || "Could not generate a summary. Please try again." });
//   }
// }



import { summarizeTask } from "../services/aiSummaryService.js";

export async function summarizeTaskController(req, res) {
  try {
    const { description } = req.body;

    if (
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        message: "Task description is required.",
      });
    }

    if (description.length > 10000) {
      return res.status(400).json({
        message: "Task description must be under 10,000 characters.",
      });
    }

    const summary = await summarizeTask(description.trim());

    return res.status(200).json({ summary });
  } catch (error) {
    console.error("Gemini summary error:", error.message);

    return res.status(502).json({
      message: "Unable to generate the summary right now.",
    });
  }
}

