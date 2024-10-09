import { useState, useEffect } from 'react'
import { Bell, Check, X, Info, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { supabase } from '@/utils/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { useUser } from '@/lib/hooks/useUser'

interface Notification {
    notification_id: string
    type: string
    message: string
    is_read: boolean
    created_at: string
}

const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'onboarding':
            return <Info className="h-4 w-4 text-green-500" />
        case 'tip':
            return <AlertCircle className="h-4 w-4 text-yellow-500" />
        default:
            return null
    }
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const { user, isLoading } = useUser()

    useEffect(() => {
        const fetchNotifications = async () => {
            if (user) {
                const { data, error } = await supabase
                    .rpc('fetch_notifications', { p_merchant_id: user.id })

                if (error) {
                    console.error('Error fetching notifications:', error)
                } else {
                    setNotifications(data)
                }
            }
        }

        if (!isLoading) {
            fetchNotifications()
        }
    }, [user, isLoading])

    const markNotificationAsRead = async (id: string) => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('notification_id', id)

        setNotifications(notifications.map(notif =>
            notif.notification_id === id ? { ...notif, is_read: true } : notif
        ))
    }

    const removeNotification = async (id: string) => {
        await supabase
            .from('notifications')
            .delete()
            .eq('notification_id', id)

        setNotifications(notifications.filter(notif => notif.notification_id !== id))
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-accent transition-colors duration-200">
                    <Bell className="h-5 w-5 text-foreground" />
                    {notifications.some(notif => !notif.is_read) && (
                        <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 sm:w-96 bg-white dark:bg-[#0a0f1c] border border-border shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    <Button variant="ghost" size="sm" onClick={() => setNotifications(notifications.filter(notif => !notif.is_read))} className="text-muted-foreground hover:text-foreground">
                        Clear all
                    </Button>
                </div>
                {notifications.length === 0 ? (
                    <div className="text-center py-4">
                        <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-muted-foreground">All caught up!</p>
                    </div>
                ) : (
                    <ul className="space-y-2 max-h-[60vh] overflow-auto">
                        {notifications.map((notif) => (
                            <li
                                key={notif.notification_id}
                                className={`flex items-start justify-between p-3 rounded-md transition-colors duration-200 ${notif.is_read
                                    ? 'bg-gray-50 dark:bg-[#141a2e]'
                                    : 'bg-blue-50 dark:bg-blue-900'
                                    }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <NotificationIcon type={notif.type} />
                                    <div>
                                        <p className="text-sm text-foreground">{notif.message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {!notif.is_read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => markNotificationAsRead(notif.notification_id)}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeNotification(notif.notification_id)}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </PopoverContent>
        </Popover>
    )
}