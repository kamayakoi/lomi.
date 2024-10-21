import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

interface CustomerNotifications {
    newPaymentLinks: { email: boolean; whatsapp: boolean };
    paymentReminders: { email: boolean; whatsapp: boolean };
    successfulPaymentAttempts: { email: boolean; whatsapp: boolean };
}

interface MerchantRecipient {
    email: string;
    notification: string;
}

export function NotificationSettings() {
    const [customerNotifications, setCustomerNotifications] = useState<CustomerNotifications>({
        newPaymentLinks: { email: false, whatsapp: false },
        paymentReminders: { email: false, whatsapp: false },
        successfulPaymentAttempts: { email: false, whatsapp: false },
    })
    const [merchantRecipients, setMerchantRecipients] = useState<MerchantRecipient[]>([])

    const handleCustomerNotificationChange = (type: keyof CustomerNotifications, method: keyof CustomerNotifications[keyof CustomerNotifications]) => {
        setCustomerNotifications(prev => ({
            ...prev,
            [type]: { ...prev[type], [method]: !prev[type][method] }
        }))
    }

    const addMerchantRecipient = () => {
        setMerchantRecipients([...merchantRecipients, { email: '', notification: '' }])
    }

    const updateMerchantRecipient = (index: number, field: keyof MerchantRecipient, value: string) => {
        const updatedRecipients = [...merchantRecipients]
        if (updatedRecipients[index]) {
            updatedRecipients[index][field] = value
            setMerchantRecipients(updatedRecipients)
        }
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Customer Notifications</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Select the types of notifications you want to send to your customers. If you are using WhatsApp notifications, please make sure you have your customers&apos; consent to receive messages.
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left py-2">Notification Type</th>
                                    <th className="text-center py-2">Email</th>
                                    <th className="text-center py-2">WhatsApp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(customerNotifications).map(([type, methods]) => (
                                    <tr key={type}>
                                        <td className="py-2">{type.replace(/([A-Z])/g, ' $1').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</td>
                                        {Object.entries(methods).map(([method, isChecked]) => (
                                            <td key={method} className="py-2 text-center">
                                                <Checkbox
                                                    checked={isChecked as boolean}
                                                    onCheckedChange={() => handleCustomerNotificationChange(type as keyof CustomerNotifications, method as keyof CustomerNotifications[keyof CustomerNotifications])}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Merchant Notifications</h3>
                    <p className="text-sm text-muted-foreground mb-4">Add recipients who will be notified about invoice updates.</p>
                    {merchantRecipients.map((recipient, index) => (
                        <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                            <Input
                                placeholder="Email"
                                value={recipient.email}
                                onChange={(e) => updateMerchantRecipient(index, 'email', e.target.value)}
                                className="flex-grow"
                            />
                            <Select
                                value={recipient.notification}
                                onValueChange={(value) => updateMerchantRecipient(index, 'notification', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Notification" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Notifications</SelectItem>
                                    <SelectItem value="important">Important Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                    <Button variant="outline" onClick={addMerchantRecipient} className="mt-2">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add recipient
                    </Button>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Save Changes</Button>
            </CardFooter>
        </Card>
    )
}

export default NotificationSettings