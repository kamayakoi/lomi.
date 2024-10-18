import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createProduct } from './support_product'
import { useUser } from '@/lib/hooks/useUser'
import { supabase } from '@/utils/supabase/client'

interface CreateProductFormProps {
    onClose: () => void
    onSuccess: () => void
}

interface ProductFormData {
    name: string
    description: string
    price: number
    currencyCode: string
    isActive: boolean
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({ onClose, onSuccess }) => {
    const { user } = useUser()
    const { register, handleSubmit } = useForm<ProductFormData>()

    const onSubmit = async (data: ProductFormData) => {
        try {
            const { data: organizationData, error: organizationError } = await supabase
                .rpc('fetch_organization_details', { p_merchant_id: user?.id })

            if (organizationError) {
                console.error('Error fetching organization details:', organizationError)
                return
            }

            await createProduct({
                merchantId: user?.id || '',
                organizationId: organizationData[0].organization_id,
                name: data.name,
                description: data.description,
                price: data.price,
                currencyCode: 'XOF',
                isActive: true,
            })
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error creating product:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                    id="name"
                    placeholder="Enter product name"
                    {...register('name')}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                    id="description"
                    placeholder="Enter product description"
                    {...register('description')}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <div className="flex space-x-2">
                    <Select>
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="XOF" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="XOF">XOF</SelectItem>
                            <SelectItem value="USD" disabled>USD</SelectItem>
                            <SelectItem value="EUR" disabled>EUR</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input id="price" type="number" placeholder="Enter price" className="flex-1" {...register('price')} />
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Create Product</Button>
            </div>
        </form>
    )
}
