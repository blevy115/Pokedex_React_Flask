import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { NavBar } from "../../components";
import { ScrollToTop } from "./";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <ScrollToTop />
      <NavBar />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
