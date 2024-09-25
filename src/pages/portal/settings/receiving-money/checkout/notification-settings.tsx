import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

interface CustomerNotifications {
    newPaymentLinks: { email: boolean; whatsapp: boolean; viber: boolean };
    paymentReminders: { email: boolean; whatsapp: boolean; viber: boolean };
    successfulPaymentAttempts: { email: boolean; whatsapp: boolean; viber: boolean };
}

interface MerchantRecipient {
    email: string;
    notification: string;
}

export function NotificationSettings() {
    const [notificationType, setNotificationType] = useState('physical-and-digital')
    const [customerNotifications, setCustomerNotifications] = useState<CustomerNotifications>({
        newPaymentLinks: { email: false, whatsapp: false, viber: false },
        paymentReminders: { email: false, whatsapp: false, viber: false },
        successfulPaymentAttempts: { email: false, whatsapp: false, viber: false },
    })
    const [merchantRecipients, setMerchantRecipients] = useState<MerchantRecipient[]>([])
    const [supportEmail, setSupportEmail] = useState('no-reply@xendit.co')

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
        updatedRecipients[index][field] = value
        setMerchantRecipients(updatedRecipients)
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Notifications</h2>

            <div>
                <Label htmlFor="notificationType">Notification Type</Label>
                <p className="text-sm text-muted-foreground mb-2">Select the option that best fits your business</p>
                <Select value={notificationType} onValueChange={setNotificationType}>
                    <SelectTrigger id="notificationType">
                        <SelectValue placeholder="Select notification type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="physical-and-digital">Physical and Digital Products</SelectItem>
                        <SelectItem value="physical">Physical Products</SelectItem>
                        <SelectItem value="digital">Digital Products</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Example Notification</h3>
                    <p className="text-sm">Please complete your order in WTExport</p>
                    <p className="text-sm mt-2">
                        You made an order with WTExport on 24 Sep 2024, 19:51 (GMT). Please pay through this link:
                        https://xen.to/example
                    </p>
                </CardContent>
            </Card>

            <div>
                <h3 className="text-lg font-semibold mb-2">Customer Notifications</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Select the types of notifications you want to send to your customers. If you are using WhatsApp notifications, please make sure you have your customers&apos; consent to receive messages.
                </p>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th className="text-left">Email</th>
                            <th className="text-left">WhatsApp</th>
                            <th className="text-left">Viber</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(customerNotifications).map(([type, methods]) => (
                            <tr key={type}>
                                <td className="py-2">{type.replace(/([A-Z])/g, ' $1').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</td>
                                {Object.entries(methods).map(([method, isChecked]) => (
                                    <td key={method} className="py-2">
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

            <div>
                <h3 className="text-lg font-semibold mb-2">Merchant Notifications</h3>
                <p className="text-sm text-muted-foreground mb-4">Add recipients who will be notified about invoice updates.</p>
                {merchantRecipients.map((recipient, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                        <Input
                            placeholder="Email"
                            value={recipient.email}
                            onChange={(e) => updateMerchantRecipient(index, 'email', e.target.value)}
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

            <div>
                <h3 className="text-lg font-semibold mb-2">Customer Support</h3>
                <p className="text-sm text-muted-foreground mb-2">Add the support email that your customers can reply to on your email notifications.</p>
                <Input
                    placeholder="Customer Support Email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                />
            </div>

            <Button>Save Changes</Button>
        </div>
    )
}

export default NotificationSettings