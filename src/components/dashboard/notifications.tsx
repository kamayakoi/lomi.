import { useState } from 'react'
import { Bell, Check, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Notification {
    id: number
    message: string
    time: string
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, message: "New message received", time: "2 min ago" },
        { id: 2, message: "Your order has been shipped", time: "1 hour ago" },
        { id: 3, message: "Payment successful", time: "2 hours ago" },
    ])

    const clearNotification = (id: number) => {
        setNotifications(notifications.filter(notif => notif.id !== id))
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-accent transition-colors duration-200">
                    <Bell className="h-5 w-5 text-foreground" />
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 sm:w-96 bg-white dark:bg-[#0a0f1c] border border-border shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    <Button variant="ghost" size="sm" onClick={() => setNotifications([])} className="text-muted-foreground hover:text-foreground">
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
                            <li key={notif.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-[#141a2e] rounded-md transition-colors duration-200">
                                <div>
                                    <p className="text-sm text-foreground">{notif.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => clearNotification(notif.id)} className="text-muted-foreground hover:text-foreground">
                                    <X className="h-4 w-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </PopoverContent>
        </Popover>
    )
}