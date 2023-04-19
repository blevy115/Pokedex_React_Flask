import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function AuthRoute() {
  const isAuthenticated = localStorage.getItem("token");
  if (isAuthenticated) {
    return <Navigate to="/pokemon" />;
  }
  return <Outlet />;
}
