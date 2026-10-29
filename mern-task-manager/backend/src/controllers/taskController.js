import Task from "../models/Task.js";

const allowedStatuses = ["pending", "in-progress", "completed"];
const allowedPriorities = ["low", "medium", "high"];

export async function getTasks(req, res) {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ tasks });
}
export async function getTask(req, res) {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found." });
  res.json({ task });
}
export async function createTask(req, res) {
  const { title, description = "", status = "pending", priority = "medium" } = req.body;
  if (!title?.trim()) return res.status(400).json({ message: "Task title is required." });
  if (!allowedStatuses.includes(status) || !allowedPriorities.includes(priority)) {
    return res.status(400).json({ message: "Invalid status or priority." });
  }
  const task = await Task.create({ user: req.user._id, title: title.trim(), description, status, priority });
  res.status(201).json({ message: "Task created.", task });
}
export async function updateTask(req, res) {
  const updates = {};
  for (const key of ["title", "description", "status", "priority"]) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (updates.title !== undefined && !updates.title.trim()) {
    return res.status(400).json({ message: "Task title cannot be empty." });
  }
  if (updates.status !== undefined && !allowedStatuses.includes(updates.status)) {
    return res.status(400).json({ message: "Invalid status." });
  }
  if (updates.priority !== undefined && !allowedPriorities.includes(updates.priority)) {
    return res.status(400).json({ message: "Invalid priority." });
  }
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id }, updates, { new: true, runValidators: true }
  );
  if (!task) return res.status(404).json({ message: "Task not found." });
  res.json({ message: "Task updated.", task });
}
export async function deleteTask(req, res) {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found." });
  res.json({ message: "Task deleted." });
}
