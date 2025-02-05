import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Personal Finance Tracker. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
