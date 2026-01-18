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
import Home from "./pages/home"
import Login from "./pages/login";
import Register from "./pages/register";
import ProfilePage from "./pages/profile";
import ForgotPassword from "./pages/forgot-password";
import Layout from "@/layouts/Layout.astro";
// Add more lazy imports as needed


// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);



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
            
            
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route
            path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage/>
                </ProtectedRoute>
              }
            />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              
            </Routes>
              </Suspense>
            </Router>
          </PersistGate>
        </Provider>
      )}
    </>
  );
}
