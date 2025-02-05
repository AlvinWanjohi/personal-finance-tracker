import React, { useState } from 'react';
import axios from 'axios';
import './ResetPasswordPage.css'; // Import CSS file

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const token = localStorage.getItem('token');

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5001/reset-password',
        { new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage(response.data.message);
      setIsLoading(false);
    } catch (error) {
      setError('Error resetting password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}
      
      <div className="input-group">
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button
        onClick={handlePasswordReset}
        disabled={isLoading}
        className={isLoading ? 'loading' : ''}
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
    </div>
  );
}

export default ResetPasswordPage;
