import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';
import { useUser } from '../context/UserContext'; // Use useUser() hook instead of useContext

const HomePage = () => {
  const { user } = useUser(); // Get user from context
  const navigate = useNavigate(); // Hook for navigation

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="homepage-container">
      <main className="homepage-content">
        <section className="hero-section">
          <h2>Gain Full Control Over Your Finances</h2>

          <div className="hero-content">
            {/* Welcome Section for users who are not logged in */}
            <div className="welcome-section">
              <h3>🚀 Welcome to Personal Finance Tracker</h3>
              <p>
                Manage your money like a pro! Sign up today and start tracking your income, expenses, and budgets with ease.
              </p>
              <Link to="/signup" className="get-started-button">
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* Subscription Plans - Visible to all */}
        <section className="subscription-section">
          <h3>Choose Your Plan</h3>
          <p>Get access to automated financial tracking and insights.</p>

          <div className="subscription-container">
            <div className="subscription-card free-trial">
              <h4>🎉 Free Trial</h4>
              <p>Try manual tracking for free.</p>
              <button className="manual-activate">Activate Manually</button>
            </div>

            <div className="subscription-card weekly">
              <h4>📅 Weekly Plan</h4>
              <p>$5 per week</p>
              <p>Automated financial tracking & insights.</p>
              <button className="subscribe-button">Subscribe</button>
            </div>

            <div className="subscription-card monthly">
              <h4>📆 Monthly Plan</h4>
              <p>$15 per month</p>
              <p>Comprehensive financial automation.</p>
              <button className="subscribe-button">Subscribe</button>
            </div>
          </div>
        </section>

        {/* Key Features Section - Visible to all */}
        <section className="features-section">
          <h3>Why Choose Personal Finance Tracker?</h3>
          <div className="features-container">
            <div className="feature">
              <h4>💰 Budget Management</h4>
              <p>Set up budgets and track spending effortlessly.</p>
            </div>
            <div className="feature">
              <h4>📊 Income & Expense Tracking</h4>
              <p>Keep an eye on your financial health in real-time.</p>
            </div>
            <div className="feature">
              <h4>🔐 Secure & Private</h4>
              <p>Your financial data is always protected and secure.</p>
            </div>
          </div>
        </section>

        {/* Call to Action - Only show if NOT logged in */}
        {!user && (
          <Link to="/signup" className="cta-link">
            <section className="cta-section">
              <h3>Start Your Financial Journey Today</h3>
              <p>Sign up and take control of your money with ease.</p>
            </section>
          </Link>
        )}
      </main>

      {/* Footer - Visible to all */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Personal Finance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
