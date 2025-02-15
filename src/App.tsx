import { ThemeProvider } from "@/components/landing/theme-provider";
import { UserProvider } from '@/lib/contexts/user-context';
import { QueryClient, QueryClientProvider } from 'react-query'
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from 'react';
import AppRouter from "./router";
import AnimatedLogoLoader from "@/components/portal/loader";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
            suspense: false,
            useErrorBoundary: true,
        },
    },
});

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={<AnimatedLogoLoader />}>
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
            </Suspense>
        </QueryClientProvider>
    );
} 