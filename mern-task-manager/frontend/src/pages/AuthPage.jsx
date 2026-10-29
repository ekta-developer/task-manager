import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  if (user) return <Navigate to="/" replace />;
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function submit(e) {
    e.preventDefault(); setError("");
    if (isRegister && !form.name.trim()) return setError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Please enter a valid email address.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const { data } = await api.post(endpoint, isRegister ? form : { email: form.email, password: form.password });
      login(data);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect to the server. Check that the backend is running.");
    } finally { setLoading(false); }
  }
  return <main className="auth-layout">
    <section className="auth-aside"><div className="brand brand-light"><span className="brand-mark">✓</span> TaskFlow</div><div className="aside-copy"><p className="eyebrow">YOUR WORK, IN FLOW</p><h1>Small steps.<br />Big progress.</h1><p>Organize your work, focus on what matters, and turn long task descriptions into clear summaries.</p><div className="aside-pill">✦ AI-powered task summaries</div></div><div className="aside-footer">A simple, thoughtful way to get things done.</div></section>
    <section className="auth-main"><div className="auth-card"><div className="brand mobile-brand"><span className="brand-mark">✓</span> TaskFlow</div><p className="eyebrow">{isRegister ? "GET STARTED" : "WELCOME BACK"}</p><h2>{isRegister ? "Create your account" : "Sign in to TaskFlow"}</h2><p className="muted">{isRegister ? "Start organizing your tasks today." : "Pick up where you left off."}</p>
      <form onSubmit={submit} className="auth-form">
        {isRegister && <label>Full name<input name="name" value={form.name} onChange={change} required minLength="2" maxLength="80" placeholder="Your name" autoComplete="name" /></label>}
        <label>Email address<input name="email" type="email" value={form.email} onChange={change} required placeholder="you@example.com" autoComplete="email" /></label>
        <label>Password<input name="password" type="password" value={form.password} onChange={change} required minLength="8" placeholder="At least 8 characters" autoComplete={isRegister ? "new-password" : "current-password"} /></label>
        {error && <div className="alert error-alert" role="alert">{error}</div>}
        <button className="button primary full-button" disabled={loading}>{loading ? "Please wait…" : isRegister ? "Create account →" : "Sign in →"}</button>
      </form>
      <p className="auth-switch">{isRegister ? "Already have an account?" : "New to TaskFlow?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p>
    </div><p className="auth-legal">By continuing, you agree to use TaskFlow responsibly.</p></section>
  </main>;
}
