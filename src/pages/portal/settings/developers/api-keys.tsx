import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Copy } from 'lucide-react'
import ContentSection from '@/components/dashboard/content-section'
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"

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
    const [newApiKey, setNewApiKey] = useState<string | null>(null)
    const [isCopied, setIsCopied] = useState(false)

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
                setNewApiKey(data[0].api_key)
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
        const { error } = await supabase.rpc('delete_api_key', {
            p_api_key: apiKey,
        })

        if (error) {
            console.error('Error deleting API key:', error)
        } else {
            setApiKeys(apiKeys.filter(key => key.api_key !== apiKey))
        }
    }

    const handleToggleKeyStatus = async (apiKey: ApiKey) => {
        const newValue = !apiKey.is_active

        try {
            const { error } = await supabase.rpc('update_api_key_status', {
                p_api_key: apiKey.api_key,
                p_is_active: newValue,
                p_merchant_id: user?.id
            })

            if (error) throw error

            setApiKeys(keys => keys.map(key =>
                key.api_key === apiKey.api_key
                    ? { ...key, is_active: newValue }
                    : key
            ))
        } catch (error) {
            console.error('Error updating API key status:', error)
        }
    }

    const handleCopyApiKey = () => {
        if (newApiKey) {
            navigator.clipboard.writeText(newApiKey)
            setIsCopied(true)
            toast({
                title: "Copied!",
                description: "API key has been copied to clipboard",
                duration: 3000,
            })
            setTimeout(() => setIsCopied(false), 2000)
        }
    }

    const handleCloseDialogs = () => {
        setNewApiKey(null)
        setIsGeneratingKey(false)
    }

    const maskApiKey = (key: string) => {
        const visiblePart = key.slice(0, 4)
        return `${visiblePart}****`
    }

    return (
        <ContentSection
            title="API Keys"
            desc="Create and manage your API keys to authenticate requests coming from your servers."
        >
            <div className="space-y-6">
                <Alert variant="info">
                    <AlertDescription>
                        Secret keys should be kept secure and only shared with trusted services. Never expose them in client-side code or version control systems.
                    </AlertDescription>
                </Alert>

                <Card className="rounded-none">
                    <CardContent className="p-6">
                        <div className="rounded-none border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="rounded-none">
                                        <TableHead className="w-[25%] rounded-none">NAME</TableHead>
                                        <TableHead className="w-[35%] rounded-none">API KEY</TableHead>
                                        <TableHead className="w-[20%] rounded-none">STATUS</TableHead>
                                        <TableHead className="w-[15%] rounded-none">CREATED</TableHead>
                                        <TableHead className="w-[5%] rounded-none"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {apiKeys.map((key, index) => (
                                        <TableRow key={index} className="rounded-none">
                                            <TableCell>{key.name}</TableCell>
                                            <TableCell>
                                                <code className="bg-muted px-2 py-1 rounded-none text-xs">
                                                    {maskApiKey(key.api_key)}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <button
                                                    onClick={() => handleToggleKeyStatus(key)}
                                                    className={`
                                                        px-3 py-1 text-xs font-medium transition-colors duration-200 cursor-pointer
                                                        ${key.is_active
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                                                        }
                                                    `}>
                                                    {key.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(key.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteKey(key.api_key)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Dialog open={isGeneratingKey} onOpenChange={setIsGeneratingKey}>
                                <DialogTrigger asChild>
                                    <Button className="rounded-none bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setIsGeneratingKey(true)} disabled={apiKeys.length >= 3}>
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Generate a secret key
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded-none">
                                    <DialogHeader>
                                        <DialogTitle>Generate a new secret key</DialogTitle>
                                        <DialogDescription>
                                            Enter a name to identify your new API key.
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
                                                className="col-span-3 rounded-none"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleGenerateKey} className="rounded-none bg-blue-500 hover:bg-blue-600 text-white">Generate Key</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Dialog open={!!newApiKey} onOpenChange={handleCloseDialogs}>
                            <DialogContent className="rounded-non">
                                <DialogHeader>
                                    <DialogTitle>Success! You safely generated a new secret key.</DialogTitle>
                                    <DialogDescription className="text-sm text-red-500">
                                        Please store this key safely as you won&apos;t be able to view it again. If you lose it, you&apos;ll need to generate a new one.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="api-key" className="text-right">
                                            Your secret key
                                        </Label>
                                        <div className="col-span-3 flex">
                                            <Input
                                                id="api-key"
                                                value={newApiKey || ''}
                                                readOnly
                                                className="flex-grow rounded-none"
                                            />
                                            <Button
                                                variant={isCopied ? "default" : "outline"}
                                                onClick={handleCopyApiKey}
                                                className={`ml-2 rounded-none ${isCopied ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                                            >
                                                {isCopied ? (
                                                    "Copied"
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4 mr-2" />
                                                        Copy
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
        </ContentSection>
    )
}
