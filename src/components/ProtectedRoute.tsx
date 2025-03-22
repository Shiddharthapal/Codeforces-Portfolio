import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { RootState } from "@/redux/store";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Verify token validity on mount and after any auth state changes
    const isValid = checkAuth();
    if (!isValid && isAuthenticated) {
      // If token is invalid but state shows authenticated, logout
      dispatch({ type: "auth/logout" });
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    // Show loading state while checking authentication
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login while preserving the attempted URL
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
function checkAuth(): boolean {
  // Implement your authentication check logic here
  return false; // Temporary return value
}
