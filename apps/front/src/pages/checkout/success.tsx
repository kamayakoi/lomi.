import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'] || '';
const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CheckoutSuccess() {
    const router = useRouter();
    const [organizationName, setOrganizationName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getSessionDetails = async () => {
            // We could get the checkout session ID from the URL if passed by Wave
            // const { id } = router.query;

            try {
                // Get the most recent completed checkout session for this browser session
                // In production, you'd use a more reliable way to identify the session
                const { data: sessionData, error } = await supabase
                    .from('checkout_sessions')
                    .select('*, organizations!inner(*)')
                    .eq('status', 'completed')
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error) {
                    console.error('Error fetching checkout session:', error);
                    return;
                }

                if (sessionData) {
                    setOrganizationName(sessionData.organizations.name);
                    setLogoUrl(sessionData.organizations.logo_url);
                }
            } catch (error) {
                console.error('Error processing checkout success:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (router.isReady) {
            getSessionDetails();
        }
    }, [router.isReady, router.query]);

    const handleContinue = () => {
        // Redirect to home or order confirmation page
        window.location.href = 'https://lomi.africa';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-[#121317] p-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                <p className="text-muted-foreground">Processing your payment...</p>
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
                    <div className="w-16 h-16 bg-green-500/10 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-500">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
                    <p className="text-muted-foreground mb-6">
                        Thank you for your payment. Your transaction has been completed successfully.
                    </p>

                    <button
                        onClick={handleContinue}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-[5px] transition-colors"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
} 