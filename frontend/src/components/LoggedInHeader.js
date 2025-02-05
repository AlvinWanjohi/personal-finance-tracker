import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoggedInHeader.css'; // Import styles
import { useUser } from '../context/UserContext'; // Import user context

const LoggedInHeader = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useUser(); // Get logout function
  const navigate = useNavigate();

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logout(); // Call logout function from context
    navigate('/'); // Redirect to home page
    window.location.reload(); // Ensure the header updates
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo Section */}
        <div className="logo">
          <h1>Personal Finance</h1>
          <span className="money-emoji">💰</span>
        </div>

        {/* Navigation Links for logged-in users */}
        <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/loggedin-home">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/settings">Settings</Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu} 
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default LoggedInHeader;
