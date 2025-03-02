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
import { useTranslation } from "react-i18next";

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

// Component to handle title resets and language metadata
function MetadataManager() {
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language || 'en';
    const defaultTitle = t('app.title', 'lomi. | West Africa\'s Payment Orchestration Platform');
    const defaultDescription = t('app.description', 'Sell products and subscriptions online with lomi. Accept payments via cards, mobile money and crypto, send payouts and automate financial workflows with ease.');

    useEffect(() => {
        // Reset the title when navigating away from blog pages
        if (!location.pathname.startsWith('/blog')) {
            document.title = defaultTitle;
        }
    }, [location.pathname, defaultTitle]);

    // Get all supported languages for hreflang tags
    const supportedLanguages = ['en', 'fr', 'es', 'pt', 'zh'];

    return (
        <Helmet>
            <html lang={currentLanguage} />
            <title>{defaultTitle}</title>
            <meta name="description" content={defaultDescription} />

            {/* Hreflang tags for language alternatives */}
            {supportedLanguages.map(lang => (
                <link
                    key={lang}
                    rel="alternate"
                    hrefLang={lang}
                    href={`${window.location.origin}${location.pathname}${location.search ? location.search : ''}${location.search ? '&' : '?'}lang=${lang}`}
                />
            ))}
            {/* Default hreflang for international users */}
            <link
                rel="alternate"
                hrefLang="x-default"
                href={`${window.location.origin}${location.pathname}${location.search}`}
            />
        </Helmet>
    );
}

export function App() {
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
                                <MetadataManager />
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