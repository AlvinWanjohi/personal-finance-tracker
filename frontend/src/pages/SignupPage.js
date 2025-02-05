import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignupPage.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { fullName, email, password } = formData;

    // Input validation
    if (fullName.trim().length < 3) {
      setErrorMessage("Full name must be at least 3 characters long.");
      return;
    }
    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        username: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Signup successful:", response.data);

      if (response.status === 201) {
        const { token } = response.data;
        localStorage.setItem("jwtToken", token);
        navigate("/logged-in-home");  // Redirect to the LoggedInHomePage
      } else {
        setErrorMessage(response.data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage(error.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1>Join Personal Finance Tracker</h1>
      <p className="signup-description">
        Create an account to start managing your finances efficiently. Track expenses, 
        monitor income, and take control of your financial future.
      </p>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="signup-extra">
        <p>Already have an account?</p>
        <Link to="/login" className="login-btn">Log In</Link>
      </div>

      <div className="signup-benefits">
        <h3>Why Sign Up?</h3>
        <ul>
          <li>✅ Track your income & expenses</li>
          <li>✅ Set budgets and financial goals</li>
          <li>✅ Get real-time insights</li>
          <li>✅ Secure & private transactions</li>
        </ul>
      </div>
    </div>
  );
};

export default SignupPage;
