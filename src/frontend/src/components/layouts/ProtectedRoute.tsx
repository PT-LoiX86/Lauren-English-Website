import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/AuthStore";

export const ProtectedRoute = () => {
  // Grab the authentication state from Zustand
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If they are not logged in, redirect to the login page immediately
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, render the child routes
  return <Outlet />;
};
