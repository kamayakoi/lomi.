import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from 'lucide-react'
import ContentSection from '../components/content-section'

export default function CategoryApproval() {
    const handleAddNewCategory = () => {
        console.log("Adding new disbursement category")
        // Implement logic to add a new category
    }

    return (
        <ContentSection
            title="Disbursement Category & Approval"
            desc="Set different level of approval for batch disbursement"
        >
            <Card>
                <CardHeader>
                    <CardTitle>Disbursement Category & Approval</CardTitle>
                    <CardDescription>Set multi-level approval for Batch Disbursement</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">You don&apos;t have any Disbursement Category yet!</p>
                        <Button onClick={handleAddNewCategory}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            New Category
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </ContentSection>
    )
}