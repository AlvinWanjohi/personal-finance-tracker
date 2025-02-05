import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoggedInHomePage from "./pages/LoggedInHomePage";
import DashboardPage from "./pages/DashboardPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import TransactionsPage from "./pages/TransactionsPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ContactSupportPage from "./pages/ContactSupportPage";
import SubscriptionPlans from "./pages/SubscriptionPlans"; // ✅ Import SubscriptionPlans page
import PaymentPage from "./pages/PaymentPage"; // ✅ Import PaymentPage

import Header from "./components/Header";
import LoggedInHeader from "./components/LoggedInHeader";

import { TransactionProvider } from "./context/TransactionContext";
import { useUser } from "./context/UserContext";

import "./App.css";

// ProtectedRoute Component: Ensures that the route is accessible only if the user is logged in
const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    // List of protected and public routes
    const protectedRoutes = ["/dashboard", "/transactions", "/settings", "/loggedin-home", "/subscription-plans", "/payment"];
    const publicRoutes = ["/login", "/signup"];

    // If the user is not logged in and tries to access protected routes, redirect to login
    if (!user && protectedRoutes.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }

    // If the user is logged in and tries to access public routes, redirect to dashboard
    if (user && publicRoutes.includes(location.pathname)) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return <div className="loading">Authenticating...</div>;
  }

  return (
    <>
      {/* Show appropriate header based on whether the user is logged in */}
      {user ? <LoggedInHeader /> : <Header />}

      <TransactionProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/" element={<HomePage />} />

          {/* Private Routes */}
          <Route path="/loggedin-home" element={<ProtectedRoute><LoggedInHomePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/subscription-plans" element={<ProtectedRoute><SubscriptionPlans /></ProtectedRoute>} /> {/* SubscriptionPlans route */}
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} /> {/* PaymentPage route */}

          {/* Contact Support Route */}
          <Route path="/contact-support" element={<ContactSupportPage />} />

          {/* Catch-All Route to redirect to HomePage if no match */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TransactionProvider>
    </>
  );
};

export default App;
