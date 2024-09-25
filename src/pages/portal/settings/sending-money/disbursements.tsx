import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ContentSection from '../components/content-section'

export default function Disbursements() {
    const [defaultDescription, setDefaultDescription] = useState("")

    const handleSaveDescription = () => {
        console.log("Saving default description:", defaultDescription)
        // Implement API call to save the description
    }

    return (
        <ContentSection
            title="Disbursements"
            desc="Activate and configure xenDisburse for your business"
        >
            <Card>
                <CardHeader>
                    <CardTitle>Default Disbursement Description</CardTitle>
                    <CardDescription>Set the default description for all your disbursements. You may also set it during each API request.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Input
                            id="default-description"
                            value={defaultDescription}
                            onChange={(e) => setDefaultDescription(e.target.value)}
                            placeholder="Enter default description such as 'Payment' or 'Disbursement'"
                        />
                        <Button onClick={handleSaveDescription}>Save</Button>
                    </div>
                </CardContent>
            </Card>
        </ContentSection>
    )
}