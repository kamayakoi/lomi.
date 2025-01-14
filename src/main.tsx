import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@/components/landing/theme-provider.tsx";
import { UserProvider } from '@/lib/contexts/UserContext';
import { QueryClient, QueryClientProvider } from 'react-query'
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import AppRouter from "./router";
import "./index.css";
import './i18n';

const queryClient = new QueryClient()


export function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <UserProvider>
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
              <AppRouter />
              <Toaster />
            </BrowserRouter>
            <Analytics />
          </UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found");
}