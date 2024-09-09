import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/utils/supabase/client';

interface OnboardingRouteProps {
    children: React.ReactNode;
}

export function OnboardingRoute({ children }: OnboardingRouteProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isOnboarded, setIsOnboarded] = useState(false);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) {
                setIsLoading(false);
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from('merchants')
                .select('onboarded')
                .eq('merchant_id', session.user.id)
                .single();

            if (profileError) {
                console.error('Error fetching merchant profile:', profileError);
                setIsLoading(false);
                return;
            }

            setIsOnboarded(profile?.onboarded || false);
            setIsLoading(false);
        };

        checkOnboardingStatus();
    }, []);

    if (isLoading) {
        return null;
    }

    if (isOnboarded) {
        return <Navigate to="/portal" replace />;
    }

    return <>{children}</>;
}