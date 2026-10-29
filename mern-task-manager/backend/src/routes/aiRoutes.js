import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { summarizeTask } from "../controllers/aiController.js";
const router = Router();
router.post("/summarize", protect, summarizeTask);
export default router;
