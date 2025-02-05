import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // Your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios request interceptor for error handling
api.interceptors.response.use(
  (response) => response,  // If response is successful, pass it through
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with a status code other than 2xx
      console.error("API Error:", error.response.data);
      return Promise.reject(error.response.data);  // Return the error message
    } else if (error.request) {
      // No response from the server
      console.error("Network Error:", error.request);
      return Promise.reject("Network Error: Server is unreachable.");
    } else {
      // Something else happened
      console.error("Error:", error.message);
      return Promise.reject(error.message);
    }
  }
);

export default api;
