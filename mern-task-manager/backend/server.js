import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

try {
  await connectDB();
  app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
} catch (error) {
  console.error("Failed to start server:", error.message);
  process.exit(1);
}
