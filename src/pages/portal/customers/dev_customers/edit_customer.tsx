import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { fetchCustomer, updateCustomer, deleteCustomer } from './support_customers'

interface EditCustomerFormProps {
    customerId: string
    onClose: () => void
    onSuccess: () => void
}

interface CustomerFormData {
    name: string
    email: string
    phone_number: string
    country: string
    city: string
    address: string
    postal_code: string
    is_business: boolean
}

export const EditCustomerForm: React.FC<EditCustomerFormProps> = ({ customerId, onClose, onSuccess }) => {
    const { register, handleSubmit, setValue, control } = useForm<CustomerFormData>()

    useEffect(() => {
        const fetchData = async () => {
            const customer = await fetchCustomer(customerId)
            if (customer) {
                setValue('name', customer.name)
                setValue('email', customer.email)
                setValue('phone_number', customer.phone_number)
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
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error deleting customer:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input id="phone_number" {...register('phone_number')} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register('country')} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register('city')} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register('address')} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input id="postal_code" {...register('postal_code')} />
            </div>
            <div className="flex items-center space-x-2">
                <Controller
                    name="is_business"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            id="is_business"
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked)}
                        />
                    )}
                />
                <Label htmlFor="is_business" className="font-normal">Business Customer</Label>
            </div>
            <div className="flex justify-end space-x-2">
                <Button
                    type="button"
                    className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 h-10"
                    onClick={handleDelete}
                >
                    Delete Customer
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
