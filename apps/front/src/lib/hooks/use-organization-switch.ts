import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useOrganizationSwitch() {
    const navigate = useNavigate();
    const location = useLocation();

    const switchOrganization = useCallback(async (organizationId: string) => {
        try {
            // Get the base path (portal)
            const basePath = location.pathname.split('/')[1];
            
            // Navigate to the same route with new organization ID
            navigate(
                `/${basePath}/${organizationId}`,
                { replace: true }
            );

            // Reload to refresh all contexts
            window.location.reload();
        } catch (error) {
            console.error('Error switching organization:', error);
            throw error;
        }
    }, [navigate, location]);

    return { switchOrganization };
} 