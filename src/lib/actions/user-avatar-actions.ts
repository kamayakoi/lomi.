import { supabase } from '@/utils/supabase/client';

export const fetchUserAvatar = async (
    setAvatarUrl: React.Dispatch<React.SetStateAction<string | null>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
    setIsLoading(true);
    setError(null);

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: avatarPath, error: avatarError } = await supabase
                .rpc('fetch_user_avatar', { p_user_id: user.id });

            if (avatarError) {
                setError('Error fetching avatar URL');
            } else {
                if (avatarPath) {
                    const { data: avatarData, error: downloadError } = await supabase
                        .storage
                        .from('avatars')
                        .download(avatarPath);

                    if (downloadError) {
                        setError('Error downloading avatar');
                    } else {
                        const url = URL.createObjectURL(avatarData);
                        setAvatarUrl(url);
                    }
                }
            }
        }
    } catch (error) {
        setError('Failed to fetch user avatar');
    } finally {
        setIsLoading(false);
    }
};
