import { useState, useEffect } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { type CheckoutSettings, type FeeType } from '@/lib/types/checkoutsettings'
import { supabase } from '@/utils/supabase/client'

interface FeeSettingsProps {
    settings: CheckoutSettings | null;
    onUpdate: (settings: Partial<CheckoutSettings>) => Promise<void>;
}

export function FeeSettings({ settings, onUpdate }: FeeSettingsProps) {
    const [newFeeType, setNewFeeType] = useState('')
    const [feeTypes, setFeeTypes] = useState<FeeType[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchFeeTypes = async () => {
            try {
                if (!settings?.organization_id) return

                setIsLoading(true)
                const { data, error } = await supabase
                    .rpc('fetch_organization_checkout_settings', {
                        p_organization_id: settings.organization_id
                    })

                if (error) throw error

                if (data && data[0]?.fee_types) {
                    setFeeTypes(data[0].fee_types)
                }
            } catch (error) {
                console.error('Error fetching fee types:', error)
                toast({
                    title: "Error",
                    description: "Failed to load fee settings",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchFeeTypes()
    }, [settings?.organization_id])

    const handleAddFeeType = () => {
        if (!newFeeType.trim()) {
            toast({
                title: "Error",
                description: "Fee type name cannot be empty",
                variant: "destructive",
            })
            return
        }

        if (feeTypes.some(fee => fee.name.toLowerCase() === newFeeType.toLowerCase())) {
            toast({
                title: "Error",
                description: "A fee type with this name already exists",
                variant: "destructive",
            })
            return
        }

        const newFee = {
            id: null, // Set to null for new fees
            name: newFeeType.trim(),
            enabled: false,
            percentage: 5
        }
        setFeeTypes([...feeTypes, newFee])
        setNewFeeType('')
    }

    const handleToggleFeeType = (id: string | null) => {
        if (id === null) return; // Don't toggle new fees
        setFeeTypes(feeTypes.map(fee =>
            fee.id === id ? { ...fee, enabled: !fee.enabled } : fee
        ))
    }

    const handlePercentageChange = (id: string | null, value: string) => {
        if (id === null) return; // Don't change new fees
        const numValue = value === '' ? '' : parseInt(value)
        setFeeTypes(feeTypes.map(fee => {
            if (fee.id !== id) return fee
            if (numValue === '') {
                return { ...fee, percentage: 0 }
            }
            if (!isNaN(numValue)) {
                if (numValue > 100) return { ...fee, percentage: 100 }
                if (numValue < 1) return { ...fee, percentage: 1 }
                return { ...fee, percentage: numValue }
            }
            return fee
        }))
    }

    const handlePercentageBlur = (id: string | null) => {
        if (id === null) return; // Don't handle blur for new fees
        setFeeTypes(feeTypes.map(fee => {
            if (fee.id === id && fee.percentage < 1) {
                return { ...fee, percentage: 1 }
            }
            return fee
        }))
    }

    const handleSave = async () => {
        if (!settings?.organization_id) {
            toast({
                title: "Error",
                description: "Organization ID is required",
                variant: "destructive",
            })
            return
        }

        setIsSaving(true)
        try {
            // Save each fee type
            for (const fee of feeTypes) {
                const { error } = await supabase.rpc('manage_organization_fee_type', {
                    p_organization_id: settings.organization_id,
                    p_fee_type_id: fee.id,
                    p_name: fee.name,
                    p_percentage: Number(fee.percentage),
                    p_is_enabled: fee.enabled
                })

                if (error) throw error
            }

            // Refresh fee types after saving
            const { data, error } = await supabase
                .rpc('fetch_organization_checkout_settings', {
                    p_organization_id: settings.organization_id
                })

            if (error) throw error

            if (data && data[0]?.fee_types) {
                setFeeTypes(data[0].fee_types)
            }

            // Update parent component with refreshed data
            await onUpdate({
                organization_id: settings.organization_id,
                fee_types: data[0]?.fee_types || []
            })

            toast({
                title: "Success",
                description: "Fee settings updated successfully",
            })
        } catch (error) {
            console.error('Error saving fees:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update fee settings",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return null;
    }

    return (
        <Card className="rounded-none">
            <CardHeader>
                <CardTitle>Additional fees</CardTitle>
                <CardDescription>Configure additional fees to apply to transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex space-x-2">
                    <Input
                        placeholder="Admin fee"
                        value={newFeeType}
                        onChange={(e) => setNewFeeType(e.target.value)}
                        className="flex-grow rounded-none"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddFeeType()
                            }
                        }}
                    />
                    <Button
                        onClick={handleAddFeeType}
                        variant="outline"
                        className="rounded-none"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>
                <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                    {feeTypes.map((fee) => (
                        <div
                            key={fee.id}
                            className="flex items-center justify-between space-x-2 py-2 px-3 border rounded-none hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={`toggle-${fee.id}`}
                                    checked={fee.enabled}
                                    onCheckedChange={() => handleToggleFeeType(fee.id)}
                                />
                                <Label
                                    htmlFor={`toggle-${fee.id}`}
                                    className="text-sm font-medium cursor-pointer"
                                >
                                    {fee.name}
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="number"
                                    value={fee.percentage || ''}
                                    onChange={(e) => handlePercentageChange(fee.id, e.target.value)}
                                    onBlur={() => handlePercentageBlur(fee.id)}
                                    className="w-20 h-8 text-right text-sm rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="1-100"
                                    disabled={!fee.enabled}
                                />
                                <span className="text-sm text-muted-foreground">%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleSave}
                    className="ml-auto rounded-none bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>
            </CardFooter>
        </Card>
    )
}