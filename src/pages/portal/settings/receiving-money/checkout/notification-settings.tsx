import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type CheckedState } from "@radix-ui/react-checkbox"
import { type CheckoutSettings, type CustomerNotifications, type MerchantRecipient } from '@/lib/types/checkoutsettings'

const DEFAULT_CUSTOMER_NOTIFICATIONS: CustomerNotifications = {
    new_payment_links: { email: false, whatsapp: false },
    payment_reminders: { email: false, whatsapp: false },
    successful_payment_attempts: { email: false, whatsapp: false },
}

interface NotificationSettingsProps {
    settings: CheckoutSettings | null;
    onUpdate: (settings: Partial<CheckoutSettings>) => Promise<void>;
}

export function NotificationSettings({ settings, onUpdate }: NotificationSettingsProps) {
    const [customerNotifications, setCustomerNotifications] = useState<CustomerNotifications>(DEFAULT_CUSTOMER_NOTIFICATIONS)
    const [merchantRecipients, setMerchantRecipients] = useState<MerchantRecipient[]>([])
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (settings) {
            setCustomerNotifications(settings.customer_notifications || DEFAULT_CUSTOMER_NOTIFICATIONS)
            setMerchantRecipients(settings.merchant_recipients || [])
        }
    }, [settings])

    const handleCustomerNotificationChange = (type: keyof CustomerNotifications, method: 'email' | 'whatsapp', checked: CheckedState) => {
        if (typeof checked === 'boolean') {
            setCustomerNotifications(prev => ({
                ...prev,
                [type]: { ...prev[type], [method]: checked }
            }))
        }
    }

    const addMerchantRecipient = () => {
        const newRecipient: MerchantRecipient = {
            email: '',
            notification: 'all'
        }
        setMerchantRecipients(prevRecipients => [...prevRecipients, newRecipient])
    }

    const updateMerchantRecipient = (index: number, field: keyof MerchantRecipient, value: string) => {
        setMerchantRecipients(prevRecipients => {
            const updatedRecipients = [...prevRecipients]
            const currentRecipient = updatedRecipients[index] || { email: '', notification: 'all' }

            if (field === 'notification' && (value === 'all' || value === 'important')) {
                updatedRecipients[index] = {
                    ...currentRecipient,
                    notification: value
                }
            } else if (field === 'email') {
                updatedRecipients[index] = {
                    ...currentRecipient,
                    email: value
                }
            }

            return updatedRecipients
        })
    }

    const removeMerchantRecipient = (index: number) => {
        setMerchantRecipients(prevRecipients => prevRecipients.filter((_, i) => i !== index))
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)
            await onUpdate({
                customer_notifications: customerNotifications,
                merchant_recipients: merchantRecipients.filter(r => r.email && r.notification)
            })
            toast({
                title: "Success",
                description: "Notification settings updated successfully",
            })
        } catch (error) {
            console.error('Error saving notification settings:', error)
            toast({
                title: "Error",
                description: "Failed to update notification settings",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Customer Notifications</CardTitle>
                    <CardDescription>
                        Configure notifications sent to your customers during the payment process
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-none">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Notification Type</TableHead>
                                    <TableHead className="text-center">Email</TableHead>
                                    <TableHead className="text-center">WhatsApp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(customerNotifications).map(([type, methods]) => (
                                    <TableRow key={type}>
                                        <TableCell>
                                            {type.replace(/([A-Z])/g, ' $1')
                                                .split('_')
                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(' ')}
                                        </TableCell>
                                        {Object.entries(methods).map(([method, isChecked]) => (
                                            <TableCell key={method} className="text-center">
                                                <Checkbox
                                                    checked={isChecked as boolean}
                                                    onCheckedChange={(checked) => handleCustomerNotificationChange(
                                                        type as keyof CustomerNotifications,
                                                        method as 'email' | 'whatsapp',
                                                        checked
                                                    )}
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Merchant Recipients</CardTitle>
                    <CardDescription>
                        Add team members who should receive payment notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {merchantRecipients.map((recipient, index) => (
                        <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <div className="flex-grow">
                                <Input
                                    placeholder="Email address"
                                    value={recipient.email}
                                    onChange={(e) => updateMerchantRecipient(index, 'email', e.target.value)}
                                    className="rounded-none"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <Select
                                    value={recipient.notification || 'all'}
                                    onValueChange={(value: 'all' | 'important') => updateMerchantRecipient(index, 'notification', value)}
                                >
                                    <SelectTrigger className="w-[180px] rounded-none">
                                        <SelectValue placeholder="Notification type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Notifications</SelectItem>
                                        <SelectItem value="important">Important Only</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeMerchantRecipient(index)}
                                    className="rounded-none hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        onClick={addMerchantRecipient}
                        className="w-full rounded-none"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Recipient
                    </Button>
                    <div className="pt-4">
                        <Button
                            onClick={handleSave}
                            className="w-full rounded-none"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default NotificationSettings