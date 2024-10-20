import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CopyIcon, PlusCircleIcon, TrashIcon } from 'lucide-react'
import ContentSection from '@/components/dashboard/content-section'
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@/lib/hooks/useUser'

type ApiKey = {
    name: string;
    api_key: string;
    is_active: boolean;
    created_at: string;
}

export default function ApiKeys() {
    const { user } = useUser()
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
    const [isGeneratingKey, setIsGeneratingKey] = useState(false)
    const [newKeyName, setNewKeyName] = useState("")
    const [organizationId, setOrganizationId] = useState<string | null>(null)

    const fetchOrganizationDetails = useCallback(async () => {
        const { data, error } = await supabase
            .rpc('fetch_organization_details', { p_merchant_id: user?.id })

        if (error) {
            console.error('Error fetching organization details:', error)
        } else if (Array.isArray(data) && data[0]) {
            setOrganizationId(data[0].organization_id)
        }
    }, [user?.id])

    const fetchApiKeys = useCallback(async () => {
        if (!organizationId) return

        const { data, error } = await supabase.rpc('fetch_api_keys', {
            p_organization_id: organizationId,
        })

        if (error) {
            console.error('Error fetching API keys:', error)
        } else if (Array.isArray(data)) {
            setApiKeys(data)
        }
    }, [organizationId])

    useEffect(() => {
        if (user?.id) {
            fetchOrganizationDetails()
        }
    }, [user?.id, fetchOrganizationDetails])

    useEffect(() => {
        if (organizationId) {
            fetchApiKeys()
        }
    }, [organizationId, fetchApiKeys])

    const handleGenerateKey = async () => {
        if (apiKeys.length >= 3) {
            alert('You can only have a maximum of 3 API keys.')
            return
        }

        try {
            const { data, error } = await supabase.rpc('generate_api_key', {
                p_merchant_id: user?.id,
                p_organization_id: organizationId,
                p_name: newKeyName,
                p_expiration_date: null,
            })

            if (error) {
                console.error('Error generating API key:', error)
            } else if (Array.isArray(data) && data[0] && data[0].api_key) {
                setApiKeys([...apiKeys, {
                    name: newKeyName,
                    api_key: data[0].api_key,
                    is_active: true,
                    created_at: new Date().toISOString(),
                }])
                setNewKeyName('')
            }
        } catch (error) {
            console.error('Error generating API key:', error)
        }
    }

    const handleDeleteKey = async (apiKey: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this API key?')

        if (confirmed) {
            const { error } = await supabase.rpc('delete_api_key', {
                p_api_key: apiKey,
            })

            if (error) {
                console.error('Error deleting API key:', error)
            } else {
                setApiKeys(apiKeys.filter(key => key.api_key !== apiKey))
            }
        }
    }

    const handleToggleKeyStatus = async (apiKey: string, isActive: boolean) => {
        const { error } = await supabase.rpc('update_api_key_status', {
            p_api_key: apiKey,
            p_is_active: !isActive,
        })

        if (error) {
            console.error('Error updating API key status:', error)
        } else {
            setApiKeys(apiKeys.map(key => key.api_key === apiKey ? { ...key, is_active: !isActive } : key))
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div style={{
            overflowY: 'auto',
            maxHeight: '100vh',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
        }}>
            <style>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <ContentSection
                title="API Keys"
                desc="Manage your API keys to authenticate requests and access Lomi's APIs."
            >
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Secret Keys</h2>
                        <p className="text-muted-foreground mb-4">Secret keys are used to authenticate API requests coming from your servers.</p>
                        {apiKeys.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Key name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {apiKeys.map((key, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{key.name}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant={key.is_active ? 'secondary' : 'ghost'}
                                                    size="sm"
                                                    onClick={() => handleToggleKeyStatus(key.api_key, key.is_active)}
                                                >
                                                    {key.is_active ? 'Active' : 'Inactive'}
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(key.created_at).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(key.api_key)}
                                                >
                                                    <CopyIcon className="h-4 w-4 mr-2" />
                                                    Copy
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteKey(key.api_key)}
                                                >
                                                    <TrashIcon className="h-4 w-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-center py-4">You don&apos;t have any secret API keys yet.</p>
                        )}
                        <Dialog open={isGeneratingKey} onOpenChange={setIsGeneratingKey}>
                            <DialogTrigger asChild>
                                <Button className="mt-4" disabled={apiKeys.length >= 3}>
                                    <PlusCircleIcon className="h-4 w-4 mr-2" />
                                    Generate secret key
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Generate New Secret Key</DialogTitle>
                                    <DialogDescription>
                                        Enter a name for your new secret key.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={newKeyName}
                                            onChange={(e) => setNewKeyName(e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleGenerateKey}>Generate Key</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </ContentSection>
        </div>
    )
}
