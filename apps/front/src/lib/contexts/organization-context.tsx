import { createContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@/lib/hooks/use-user';
import { useParams } from 'react-router-dom';

interface OrganizationDetails {
    organization_id: string;
    name: string;
    email: string;
    logo_url: string | null;
    website_url: string | null;
    verified: boolean;
    default_currency: 'XOF' | 'USD' | 'EUR';
    country: string;
    region: string;
    city: string;
    district: string;
    street: string;
    postal_code: string;
}

interface OrganizationContextProps {
    organizationId: string | null;
    organizationDetails: OrganizationDetails | null;
    isLoading: boolean;
    error: Error | null;
}

const OrganizationContext = createContext<OrganizationContextProps>({
    organizationId: null,
    organizationDetails: null,
    isLoading: true,
    error: null,
});

const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const params = useParams();
    const [organizationDetails, setOrganizationDetails] = useState<OrganizationDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Get organization ID from URL params, null if not present
    const organizationId = params['organizationId'] || null;

    useEffect(() => {
        const fetchOrganizationDetails = async () => {
            if (!user?.id || !organizationId) return;

            try {
                setIsLoading(true);
                setError(null);

                // Fetch organization details
                const { data, error } = await supabase.rpc('fetch_organization_details', {
                    p_merchant_id: user.id,
                    p_organization_id: organizationId
                });

                if (error) throw error;

                if (Array.isArray(data) && data[0]) {
                    setOrganizationDetails(data[0]);
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch organization details'));
                console.error('Error fetching organization details:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrganizationDetails();
    }, [user?.id, organizationId]);

    return (
        <OrganizationContext.Provider value={{
            organizationId,
            organizationDetails,
            isLoading,
            error
        }}>
            {children}
        </OrganizationContext.Provider>
    );
};

export { OrganizationContext, OrganizationProvider };
