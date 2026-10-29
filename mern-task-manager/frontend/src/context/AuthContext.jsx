import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("taskflow_token");
    if (!token) { setChecking(false); return; }
    api.get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem("taskflow_token"))
      .finally(() => setChecking(false));
  }, []);

  function login(authData) {
    localStorage.setItem("taskflow_token", authData.token);
    setUser(authData.user);
  }
  function logout() {
    localStorage.removeItem("taskflow_token");
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, checking, login, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
