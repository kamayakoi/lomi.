import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CopyIcon, PlusCircleIcon } from 'lucide-react'

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
        <div className="container mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold">API Keys</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Secret Keys</CardTitle>
                    <CardDescription>Secret keys are used to authenticate API requests coming from your servers.</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Public Key</CardTitle>
                    <CardDescription>Public keys are only used to tokenize card information on the client side.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Input value={publicKey} readOnly />
                        <Button variant="outline" onClick={() => copyToClipboard(publicKey)}>
                            <CopyIcon className="h-4 w-4 mr-2" />
                            Copy
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}