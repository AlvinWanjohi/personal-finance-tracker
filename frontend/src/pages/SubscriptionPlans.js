import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './SubscriptionPlans.css';

const SubscriptionPlans = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const handlePlanSelection = (planType) => {
    if (planType === 'weekly' || planType === 'monthly') {
      navigate('/payment'); // Navigate to Payment Page for Weekly or Monthly plan
    } else if (planType === 'free-trial') {
      navigate('/dashboard'); // Navigate to Dashboard Page for Free Trial
    }
  };

  return (
    <div className="subscription-plans-container">
      <h1 className="subscription-title">Choose Your Plan</h1>
      <p className="subscription-description">
        Select the plan that works best for you and start your journey toward smarter financial management. All plans come with full access to our automated tracking features and insights, tailored to your needs.
      </p>

      <div className="plans-grid">
        {/* Free Trial Plan */}
        <div className="subscription-card free-trial">
          <h2>Free Trial</h2>
          <p>No charge for the first 7 days. Get started with manual tracking and explore all features at no cost. It's the perfect way to test the waters and see how our platform works for you.</p>
          <div className="price">$0</div>
          <button
            className="subscribe-button"
            onClick={() => handlePlanSelection('free-trial')}
          >
            Start Free Trial
          </button>
        </div>

        {/* Weekly Plan */}
        <div className="subscription-card weekly">
          <h2>Weekly Plan</h2>
          <p>Pay weekly for quick, convenient access to automated financial tracking and insights. This is a great option if you're looking for a short-term solution and want flexibility.</p>
          <div className="price">$5 / week</div>
          <button
            className="subscribe-button"
            onClick={() => handlePlanSelection('weekly')}
          >
            Subscribe Now
          </button>
        </div>

        {/* Monthly Plan - Best Value */}
        <div className="subscription-card monthly">
          <h2>Monthly Plan</h2>
          <p>Enjoy automated financial tracking and insights, billed monthly. Ideal for consistent users who want to save money with continuous access to all our tools and features.</p>
          <div className="price">$15 / month</div>
          <span className="best-value">Best Value</span>
          <button
            className="subscribe-button"
            onClick={() => handlePlanSelection('monthly')}
          >
            Go Pro Now
          </button>
          <div className="discount-text">Save 10% with yearly subscription!</div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="additional-info">
        <h3>Why Choose Our Plans?</h3>
        <p>Our subscription options cater to a variety of users, whether you need a quick test with the Free Trial or long-term financial insights with our Monthly Plan. All our plans include:</p>
        <ul>
          <li>Automated expense tracking</li>
          <li>Real-time financial insights and budgeting tools</li>
          <li>Access to detailed reports and analytics</li>
          <li>Customizable categories to track income and expenses</li>
        </ul>

        {/* Testimonials */}
        <h3>Customer Testimonials</h3>
        <p>See how our users are benefiting from our plans:</p>
        <div className="testimonials">
          <div className="testimonial">
            <p>"The Weekly Plan has been amazing for keeping me on track. It’s affordable and gives me the insights I need to manage my finances better!"</p>
            <strong>- Sarah T.</strong>
          </div>
          <div className="testimonial">
            <p>"I love the Monthly Plan! The financial insights are so detailed, and I can track everything in one place. It's like having a personal financial advisor!"</p>
            <strong>- David M.</strong>
          </div>
        </div>

        {/* FAQ */}
        <h3>Frequently Asked Questions</h3>
        <div className="faq">
          <h4>How does the Free Trial work?</h4>
          <p>The Free Trial lasts for 7 days, giving you access to all features without charge. You can cancel at any time before the trial ends.</p>

          <h4>Can I change my plan later?</h4>
          <p>Yes, you can upgrade or downgrade your plan at any time. Simply go to your account settings to make the change.</p>

          <h4>What payment methods do you accept?</h4>
          <p>We accept major credit cards, PayPal, and other secure payment methods. Your payment information is processed safely through our encrypted platform.</p>

          <h4>Is my data secure?</h4>
          <p>Yes! We take security seriously and use the highest level of encryption to ensure that your data is safe with us. Your financial information is never shared with third parties.</p>
        </div>

        <h3>Need More Information?</h3>
        <p>If you have any other questions or need assistance, feel free to contact our support team or visit our help center for further guidance.</p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
