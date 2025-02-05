import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./context/UserContext"; // Ensure correct hook usage

const PrivateRoute = () => {
  const { user, loading } = useUser(); // Get user and loading state from context

  // Show a loading state if the user data is still being fetched
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or a better UI component
  }

  // If the user is authenticated, render the child routes. Otherwise, redirect to the login page.
  return user ? (
    // Use Outlet to render the child components if the user is authenticated
    <Outlet />
  ) : (
    // If no user (unauthenticated), redirect to the login page
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
