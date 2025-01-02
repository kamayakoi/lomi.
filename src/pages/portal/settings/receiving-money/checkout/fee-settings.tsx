import { useState, useEffect } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { type CheckoutSettings, type FeeType } from '@/lib/types/checkoutsettings'

interface FeeSettingsProps {
    settings: CheckoutSettings | null;
    onUpdate: (settings: Partial<CheckoutSettings>) => Promise<void>;
}

export function FeeSettings({ settings, onUpdate }: FeeSettingsProps) {
    const [newFeeType, setNewFeeType] = useState('')
    const [feeTypes, setFeeTypes] = useState<FeeType[]>([])
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (settings?.fee_types) {
            setFeeTypes(settings.fee_types)
        } else {
            // Default fee types if none exist
            setFeeTypes([
                { id: '1', name: 'Admin Fee', enabled: false, percentage: 0 },
                { id: '2', name: 'Shipping Fee', enabled: false, percentage: 0 },
                { id: '3', name: 'Discount', enabled: false, percentage: 0 },
                { id: '4', name: 'Tax', enabled: false, percentage: 0 },
            ])
        }
    }, [settings])

    const handleAddFeeType = () => {
        if (newFeeType) {
            const newFee = {
                id: Date.now().toString(),
                name: newFeeType,
                enabled: false,
                percentage: 5
            }
            setFeeTypes([...feeTypes, newFee])
            setNewFeeType('')
        }
    }

    const handleToggleFeeType = (id: string) => {
        setFeeTypes(feeTypes.map(fee =>
            fee.id === id ? { ...fee, enabled: !fee.enabled } : fee
        ))
    }

    const handlePercentageChange = (id: string, value: number) => {
        setFeeTypes(feeTypes.map(fee =>
            fee.id === id ? { ...fee, percentage: Math.min(Math.max(value, 0), 30) } : fee
        ))
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)
            await onUpdate({
                fee_types: feeTypes
            })
            toast({
                title: "Success",
                description: "Fee settings updated successfully",
            })
        } catch (error) {
            console.error('Error saving fee settings:', error)
            toast({
                title: "Error",
                description: "Failed to update fee settings",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Fee Types</CardTitle>
                    <CardDescription>Configure additional fees to apply to transactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                        <Input
                            placeholder="New fee type"
                            value={newFeeType}
                            onChange={(e) => setNewFeeType(e.target.value)}
                            className="flex-grow rounded-none"
                        />
                        <Button
                            onClick={handleAddFeeType}
                            variant="outline"
                            className="rounded-none"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </div>
                    <div className="space-y-2">
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
                                        value={fee.percentage}
                                        onChange={(e) => handlePercentageChange(fee.id, Number(e.target.value))}
                                        className="w-20 h-8 text-right text-sm rounded-none"
                                        min={0}
                                        max={30}
                                        disabled={!fee.enabled}
                                    />
                                    <span className="text-sm text-muted-foreground">%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4">
                        <Button
                            onClick={handleSave}
                            className="w-full rounded-none"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}