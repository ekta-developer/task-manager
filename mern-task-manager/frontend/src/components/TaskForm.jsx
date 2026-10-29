import { useEffect, useState } from "react";

const empty = { title: "", description: "", status: "pending", priority: "medium" };
export default function TaskForm({ initialTask, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initialTask ? {
    title: initialTask.title, description: initialTask.description || "",
    status: initialTask.status, priority: initialTask.priority
  } : empty);
  const [error, setError] = useState("");
  useEffect(() => {
    setForm(initialTask ? { title: initialTask.title, description: initialTask.description || "", status: initialTask.status, priority: initialTask.priority } : empty);
    setError("");
  }, [initialTask]);
  function change(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) { setError("Please enter a task title."); return; }
    setError("");
    await onSave({ ...form, title: form.title.trim() });
  }
  return <form className="task-form" onSubmit={submit}>
    <label>Task title<input name="title" value={form.title} onChange={change} maxLength="120" required placeholder="e.g. Prepare interview notes" /></label>
    <label>Description<textarea name="description" value={form.description} onChange={change} rows="4" maxLength="10000" placeholder="Describe what needs to be done…" /></label>
    <div className="form-grid">
      <label>Status<select name="status" value={form.status} onChange={change}><option value="pending">Pending</option><option value="in-progress">In progress</option><option value="completed">Completed</option></select></label>
      <label>Priority<select name="priority" value={form.priority} onChange={change}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
    </div>
    {error && <p className="error-text">{error}</p>}
    <div className="form-actions"><button className="button primary" disabled={saving}>{saving ? "Saving…" : initialTask ? "Save changes" : "Add task"}</button><button type="button" className="button secondary" onClick={onCancel}>Cancel</button></div>
  </form>;
}
