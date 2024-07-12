// Components 

import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/landing/theme-provider.tsx";
import AppRouter from "./router"; // Import the router component

// Styles
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppRouter /> {/* Use the router component */}
      <Analytics />
    </ThemeProvider>
  </React.StrictMode>
);