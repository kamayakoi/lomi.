import { useState, useEffect } from 'react'
import { Bell, Check, InfoIcon, AlertTriangle, ShieldAlert, RefreshCw, AlertOctagon, FileText, Settings, Repeat, Webhook, ArrowLeftRight } from 'lucide-react'
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
    return (
        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center">
            {(() => {
                switch (type) {
                    case 'onboarding':
                        return <InfoIcon className="w-4 h-4 text-green-500" />
                    case 'tip':
                        return <InfoIcon className="w-4 h-4 text-green-500" />
                    case 'alert':
                    case 'security_alert':
                        return <AlertOctagon className="w-4 h-4 text-red-500" />
                    case 'update':
                        return <RefreshCw className="w-4 h-4 text-cyan-500" />
                    case 'maintenance':
                        return <Settings className="w-4 h-4 text-gray-500" />
                    case 'compliance':
                        return <ShieldAlert className="w-4 h-4 text-indigo-500" />
                    case 'billing':
                        return <FileText className="w-4 h-4 text-purple-500" />
                    case 'invoice':
                        return <FileText className="w-4 h-4 text-blue-500" />
                    case 'provider_status':
                        return <AlertTriangle className="w-4 h-4 text-orange-500" />
                    case 'dispute':
                        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    case 'subscription':
                        return <Repeat className="w-4 h-4 text-teal-500" />
                    case 'webhook':
                        return <Webhook className="w-4 h-4 text-indigo-500" />
                    case 'transaction':
                        return <InfoIcon className="w-4 h-4 text-green-500" />
                    case 'payout':
                        return <InfoIcon className="w-4 h-4 text-green-500" />
                    case 'refund':
                        return <ArrowLeftRight className="w-4 h-4 text-yellow-500" />
                    case 'chargeback':
                        return <ArrowLeftRight className="w-4 h-4 text-red-500" />
                    default:
                        return <InfoIcon className="w-4 h-4 text-blue-500" />
                }
            })()}
        </div>
    )
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
            .rpc('mark_notification_read', { p_notification_id: id })

        setNotifications(notifications.map(notif =>
            notif.notification_id === id ? { ...notif, is_read: true } : notif
        ))
    }

    const markAllNotificationsAsRead = async () => {
        if (user) {
            const { error } = await supabase
                .rpc('mark_all_notifications_read', { p_merchant_id: user.id })

            if (error) {
                console.error('Error marking all notifications as read:', error)
            } else {
                setNotifications(notifications.map(notif => ({ ...notif, is_read: true })))
            }
        }
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
            <PopoverContent
                className="w-80 sm:w-96 bg-white dark:bg-[#0a0f1c] border border-border shadow-lg rounded-lg"
                align="end"
                alignOffset={-15}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllNotificationsAsRead}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Clear all
                    </Button>
                </div>
                {notifications.length === 0 || notifications.every(notif => notif.is_read) ? (
                    <div className="text-center py-4">
                        <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-muted-foreground">All caught up!</p>
                    </div>
                ) : (
                    <ul className="space-y-2 max-h-[60vh] overflow-auto">
                        {notifications.filter(notif => !notif.is_read).map((notif) => (
                            <li
                                key={notif.notification_id}
                                className="flex items-start p-3 rounded-md transition-colors duration-200 bg-blue-50 dark:bg-blue-900"
                            >
                                <div className="flex items-start space-x-3 flex-grow">
                                    <NotificationIcon type={notif.type} />
                                    <div className="flex-grow">
                                        <p className="text-sm text-foreground text-justify">{notif.message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => markNotificationAsRead(notif.notification_id)}
                                    className="text-muted-foreground hover:text-foreground ml-4 bg-transparent hover:bg-transparent dark:hover:bg-transparent"
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </PopoverContent>
        </Popover>
    )
}