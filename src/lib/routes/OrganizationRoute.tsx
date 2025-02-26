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

    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const isPortalSubdomain = window.location.hostname.startsWith('portal.');

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
                    const onboardingUrl = isProduction
                        ? 'https://lomi.africa/onboarding'
                        : '/onboarding';
                    window.location.href = onboardingUrl;
                    return;
                }

                // If no org ID in URL or invalid org ID, redirect to first org
                if (!currentOrgId || !orgs.some((org: Organization) => org.organization_id === currentOrgId)) {
                    const firstOrg = orgs[0];
                    if (firstOrg) {
                        if (isProduction && !isPortalSubdomain) {
                            // Redirect to portal subdomain with auth state
                            const session = await supabase.auth.getSession();
                            const redirectUrl = `https://portal.lomi.africa/${firstOrg.organization_id}`;
                            if (session.data.session) {
                                // Store the current auth state before redirecting
                                localStorage.setItem('pendingRedirect', redirectUrl);
                                await supabase.auth.refreshSession();
                            }
                            window.location.href = redirectUrl;
                            return;
                        }
                        navigate(
                            `/${firstOrg.organization_id}`,
                            { replace: true }
                        );
                    }
                    return;
                }

                // If we're in production and not on portal subdomain, redirect
                if (isProduction && !isPortalSubdomain) {
                    const session = await supabase.auth.getSession();
                    const redirectUrl = `https://portal.lomi.africa${location.pathname}`;
                    if (session.data.session) {
                        // Store the current auth state before redirecting
                        localStorage.setItem('pendingRedirect', redirectUrl);
                        await supabase.auth.refreshSession();
                    }
                    window.location.href = redirectUrl;
                    return;
                }
            } catch (error) {
                console.error('Error validating organization:', error);
                navigate('/500', { replace: true });
            }
        };

        validateAndSetOrg();
    }, [user?.id, currentOrgId, location.pathname, navigate, isProduction, isPortalSubdomain]);

    if (!user) {
        return <AnimatedLogoLoader />;
    }

    return <>{children}</>;
} 