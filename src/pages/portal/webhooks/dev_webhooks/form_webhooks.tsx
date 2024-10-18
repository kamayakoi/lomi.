import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    const { register, handleSubmit, control } = useForm<WebhookFormData>()

    const onSubmit = async (data: WebhookFormData) => {
        try {
            await createWebhook({
                merchantId: user?.id || '',
                url: data.url,
                event: data.event,
                isActive: true,
                metadata: {},
            })
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error creating webhook:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <Controller
                    name="event"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    )}
                />
            </div>
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Create Webhook</Button>
            </div>
        </form>
    )
}
