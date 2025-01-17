import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useSidebar } from '@/lib/hooks/useSidebar'
import slugify from 'slugify';

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
    settings: {
        orgName: string;
        description: string;
        themeColor: string;
        slug: string;
    };
    onSettingsChange: (settings: {
        orgName: string;
        description: string;
        themeColor: string;
        slug: string;
    }) => void;
}

export function OrganizationSettings({ settings, onSettingsChange }: OrganizationSettingsProps) {
    const { sidebarData } = useSidebar()
    const [orgName, setOrgName] = useState(sidebarData.organizationName || '')
    const [description, setDescription] = useState('')
    const [selectedColor, setSelectedColor] = useState('blue')
    const [copied, setCopied] = useState(false);

    const handleSettingsChange = useCallback((settings: {
        orgName: string;
        description: string;
        themeColor: string;
        slug: string;
    }) => {
        onSettingsChange(settings);
    }, [onSettingsChange]);

    useEffect(() => {
        const slug = slugify(orgName.toLowerCase(), { remove: /[*+~.()'"!:@]/g });
        handleSettingsChange({
            orgName,
            description,
            themeColor: THEME_COLORS.find(color => color.name === selectedColor)?.value || '#3B82F6',
            slug,
        });
    }, [orgName, description, selectedColor, handleSettingsChange]);

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://store.lomi.africa/${settings.slug}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-6 space-y-8 overflow-y-auto h-full bg-background text-foreground">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Storefront</h2>
                    <Button
                        variant="default"
                        onClick={() => window.open(`https://store.lomi.africa/${settings.slug}`, '_blank')}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Open Storefront
                    </Button>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="org-name">Organization Name</Label>
                        <Input
                            id="org-name"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <div className="relative mt-1">
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                                    onClick={() => setSelectedColor(color.name)}
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
                            value={`https://store.lomi.africa/${settings.slug}`}
                            readOnly
                            className="bg-background border-input text-muted-foreground"
                        />
                        <Button
                            variant="outline"
                            onClick={handleCopy}
                            className={`
                                ${copied ? 'bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600 dark:bg-green-600 dark:border-green-600 dark:hover:bg-green-700 dark:hover:border-green-700' : 'border-input hover:bg-accent hover:text-accent-foreground'}
                            `}
                        >
                            {copied ? 'Copied!' : 'Copy'}
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

