import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

export function useAuthStatus() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isOnboarded, setIsOnboarded] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                setIsLoading(false);
                return;
            }

            if (session) {
                setIsAuthenticated(true);
                const { data: onboardingStatus, error: onboardingError } = await supabase.rpc('check_onboarding_status', {
                    p_merchant_id: session.user.id,
                });

                if (onboardingError) {
                    console.error('Error checking onboarding status:', onboardingError);
                } else {
                    setIsOnboarded(onboardingStatus);
                }
            }
            setIsLoading(false);
        };

        checkAuthStatus();
    }, []);

    return { isLoading, isAuthenticated, isOnboarded };
}