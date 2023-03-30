import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}
