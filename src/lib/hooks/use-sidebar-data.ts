import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@/lib/hooks/use-user';
import { useSearchParams } from 'react-router-dom';
import { SidebarData } from '@/lib/types/sidebar';
import { sidebarCache } from '@/utils/cache/sidebar-cache';

// Memory cache implementation
const MEMORY_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const memoryCache = new Map<string, { data: SidebarData; timestamp: number }>();

export function useSidebarData() {
    const { user } = useUser();
    const [searchParams] = useSearchParams();
    const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchSidebarData = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                const organizationId = searchParams.get('org');
                const cacheKey = `${user.id}:${organizationId || 'default'}`;

                // 1. Check memory cache first
                const memoryCached = memoryCache.get(cacheKey);
                if (memoryCached && Date.now() - memoryCached.timestamp < MEMORY_CACHE_DURATION) {
                    if (isMounted) {
                        setSidebarData(memoryCached.data);
                        setIsLoading(false);
                        setError(null);
                    }
                    return;
                }

                // 2. Try Redis cache through Edge Function
                const redisCached = await sidebarCache.get(user.id, organizationId || undefined);
                if (redisCached) {
                    // Update memory cache
                    memoryCache.set(cacheKey, {
                        data: redisCached,
                        timestamp: Date.now()
                    });
                    
                    if (isMounted) {
                        setSidebarData(redisCached);
                        setIsLoading(false);
                        setError(null);
                    }
                    return;
                }

                // 3. Fetch fresh data
                const { data, error: supabaseError } = await supabase.rpc('fetch_sidebar_data', {
                    p_merchant_id: user.id,
                    p_organization_id: organizationId
                });

                if (supabaseError) throw supabaseError;

                if (data && data.length > 0) {
                    const freshData: SidebarData = {
                        organizationId: data[0].organization_id,
                        organizationName: data[0].organization_name,
                        organizationLogo: null,
                        merchantName: data[0].merchant_name,
                        merchantRole: data[0].merchant_role
                    };

                    // Handle logo URL
                    if (data[0].organization_logo_url) {
                        try {
                            let logoPath = data[0].organization_logo_url;
                            
                            // Handle both full URLs and relative paths
                            if (logoPath.includes('https://')) {
                                const urlParts = logoPath.split('/logos/');
                                logoPath = urlParts.length > 1 ? urlParts[1] : logoPath;
                            }

                            // Validate logo path
                            if (logoPath && !logoPath.includes('https://')) {
                                const { data: publicUrl } = supabase.storage
                                    .from('logos')
                                    .getPublicUrl(logoPath);
                                
                                if (publicUrl?.publicUrl) {
                                    // Verify the image exists before setting it
                                    const checkImage = new Image();
                                    checkImage.onerror = () => {
                                        console.warn('Logo image failed to load:', publicUrl.publicUrl);
                                        freshData.organizationLogo = null;
                                    };
                                    checkImage.src = publicUrl.publicUrl;
                                    
                                    freshData.organizationLogo = publicUrl.publicUrl;
                                }
                            } else {
                                console.warn('Invalid logo path:', logoPath);
                            }
                        } catch (logoError) {
                            console.warn('Error processing logo URL:', logoError);
                            // Don't let logo errors affect the main functionality
                            freshData.organizationLogo = null;
                        }
                    }

                    console.log('💾 Updating caches with fresh data');
                    // Update both caches
                    memoryCache.set(cacheKey, {
                        data: freshData,
                        timestamp: Date.now()
                    });
                    await sidebarCache.set(user.id, freshData, organizationId || undefined);

                    if (isMounted) {
                        setSidebarData(freshData);
                        setError(null);
                    }
                }
            } catch (error) {
                console.error('❌ Error fetching sidebar data:', error);
                if (isMounted) {
                    setError(error instanceof Error ? error : new Error('Failed to fetch sidebar data'));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchSidebarData();

        return () => {
            isMounted = false;
        };
    }, [user, searchParams]);

    return { sidebarData, isLoading, error };
} 