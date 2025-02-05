import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import minionImage from '../assets/Minion.png';
import './LoggedInHomePage.css';

const LoggedInHomePage = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Navigate to Dashboard for Free Trial Plan, otherwise navigate to SubscriptionPlans page
  const handleSubscribeClick = (plan) => {
    if (plan === "free-trial") {
      // If Free Trial is selected, navigate to Dashboard directly
      navigate("/dashboard");
    } else {
      // If other plans are selected, navigate to SubscriptionPlans
      navigate("/subscription-plans");
    }
  };

  return (
    <div className="loggedin-homepage-container">
      <main className="loggedin-homepage-content">
        <section className="hero-section">
          <h2>Gain Full Control Over Your Finances</h2>

          <div className="hero-content">
            <div className="dashboard-container">
              <div className="dashboard-box">
                <h3>📊 Go to Dashboard</h3>
                <p>View your financial insights and track expenses easily.</p>
              </div>
            </div>

            <div className="minion-container">
              <img src={minionImage} alt="Funny Minion" className="animated-minion" />
            </div>

            <div className="logged-in-message">
              <h3>🎉 Welcome, {user?.username || "User"}!</h3>
              <p>You're all set to take control of your finances. Start tracking your expenses now and make smarter financial decisions.</p>
            </div>
          </div>
        </section>

        {/* Subscription Plans */}
        <section className="subscription-section">
          <h3>Choose Your Plan</h3>
          <p>Get access to automated financial tracking and insights.</p>

          <div className="subscription-container">
            <div className="subscription-card free-trial">
              <h4>🎉 Free Trial</h4>
              <p>Try manual tracking for free.</p>
              <button className="manual-activate" onClick={() => handleSubscribeClick("free-trial")}>
                Activate Manually
              </button>
            </div>

            <div className="subscription-card weekly">
              <h4>📅 Weekly Plan</h4>
              <p>$5 per week</p>
              <p>Automated financial tracking & insights.</p>
              <button className="subscribe-button" onClick={() => handleSubscribeClick("weekly")}>
                Subscribe
              </button>
            </div>

            <div className="subscription-card monthly">
              <h4>📆 Monthly Plan</h4>
              <p>$15 per month</p>
              <p>Comprehensive financial automation.</p>
              <button className="subscribe-button" onClick={() => handleSubscribeClick("monthly")}>
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
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
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Personal Finance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoggedInHomePage;
