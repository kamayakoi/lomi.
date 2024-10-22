import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PaymentLink } from './types'
import { supabase } from '@/utils/supabase/client'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

interface EditPaymentLinkFormProps {
    paymentLink: PaymentLink
    onClose: () => void
    onSuccess: () => void
}

export function EditPaymentLinkForm({ paymentLink, onClose, onSuccess }: EditPaymentLinkFormProps) {
    const [title, setTitle] = useState(paymentLink.title)
    const [publicDescription, setPublicDescription] = useState(paymentLink.public_description || '')
    const [privateDescription, setPrivateDescription] = useState(paymentLink.private_description || '')
    const [price, setPrice] = useState(paymentLink.price?.toString() || '')
    const [isActive, setIsActive] = useState(paymentLink.is_active)
    const [expirationDate, setExpirationDate] = useState<Date | null>(paymentLink.expires_at ? new Date(paymentLink.expires_at) : null)
    const [successUrl, setSuccessUrl] = useState(paymentLink.success_url || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const { data, error } = await supabase.rpc('update_payment_link', {
                p_link_id: paymentLink.link_id,
                p_title: title,
                p_public_description: publicDescription,
                p_private_description: privateDescription,
                p_price: price ? parseFloat(price) : null,
                p_is_active: isActive,
                p_expires_at: expirationDate ? expirationDate.toISOString() : null,
                p_success_url: successUrl,
            })

            if (error) {
                console.error('Error updating payment link:', error)
            } else {
                console.log('Payment link updated:', data)
                onSuccess()
            }
        } catch (error) {
            console.error('Error updating payment link:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="publicDescription">Public Description</Label>
                <Input id="publicDescription" value={publicDescription} onChange={(e) => setPublicDescription(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="privateDescription">Private Description</Label>
                <Input id="privateDescription" value={privateDescription} onChange={(e) => setPrivateDescription(e.target.value)} />
            </div>
            {paymentLink.link_type === 'instant' && (
                <div>
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
            )}
            <div>
                <Label htmlFor="isActive">Status</Label>
                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
            </div>
            <div>
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <DatePicker
                    id="expirationDate"
                    selected={expirationDate}
                    onChange={(date: Date | null) => setExpirationDate(date)}
                    className="w-full rounded-none bg-background text-foreground p-2 border border-gray-300"
                    dateFormat="dd/MM/yyyy"
                />
            </div>
            <div>
                <Label htmlFor="successUrl">Success URL</Label>
                <Input id="successUrl" value={successUrl} onChange={(e) => setSuccessUrl(e.target.value)} />
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit">
                    Save
                </Button>
            </div>
        </form>
    )
}
