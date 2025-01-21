import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import './i18n';

// Enable React concurrent features
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Use createRoot for concurrent features
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
