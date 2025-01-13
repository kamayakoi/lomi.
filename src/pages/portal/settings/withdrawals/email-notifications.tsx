import { useState } from 'react'
import ContentSection from '@/components/portal/content-section'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { PlusIcon, XIcon, Mail } from 'lucide-react'
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
        <div style={{
            overflowY: 'auto',
            overflowX: 'hidden',
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
                title="Email notifications"
                desc="Configure email recipients of withdrawal notifications."
            >
                <div>
                    <Card className="rounded-none border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">Email recipients</CardTitle>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="rounded-none bg-blue-500 hover:bg-blue-600 text-white">
                                        <PlusIcon className="mr-2 h-4 w-4" /> Add email
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded-none sm:max-w-[425px]">
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
                                                className="rounded-none"
                                            />
                                            <p className="text-sm text-muted-foreground">Use space or comma to separate email addresses</p>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-none">Cancel</Button>
                                            <Button type="submit" className="rounded-none bg-blue-500 hover:bg-blue-600 text-white">Save</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {emails.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                                        <Mail className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p className="text-xl font-semibold text-gray-500 dark:text-gray-400 mt-4">
                                        No email recipients yet
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center mt-2">
                                        Add email recipients to receive withdrawal notifications.
                                    </p>
                                </div>
                            ) : (
                                <ScrollArea className="h-[200px] w-full border p-4 rounded-none">
                                    <ul className="space-y-2">
                                        {emails.map((email, index) => (
                                            <li key={index} className="flex justify-between items-center p-2 bg-secondary">
                                                <span className="text-sm">{email}</span>
                                                <Button variant="ghost" size="sm" className="rounded-none" onClick={() => handleRemoveEmail(email)}>
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
        </div>
    )
}
