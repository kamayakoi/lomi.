import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@/lib/hooks/use-user';

interface SidebarData {
    organization_id: string;
    organization_name: string;
    organization_logo_url: string;
    merchant_name: string;
    merchant_role: string;
}

export function useSidebarData() {
    const { user } = useUser();
    const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSidebarData = async () => {
            if (user) {
                const { data, error } = await supabase.rpc('fetch_sidebar_data', { p_merchant_id: user.id });
                if (error) {
                    console.error('Error fetching sidebar data:', error);
                } else {
                    setSidebarData(data[0] as SidebarData);
                }
            }
            setIsLoading(false);
        };

        fetchSidebarData();
    }, [user]);

    return { sidebarData, isLoading };
}
