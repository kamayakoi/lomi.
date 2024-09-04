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
                navigate('/sign-in');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-4 text-lg font-semibold text-gray-700">Completing authentication process...</p>
            </div>
        </div>
    );
};

export default AuthCallback;