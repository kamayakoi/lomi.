import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface FeeType {
    id: string
    name: string
    enabled: boolean
}

export function FeeSettings() {
    const [newFeeType, setNewFeeType] = useState('')
    const [feeTypes, setFeeTypes] = useState<FeeType[]>([
        { id: '1', name: 'Admin Fee', enabled: true },
        { id: '2', name: 'Shipping Fee', enabled: false },
        { id: '3', name: 'Discount', enabled: false },
        { id: '4', name: 'Tax', enabled: true },
    ])

    const handleAddFeeType = () => {
        if (newFeeType) {
            setFeeTypes([...feeTypes, { id: Date.now().toString(), name: newFeeType, enabled: false }])
            setNewFeeType('')
        }
    }

    const handleToggleFeeType = (id: string) => {
        setFeeTypes(feeTypes.map(fee =>
            fee.id === id ? { ...fee, enabled: !fee.enabled } : fee
        ))
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Fee Types</h2>
            <div className="space-y-4">
                <div className="flex space-x-2">
                    <Input
                        placeholder="Create custom fee"
                        value={newFeeType}
                        onChange={(e) => setNewFeeType(e.target.value)}
                    />
                    <Button onClick={handleAddFeeType}>Add</Button>
                </div>
                <div className="space-y-2">
                    {feeTypes.map((fee) => (
                        <div key={fee.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={fee.id}
                                checked={fee.enabled}
                                onCheckedChange={() => handleToggleFeeType(fee.id)}
                            />
                            <Label htmlFor={fee.id}>{fee.name}</Label>
                        </div>
                    ))}
                </div>
            </div>
            <Button>Save Changes</Button>
        </div>
    )
}