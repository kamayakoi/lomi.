import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabase/client';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error during auth callback:', error);
                navigate('/sign-in');
            } else if (data?.session) {
                navigate('/portal');
            } else {
                navigate('/sign-in');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return <div>Processing authentication...</div>;
};

export default AuthCallback;