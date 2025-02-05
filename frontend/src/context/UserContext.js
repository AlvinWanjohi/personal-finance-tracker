import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Create UserContext
const UserContext = createContext();

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  // Logout function (wrapped in useCallback to prevent re-renders)
  const logout = useCallback(() => {
    console.log("Logging out...");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    navigate("/login"); // Redirect safely after user state update
  }, [navigate]);

  // Load user from localStorage on app startup
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("jwtToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "user" || event.key === "jwtToken") {
        window.location.reload(); // Ensure consistent auth state across tabs
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Login function
  const login = useCallback((userData, authToken) => {
    if (!userData || !authToken) {
      console.error("❌ Missing user data or token!");
      return;
    }

    localStorage.setItem("jwtToken", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  }, []);

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {loading ? <div className="loading">Authenticating...</div> : children}
    </UserContext.Provider>
  );
};

// Custom hook to access user context
export const useUser = () => useContext(UserContext);
