import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/useAuthStatus';

const publicRoutes = ['/', '/home', '/about', '/products', '/integrations', '/careers', '/terms', '/privacy', '/status'];

export function SessionCheck({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, isAuthenticated } = useAuthStatus();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated && !publicRoutes.includes(location.pathname) && location.pathname !== '/sign-in' && location.pathname !== '/sign-up') {
                navigate('/sign-in');
            } else if (isAuthenticated && (location.pathname === '/sign-in' || location.pathname === '/sign-up')) {
                navigate('/portal');
            }
        }
    }, [isLoading, isAuthenticated, location, navigate]);

    if (isLoading) {
        return null;
    }

    return <>{children}</>;
}