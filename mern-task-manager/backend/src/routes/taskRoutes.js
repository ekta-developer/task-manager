import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getTasks, getTask, createTask, updateTask, deleteTask } from "../controllers/taskController.js";
const router = Router();
router.use(protect);
router.route("/").get(getTasks).post(createTask);
router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);
export default router;
