import { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/useAuthStatus';
import LoadingButton from '@/components/portal/loader';
import { supabase } from '@/utils/supabase/client';
import { toast } from '@/components/ui/use-toast';

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, isOnboarded } = useAuthStatus();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let retryCount = 0;
        const MAX_RETRIES = 5;

        const handleCallback = async () => {
            try {
                // Parse both URL parameters and hash parameters
                const urlParams = new URLSearchParams(location.search);
                const hashParams = new URLSearchParams(location.hash.replace('#', ''));
                const type = urlParams.get('type') || hashParams.get('type');
                const next = searchParams.get('next');
                const message = urlParams.get('message') || hashParams.get('message');

                // Handle email change confirmation
                if (type === 'email_change' || message?.includes('Confirmation link accepted')) {
                    // Get the current session to check if we're authenticated
                    const { data: { session } } = await supabase.auth.getSession();

                    if (!session) {
                        throw new Error('No active session found');
                    }

                    toast({
                        title: "Success",
                        description: "Email address updated successfully",
                    });

                    // Clear URL parameters and hash
                    window.history.replaceState(null, '', window.location.pathname);

                    // Navigate to the next URL or default to portal
                    navigate(next || '/portal/settings/business-profile', { replace: true });
                    return;
                }

                // Handle normal auth callback
                const { data: { session } } = await supabase.auth.getSession();

                // If no session, retry a few times before giving up
                if (!session) {
                    retryCount++;
                    if (retryCount < MAX_RETRIES) {
                        timeoutId = setTimeout(handleCallback, 1000);
                        return;
                    }
                    throw new Error('Failed to establish session after multiple attempts');
                }

                // Only proceed with navigation when we have both session and loading state
                if (!isLoading && session) {
                    if (!isOnboarded) {
                        navigate('/onboarding', { replace: true });
                    } else {
                        navigate(next || '/portal', { replace: true });
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
    }, [isLoading, isOnboarded, navigate, searchParams, location]);

    return <LoadingButton />;
};

export default AuthCallback;