import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateSubscriptionPlan, deleteSubscriptionPlan } from './support_subscriptions'
import { frequency, failed_payment_action, FirstPaymentType, SubscriptionPlan, SubscriptionLength } from './types'
import React from 'react'
import { SelectProps } from '@radix-ui/react-select'
import { Switch } from "@/components/ui/switch"
import InputRightAddon from "@/components/ui/input-right-addon"

interface EditPlanFormProps {
    onClose: () => void
    onSuccess: () => void
    plan: SubscriptionPlan
}

type CollectionDateType = 'maintain' | 'specific_day'

interface SubscriptionPlanFormData {
    merchant_id: string
    name: string
    description: string
    billing_frequency: frequency
    amount: number
    currency_code: 'XOF'
    subscription_length: SubscriptionLength
    fixed_charges?: number
    failed_payment_action: failed_payment_action
    first_payment_type: FirstPaymentType
    collection_date_type: CollectionDateType
    collection_day?: number
    metadata: Record<string, unknown>
}

const frequencyOptions: frequency[] = ['weekly', 'bi-weekly', 'monthly', 'bi-monthly', 'quarterly', 'semi-annual', 'yearly', 'one-time']

const fixedChargesOptions: number[] = [3, 6, 9, 12, 18, 24, 36, 48, 60, 72, 84, 96];
const collectionDayOptions: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

interface ForwardedSelectProps extends SelectProps {
    placeholder?: string;
    value?: string;
}

const ForwardedSelect = React.forwardRef<HTMLButtonElement, ForwardedSelectProps>((props, ref) => (
    <Select {...props}>
        <SelectTrigger ref={ref} className="w-full">
            <SelectValue placeholder={props.placeholder}>
                {props.value}
            </SelectValue>
        </SelectTrigger>
        <SelectContent>
            {props.children}
        </SelectContent>
    </Select>
));

ForwardedSelect.displayName = 'ForwardedSelect';

export function EditPlanForm({ onClose, onSuccess, plan }: EditPlanFormProps) {
    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<SubscriptionPlanFormData>({
        defaultValues: {
            merchant_id: plan.merchant_id,
            name: plan.name,
            description: plan.description,
            billing_frequency: plan.billing_frequency,
            amount: plan.amount,
            currency_code: plan.currency_code as 'XOF',
            subscription_length: plan.metadata?.['subscription_length'] as SubscriptionLength || 'automatic',
            fixed_charges: plan.metadata?.['fixed_charges'] as number,
            failed_payment_action: plan.failed_payment_action || 'continue',
            first_payment_type: plan.first_payment_type,
            collection_date_type: plan.charge_day ? 'specific_day' : 'maintain',
            collection_day: plan.charge_day,
            metadata: plan.metadata || {},
        },
    })

    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

    const subscriptionLength = watch('subscription_length')
    const collectionDateType = watch('collection_date_type')
    const billingFrequency = watch('billing_frequency')

    const isOneTimeFrequency = billingFrequency === 'one-time'

    const onSubmit = async (data: SubscriptionPlanFormData) => {
        try {
            const metadata: Record<string, unknown> = {
                subscription_length: data.subscription_length,
                fixed_charges: data.fixed_charges,
            };

            await updateSubscriptionPlan({
                planId: plan.plan_id,
                name: data.name,
                description: data.description,
                billingFrequency: data.billing_frequency,
                amount: data.amount,
                failedPaymentAction: data.failed_payment_action,
                chargeDay: data.collection_date_type === 'specific_day' ? data.collection_day : undefined,
                metadata,
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating subscription plan:', error);
        }
    }

    const formatAmount = (amount: number | undefined) => {
        return amount ? amount.toLocaleString("en-US") : "";
    };

    const parseAmount = (amount: string) => {
        return parseFloat(amount.replace(/,/g, ""));
    };

    const onDelete = async () => {
        try {
            await deleteSubscriptionPlan(plan.plan_id);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error deleting subscription plan:', error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Subscription Plan</CardTitle>
                        <CardDescription>Modify the details of the subscription plan</CardDescription>
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
                            <Label htmlFor="amount">Plan price</Label>
                            <InputRightAddon
                                id="amount"
                                type="text"
                                placeholder="Enter amount"
                                value={formatAmount(watch("amount"))}
                                onChange={(value) => setValue("amount", parseAmount(value))}
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

                        {!isOneTimeFrequency && (
                            <>
                                <div className="space-y-2">
                                    <Label>Subscription length</Label>
                                    <RadioGroup
                                        defaultValue={subscriptionLength}
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select number of charges" />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-60 overflow-y-auto">
                                                        {fixedChargesOptions.map((option) => (
                                                            <SelectItem key={option} value={option.toString()}>
                                                                End after {option} charges
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.fixed_charges && <p className="text-sm text-red-500">{errors.fixed_charges.message}</p>}
                                    </div>
                                )}
                            </>
                        )}

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={showAdvancedSettings}
                                    onCheckedChange={setShowAdvancedSettings}
                                />
                                <Label>Show Advanced Settings</Label>
                            </div>
                        </div>

                        {showAdvancedSettings && !isOneTimeFrequency && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Collection Date</Label>
                                    <RadioGroup
                                        defaultValue={collectionDateType}
                                        onValueChange={(value: CollectionDateType) => setValue('collection_date_type', value)}
                                        className="space-y-2"
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
                                            rules={{ required: 'Collection day is required' }}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select collection day" />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-60 overflow-y-auto">
                                                        {collectionDayOptions.map((day) => (
                                                            <SelectItem key={day} value={day.toString()}>
                                                                {day}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.collection_day && <p className="text-sm text-red-500">{errors.collection_day.message}</p>}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="failed_payment_action">Failed Payment Action</Label>
                                    <Controller
                                        name="failed_payment_action"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select action" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cancel">Cancel subscription</SelectItem>
                                                    <SelectItem value="pause">Pause subscription</SelectItem>
                                                    <SelectItem value="continue">Continue subscription</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end space-x-2">
                <Button
                    type="button"
                    className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 h-10"
                    onClick={onDelete}
                >
                    Delete Plan
                </Button>
                <Button
                    type="submit"
                    className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 h-10"
                >
                    Save Changes
                </Button>
            </div>
        </form>
    )
}
