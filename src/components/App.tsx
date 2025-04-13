import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { ProtectedRoute } from "./ProtectedRoute";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/home"));
const About = lazy(() => import("./pages/about"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const CreateAc = lazy(() => import("./pages/createAc"));
const EditAc = lazy(() => import("./pages/editAc"));
const UserProfile = lazy(() => import("./pages/user"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/about/:id"
                element={
                  <ProtectedRoute>
                    <About />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/createAc"
                element={
                  <ProtectedRoute>
                    <CreateAc />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/editAc"
                element={
                  <ProtectedRoute>
                    <EditAc />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Route - Redirect to home if no match */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </PersistGate>
    </Provider>
  );
}
