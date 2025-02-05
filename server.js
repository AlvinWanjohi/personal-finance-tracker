require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
const allowedOrigins = ['http://localhost:3000', process.env.FRONTEND_URL]; // Add production URL here
app.use(cors({
  origin: allowedOrigins, // Dynamically allow origins
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, // Allow credentials if needed
}));
app.use(express.json()); // Parse JSON requests

// Ensure all required environment variables are set
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('❌ Missing necessary environment variables: MONGO_URI or JWT_SECRET');
  process.exit(1); // Exit if required environment variables are missing
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Define User Schema & Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Define Expense Schema & Model
const expenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});
const Expense = mongoose.model('Expense', expenseSchema);

// Middleware to protect routes (JWT authentication)
const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access Denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
};

// API to get all expenses (protected route)
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API to add a new expense (protected route)
app.post('/api/expenses', authenticateToken, async (req, res) => {
  const { name, amount } = req.body;

  if (!name || !amount) {
    return res.status(400).json({ error: 'Expense name and amount are required.' });
  }

  try {
    const expense = new Expense({ name, amount });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error('Error saving expense:', err);
    res.status(500).json({ error: 'Failed to save expense' });
  }
});

// API for user registration (sign up)
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// API for user login
app.post('/api/login', async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  try {
    // Find user by username or email
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a JWT token with a 1-hour expiration time
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ access_token: token, user: { username: user.username, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

