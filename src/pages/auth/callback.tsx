import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/useAuthStatus';
import LoadingButton from '@/components/dashboard/loader';
import { supabase } from '@/utils/supabase/client';
import { toast } from '@/components/ui/use-toast';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { isLoading, isOnboarded } = useAuthStatus();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const { error } = await supabase.auth.getSession();
                if (error) throw error;

                if (!isLoading) {
                    if (!isOnboarded) {
                        navigate('/onboarding');
                    } else {
                        navigate('/portal');
                    }
                }
            } catch (error) {
                console.error('Error in auth callback:', error);
                toast({
                    title: "Authentication Error",
                    description: "There was a problem signing you in. Please try again.",
                    variant: "destructive",
                });
                navigate('/sign-in');
            }
        };

        handleCallback();
    }, [isLoading, isOnboarded, navigate]);

    return <LoadingButton />;
};

export default AuthCallback;