import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const THEME_COLORS = [
    { name: 'blue', value: '#3B82F6' },
    { name: 'green', value: '#10B981' },
    { name: 'purple', value: '#8B5CF6' },
    { name: 'orange', value: '#F97316' },
    { name: 'pink', value: '#EC4899' },
    { name: 'teal', value: '#14B8A6' },
    { name: 'red', value: '#EF4444' },
]

interface OrganizationSettingsProps {
    onSettingsChange: (settings: {
        logoUrl: string;
        orgName: string;
        description: string;
        themeColor: string;
    }) => void;
}

export function OrganizationSettings({ onSettingsChange }: OrganizationSettingsProps) {
    const [logoUrl, setLogoUrl] = useState('')
    const [orgName, setOrgName] = useState('lomi.')
    const [description, setDescription] = useState('')
    const [selectedColor, setSelectedColor] = useState('blue')

    const handleChange = (
        field: 'logoUrl' | 'orgName' | 'description' | 'themeColor',
        value: string
    ) => {
        switch (field) {
            case 'logoUrl':
                setLogoUrl(value)
                break
            case 'orgName':
                setOrgName(value)
                break
            case 'description':
                setDescription(value)
                break
            case 'themeColor':
                setSelectedColor(value)
                break
        }

        onSettingsChange({
            logoUrl,
            orgName,
            description,
            themeColor: THEME_COLORS.find(color => color.name === selectedColor)?.value || '#3B82F6',
        })
    }

    return (
        <div className="p-6 space-y-8 overflow-y-auto h-full bg-background text-foreground">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Storefront</h2>
                    <Button variant="default">
                        Open Storefront
                    </Button>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="logo-url">Logo URL</Label>
                        <Input
                            id="logo-url"
                            placeholder="Enter logo URL"
                            value={logoUrl}
                            onChange={(e) => handleChange('logoUrl', e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="org-name">Organization Name</Label>
                        <Input
                            id="org-name"
                            value={orgName}
                            onChange={(e) => handleChange('orgName', e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <div className="relative mt-1">
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                maxLength={160}
                                className="h-24"
                            />
                            <span className="absolute bottom-2 right-2 text-sm text-muted-foreground">
                                {description.length} / 160
                            </span>
                        </div>
                    </div>

                    <div>
                        <Label className="block mb-2">Theme</Label>
                        <div className="flex flex-wrap gap-2">
                            {THEME_COLORS.map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => handleChange('themeColor', color.name)}
                                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.name
                                        ? 'border-primary'
                                        : 'border-transparent'
                                        }`}
                                    style={{
                                        backgroundColor: color.value,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-foreground font-medium mb-2">Share</h3>
                    <div className="flex space-x-2">
                        <Input
                            value={`https://store.lomi.africa/${orgName.toLowerCase().replace(/\./g, '')}`}
                            readOnly
                            className="bg-background border-input text-muted-foreground"
                        />
                        <Button
                            variant="secondary"
                            onClick={() => navigator.clipboard.writeText(`https://store.lomi.africa/${orgName.toLowerCase().replace(/\./g, '')}`)}
                        >
                            Copy
                        </Button>
                    </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-foreground font-medium mb-2">Deactivate Storefront</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                        Disables the storefront and only allows checkouts via API and Payment Links
                    </p>
                    <Button variant="destructive">Deactivate Storefront</Button>
                </div>
            </div>
        </div>
    )
}

