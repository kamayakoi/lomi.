import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Copy, PlusCircle, Trash2 } from 'lucide-react'
import ContentSection from '@/components/dashboard/content-section'
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ApiKey = {
    name: string;
    api_key: string;
    is_active: boolean;
    created_at: string;
}

export default function Component() {
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
                setIsGeneratingKey(false)
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

    const maskApiKey = (key: string) => {
        const visiblePart = key.slice(0, 4)
        const hiddenPart = '•'.repeat(Math.max(20, key.length - 4))  // Ensure at least 20 dots
        return `${visiblePart}${hiddenPart}`
    }

    return (
        <ContentSection
            title="API Keys"
            desc="Creat and manage your API keys to authenticate requests coming from your servers."
        >
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Secret Keys</CardTitle>
                </CardHeader>
                <CardContent>
                    {apiKeys.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/5">Name</TableHead>
                                    <TableHead className="w-2/5">API Key</TableHead>
                                    <TableHead className="w-1/5">Status</TableHead>
                                    <TableHead className="w-1/5">Created</TableHead>
                                    <TableHead className="w-1/5">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {apiKeys.map((key, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{key.name}</TableCell>
                                        <TableCell>
                                            <code className="bg-muted px-2 py-1 rounded text-xs">
                                                {maskApiKey(key.api_key)}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={key.is_active ? "default" : "secondary"}
                                                className="cursor-pointer"
                                                onClick={() => handleToggleKeyStatus(key.api_key, key.is_active)}
                                            >
                                                {key.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(key.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => copyToClipboard(key.api_key)}
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Copy Key</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDeleteKey(key.api_key)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete Key</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
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
                            <Button className="mt-6" onClick={() => setIsGeneratingKey(true)} disabled={apiKeys.length >= 3}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Generate a secret key
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Generate a new secret key</DialogTitle>
                                <DialogDescription>
                                    Enter a name to identidy your new API key.
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
                </CardContent>
            </Card>
        </ContentSection>
    )
}