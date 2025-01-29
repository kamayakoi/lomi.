import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from '@/lib/actions/utils'
import { fetchCustomer, updateCustomer, deleteCustomer } from './support_customers'
import { countries } from '@/lib/data/onboarding'
import PhoneNumberInput from "@/components/ui/phone-number-input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface EditCustomerFormProps {
    customerId: string
    onClose: () => void
    onSuccess: () => void
}

interface CustomerFormData {
    name: string
    email: string
    phone_number: string
    whatsapp_number: string
    country: string
    city: string
    address: string
    postal_code: string
    is_business: boolean
}

export const EditCustomerForm: React.FC<EditCustomerFormProps> = ({ customerId, onClose, onSuccess }) => {
    const { register, handleSubmit, setValue, control } = useForm<CustomerFormData>()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const customer = await fetchCustomer(customerId)
            if (customer) {
                setValue('name', customer.name)
                setValue('email', customer.email)
                setValue('phone_number', customer.phone_number)
                setValue('whatsapp_number', customer.whatsapp_number)
                setValue('country', customer.country)
                setValue('city', customer.city)
                setValue('address', customer.address)
                setValue('postal_code', customer.postal_code)
                setValue('is_business', customer.is_business)
            }
        }
        fetchData()
    }, [customerId, setValue])

    const onSubmit = async (data: CustomerFormData) => {
        try {
            await updateCustomer(customerId, data)
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error updating customer:', error)
        }
    }

    const handleDelete = async () => {
        try {
            await deleteCustomer(customerId)
            setIsDeleteDialogOpen(false)
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error deleting customer:', error)
        }
    }

    return (
        <>
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto px-2">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register('name')} className="w-full" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register('email')} className="w-full" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <div className="w-full">
                            <Controller
                                name="phone_number"
                                control={control}
                                render={({ field }) => (
                                    <PhoneNumberInput
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp_number">WhatsApp</Label>
                        <div className="w-full">
                            <Controller
                                name="whatsapp_number"
                                control={control}
                                render={({ field }) => (
                                    <PhoneNumberInput
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <select
                            id="country"
                            {...register('country')}
                            className={cn(
                                "w-full mb-2 px-3 py-2 border h-10 rounded-none",
                                "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                "appearance-none"
                            )}
                        >
                            <option value="">Select a country</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...register('city')} className="rounded-none" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" {...register('address')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="postal_code">Postal Code</Label>
                        <Input id="postal_code" {...register('postal_code')} className="rounded-none" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Controller
                            name="is_business"
                            control={control}
                            render={({ field }) => (
                                <button
                                    type="button"
                                    onClick={() => field.onChange(!field.value)}
                                    className={cn(
                                        "px-3 py-1 text-xs font-medium transition-colors duration-200 cursor-pointer rounded-none",
                                        field.value
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
                                            : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800"
                                    )}
                                >
                                    {field.value ? 'Business Customer' : 'Individual Customer'}
                                </button>
                            )}
                        />
                    </div>
                </form>
            </div>

            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                <Button
                    type="button"
                    className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 h-10 rounded-none"
                    onClick={() => setIsDeleteDialogOpen(true)}
                >
                    Delete Customer
                </Button>
                <Button
                    type="submit"
                    className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 h-10 rounded-none"
                    onClick={handleSubmit(onSubmit)}
                >
                    Save Changes
                </Button>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="rounded-none">
                    <DialogHeader>
                        <DialogTitle>Delete Customer</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this customer? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="rounded-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="rounded-none"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
