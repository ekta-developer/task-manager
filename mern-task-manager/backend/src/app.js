import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true
}));

app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", message: "Task Manager API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
