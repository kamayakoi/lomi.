import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '@/lib/hooks/useAuthStatus';

// Public routes that don't require authentication
const publicRoutes = ['/', '/home', '/about', '/products', '/integrations', '/careers', '/terms', '/privacy', '/status'];

// Auth routes that should redirect to /portal if user is already authenticated
const authRoutes = ['/sign-in', '/sign-up', '/log-in', '/sign-in-test', '/forgot-password', '/otp', '/auth/reset-password'];

// Routes that require authentication but don't need to redirect if already authenticated
const protectedRoutes = ['/portal', '/onboarding', '/auth/callback'];

export function SessionCheck({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, isAuthenticated } = useAuthStatus();

    useEffect(() => {
        if (!isLoading) {
            const currentPath = location.pathname;

            // Check if the current path starts with any of the protected routes
            const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));

            if (!isAuthenticated) {
                if (!publicRoutes.includes(currentPath) && !authRoutes.includes(currentPath) && !isProtectedRoute) {
                    navigate('/sign-in');
                }
            } else {
                if (authRoutes.includes(currentPath)) {
                    navigate('/portal');
                }
            }
        }
    }, [isLoading, isAuthenticated, location, navigate]);

    if (isLoading) {
        return null;
    }

    return <>{children}</>;
}