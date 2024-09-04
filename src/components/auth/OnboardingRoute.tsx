import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/utils/supabase/client';

interface OnboardingRouteProps {
    children: React.ReactNode;
}

export function OnboardingRoute({ children }: OnboardingRouteProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [shouldOnboard, setShouldOnboard] = useState(false);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) {
                setIsLoading(false);
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('onboarded')
                .eq('user_id', session.user.id)
                .single();

            if (profileError) {
                console.error('Error fetching user profile:', profileError);
                setIsLoading(false);
                return;
            }

            setShouldOnboard(!profile?.onboarded);
            setIsLoading(false);
        };

        checkOnboardingStatus();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!shouldOnboard) {
        return <Navigate to="/portal" replace />;
    }

    return <>{children}</>;
}