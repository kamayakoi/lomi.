import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabase/client';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error getting session:', error);
                navigate('/sign-in');
                return;
            }

            if (data?.session) {
                // Session exists, user is authenticated
                const { data: profile } = await supabase
                    .from('users')
                    .select('onboarded')
                    .eq('user_id', data.session.user.id)
                    .single();

                if (profile && profile.onboarded) {
                    navigate('/portal');
                } else {
                    navigate('/onboarding');
                }
            } else {
                // No session, redirect to sign-in
                navigate('/sign-in');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return <div>Processing authentication...</div>;
};

export default AuthCallback;