import { createContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@/lib/hooks/useUser';

interface OrganizationDetails {
    organization_id: string;
    organization_name: string;
    // Add other properties as needed
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
                    setOrganizationDetails(data[0] as OrganizationDetails);
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