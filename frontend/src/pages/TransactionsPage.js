import React, { useState, useEffect } from 'react';
import './TransactionsPage.css';
import { useTransactions } from "../context/TransactionContext";  // Use context to fetch transactions

const TransactionsPage = () => {
  // Use context to get transactions and set them
  const { transactions } = useTransactions();  // No need to fetch from localStorage or API
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setError('No transactions available.');
    }
    setLoading(false);
  }, [transactions]);  // Listen for changes in transactions

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="transactions-container">
      <h2>💰 Your Transactions</h2>
      <p>Track and manage all your financial transactions in one place.</p>

      {/* History Section with Clear Button */}
      <div className="history-header">
        <h3>Transaction History</h3>
      </div>

      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <tr key={index} className={transaction.type.toLowerCase()}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.type}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No transactions available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsPage;
