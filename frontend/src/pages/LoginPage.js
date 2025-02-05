import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import axios from "axios";
import { useUser } from "../context/UserContext"; // Import UserContext

const LoginPage = () => {
  const [identifier, setIdentifier] = useState(""); // Handles both email & username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useUser(); // Get login function from UserContext

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loginData = identifier.includes("@")
        ? { email: identifier, password }
        : { username: identifier, password };

      const response = await axios.post(
        "http://localhost:5000/api/login",
        loginData
      );

      console.log("Full API Response:", response.data); // Debugging API response

      const { access_token, user } = response.data; // Extract token & user from API response

      if (!access_token) {
        throw new Error("No token received from server");
      }

      // Store token & user info in localStorage
      localStorage.setItem("jwtToken", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update UserContext with logged-in user
      login(user);

      // Redirect to LoggedInHomePage
      navigate("/loggedin-home");
    } catch (err) {
      console.error("Login error:", err); // Log the full error for debugging
      setError(err?.response?.data?.error || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome Back!</h1>
      <p className="login-description">
        Log in to access your finance dashboard and manage your money.
      </p>

      <form className="login-form" onSubmit={handleLogin}>
        <label htmlFor="identifier">Username or Email</label>
        <input
          type="text"
          id="identifier"
          name="identifier"
          placeholder="Enter your username or email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          autoComplete="username"
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="login-extra">
        <p>Don't have an account?</p>
        <Link to="/signup" className="signup-btn">
          Sign Up
        </Link>
        <p>
  <button
    type="button"
    className="forgot-password-btn"
    onClick={() => navigate("/reset-password")}
  >
    Forgot Password?
  </button>
</p>


      </div>
    </div>
  );
};

export default LoginPage;
