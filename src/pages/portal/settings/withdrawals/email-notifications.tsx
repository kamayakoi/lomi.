import { useState } from 'react'
import ContentSection from '@/components/dashboard/content-section'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { PlusIcon, XIcon } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"

export default function EmailNotifications() {
    const [emails, setEmails] = useState<string[]>([])
    const [newEmail, setNewEmail] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleAddEmail = () => {
        const emailsToAdd = newEmail.split(/[,\s]+/).filter(email => email.trim() !== '')
        const validEmails = emailsToAdd.filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        const invalidEmails = emailsToAdd.filter(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))

        if (validEmails.length > 0) {
            setEmails(prevEmails => [...new Set([...prevEmails, ...validEmails])])
            setNewEmail('')
            setIsDialogOpen(false)
            toast({
                title: "Emails added",
                description: `Successfully added ${validEmails.length} email(s).`,
            })
        }

        if (invalidEmails.length > 0) {
            toast({
                title: "Invalid emails",
                description: `${invalidEmails.length} email(s) were invalid and not added.`,
                variant: "destructive",
            })
        }
    }

    const handleRemoveEmail = (emailToRemove: string) => {
        setEmails(emails.filter(email => email !== emailToRemove))
        toast({
            title: "Email removed",
            description: `${emailToRemove} has been removed from notifications.`,
        })
    }

    return (
        <ContentSection
            title="Email Notifications"
            desc="Configure email recipients of withdrawal notifications"
        >
            {/* Wrap all content in a single div */}
            <div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Email Recipients</CardTitle>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <PlusIcon className="mr-2 h-4 w-4" /> Add email
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
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
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                        <Button type="submit">Save</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        {emails.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">You don&apos;t have any emails added yet!</p>
                        ) : (
                            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                <ul className="space-y-2">
                                    {emails.map((email, index) => (
                                        <li key={index} className="flex justify-between items-center p-2 bg-secondary rounded-md">
                                            <span className="text-sm">{email}</span>
                                            <Button variant="ghost" size="sm" onClick={() => handleRemoveEmail(email)}>
                                                <XIcon className="h-4 w-4" />
                                                <span className="sr-only">Remove {email}</span>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>

                <p className="text-sm text-muted-foreground mt-4">
                    Contact hello@lomi.africa if you need assistance with managing your email notifications.
                </p>
            </div>
        </ContentSection>
    )
}
