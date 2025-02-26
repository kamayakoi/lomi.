import { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/use-auth-status';
import LoadingButton from '@/components/portal/loader';
import { supabase } from '@/utils/supabase/client';
import { toast } from '@/lib/hooks/use-toast';

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, isOnboarded } = useAuthStatus();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        let retryCount = 0;
        const MAX_RETRIES = 5;
        const RETRY_DELAY = 1000;

        const handleCallback = async () => {
            try {
                // Parse both URL parameters and hash parameters
                const urlParams = new URLSearchParams(location.search);
                const hashParams = new URLSearchParams(location.hash.replace('#', ''));

                // Get all possible error parameters
                const error = urlParams.get('error') || hashParams.get('error');
                const error_description = urlParams.get('error_description') || hashParams.get('error_description');
                const provider_error = urlParams.get('provider_error') || hashParams.get('provider_error');
                const provider_error_description = urlParams.get('provider_error_description') || hashParams.get('provider_error_description');

                // Handle any OAuth or PKCE errors
                if (error || provider_error) {
                    throw new Error(
                        provider_error_description ||
                        error_description ||
                        provider_error ||
                        error ||
                        'Authentication failed'
                    );
                }

                // Get other parameters
                const type = urlParams.get('type') || hashParams.get('type');
                const next = searchParams.get('next');
                const code = urlParams.get('code') || hashParams.get('code');

                // Handle email verification
                if (type === 'signup' || urlParams.get('message')?.includes('Email verified')) {
                    navigate('/auth/connect/email-verified', { replace: true });
                    return;
                }

                // Handle email change confirmation
                if (type === 'email_change' || urlParams.get('message')?.includes('Confirmation link accepted')) {
                    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                    if (sessionError) throw sessionError;
                    if (!session) throw new Error('No active session found');

                    toast({
                        title: "Success",
                        description: "Email address updated successfully",
                    });

                    // Clear URL parameters and hash
                    window.history.replaceState(null, '', window.location.pathname);
                    navigate(next || '/portal/settings/business-profile', { replace: true });
                    return;
                }

                // Handle OAuth callback with PKCE
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Session error:', sessionError);
                    throw sessionError;
                }

                // If no session and we have a code, exchange it
                if (!session && code) {
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                    if (exchangeError) throw exchangeError;
                }

                // Get the final session state
                const { data: { session: finalSession }, error: finalSessionError } = await supabase.auth.getSession();

                if (finalSessionError) throw finalSessionError;

                // If still no session after exchange, retry a few times
                if (!finalSession) {
                    retryCount++;
                    if (retryCount < MAX_RETRIES) {
                        timeoutId = setTimeout(handleCallback, RETRY_DELAY);
                        return;
                    }
                    throw new Error('Failed to establish session after multiple attempts');
                }

                // Only proceed with navigation when we have both session and loading state
                if (!isLoading && finalSession) {
                    if (!isOnboarded) {
                        navigate('/onboarding', { replace: true });
                    } else {
                        navigate(next || '/', { replace: true });
                    }
                }
            } catch (error) {
                console.error('Error in auth callback:', error);
                toast({
                    title: "Authentication Error",
                    description: error instanceof Error ? error.message : "There was a problem signing you in. Please try again.",
                    variant: "destructive",
                });
                navigate('/sign-in', { replace: true });
            }
        };

        handleCallback();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [navigate, location, isLoading, isOnboarded, searchParams]);

    return <LoadingButton />;
};

export default AuthCallback;