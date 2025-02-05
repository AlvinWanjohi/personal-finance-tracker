import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Set up axios instance for API calls
const api = axios.create({
  baseURL: "https://your-api-base-url.com", // Replace with your actual API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to verify JWT token validity
const verifyJWT = (token) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000; // Token is valid if not expired
  } catch (error) {
    return false; // Token is invalid if error occurs
  }
};

// Function to refresh JWT token using refresh token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("Refresh token not available.");

  try {
    const response = await api.post("/refresh-token", { refreshToken });
    const { access_token, refresh_token } = response.data;

    // Store new tokens in localStorage
    if (access_token) localStorage.setItem("token", access_token);
    if (refresh_token) localStorage.setItem("refreshToken", refresh_token);

    return access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Failed to refresh token. Please log in again.");
  }
};

// Function to get transactions using JWT token
const getTransactions = async () => {
  let token = localStorage.getItem("token");

  if (!token || !verifyJWT(token)) {
    try {
      token = await refreshToken();
    } catch (error) {
      throw new Error("No valid token found, please log in again.");
    }
  }

  try {
    const response = await api.get("/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Assuming response.data contains the list of transactions
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to load transactions. Please try again later.");
  }
};

// Function to add a new transaction
const addTransactionAPI = async (newTransaction) => {
  let token = localStorage.getItem("token");

  if (!token || !verifyJWT(token)) {
    try {
      token = await refreshToken();
    } catch (error) {
      throw new Error("No valid token found, please log in again.");
    }
  }

  try {
    const response = await api.post("/transactions", newTransaction, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Assuming response.data contains the added transaction
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw new Error("Failed to add transaction. Please try again later.");
  }
};

// Export functions to use them in other parts of your app
export { api, getTransactions, addTransactionAPI, verifyJWT, refreshToken };
