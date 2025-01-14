import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@/components/landing/theme-provider.tsx";
import { UserProvider } from '@/lib/contexts/UserContext';
import { QueryClient, QueryClientProvider } from 'react-query'
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import AppRouter from "./router";
import { useRoutePreload } from "@/lib/hooks/useRoutePreload";
import "./index.css";
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function AppContent() {
  // Use the route preloading hook
  useRoutePreload();

  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  );
}

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
              <AppContent />
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