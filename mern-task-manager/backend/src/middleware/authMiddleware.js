import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required. Please log in." });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id name email");
    if (!user) return res.status(401).json({ message: "User account was not found." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
}
