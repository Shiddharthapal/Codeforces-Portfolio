import { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import SplashScreen from "./SplashScreen";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { ProtectedRoute } from "./ProtectedRoute";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const ForgotPassword = lazy(() => import("./pages/forgot-password"));
// Add more lazy imports as needed
const Profile = lazy(() => import("./pages/profile"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Route configuration - easily add/modify routes here
const routeConfig = [
  // Public Routes
  {
    path: "/login",
    element: Login,
    protected: false,
  },
  {
    path: "/forgot-password",
    element: ForgotPassword,
    protected: false,
  },
  {
    path: "/reset-password",
    element: Login,
    protected: false,
  },
  {
    path: "/register",
    element: Register,
    protected: false,
  },

  // Protected Routes
  {
    path: "/",
    element: Home,
    protected: true,
  },
  // Add new routes here easily:
  {
    path: "/profile",
    element: Profile,
    protected: true,
  },
];

// Route renderer component
const RouteRenderer = ({ route }: any) => {
  const Component = route.element;

  if (route.protected) {
    return (
      <ProtectedRoute>
        <Component />
      </ProtectedRoute>
    );
  }

  return <Component />;
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <Provider store={store}>
          <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
            <Router>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
  {routeConfig.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={<RouteRenderer route={route} />}
    />
  ))}

  {/* Add a proper 404 page instead of redirect */}
  <Route path="/404" element={<div>Page Not Found</div>} />
  <Route path="*" element={<Navigate to="/404" replace />} />
</Routes>
              </Suspense>
            </Router>
          </PersistGate>
        </Provider>
      )}
    </>
  );
}
