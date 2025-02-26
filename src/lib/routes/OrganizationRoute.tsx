import { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useUser } from '@/lib/hooks/use-user';
import { supabase } from '@/utils/supabase/client';
import AnimatedLogoLoader from '@/components/portal/loader';

interface Organization {
    organization_id: string;
    organization_name: string;
    organization_logo_url: string | null;
    merchant_role: string;
}

export function OrganizationRoute({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId: currentOrgId } = useParams();

    useEffect(() => {
        const validateAndSetOrg = async () => {
            if (!user?.id) return;

            try {
                // Fetch user's organizations
                const { data: orgs, error } = await supabase
                    .rpc('fetch_merchant_organizations', { p_merchant_id: user.id })
                    .returns<Organization[]>();

                if (error) throw error;

                // If no organizations, redirect to onboarding
                if (!orgs?.length) {
                    navigate('/onboarding', { replace: true });
                    return;
                }

                // If no org ID in URL or invalid org ID, redirect to first org
                if (!currentOrgId || !orgs.some((org: Organization) => org.organization_id === currentOrgId)) {
                    const firstOrg = orgs[0];
                    if (firstOrg) {
                        navigate(`/${firstOrg.organization_id}`, { replace: true });
                    }
                    return;
                }
            } catch (error) {
                console.error('Error validating organization:', error);
                navigate('/500', { replace: true });
            }
        };

        validateAndSetOrg();
    }, [user?.id, currentOrgId, location.pathname, navigate]);

    if (!user) {
        return <AnimatedLogoLoader />;
    }

    return <>{children}</>;
} 