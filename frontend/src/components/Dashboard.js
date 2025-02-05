import React from 'react';
import Header from '../components/Header';  // Import Header
import Footer from '../components/Footer';  // Import Footer
import Sidebar from '../components/Sidebar'; // Import Sidebar
import './DashboardPage.css'; // Import page-specific styles

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <Header />  {/* Header component at the top */}
      <div className="dashboard-content">
        <Sidebar /> {/* Sidebar for navigation */}
        <main className="main-content">
          <h2>Welcome to the Dashboard</h2>
          <p>Manage your finances with ease.</p>
        </main>
      </div>
      <Footer /> {/* Footer component at the bottom */}
    </div>
  );
};

export default DashboardPage;
