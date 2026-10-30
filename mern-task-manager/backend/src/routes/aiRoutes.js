
import { Router } from "express";
import { summarizeTaskController } from "../controllers/aiController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/summarize",
  protect,
  summarizeTaskController
);

export default router;
