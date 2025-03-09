import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PaymentLink, provider_code } from './types'
import { supabase } from '@/utils/supabase/client'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import "./datepicker-dark-mode.css"
import { Badge } from "@/components/ui/badge"
import { useUser } from '@/lib/hooks/use-user'
import InputRightAddon from "@/components/ui/input-right-addon"
import { toast } from '@/lib/hooks/use-toast'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { safeDeletePaymentLink } from './support'

interface EditPaymentLinkFormProps {
    paymentLink: PaymentLink
    onSuccess: () => void
    onRefresh: () => Promise<void>
}

interface PaymentMethod {
    id: string | provider_code;
    name: string;
    icon: string;
}

export function EditPaymentLinkForm({ paymentLink, onSuccess, onRefresh }: EditPaymentLinkFormProps) {
    const [title, setTitle] = useState(paymentLink.title)
    const [publicDescription, setPublicDescription] = useState(paymentLink.public_description || '')
    const [privateDescription, setPrivateDescription] = useState(paymentLink.private_description || '')
    const [price, setPrice] = useState(paymentLink.price?.toString() || '')
    const [isActive, setIsActive] = useState(paymentLink.is_active)
    const [expirationDate, setExpirationDate] = useState<Date | null>(paymentLink.expires_at ? new Date(paymentLink.expires_at) : null)
    const [successUrl, setSuccessUrl] = useState(paymentLink.success_url || '')
    const [allowedPaymentMethods, setAllowedPaymentMethods] = useState<(provider_code | 'CARDS')[]>(
        paymentLink.allowed_providers.includes('ECOBANK')
            ? [...paymentLink.allowed_providers.filter(p => p !== 'ECOBANK'), 'CARDS']
            : paymentLink.allowed_providers
    );
    const [connectedProviders, setConnectedProviders] = useState<string[]>([])
    const { user } = useUser()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

    const paymentMethods: PaymentMethod[] = [
        { id: 'CARDS', name: 'Cards', icon: '/payment_channels/cards.webp' },
        { id: 'WAVE', name: 'Wave', icon: '/payment_channels/wave.webp' },
        { id: 'MTN', name: 'MTN', icon: '/payment_channels/mtn.webp' },
        { id: 'ORANGE', name: 'Orange', icon: '/payment_channels/orange.webp' },
    ]

    useEffect(() => {
        const fetchData = async () => {
            if (user?.id) {
                const { data: connectedProvidersData, error: connectedProvidersError } = await supabase
                    .rpc('get_payment_link_available_providers', { p_merchant_id: user.id })

                if (connectedProvidersError) {
                    console.error('Error fetching connected providers:', connectedProvidersError)
                } else {
                    const mappedProviders = connectedProvidersData.reduce((acc: string[], provider: { code: string }) => {
                        if (provider.code === 'ECOBANK') {
                            acc.push('CARDS')
                        } else {
                            acc.push(provider.code)
                        }
                        return acc
                    }, [])
                    setConnectedProviders(mappedProviders)
                }
            }
        }

        fetchData()
    }, [user?.id])

    useEffect(() => {
        if (expirationDate && expirationDate > new Date()) {
            if (!isActive) {
                setIsActive(true);
            }
        } else if (expirationDate && expirationDate <= new Date()) {
            if (isActive) {
                setIsActive(false);
            }
        }
    }, [expirationDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const mappedProviders = allowedPaymentMethods.reduce((acc, method) => {
                if (method === 'CARDS') {
                    acc.push('ECOBANK')
                } else {
                    acc.push(method as provider_code)
                }
                return acc
            }, [] as provider_code[])

            const { data, error } = await supabase.rpc('update_payment_link', {
                p_link_id: paymentLink.link_id,
                p_title: title,
                p_public_description: publicDescription,
                p_private_description: privateDescription,
                p_price: price ? parseFloat(price) : null,
                p_is_active: isActive,
                p_expires_at: expirationDate ? expirationDate.toISOString() : null,
                p_success_url: successUrl,
                p_allowed_providers: mappedProviders,
            })

            if (error) {
                console.error('Error updating payment link:', error)
            } else {
                console.log('Payment link updated:', data)
                onSuccess()
                await onRefresh()
            }
        } catch (error) {
            console.error('Error updating payment link:', error)
        }
    }

    const handleDelete = async () => {
        try {
            setIsDeleting(true);

            const result = await safeDeletePaymentLink(paymentLink.link_id);

            if (result.success) {
                toast({
                    title: "Success",
                    description: "Payment link deleted successfully",
                    variant: "default",
                });
                onSuccess();
                await onRefresh();
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to delete payment link",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error deleting payment link:', error);
            toast({
                title: "Error",
                description: "An error occurred while deleting the payment link",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            setIsDeleteConfirmOpen(false);
        }
    };

    const togglePaymentMethod = (methodId: string | provider_code) => {
        setAllowedPaymentMethods(prev => {
            if (methodId === 'CARDS') {
                if (prev.includes(methodId)) {
                    return prev.filter(m => m !== methodId)
                } else {
                    return [...prev, methodId]
                }
            } else {
                return prev.includes(methodId as provider_code)
                    ? prev.filter(m => m !== methodId)
                    : [...prev, methodId as provider_code]
            }
        })
    }

    const getBadgeColor = (methodId: string) => {
        switch (methodId) {
            case 'WAVE':
                return 'bg-[#71CDF4] hover:bg-[#71CDF4] text-black';
            case 'ORANGE':
                return 'bg-[#FC6307] hover:bg-[#FC6307] text-white';
            case 'MTN':
                return 'bg-[#F7CE46] hover:bg-[#F7CE46] text-black';
            case 'CARDS':
                return 'bg-[#074367] hover:bg-[#074367] text-white';
            default:
                return '';
        }
    };

    const formatAmount = (amount: number | undefined) => {
        return amount ? amount.toLocaleString("en-US") : "";
    };

    const parseAmount = (amount: string) => {
        return parseFloat(amount.replace(/,/g, ""));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="publicDescription">Public Description</Label>
                <Input id="publicDescription" value={publicDescription} onChange={(e) => setPublicDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="privateDescription">Private Description</Label>
                <Input id="privateDescription" value={privateDescription} onChange={(e) => setPrivateDescription(e.target.value)} />
            </div>
            {paymentLink.link_type === 'instant' && (
                <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <InputRightAddon
                        id="price"
                        type="text"
                        placeholder="Enter amount"
                        value={formatAmount(parseFloat(price))}
                        onChange={(value) => setPrice(parseAmount(value).toString())}
                    />
                </div>
            )}
            <div className="space-y-4">
                <Label className="block">Payment methods</Label>
                <div className="flex flex-wrap gap-2">
                    {paymentMethods
                        .filter((method) => connectedProviders.includes(method.id))
                        .map((method) => {
                            const isSelected = allowedPaymentMethods.includes(method.id as provider_code | 'CARDS')

                            return (
                                <Badge
                                    key={method.id}
                                    variant={isSelected ? "default" : "outline"}
                                    className={`cursor-pointer rounded-none px-4 py-2 ${isSelected
                                        ? getBadgeColor(method.id)
                                        : 'bg-transparent hover:bg-transparent'
                                        }`}
                                    onClick={() => togglePaymentMethod(method.id)}
                                >
                                    {method.name}
                                </Badge>
                            )
                        })
                    }
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <Label htmlFor="isActive">Status</Label>
                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <div>
                    <DatePicker
                        id="expirationDate"
                        selected={expirationDate}
                        onChange={(date: Date | null) => setExpirationDate(date)}
                        className="w-full rounded-none bg-background text-foreground p-2 border border-gray-300 dark:bg-[#1F2937] dark:text-white dark:border-gray-700"
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        placeholderText="Select future date"
                        isClearable={true}
                        showPopperArrow={false}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    {expirationDate && expirationDate < new Date() ?
                        "⚠️ Past dates will make this link inactive" :
                        "Setting a future date will automatically activate the link"}
                </p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="successUrl">Success URL</Label>
                <Input id="successUrl" value={successUrl} onChange={(e) => setSuccessUrl(e.target.value)} />
            </div>
            <div className="flex justify-end space-x-2">
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 h-10"
                >
                    Delete
                </Button>
                <Button
                    type="submit"
                    className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 h-10"
                >
                    Save
                </Button>
            </div>

            <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the payment link
                            and any related data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 text-white hover:bg-red-600"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </form>
    )
}
