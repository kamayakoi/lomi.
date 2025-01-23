import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import './i18n';

// Extend Window interface to include our custom property
declare global {
  interface Window {
    __ROOT__?: ReturnType<typeof createRoot>;
  }
}

// Enable React concurrent features
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

let root: ReturnType<typeof createRoot>;

// Only create root once
if (!window.__ROOT__) {
  root = createRoot(rootElement);
  window.__ROOT__ = root;
} else {
  root = window.__ROOT__;
}

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
