import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for React 18
import { BrowserRouter } from "react-router-dom"; // Use full name for clarity
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { TransactionProvider } from "./context/TransactionContext";

// Get the root element from the DOM
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <BrowserRouter> {/* Ensure routing is properly wrapped */}
        <UserProvider>
          <TransactionProvider>
            <App />
          </TransactionProvider>
        </UserProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("Error: Root element not found!");
}
