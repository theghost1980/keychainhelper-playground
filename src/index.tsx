import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/base.css";

const container = document.getElementById("root");

if (container) {
  const root = ReactDOM.createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Element with ID 'root' not found in index.html");
}

console.log("React App for Keychain Test started.");
