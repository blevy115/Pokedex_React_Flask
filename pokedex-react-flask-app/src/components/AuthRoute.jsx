import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const AuthRoute = () => {
  const isAuthenticated = localStorage.getItem("token");
  if (isAuthenticated) {
    return <Navigate to="/pokemon" />;
  }
  return <Outlet />;
};

export default AuthRoute;
