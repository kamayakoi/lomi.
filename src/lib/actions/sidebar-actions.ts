import { supabase } from '@/utils/supabase/client';
import { SidebarData } from '@/lib/types/sidebar';
import { sidebarCache } from '@/utils/cache/sidebar-cache';

export const fetchSidebarData = async (
  setSidebarData: React.Dispatch<React.SetStateAction<SidebarData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  setIsLoading(true);
  setError(null);

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Try to get data from cache first
      const cachedData = await sidebarCache.get(user.id);

      if (cachedData) {
        setSidebarData(cachedData);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('fetch_sidebar_data', { p_merchant_id: user.id });

      if (error) {
        setError('Error fetching sidebar data');
      } else if (data && data.length > 0) {
        // Set initial data without logo
        const sidebarData: SidebarData = {
          organizationId: data[0].organization_id,
          organizationName: data[0].organization_name,
          merchantName: data[0].merchant_name,
          merchantRole: data[0].merchant_role,
          organizationLogo: null,
        };

        // Handle logo separately
        if (data[0].organization_logo_url) {
          try {
            // First try to get the public URL
            const { data: publicUrl } = supabase
              .storage
              .from('logos')
              .getPublicUrl(data[0].organization_logo_url);

            if (publicUrl?.publicUrl) {
              // Verify the image exists
              const response = await fetch(publicUrl.publicUrl, { method: 'HEAD' });
              if (response.ok) {
                sidebarData.organizationLogo = publicUrl.publicUrl;
              } else {
                // If public URL fails, try to download and create blob URL
                const { data: logoData } = await supabase
                  .storage
                  .from('logos')
                  .download(data[0].organization_logo_url);
                
                if (logoData) {
                  const logoUrl = URL.createObjectURL(logoData);
                  sidebarData.organizationLogo = logoUrl;
                }
              }
            }
          } catch (error) {
            console.error('Error handling logo:', error);
            // Keep organizationLogo as null if there's an error
          }
        }

        // Cache the data
        await sidebarCache.set(user.id, sidebarData);
        setSidebarData(sidebarData);
      }
    }
  } catch (error) {
    setError('Failed to fetch sidebar data');
  } finally {
    setIsLoading(false);
  }
};

// Add function to invalidate cache when needed
export const invalidateSidebarCache = async (userId: string) => {
  await sidebarCache.del(userId);
}; 