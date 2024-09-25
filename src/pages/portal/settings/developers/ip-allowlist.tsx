import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

type IpAddress = {
    address: string;
    added: string;
}

export default function IpAllowlist() {
    const [ipAddresses, setIpAddresses] = useState<IpAddress[]>([])
    const [newIpAddresses, setNewIpAddresses] = useState("")
    const [isAddingIp, setIsAddingIp] = useState(false)

    const handleAddIpAddresses = () => {
        if (newIpAddresses) {
            const addresses = newIpAddresses.split('\n').filter(address => address.trim() !== '')
            const newEntries = addresses.map(address => ({
                address: address.trim(),
                added: new Date().toISOString()
            }))
            setIpAddresses([...ipAddresses, ...newEntries])
            setNewIpAddresses("")
            setIsAddingIp(false)
        }
    }

    const handleRemoveIpAddress = (index: number) => {
        const updatedIpAddresses = ipAddresses.filter((_, i) => i !== index)
        setIpAddresses(updatedIpAddresses)
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>IP Allowlist</CardTitle>
                            <CardDescription>
                                Secure API access against foreign or malicious IPs by allowing only specific IP addresses of your choice to access APIs via IP Allowlist.
                            </CardDescription>
                        </div>
                        <Dialog open={isAddingIp} onOpenChange={setIsAddingIp}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add IP Address / CIDR
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add IP Address / CIDR</DialogTitle>
                                    <DialogDescription>
                                        We support IPv4 and CIDR format to register your server IPs. <a href="#" className="text-primary">Learn more</a>.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="ipAddresses">IP address / Range</Label>
                                        <Textarea
                                            id="ipAddresses"
                                            value={newIpAddresses}
                                            onChange={(e) => setNewIpAddresses(e.target.value)}
                                            placeholder="Example: 1.1.1.1 or 1.1.1.1/24. Use a new line to add another IP address."
                                            className="h-[100px]"
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="sm:justify-between">
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" onClick={handleAddIpAddresses}>
                                        Add ({newIpAddresses.split('\n').filter(ip => ip.trim() !== '').length})
                                    </Button>
                                </DialogFooter>
                                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Close</span>
                                </DialogClose>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <Alert variant="info" className="mb-6">
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                            The IP Allowlist only works for API users through direct integration and will not work for Plugin users (Shopify, Woocommerce, etc). Learn more about IP Allowlist <a href="#" className="underline">here</a>.
                        </AlertDescription>
                    </Alert>

                    {ipAddresses.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>IP Address / CIDR</TableHead>
                                    <TableHead>Added On</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ipAddresses.map((ip, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{ip.address}</TableCell>
                                        <TableCell>{new Date(ip.added).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Button variant="destructive" size="sm" onClick={() => handleRemoveIpAddress(index)}>
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-xl font-semibold">No IP Address added</p>
                            <p className="text-muted-foreground">Click &apos;Add IP Address / CIDR&apos; to start adding your server IPs to allowlist</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}