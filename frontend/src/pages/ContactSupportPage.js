import React, { useState } from 'react';
import './ContactSupportPage.css'; // Make sure to import the CSS for styling

const ContactSupportPage = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate an API call (replace with actual backend logic)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="contact-support-container">
      <h1 className="title">Contact Support</h1>
      <p className="contact-description">
        If you need assistance, feel free to reach out to us. We're here to help!
      </p>

      <div className="contact-form-container">
        {success === true && <p className="success-message">Your request has been sent successfully!</p>}
        {success === false && <p className="error-message">Something went wrong. Please try again.</p>}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Subject</label>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Message</label>
            <textarea
              placeholder="Describe your issue or question"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </div>

      <div className="additional-contact-info">
        <h2>Other Ways to Contact Us</h2>
        <p>If you'd prefer to contact us via social media or phone, here are some additional options:</p>
        <ul>
          <li><strong>Email:</strong> Personalfinanceteam001@gmail.com</li>
          <li><strong>Phone:</strong> 254-728-967-908</li>
          <li><strong>Social Media:</strong></li>
          <li>Twitter: <a href="https://twitter.com/support" target="_blank" rel="noopener noreferrer">@Support</a></li>
          <li>Facebook: <a href="https://facebook.com/support" target="_blank" rel="noopener noreferrer">Support</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ContactSupportPage;
