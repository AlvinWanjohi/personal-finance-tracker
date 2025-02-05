import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useTransactions } from "../context/TransactionContext";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const { transactions, setTransactions } = useTransactions(); // Using context to fetch transactions
  const [user, setUser] = useState({ name: 'User' }); // Default to 'User' if not available
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', date: '', description: '' });
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [newIncome, setNewIncome] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user and transactions from localStorage on component mount
  useEffect(() => {
    // Fetch user data
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);  // Set the user if available
    }

    // Fetch transactions and financial data from localStorage
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    setTransactions(storedTransactions);
    console.log('Fetched transactions:', storedTransactions); // Debugging logs
    
    const storedBalance = parseFloat(localStorage.getItem('balance')) || 0;
    setBalance(storedBalance);
    console.log('Fetched balance:', storedBalance); // Debugging logs

    const storedIncome = parseFloat(localStorage.getItem('income')) || 0;
    setIncome(storedIncome);
    console.log('Fetched income:', storedIncome); // Debugging logs
  }, [setTransactions]);

  // Handle adding expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    if (!newExpense.name || !newExpense.amount || !newExpense.date || !newExpense.description) {
      setError('All fields are required.');
      return;
    }

    const expenseAmount = parseFloat(newExpense.amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    if (expenseAmount > balance) {
      setError('Insufficient balance.');
      return;
    }

    const newTransaction = {
      date: newExpense.date,
      description: newExpense.description,
      amount: expenseAmount,
      type: 'expense',
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions); // Update transactions context
    setBalance((prevBalance) => prevBalance - expenseAmount);

    // Save to localStorage
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    localStorage.setItem('balance', balance - expenseAmount);

    setNewExpense({ name: '', amount: '', date: '', description: '' });
    setSuccessMessage('Expense added successfully!');
    console.log('Updated transactions:', updatedTransactions); // Debugging logs
    console.log('Updated balance:', balance - expenseAmount); // Debugging logs
  };

  // Handle adding income
  const handleAddIncome = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    const incomeAmount = parseFloat(newIncome);
    if (isNaN(incomeAmount) || incomeAmount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    const newTransaction = {
      date: new Date().toLocaleDateString(),
      description: 'Income',
      amount: incomeAmount,
      type: 'income',
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions); // Update transactions context
    setIncome((prevIncome) => prevIncome + incomeAmount);
    setBalance((prevBalance) => prevBalance + incomeAmount);

    // Save to localStorage
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    localStorage.setItem('income', income + incomeAmount);
    localStorage.setItem('balance', balance + incomeAmount);

    setNewIncome('');
    setSuccessMessage('Income added successfully!');
    console.log('Updated transactions:', updatedTransactions); // Debugging logs
    console.log('Updated balance:', balance + incomeAmount); // Debugging logs
  };

  // Prepare data for the chart (Expenses)
  const expenseAmounts = transactions.filter((t) => t.type === 'expense').map((t) => t.amount);
  const expenseLabels = transactions.filter((t) => t.type === 'expense').map((t) => t.description);

  const data = {
    labels: expenseLabels,
    datasets: [
      {
        label: 'Expenses',
        data: expenseAmounts,
        borderColor: '#1abc9c',
        backgroundColor: 'rgba(26, 188, 156, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* Welcome message */}
      <div className="dashboard-welcome">
        <h2>Welcome😁 {user.name}</h2>
        <p>Track your financial progress with real-time insights.</p>
      </div>

      {/* Financial Overview */}
      <div className="dashboard-overview">
        <h3>Financial Overview</h3>
        <div className="stats">
          <div className="stat-card">
            <h4>Current Balance</h4>
            <p>${balance.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h4>Monthly Income</h4>
            <p>${income.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h4>Monthly Expenses</h4>
            <p>${expenseAmounts.reduce((acc, cur) => acc + cur, 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Add Income Form */}
      <div className="add-income">
        <h3>Add Income</h3>
        <form onSubmit={handleAddIncome}>
          <input
            type="number"
            placeholder="Enter income amount"
            value={newIncome}
            onChange={(e) => setNewIncome(e.target.value)}
            required
          />
          <button type="submit">Add Income</button>
        </form>
      </div>

      {/* Recent Transactions Section */}
      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index}>
              <strong>{transaction.date}</strong>: {transaction.description} - ${transaction.amount} ({transaction.type})
            </li>
          ))}
        </ul>
      </div>

      {/* Expense Chart */}
      <div className="expense-chart">
        <h3>Your Expense Trends</h3>
        <Line data={data} />
      </div>

      {/* Add Expense Form */}
      <div className="add-expense">
        <h3>Add a New Expense</h3>
        <form onSubmit={handleAddExpense}>
          <label>Expense Name</label>
          <input
            type="text"
            placeholder="Enter expense name"
            value={newExpense.name}
            onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
            required
          />
          <label>Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            required
          />
          <label>Date</label>
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            required
          />
          <label>Description</label>
          <textarea
            placeholder="Enter description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            required
          />
          <button type="submit">Add Expense</button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default DashboardPage;
