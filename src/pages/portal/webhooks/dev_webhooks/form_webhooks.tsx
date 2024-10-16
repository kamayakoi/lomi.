import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from 'lucide-react'
import { createWebhook } from './support_webhooks'
import { useUser } from '@/lib/hooks/useUser'
import { webhook_event } from './types'

interface CreateWebhookFormProps {
    onClose: () => void
    onSuccess: () => void
}

interface WebhookFormData {
    url: string
    event: webhook_event
    isActive: boolean
    metadata: Record<string, unknown>
}

export const CreateWebhookForm: React.FC<CreateWebhookFormProps> = ({ onClose, onSuccess }) => {
    const { user } = useUser()
    const { register, handleSubmit } = useForm<WebhookFormData>()

    const onSubmit = async (data: WebhookFormData) => {
        try {
            await createWebhook({
                merchantId: user?.id || '',
                ...data,
            })
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error creating webhook:', error)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-background p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Create New Webhook</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="url">Webhook URL</Label>
                            <Input
                                id="url"
                                placeholder="Enter webhook URL"
                                {...register('url')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="event">Event</Label>
                            <Select {...register('event')}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an event" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new_payment">New Payment</SelectItem>
                                    <SelectItem value="new_subscription">New Subscription</SelectItem>
                                    <SelectItem value="payment_status_change">Payment Status Change</SelectItem>
                                    <SelectItem value="subscription_status_change">Subscription Status Change</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Create Webhook</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
