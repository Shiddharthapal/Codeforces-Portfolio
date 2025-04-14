import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAppSelector((state) => state.auth);
  const storedToken = localStorage.getItem("authToken");

  if (!token && !storedToken) {
    // Redirect to login if no token in Redux or localStorage
    return <Navigate to="/login" replace />;
  }

  return children;
}
