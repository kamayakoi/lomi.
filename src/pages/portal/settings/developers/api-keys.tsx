import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CopyIcon, PlusCircleIcon } from 'lucide-react'
import ContentSection from '@/components/dashboard/content-section'

type SecretKey = {
    name: string;
    permissions: string;
    created: string;
    lastUsed: string;
}

export default function ApiKeys() {
    const [secretKeys, setSecretKeys] = useState<SecretKey[]>([])
    const [publicKey] = useState("lomi_public_development_89G1GynFXftTY9")
    const [isGeneratingKey, setIsGeneratingKey] = useState(false)
    const [newKeyName, setNewKeyName] = useState("")

    const handleGenerateKey = () => {
        setIsGeneratingKey(false)
        setSecretKeys([...secretKeys, { name: newKeyName, permissions: "All", created: new Date().toISOString(), lastUsed: "-" }])
        setNewKeyName("")
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
                        {secretKeys.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Key name</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Last Used</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {secretKeys.map((key, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{key.name}</TableCell>
                                            <TableCell>{key.permissions}</TableCell>
                                            <TableCell>{new Date(key.created).toLocaleString()}</TableCell>
                                            <TableCell>{key.lastUsed}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(key.name)}>
                                                    <CopyIcon className="h-4 w-4 mr-2" />
                                                    Copy
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
                                <Button className="mt-4">
                                    <PlusCircleIcon className="h-4 w-4 mr-2" />
                                    Generate secret key
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Generate New Secret Key</DialogTitle>
                                    <DialogDescription>
                                        Enter a name for your new secret key. This key will have full permissions.
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

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Public Key</h2>
                        <p className="text-muted-foreground mb-4">Public keys are only used to tokenize card information on the client side.</p>
                        <div className="flex items-center space-x-2">
                            <Input value={publicKey} readOnly />
                            <Button variant="outline" onClick={() => copyToClipboard(publicKey)}>
                                <CopyIcon className="h-4 w-4 mr-2" />
                                Copy
                            </Button>
                        </div>
                    </div>
                </div>
            </ContentSection>
        </div>
    )
}
