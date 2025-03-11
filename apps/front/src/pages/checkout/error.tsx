import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'] || '';
const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CheckoutError() {
    const [organizationName, setOrganizationName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [errorCode, setErrorCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getErrorDetails = async () => {
            try {
                // Parse URL parameters to get error details
                const urlParams = new URLSearchParams(window.location.search);
                const errorParam = urlParams.get('error');
                const messageParam = urlParams.get('message');

                if (errorParam) {
                    setErrorCode(errorParam);
                }

                if (messageParam) {
                    setErrorMessage(messageParam);
                }

                // Try to get organization details from the most recent checkout session
                const { data: sessionData, error } = await supabase
                    .from('checkout_sessions')
                    .select('*, organizations!inner(*)')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (!error && sessionData) {
                    setOrganizationName(sessionData.organizations.name);
                    setLogoUrl(sessionData.organizations.logo_url);
                }
            } catch (error) {
                console.error('Error processing checkout error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getErrorDetails();
    }, []);

    const handleRetry = () => {
        // Redirect back to checkout page or homepage
        window.location.href = '/checkout';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-[#121317] p-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-[#121317] p-4">
            <div className="max-w-md w-full rounded-[5px] border border-border dark:border-zinc-800 bg-card text-card-foreground dark:bg-[#1A1D23] shadow-sm p-8">
                {logoUrl && (
                    <div className="flex justify-center mb-6">
                        <img src={logoUrl} alt={organizationName} className="h-16 w-auto" />
                    </div>
                )}

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-500/10 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-500">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>

                    <p className="text-muted-foreground mb-2">
                        We couldn&apos;t process your payment. Please try again.
                    </p>

                    {errorMessage && (
                        <div className="bg-red-500/5 dark:bg-red-900/10 text-red-600 dark:text-red-500 p-3 rounded-[5px] text-sm mb-6 w-full">
                            {errorCode && <strong className="block mb-1">{errorCode}</strong>}
                            {errorMessage}
                        </div>
                    )}

                    <div className="w-full space-y-2 mt-4">
                        <button
                            onClick={handleRetry}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-[5px] transition-colors"
                        >
                            Try Again
                        </button>

                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground font-medium py-2 px-4 rounded-[5px] transition-colors border border-border dark:border-zinc-700"
                        >
                            Go to Homepage
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 