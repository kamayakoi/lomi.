import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabase/client';
import LoadingButton from '@/components/dashboard/loader';

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
                navigate('/onboarding'); // Redirect to the onboarding route
            } else {
                navigate('/sign-in');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <LoadingButton />
    );
};

export default AuthCallback;