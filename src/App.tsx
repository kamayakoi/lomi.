import { ThemeProvider } from "@/components/landing/theme-provider";
import { UserProvider } from '@/lib/contexts/user-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Suspense, useEffect } from 'react';
import AppRouter from "./router";
import AnimatedLogoLoader from "@/components/portal/loader";
import mixpanelService from "@/utils/mixpanel/mixpanel";
import { Helmet, HelmetProvider } from "react-helmet-async";

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

// Component to handle title resets
function TitleResetManager() {
    const location = useLocation();
    const defaultTitle = "lomi. | West Africa's Payment Orchestration Platform";

    useEffect(() => {
        // Reset the title when navigating away from blog pages
        if (!location.pathname.startsWith('/blog')) {
            document.title = defaultTitle;
        }
    }, [location.pathname, defaultTitle]);

    return null;
}

export function App() {
    const defaultTitle = "lomi. | West Africa's Payment Orchestration Platform";
    return (
        <HelmetProvider>
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
                                <Helmet>
                                    <title>{defaultTitle}</title>
                                </Helmet>
                                <TitleResetManager />
                                <AppRouter />
                                <Toaster />
                            </BrowserRouter>
                            <Analytics />
                        </UserProvider>
                    </ThemeProvider>
                </Suspense>
            </QueryClientProvider>
        </HelmetProvider>
    );
} 