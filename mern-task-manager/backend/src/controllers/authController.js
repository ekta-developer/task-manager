import bcrypt from "bcryptjs";
import User from "../models/User.js";
import createToken from "../utils/createToken.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Enter a valid email address." });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
    return res.status(201).json({
      message: "Registration successful.",
      token: createToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Email is already registered." });
    return res.status(500).json({ message: "Could not register user." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) return res.status(400).json({ message: "Email and password are required." });
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    return res.json({
      message: "Login successful.",
      token: createToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch {
    return res.status(500).json({ message: "Could not log in. Please try again." });
  }
}

export async function me(req, res) {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } });
}
