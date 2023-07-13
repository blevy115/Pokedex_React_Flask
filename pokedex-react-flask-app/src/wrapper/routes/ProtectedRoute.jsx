import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { NavBar } from "../../components";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
