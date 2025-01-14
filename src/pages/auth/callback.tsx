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
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

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
                    description: "There was a problem signing you in. Please try again.",
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