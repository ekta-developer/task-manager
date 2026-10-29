
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, checking } = useAuth();

  if (checking) {
    return <p style={{ padding: "24px" }}>Checking authentication...</p>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
