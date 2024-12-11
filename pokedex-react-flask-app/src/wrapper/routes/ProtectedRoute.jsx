import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { NavBar } from "../../components";
import { ScrollToTop } from "./";

const homeRoute = "/pokemon";

const ProtectedRoute = ({ allowGuest = true }) => {
  const isAuthenticated = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role === "guest" && !allowGuest) {
    return <Navigate to={homeRoute} />;
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
