import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Info } from 'lucide-react'
import { createSubscriptionPlan } from './support_subscriptions'

interface CreatePlanFormProps {
    onClose: () => void
    onSuccess: () => void
    merchantId: string
}

type Frequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quaterly' | 'yearly' | 'one-time'
type SubscriptionLength = 'automatic' | 'fixed'
type FirstPaymentType = 'normal' | 'non_initial' | 'proportional'
type CollectionDateType = 'maintain' | 'specific_day'

interface SubscriptionPlanFormData {
    merchant_id: string
    organization_id: string
    name: string
    description: string
    billing_frequency: Frequency
    amount: number
    currency_code: 'XOF'
    subscription_length: SubscriptionLength
    fixed_charges?: number
    retry_payment_every: number
    total_retries: number
    failed_payment_action: string
    first_payment_type: FirstPaymentType
    collection_date_type: CollectionDateType
    collection_day?: number
    metadata: Record<string, unknown>
}

const frequencyOptions: Frequency[] = ['daily', 'weekly', 'bi-weekly', 'monthly', 'quaterly', 'yearly', 'one-time']
const fixedChargesOptions = [3, 6, 9, 12, 18, 24, 36]

export function CreatePlanForm({ onClose, onSuccess, merchantId }: CreatePlanFormProps) {
    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<SubscriptionPlanFormData>({
        defaultValues: {
            merchant_id: merchantId,
            currency_code: 'XOF',
            subscription_length: 'automatic',
            retry_payment_every: 0,
            total_retries: 0,
            first_payment_type: 'normal',
            collection_date_type: 'maintain',
            metadata: {}
        }
    })

    const [showCustomCharges, setShowCustomCharges] = useState(false)

    const subscriptionLength = watch('subscription_length')
    const collectionDateType = watch('collection_date_type')

    const onSubmit = async (data: SubscriptionPlanFormData) => {
        try {
            await createSubscriptionPlan({
                merchantId: data.merchant_id,
                name: data.name,
                description: data.description,
                billingFrequency: data.billing_frequency,
                amount: data.amount,
                currencyCode: data.currency_code,
                retryPaymentEvery: data.retry_payment_every,
                totalRetries: data.total_retries,
                failedPaymentAction: data.failed_payment_action,
                emailNotifications: {}, // Add email notifications data if needed
                metadata: data.metadata,
            })
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error creating subscription plan:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Subscription Plan</CardTitle>
                        <CardDescription>Set up a new subscription plan for your customers</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Plan name</Label>
                            <Input
                                id="name"
                                placeholder="Enter plan name"
                                className="rounded-none"
                                {...register('name', { required: 'Plan name is required' })}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Plan description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the plan"
                                className="rounded-none"
                                {...register('description')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Plan price (XOF)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Enter amount in XOF"
                                className="rounded-none"
                                {...register('amount', {
                                    required: 'Amount is required',
                                    min: { value: 0.01, message: 'Amount must be greater than 0' }
                                })}
                            />
                            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="billing_frequency">Plan frequency</Label>
                            <Controller
                                name="billing_frequency"
                                control={control}
                                rules={{ required: 'Billing frequency is required' }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select billing frequency">
                                                {frequencyOptions.find(f => f === field.value)?.charAt(0).toUpperCase() + (frequencyOptions.find(f => f === field.value)?.slice(1) ?? '')}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {frequencyOptions.map((frequency) => (
                                                <SelectItem key={frequency} value={frequency}>
                                                    {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.billing_frequency && <p className="text-sm text-red-500">{errors.billing_frequency.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Subscription length</Label>
                            <RadioGroup
                                defaultValue="automatic"
                                onValueChange={(value: SubscriptionLength) => setValue('subscription_length', value)}
                                className="rounded-none"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="automatic" id="automatic" />
                                    <Label htmlFor="automatic">Automatic renewal</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="fixed" id="fixed" />
                                    <Label htmlFor="fixed">End after specific charges</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {subscriptionLength === 'fixed' && (
                            <div className="space-y-2">
                                <Label htmlFor="fixed_charges">Number of charges</Label>
                                <Controller
                                    name="fixed_charges"
                                    control={control}
                                    rules={{ required: 'Number of charges is required' }}
                                    render={({ field }) => (
                                        <Select onValueChange={(value: string) => {
                                            if (value === 'custom') {
                                                setShowCustomCharges(true)
                                            } else {
                                                setShowCustomCharges(false)
                                                field.onChange(parseInt(value))
                                            }
                                        }}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select number of charges">
                                                    {field.value ? `End after ${field.value} charges` : ''}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {fixedChargesOptions.map((option) => (
                                                    <SelectItem key={option} value={option.toString()}>
                                                        End after {option} charges
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="custom">Customized</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {showCustomCharges && (
                                    <Input
                                        type="number"
                                        placeholder="Enter custom number of charges"
                                        className="rounded-none"
                                        {...register('fixed_charges', {
                                            required: 'Number of charges is required',
                                            min: { value: 1, message: 'Must be at least 1' }
                                        })}
                                    />
                                )}
                                {errors.fixed_charges && <p className="text-sm text-red-500">{errors.fixed_charges.message}</p>}
                            </div>
                        )}

                        <Accordion type="single" collapsible>
                            <AccordionItem value="advanced-settings">
                                <AccordionTrigger>Advanced settings</AccordionTrigger>
                                <AccordionContent className="mt-4 space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Collection Date</Label>
                                            <RadioGroup
                                                defaultValue="maintain"
                                                onValueChange={(value: CollectionDateType) => setValue('collection_date_type', value)}
                                                className="rounded-none"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="maintain" id="maintain" />
                                                    <Label htmlFor="maintain">Maintain the collection date according to the frequency of the subscription</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="specific_day" id="specific_day" />
                                                    <Label htmlFor="specific_day">Charge subscription on a specific day of the month</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        {collectionDateType === 'specific_day' && (
                                            <div className="space-y-2">
                                                <Label htmlFor="collection_day">Collection day of the month</Label>
                                                <Controller
                                                    name="collection_day"
                                                    control={control}
                                                    rules={{ required: 'Collection day is required', min: 1, max: 31 }}
                                                    render={({ field }) => (
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            max={31}
                                                            className="rounded-none"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                {errors.collection_day && <p className="text-sm text-red-500">{errors.collection_day.message}</p>}
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label>First payment of the subscription</Label>
                                            <Controller
                                                name="first_payment_type"
                                                control={control}
                                                render={({ field }) => (
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="rounded-none">
                                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                            <Card>
                                                                <CardHeader>
                                                                    <CardTitle>
                                                                        <RadioGroupItem value="normal" id="normal" className="mr-2" />
                                                                        <Label htmlFor="normal">Normal charge</Label>
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    The subscription will be charged at the beginning and in each subsequent period.
                                                                </CardContent>
                                                            </Card>
                                                            <Card>
                                                                <CardHeader>
                                                                    <CardTitle>
                                                                        <RadioGroupItem value="non_initial" id="non_initial" className="mr-2" />
                                                                        <Label htmlFor="non_initial">Non initial charge</Label>
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    Subscription will be initiated without charge. A charge will be applied on the nearest selected debit day.
                                                                </CardContent>
                                                            </Card>
                                                            <Card>
                                                                <CardHeader>
                                                                    <CardTitle>
                                                                        <RadioGroupItem value="proportional" id="proportional" className="mr-2" />
                                                                        <Label htmlFor="proportional">Proportional charge</Label>
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    The proportional will be calculated from the current date to the next nearest collection date. The following charges will be for the totality of the subscription.
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    </RadioGroup>
                                                )}
                                            />
                                        </div>

                                        <Card className="w-full">
                                            <CardHeader>
                                                <CardTitle className="text-lg font-semibold flex items-center">
                                                    Smart Retries
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="ml-2">
                                                                <Info className="h-4 w-4" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-80">
                                                            <p className="text-sm">
                                                                Smart Retries allow you to set up a strategy for retrying failed payments.
                                                                Specify the number of days between retries and the total number of retry attempts.
                                                            </p>
                                                        </PopoverContent>
                                                    </Popover>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="retry_payment_every">Days between retries</Label>
                                                        <Controller
                                                            name="retry_payment_every"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Slider
                                                                    min={0}
                                                                    max={30}
                                                                    step={1}
                                                                    value={[field.value]}
                                                                    onValueChange={(value) => field.onChange(value[0])}
                                                                    className="rounded-none"
                                                                />
                                                            )}
                                                        />
                                                        <div className="text-sm text-muted-foreground mt-1">
                                                            Retry every {watch('retry_payment_every')} day(s)
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="total_retries">Total number of retries</Label>
                                                        <Controller
                                                            name="total_retries"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Slider
                                                                    min={0}
                                                                    max={10}
                                                                    step={1}
                                                                    value={[field.value]}
                                                                    onValueChange={(value) => field.onChange(value[0])}
                                                                    className="rounded-none"
                                                                />
                                                            )}
                                                        />
                                                        <div className="text-sm text-muted-foreground mt-1">
                                                            {watch('total_retries')} total retry attempts
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <div className="space-y-2">
                                            <Label htmlFor="failed_payment_action">Failed Payment Action</Label>
                                            <Select {...register('failed_payment_action')}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select action" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cancel">Cancel subscription</SelectItem>
                                                    <SelectItem value="pause">Pause subscription</SelectItem>
                                                    <SelectItem value="continue">Continue subscription</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="submit">Create Plan</Button>
            </div>
        </form>
    )
}
