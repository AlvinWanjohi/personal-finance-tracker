import React, { useState } from 'react';
import './PaymentPage.css';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`You selected ${paymentMethod} as your payment method.`);
    // Implement actual payment submission logic here (e.g., integration with Stripe, PayPal, etc.)
  };

  return (
    <div className="payment-container">
      <h1 className="payment-title">Complete Your Payment</h1>
      <p className="payment-description">
        Choose your preferred payment method to proceed with the subscription.
      </p>

      <form className="payment-form" onSubmit={handleSubmit}>
        <div className="payment-methods">
          <h2>Select a Payment Method</h2>
          <div className="payment-option">
            <input
              type="radio"
              id="credit-card"
              name="payment-method"
              value="Credit Card"
              checked={paymentMethod === 'Credit Card'}
              onChange={handlePaymentMethodChange}
            />
            <label htmlFor="credit-card">Credit Card (Visa, MasterCard, AMEX)</label>
          </div>

          <div className="payment-option">
            <input
              type="radio"
              id="paypal"
              name="payment-method"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={handlePaymentMethodChange}
            />
            <label htmlFor="paypal">PayPal</label>
          </div>

          <div className="payment-option">
            <input
              type="radio"
              id="other"
              name="payment-method"
              value="Other Secure Methods"
              checked={paymentMethod === 'Other Secure Methods'}
              onChange={handlePaymentMethodChange}
            />
            <label htmlFor="other">Other Secure Methods</label>
          </div>
        </div>

        {paymentMethod && (
          <div className="payment-details">
            {paymentMethod === 'Credit Card' && (
              <div className="credit-card-info">
                <label>Credit Card Number</label>
                <input type="text" placeholder="1234 5678 9876 5432" />
                <label>Expiration Date</label>
                <input type="month" />
                <label>CVV</label>
                <input type="text" placeholder="123" />
              </div>
            )}
            {paymentMethod === 'PayPal' && (
              <div className="paypal-info">
                <p>You will be redirected to PayPal to complete your payment.</p>
              </div>
            )}
            {/* Add more payment method forms here */}
          </div>
        )}

        <button type="submit" className="payment-submit-button">Submit Payment</button>
      </form>

      <div className="security-assurance">
        <p>Your payment information is processed securely through our encrypted platform.</p>
      </div>

      <div className="terms">
        <p>By proceeding with payment, you agree to our <a href="/terms">Terms & Conditions</a> and <a href="/privacy-policy">Privacy Policy</a>.</p>
      </div>
    </div>
  );
};

export default PaymentPage;
