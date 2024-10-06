import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/useAuthStatus';
import LoadingButton from '@/components/dashboard/loader';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { isLoading, isOnboarded } = useAuthStatus();

    useEffect(() => {
        if (!isLoading) {
            if (!isOnboarded) {
                navigate('/onboarding');
            } else {
                navigate('/portal');
            }
        }
    }, [isLoading, isOnboarded, navigate]);

    return <LoadingButton />;
};

export default AuthCallback;