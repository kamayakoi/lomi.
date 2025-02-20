import { createContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@/lib/hooks/use-user';

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
}

const OrganizationContext = createContext<OrganizationContextProps>({
    organizationId: null,
    organizationDetails: null,
});

const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const [organizationId, setOrganizationId] = useState<string | null>(null);
    const [organizationDetails, setOrganizationDetails] = useState<OrganizationDetails | null>(null);

    useEffect(() => {
        const fetchOrganizationDetails = async () => {
            if (user?.id) {
                const { data, error } = await supabase.rpc('fetch_organization_details', { p_merchant_id: user.id });

                if (error) {
                    console.error('Error fetching organization details:', error);
                } else if (Array.isArray(data) && data[0]) {
                    setOrganizationId(data[0].organization_id);
                    setOrganizationDetails(data[0]);
                }
            }
        };

        fetchOrganizationDetails();
    }, [user?.id]);

    return (
        <OrganizationContext.Provider value={{ organizationId, organizationDetails }}>
            {children}
        </OrganizationContext.Provider>
    );
};
export { OrganizationContext, OrganizationProvider };
