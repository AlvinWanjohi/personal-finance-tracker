import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo Section */}
        <div className="logo" onClick={() => navigate("/")}>
          <h1>Personal Finance</h1>
          <span className="money-emoji">💰</span>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/signup" className="nav-link signup-btn">Sign Up</Link>
          <Link to="/login" className="nav-link login-btn">Log In</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
