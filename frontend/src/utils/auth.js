import { jwtDecode } from "jwt-decode";
import api from "./api"; // Assuming you have an API instance set up for making API requests

// Function to verify JWT token validity
export const verifyJWT = (token) => {
  if (!token) {
    console.error("No token provided.");
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    // Check if the token has expired
    const isExpired = decoded.exp < Date.now() / 1000;
    if (isExpired) {
      console.warn("Token has expired.");
    }
    return !isExpired; // Return true if token is not expired
  } catch (error) {
    console.error("Invalid JWT token", error);
    return false; // Token is invalid if error occurs
  }
};

// Function to refresh the JWT token using the refresh token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("Refresh token not available.");
  }

  try {
    const response = await api.post("/refresh-token", { refreshToken });
    const { access_token, refresh_token } = response.data;

    // Store new tokens in localStorage
    if (access_token) {
      localStorage.setItem("token", access_token);
    }
    if (refresh_token) {
      localStorage.setItem("refreshToken", refresh_token);
    }

    return access_token; // Return new access token
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Failed to refresh token. Please log in again.");
  }
};

// Function to log in the user and store tokens in localStorage
export const loginUser = async (username, password) => {
  try {
    const response = await api.post("/login", { username, password });
    const { access_token, refresh_token } = response.data;

    if (access_token && refresh_token) {
      // Store access token and refresh token in localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("refreshToken", refresh_token);
    } else {
      throw new Error("Tokens not found in response.");
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Invalid credentials or server error.");
  }
};

// Function to check if the user is authenticated (token exists and is valid)
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem("token");
    const isValid = token && verifyJWT(token); // Returns true if token exists and is valid
    if (!isValid) {
      console.warn("User is not authenticated.");
    }
    return isValid;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

// Function to log out the user and remove tokens from localStorage
export const logoutUser = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    console.log("User logged out.");
    // Optionally, redirect to the login page after logging out
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

// Function to get transactions using the JWT token
export const getTransactions = async () => {
  let token = localStorage.getItem("token");

  if (!token || !verifyJWT(token)) {
    // If token is expired or doesn't exist, try refreshing the token
    try {
      token = await refreshToken();
    } catch (error) {
      console.error("No valid token found, please log in again.");
      throw new Error("Failed to retrieve transactions. Please log in again.");
    }
  }

  try {
    const response = await api.get("/transactions", {
      headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers
    });

    // Ensure response status is 200 OK
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to load transactions. Server responded with error.");
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to load transactions. Please try again later.");
  }
};
