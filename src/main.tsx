import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/landing/theme-provider.tsx";
import { UserProvider } from '@/lib/contexts/UserContext';
import AppRouter from "./router";

import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider>
        <UserProvider>
          <AppRouter />
          <Analytics />
        </UserProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}