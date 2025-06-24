import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import "./css/White.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);