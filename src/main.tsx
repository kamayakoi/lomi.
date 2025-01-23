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

const root = createRoot(rootElement);

// Render app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Enable HMR
if (import.meta.hot) {
  import.meta.hot.accept();
}
