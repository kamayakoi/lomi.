import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/landing/theme-provider.tsx";
import AppRouter from "./router";

import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider>
        <AppRouter />
        <Analytics />
      </ThemeProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}