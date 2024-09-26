import { useState } from 'react'
import ContentSection from '../components/content-section'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PencilIcon } from 'lucide-react'

export default function EmailNotifications() {
    const [emails, setEmails] = useState<string[]>([])
    const [newEmail, setNewEmail] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleAddEmail = () => {
        if (newEmail && !emails.includes(newEmail)) {
            setEmails([...emails, newEmail])
            setNewEmail('')
            setIsDialogOpen(false)
        }
    }

    const handleRemoveEmail = (emailToRemove: string) => {
        setEmails(emails.filter(email => email !== emailToRemove))
    }

    return (
        <ContentSection
            title="Email Notifications"
            desc="Configure email recipients of withdrawal notifications"
        >
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Email</h2>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <PencilIcon className="mr-2 h-4 w-4" /> Edit emails
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add email recipients</DialogTitle>
                                <DialogDescription>
                                    Enter email addresses for withdrawal notifications.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={(e) => { e.preventDefault(); handleAddEmail(); }} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="alan@email.com, bob@email.com, etc."
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                    />
                                    <p className="text-sm text-muted-foreground">Use space or comma to separate email addresses</p>
                                </div>
                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit">Save</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {emails.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">You don&apos;t have any emails added yet!</p>
                        </CardContent>
                    </Card>
                ) : (
                    <ul className="space-y-2">
                        {emails.map((email, index) => (
                            <li key={index} className="flex justify-between items-center p-2 bg-secondary rounded-md">
                                <span>{email}</span>
                                <Button variant="ghost" size="sm" onClick={() => handleRemoveEmail(email)}>
                                    Remove
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}

                <p className="text-sm text-muted-foreground">
                    Contact hello@lomi.africa if you need assistance with managing your email notifications.
                </p>
            </div>
        </ContentSection>
    )
}