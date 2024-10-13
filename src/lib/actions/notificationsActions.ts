import { supabase } from '@/utils/supabase/client';
import { Notification } from '@/lib/types/notificationTypes.ts';

export const fetchNotifications = async (
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
    setIsLoading(true);
    setError(null);

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase.rpc('fetch_notifications', { p_merchant_id: user.id });

            if (error) {
                setError('Error fetching notifications');
            } else {
                setNotifications(data);
            }
        }
    } catch (error) {
        setError('Failed to fetch notifications');
    } finally {
        setIsLoading(false);
    }
};

export const markNotificationAsRead = async (
    id: string,
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
) => {
    await supabase.rpc('mark_notification_read', { p_notification_id: id });
    setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => (notif.notification_id === id ? { ...notif, is_read: true } : notif))
    );
};

export const markAllNotificationsAsRead = async (
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await supabase.rpc('mark_all_notifications_read', { p_merchant_id: user.id });
        setNotifications((prevNotifications) => prevNotifications.map((notif) => ({ ...notif, is_read: true })));
    }
};
