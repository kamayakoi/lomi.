import { supabase } from '@/utils/supabase/client';
import { SidebarData } from '@/lib/types/sidebarTypes';

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
      const { data, error } = await supabase.rpc('fetch_sidebar_data', { p_merchant_id: user.id });

      if (error) {
        setError('Error fetching sidebar data');
      } else {
        setSidebarData({
          organizationName: data[0].organization_name,
          merchantName: data[0].merchant_name,
          merchantRole: data[0].merchant_role,
          organizationLogo: null,
        });

        const logoPath = data[0].organization_logo_url?.replace(/^.*\/logos\//, '');
        if (logoPath) {
          const { data: logoData, error: logoError } = await supabase.storage.from('logos').download(logoPath);
          if (!logoError) {
            const logoUrl = URL.createObjectURL(logoData);
            setSidebarData((prevData: SidebarData) => ({ ...prevData, organizationLogo: logoUrl }));
          }
        }
      }
    }
  } catch (error) {
    setError('Failed to fetch sidebar data');
  } finally {
    setIsLoading(false);
  }
};
