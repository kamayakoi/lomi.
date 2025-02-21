import { useState, useEffect, useContext } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { toast } from "@/lib/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type CheckedState } from "@radix-ui/react-checkbox"
import { type CheckoutSettings, type CustomerNotifications, type MerchantRecipient } from '@/lib/types/checkout-settings'
import { OrganizationContext } from '@/lib/contexts/organization-context'
import { supabase } from '@/utils/supabase/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const DEFAULT_CUSTOMER_NOTIFICATIONS: CustomerNotifications = {
    new_payment_links: { email: false, whatsapp: false },
    payment_reminders: { email: false, whatsapp: false },
    successful_payment_attempts: { email: false, whatsapp: false },
}

export function NotificationSettings() {
    const { organizationId } = useContext(OrganizationContext)
    const queryClient = useQueryClient()
    const [customerNotifications, setCustomerNotifications] = useState<CustomerNotifications>(DEFAULT_CUSTOMER_NOTIFICATIONS)
    const [merchantRecipients, setMerchantRecipients] = useState<MerchantRecipient[]>([])
    const [isSaving, setIsSaving] = useState(false)

    // Fetch settings
    const { data: checkoutSettings } = useQuery({
        queryKey: ['checkoutSettings', organizationId],
        queryFn: async () => {
            if (!organizationId) return null
            const { data, error } = await supabase.rpc('fetch_organization_checkout_settings', {
                p_organization_id: organizationId
            })
            if (error) throw error
            return data?.[0] || null
        },
        enabled: !!organizationId
    })

    // Update settings mutation
    const updateSettingsMutation = useMutation({
        mutationFn: async (settings: Partial<CheckoutSettings>) => {
            if (!organizationId) throw new Error('No organization ID')
            const { error } = await supabase.rpc('update_organization_checkout_settings', {
                p_organization_id: organizationId,
                p_settings: settings
            })
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['checkoutSettings'] })
            toast({
                title: "Success",
                description: "Settings updated successfully",
            })
        },
        onError: (error) => {
            console.error('Error updating settings:', error)
            toast({
                title: "Error",
                description: "Failed to update settings",
                variant: "destructive",
            })
        }
    })

    useEffect(() => {
        if (checkoutSettings) {
            setCustomerNotifications(checkoutSettings.customer_notifications || DEFAULT_CUSTOMER_NOTIFICATIONS)
            setMerchantRecipients(checkoutSettings.merchant_recipients || [])
        }
    }, [checkoutSettings])

    const handleCustomerNotificationChange = (type: keyof CustomerNotifications, method: 'email' | 'whatsapp', checked: CheckedState) => {
        if (typeof checked === 'boolean') {
            const updatedNotifications = {
                ...customerNotifications,
                [type]: { ...customerNotifications[type], [method]: checked }
            }
            setCustomerNotifications(updatedNotifications)

            // Update just the notifications
            updateSettingsMutation.mutate({
                customer_notifications: updatedNotifications
            })
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
            await updateSettingsMutation.mutateAsync({
                customer_notifications: customerNotifications,
                merchant_recipients: merchantRecipients.filter(r => r.email && r.notification)
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-4">
            <Card className="rounded-none">
                <CardHeader>
                    <CardTitle>Customer notifications</CardTitle>
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

            <Card className="rounded-none">
                <CardHeader>
                    <CardTitle>Merchant recipients</CardTitle>
                    <CardDescription>
                        Add team members who should receive payment notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1">
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
                    </div>
                    <Button
                        variant="outline"
                        onClick={addMerchantRecipient}
                        className="w-full rounded-none"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Recipient
                    </Button>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSave}
                        className="ml-auto rounded-none bg-blue-500 hover:bg-blue-600 text-white"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default NotificationSettings