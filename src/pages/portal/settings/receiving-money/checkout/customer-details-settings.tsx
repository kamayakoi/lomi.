import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

interface CustomerField {
    id: string
    name: string
    include: boolean
    required: boolean
}

export function CustomerDetailsSettings() {
    const [fields, setFields] = useState<CustomerField[]>([
        { id: '1', name: 'Full Name', include: true, required: true },
        { id: '2', name: 'Email', include: true, required: true },
        { id: '3', name: 'Phone Number', include: true, required: false },
        { id: '4', name: 'Address', include: true, required: false },
        { id: '5', name: 'City', include: true, required: false },
        { id: '6', name: 'Country', include: true, required: false },
    ])

    const handleToggleInclude = (id: string) => {
        setFields(fields.map(field =>
            field.id === id ? { ...field, include: !field.include } : field
        ))
    }

    const handleToggleRequired = (id: string) => {
        setFields(fields.map(field =>
            field.id === id ? { ...field, required: !field.required } : field
        ))
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Customer Details</h2>
            <div className="space-y-4">
                {fields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between">
                        <Label htmlFor={`include-${field.id}`}>{field.name}</Label>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={`include-${field.id}`}
                                    checked={field.include}
                                    onCheckedChange={() => handleToggleInclude(field.id)}
                                />
                                <Label htmlFor={`include-${field.id}`}>Include</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={`required-${field.id}`}
                                    checked={field.required}
                                    onCheckedChange={() => handleToggleRequired(field.id)}
                                    disabled={!field.include}
                                />
                                <Label htmlFor={`required-${field.id}`}>Required</Label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Button>Save Changes</Button>
        </div>
    )
}