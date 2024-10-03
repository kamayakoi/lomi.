import { useState } from 'react'
import ContentSection from '../components/content-section'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon, TrashIcon } from 'lucide-react'

interface PhoneNumber {
    id: string
    number: string
    provider: string
}

export default function PhoneNumbers() {
    const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([])
    const [newPhoneNumber, setNewPhoneNumber] = useState<Partial<PhoneNumber>>({})
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleAddPhoneNumber = () => {
        if (newPhoneNumber.number && newPhoneNumber.provider) {
            setPhoneNumbers([...phoneNumbers, { ...newPhoneNumber, id: Date.now().toString() } as PhoneNumber])
            setNewPhoneNumber({})
            setIsDialogOpen(false)
        }
    }

    const handleDeletePhoneNumber = (id: string) => {
        setPhoneNumbers(phoneNumbers.filter(phoneNumber => phoneNumber.id !== id))
    }

    return (
        <ContentSection
            title="Phone Numbers"
            desc="Add or delete your provider&apos;s phone number for withdrawals"
        >
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Your phone numbers</h2>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" /> Add phone number
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a new phone number</DialogTitle>
                                <DialogDescription>
                                    Enter your phone number and select the mobile money provider.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={(e) => { e.preventDefault(); handleAddPhoneNumber(); }} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="provider">Mobile Money Provider</Label>
                                    <Select onValueChange={(value) => setNewPhoneNumber({ ...newPhoneNumber, provider: value })}>
                                        <SelectTrigger id="provider">
                                            <SelectValue placeholder="Select provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mtn">MTN</SelectItem>
                                            <SelectItem value="wave">Wave</SelectItem>
                                            <SelectItem value="orange">Orange Money</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input
                                        id="phoneNumber"
                                        value={newPhoneNumber.number || ''}
                                        onChange={(e) => setNewPhoneNumber({ ...newPhoneNumber, number: e.target.value })}
                                        placeholder="Enter your phone number with country code"
                                    />
                                </div>
                                <Button type="submit">Add Phone Number</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {phoneNumbers.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">You don&apos;t have any phone numbers yet!</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {phoneNumbers.map(phoneNumber => (
                            <div key={phoneNumber.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="text-sm font-medium">{phoneNumber.number}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{phoneNumber.provider}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleDeletePhoneNumber(phoneNumber.id)}>
                                    <TrashIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <p className="text-sm text-muted-foreground">
                    Contact hello@lomi.africa if you need assistance with managing your phone numbers.
                </p>
            </div>
        </ContentSection>
    )
}