import { ThemeProvider } from "@/components/landing/theme-provider";
import { UserProvider } from '@/lib/contexts/user-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from 'react';
import AppRouter from "./router";
import AnimatedLogoLoader from "@/components/portal/loader";
import mixpanelService from "@/utils/mixpanel/mixpanel";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            throwOnError: true,
        },
    },
});

// Initialize Mixpanel
mixpanelService.init();

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