import React, { createContext, useEffect, useState } from 'react';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/actions/notifications-actions';
import { Notification } from '@/lib/types/notifications';

interface NotificationsContextValue {
    notifications: Notification[];
    isLoading: boolean;
    error: string | null;
    fetchNotifications: () => Promise<void>;
    markNotificationAsRead: (id: string) => Promise<void>;
    markAllNotificationsAsRead: () => Promise<void>;
}

export const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchNotifications(setNotifications, setIsLoading, setError);
    }, []);

    const contextValue: NotificationsContextValue = {
        notifications,
        isLoading,
        error,
        fetchNotifications: () => fetchNotifications(setNotifications, setIsLoading, setError),
        markNotificationAsRead: (id: string) => markNotificationAsRead(id, setNotifications),
        markAllNotificationsAsRead: () => markAllNotificationsAsRead(setNotifications),
    };

    return <NotificationsContext.Provider value={contextValue}>{children}</NotificationsContext.Provider>;
};
