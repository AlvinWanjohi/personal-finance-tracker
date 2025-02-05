import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
export const TransactionContext = createContext();

// Create a provider component
export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // Load transactions from localStorage if available
  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    setTransactions(storedTransactions);
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  return (
    <TransactionContext.Provider value={{ transactions, setTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

// Create a custom hook to use the transactions context
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
