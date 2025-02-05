import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('Free');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [security, setSecurity] = useState(false);

  const handleSaveChanges = () => {
    alert('Settings updated successfully!');
  };

  const handleChangePlan = () => {
    // Navigate to the payment page
    navigate('/payment'); // Assuming the payment page route is '/payment'
  };

  return (
    <div className={`settings-container ${darkMode ? 'dark' : ''}`}>
      <h1>Account Settings</h1>
      <p className="settings-description">Update your personal details and preferences.</p>

      {/* Profile Settings */}
      <div className="section">
        <h2>Profile Settings</h2>
        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
      </div>

      {/* Theme Settings */}
      <div className="section">
        <h2>Appearance Settings</h2>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          Enable Dark Mode
        </label>
      </div>

      {/* Subscription Settings */}
      <div className="section">
        <h2>Subscription Settings</h2>
        <p className="current-plan">Current Plan: <strong>{subscriptionPlan}</strong></p>
        <div className="input-group">
          <label>Change Subscription</label>
          <select
            value={subscriptionPlan}
            onChange={(e) => setSubscriptionPlan(e.target.value)}
          >
            <option value="Free">Free</option>
            <option value="Weekly - $5">Weekly - $5</option>
            <option value="Monthly - $15">Monthly - $15</option>
          </select>
        </div>
        <button className="save-btn" onClick={handleChangePlan}>Change Plan</button>
      </div>

      {/* Notification Settings */}
      <div className="section">
        <h2>Notification Settings</h2>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
          Receive Email Notifications
        </label>
      </div>

      {/* Security Settings */}
      <div className="section">
        <h2>Security Settings</h2>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={security}
            onChange={() => setSecurity(!security)}
          />
          Enable Two-Factor Authentication
        </label>
      </div>

      {/* Help & Support */}
      <div className="section">
        <h2>Help & Support</h2>
        <a href="/faq" className="link">FAQ</a>
        <a href="/contact-support" className="link">Contact Support</a>
      </div>
    </div>
  );
};

export default SettingsPage;
