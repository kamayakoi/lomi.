import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import ContentSection from '../../../../components/dashboard/content-section'

export default function DisbursementNotifications() {
    const [emailSender, setEmailSender] = useState("")
    const [emailFooter, setEmailFooter] = useState("")
    const [batchEmailSender, setBatchEmailSender] = useState("")
    const [batchEmailFooter, setBatchEmailFooter] = useState("")

    const handleSaveEmailTemplate = () => {
        console.log("Saving email template:", { emailSender, emailFooter })
        // Implement API call to save the email template
    }

    const handleSaveBatchEmailTemplate = () => {
        console.log("Saving batch email template:", { batchEmailSender, batchEmailFooter })
        // Implement API call to save the batch email template
    }

    return (
        <ContentSection
            title="Disbursement Notifications"
            desc="Set how recipients are notified about disbursements you send"
        >
            <div className="space-y-8">
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Disbursement Email Receipt Template</CardTitle>
                        <CardDescription>Customize the email sender and footer of your disbursement emails.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email-sender">Email sender</Label>
                                <Input
                                    id="email-sender"
                                    value={emailSender}
                                    onChange={(e) => setEmailSender(e.target.value)}
                                    placeholder="noreply@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email-footer">Email footer</Label>
                                <Input
                                    id="email-footer"
                                    value={emailFooter}
                                    onChange={(e) => setEmailFooter(e.target.value)}
                                    placeholder="Enter email footer"
                                />
                            </div>
                        </div>
                        <Button className="mt-4" onClick={handleSaveEmailTemplate}>Save</Button>
                        <div className="mt-6">
                            <h4 className="text-sm font-medium mb-2">Preview</h4>
                            <div className="border rounded-md p-4 bg-gray-50">
                                <p>From: {emailSender || 'noreply@example.com'}</p>
                                <p>Footer: {emailFooter || 'Default footer'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Batch Disbursement Email Receipt Template</CardTitle>
                        <CardDescription>Customize the email sender and footer of your batch disbursement emails.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="batch-email-sender">Email sender</Label>
                                <Input
                                    id="batch-email-sender"
                                    value={batchEmailSender}
                                    onChange={(e) => setBatchEmailSender(e.target.value)}
                                    placeholder="noreply@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="batch-email-footer">Email footer</Label>
                                <Input
                                    id="batch-email-footer"
                                    value={batchEmailFooter}
                                    onChange={(e) => setBatchEmailFooter(e.target.value)}
                                    placeholder="Enter email footer"
                                />
                            </div>
                        </div>
                        <Button className="mt-4" onClick={handleSaveBatchEmailTemplate}>Save</Button>
                        <div className="mt-6">
                            <h4 className="text-sm font-medium mb-2">Preview</h4>
                            <div className="border rounded-md p-4 bg-gray-50">
                                <p>From: {batchEmailSender || 'noreply@example.com'}</p>
                                <p>Footer: {batchEmailFooter || 'Default footer'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ContentSection>
    )
}