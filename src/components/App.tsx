import Home from "./pages/home";
import About from "./pages/about";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoute from "./ProtectedRoute";
export default function App() {
  const isAboutPage = window.location.pathname.includes("/about/");
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}
