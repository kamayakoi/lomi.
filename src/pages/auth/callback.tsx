import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/useAuthStatus';
import LoadingButton from '@/components/portal/loader';
import { supabase } from '@/utils/supabase/client';
import { toast } from '@/components/ui/use-toast';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { isLoading, isOnboarded } = useAuthStatus();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let retryCount = 0;
        const MAX_RETRIES = 5;

        const handleCallback = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

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
                    // Clear any existing hash from the URL
                    if (window.location.hash) {
                        window.history.replaceState(null, '', window.location.pathname);
                    }

                    if (!isOnboarded) {
                        navigate('/onboarding', { replace: true });
                    } else {
                        navigate('/portal', { replace: true });
                    }
                }
            } catch (error) {
                console.error('Error in auth callback:', error);
                toast({
                    title: "Authentication Error",
                    description: "There was a problem signing you in. Please try again.",
                    variant: "destructive",
                });
                navigate('/sign-in', { replace: true });
            }
        };

        handleCallback();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isLoading, isOnboarded, navigate]);

    return <LoadingButton />;
};

export default AuthCallback;