import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { updateProduct, deleteProduct } from './support_product'
import { Product } from './types'

interface EditProductFormProps {
    product: Product
    onClose: () => void
    onSuccess: () => void
}

interface ProductFormData {
    name: string
    description: string
    price: number
    is_active: boolean
}

export const EditProductForm: React.FC<EditProductFormProps> = ({ product, onClose, onSuccess }) => {
    const { register, handleSubmit } = useForm<ProductFormData>({
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            is_active: product.is_active,
        },
    })

    const onSubmit = async (data: ProductFormData) => {
        try {
            await updateProduct(product.product_id, {
                name: data.name,
                description: data.description,
                price: data.price,
                is_active: data.is_active,
            })
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error updating product:', error)
        }
    }

    const handleDelete = async () => {
        try {
            await deleteProduct(product.product_id)
            onSuccess()
        } catch (error) {
            console.error('Error deleting product:', error)
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
                <Button
                    type="button"
                    className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 h-10"
                    onClick={handleDelete}
                >
                    Delete Product
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
