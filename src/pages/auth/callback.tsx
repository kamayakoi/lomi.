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
        const handleCallback = async () => {
            try {
                // Get the hash fragment from the URL if present
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const queryParams = new URLSearchParams(window.location.search);

                // Check for error in hash or query parameters
                const error = hashParams.get('error') || queryParams.get('error');
                const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');

                if (error) {
                    throw new Error(errorDescription || 'Authentication error');
                }

                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;

                // Wait for session to be established
                if (!session) {
                    console.log('No session found, waiting...');
                    return;
                }

                // Only proceed with navigation when we have both session and loading state
                if (!isLoading && session) {
                    console.log('Session established, navigating...');
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
                    description: error instanceof Error ? error.message : "There was a problem signing you in. Please try again.",
                    variant: "destructive",
                });
                navigate('/sign-in', { replace: true });
            }
        };

        handleCallback();
    }, [isLoading, isOnboarded, navigate]);

    return <LoadingButton />;
};

export default AuthCallback;