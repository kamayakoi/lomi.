import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@/lib/hooks/use-user';
import { useSearchParams } from 'react-router-dom';
import { SidebarData } from '@/lib/types/sidebar';
export function useSidebarData() {
    const { user } = useUser();
    const [searchParams] = useSearchParams();
    const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchSidebarData = async () => {
            if (user) {
                try {
                    const organizationId = searchParams.get('org');
                    const { data, error } = await supabase.rpc('fetch_sidebar_data', { 
                        p_merchant_id: user.id,
                        p_organization_id: organizationId
                    });

                    if (error) {
                        console.error('Error fetching sidebar data:', error);
                        return;
                    }
                    if (data && data.length > 0) {
                        const mappedData: SidebarData = {
                            organizationId: data[0].organization_id,
                            organizationName: data[0].organization_name,
                            organizationLogo: null,
                            merchantName: data[0].merchant_name,
                            merchantRole: data[0].merchant_role
                        };

                        // Handle logo URL
                        if (data[0].organization_logo_url) {
                            try {
                                // Clean up the URL if it's already a full URL
                                const logoPath = data[0].organization_logo_url.includes('https://')
                                    ? data[0].organization_logo_url.split('/logos/').pop()
                                    : data[0].organization_logo_url;

                                if (!logoPath) {
                                    throw new Error('Invalid logo path');
                                }

                                const { data: publicUrl } = supabase
                                    .storage
                                    .from('logos')
                                    .getPublicUrl(logoPath);
                                if (publicUrl?.publicUrl) {
                                    mappedData.organizationLogo = publicUrl.publicUrl;
                                }
                            } catch (error) {
                                console.error('Error handling logo:', error);
                                mappedData.organizationLogo = null;
                            }
                        }
                        setSidebarData(mappedData);
                    }
                } catch (error) {
                    console.error('Error in fetchSidebarData:', error);
                }
            }
            setIsLoading(false);
        };
        fetchSidebarData();
    }, [user, searchParams]);
    return { sidebarData, isLoading };
}