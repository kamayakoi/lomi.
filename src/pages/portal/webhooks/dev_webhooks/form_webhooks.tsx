import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createWebhook } from './support_webhooks'
import { useUser } from '@/lib/hooks/useUser'
import { webhook_event } from './types'
import { AlertCircle } from 'lucide-react'

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

interface WebhookError {
    message: string;
    code?: string;
    details?: unknown;
}

const urlPattern = /^https?:\/\/.+/i

export const CreateWebhookForm: React.FC<CreateWebhookFormProps> = ({ onClose, onSuccess }) => {
    const { user } = useUser()
    const [submitError, setSubmitError] = useState<string | null>(null)
    const { register, handleSubmit, control, formState: { errors } } = useForm<WebhookFormData>()

    const onSubmit = async (data: WebhookFormData) => {
        try {
            setSubmitError(null)
            await createWebhook({
                merchantId: user?.id || '',
                url: data.url,
                event: data.event,
                isActive: true,
                metadata: {},
            })
            onSuccess()
            onClose()
        } catch (error: unknown) {
            console.error('Error creating webhook:', error)
            const webhookError = error as WebhookError
            setSubmitError(webhookError.message || 'Failed to create webhook. Please try again.')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="url">Webhook URL</Label>
                <Input
                    id="url"
                    placeholder="Enter webhook URL (e.g., https://api.example.com/webhook)"
                    className={`rounded-none ${errors.url ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    {...register('url', {
                        required: 'Webhook URL is required',
                        pattern: {
                            value: urlPattern,
                            message: 'URL must start with http:// or https://'
                        }
                    })}
                />
                {errors.url && (
                    <div className="flex items-center gap-x-2 text-sm text-red-500 mt-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.url.message}</span>
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="event">Event</Label>
                <Controller
                    name="event"
                    control={control}
                    rules={{ required: 'Event type is required' }}
                    render={({ field, fieldState: { error } }) => (
                        <div>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className={`w-full rounded-none ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}>
                                    <SelectValue placeholder="Select an event" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="new_payment">New Payment</SelectItem>
                                    <SelectItem value="new_subscription">New Subscription</SelectItem>
                                    <SelectItem value="payment_status_change">Payment Status Change</SelectItem>
                                    <SelectItem value="subscription_status_change">Subscription Status Change</SelectItem>
                                </SelectContent>
                            </Select>
                            {error && (
                                <div className="flex items-center gap-x-2 text-sm text-red-500 mt-1">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{error.message}</span>
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>
            {submitError && (
                <div className="flex items-center gap-x-2 text-sm text-red-500 bg-red-50 p-3 rounded-sm border border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <span>{submitError}</span>
                </div>
            )}
            <div className="flex justify-end">
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-none">
                    Create a webhook
                </Button>
            </div>
        </form>
    )
}
