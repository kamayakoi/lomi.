import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createSubscription } from './support_subscriptions'

interface CreatePlanFormProps {
    onClose: () => void
    onSuccess: () => void
}

interface SubscriptionFormData {
    merchantId: string
    organizationId: string
    customerId: string
    name: string
    description: string
    imageUrl: string
    startDate: Date
    billingFrequency: string
    amount: number
    currencyCode: string
    retryPaymentEvery: number
    totalRetries: number
    failedPaymentAction: string
    emailNotifications: Record<string, unknown>
    metadata: Record<string, unknown>
}

export const CreatePlanForm: React.FC<CreatePlanFormProps> = ({ onClose, onSuccess }) => {
    const { register, handleSubmit } = useForm<SubscriptionFormData>()
    const [startDate, setStartDate] = useState<Date>()

    const onSubmit = async (data: SubscriptionFormData) => {
        try {
            await createSubscription(data)
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error creating subscription:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                    id="name"
                    placeholder="Enter plan name"
                    {...register('name')}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="customer-id">Customer ID</Label>
                <Input
                    id="customer-id"
                    placeholder="Enter customer ID"
                    {...register('customerId')}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="plan-description">Plan description</Label>
                <Textarea
                    id="plan-description"
                    placeholder="Describe the plan"
                    {...register('description')}
                />
            </div>
            <div className="space-y-2">
                <Label>Payment details</Label>
                <RadioGroup defaultValue="amount-only">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="amount-only" id="amount-only" />
                        <Label htmlFor="amount-only">Show payment amount only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="amount-with-items" id="amount-with-items" />
                        <Label htmlFor="amount-with-items">Show payment amount with items</Label>
                    </div>
                </RadioGroup>
            </div>
            <div className="space-y-2">
                <Label htmlFor="payment-amount">Payment amount per cycle</Label>
                <div className="flex space-x-2">
                    <Select>
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="VND" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="vnd">VND</SelectItem>
                            <SelectItem value="usd">USD</SelectItem>
                            <SelectItem value="eur">EUR</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input id="payment-amount" type="number" placeholder="Enter amount" className="flex-1" />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Do you want to charge your customer immediately?</Label>
                <RadioGroup defaultValue="no">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="charge-yes" />
                        <Label htmlFor="charge-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="charge-no" />
                        <Label htmlFor="charge-no">No</Label>
                    </div>
                </RadioGroup>
                <p className="text-sm text-muted-foreground">
                    If yes, your customer will be charged right after they link their payment method. If the charge fails, this plan will not be activated.
                </p>
            </div>
            <div className="space-y-2">
                <Label>Start date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                                setStartDate(date)
                                const event = {
                                    target: {
                                        value: date,
                                    },
                                }
                                register('startDate').onChange(event)
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Create Plan</Button>
            </div>
        </form>
    )
}
