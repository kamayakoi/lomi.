import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

interface FeeType {
    id: string
    name: string
    enabled: boolean
    percentage: number
}

export function FeeSettings() {
    const [newFeeType, setNewFeeType] = useState('')
    const [feeTypes, setFeeTypes] = useState<FeeType[]>([
        { id: '1', name: 'Admin Fee', enabled: false, percentage: 0 },
        { id: '2', name: 'Shipping Fee', enabled: false, percentage: 0 },
        { id: '3', name: 'Discount', enabled: false, percentage: 0 },
        { id: '4', name: 'Tax', enabled: false, percentage: 0 },
    ])

    const handleAddFeeType = () => {
        if (newFeeType) {
            setFeeTypes([...feeTypes, { id: Date.now().toString(), name: newFeeType, enabled: false, percentage: 5 }])
            setNewFeeType('')
        }
    }

    const handleToggleFeeType = (id: string) => {
        setFeeTypes(feeTypes.map(fee =>
            fee.id === id ? { ...fee, enabled: !fee.enabled, percentage: fee.enabled ? 0 : 5 } : fee
        ))
    }

    const handlePercentageChange = (id: string, value: number) => {
        setFeeTypes(feeTypes.map(fee =>
            fee.id === id ? { ...fee, percentage: Math.min(Math.max(value, 0), 30) } : fee
        ))
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="pb-4">
                <CardTitle>Fee Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex space-x-2">
                    <Input
                        placeholder="New fee type"
                        value={newFeeType}
                        onChange={(e) => setNewFeeType(e.target.value)}
                        className="flex-grow"
                    />
                    <Button onClick={handleAddFeeType}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>
                <div className="space-y-2">
                    {feeTypes.map((fee) => (
                        <div key={fee.id} className="flex items-center justify-between space-x-2 py-1 px-2 rounded-md bg-muted">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={`toggle-${fee.id}`}
                                    checked={fee.enabled}
                                    onCheckedChange={() => handleToggleFeeType(fee.id)}
                                />
                                <Label htmlFor={`toggle-${fee.id}`} className="text-sm font-medium">{fee.name}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="number"
                                    value={fee.percentage}
                                    onChange={(e) => handlePercentageChange(fee.id, Number(e.target.value))}
                                    className="w-16 h-8 text-right text-sm"
                                    min={0}
                                    max={30}
                                />
                                <span className="text-sm">%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="pt-2">
                <Button className="w-full">Save Changes</Button>
            </CardFooter>
        </Card>
    )
}