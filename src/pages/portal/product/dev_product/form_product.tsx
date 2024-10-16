import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X } from 'lucide-react'
import { createProduct } from './support_product'
import { useUser } from '@/lib/hooks/useUser'

interface CreateProductFormProps {
    onClose: () => void
    onSuccess: () => void
}

interface ProductFormData {
    name: string
    description: string
    price: number
    currencyCode: string
    imageUrl: string
    isActive: boolean
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({ onClose, onSuccess }) => {
    const { user } = useUser()
    const { register, handleSubmit } = useForm<ProductFormData>()

    const onSubmit = async (data: ProductFormData) => {
        try {
            await createProduct({
                merchantId: user?.id || '',
                ...data,
            })
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error creating product:', error)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-background p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Create New Product</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
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
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input id="price" type="number" placeholder="Enter price" className="flex-1" {...register('price')} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                                id="imageUrl"
                                placeholder="Enter image URL"
                                {...register('imageUrl')}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Create Product</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
