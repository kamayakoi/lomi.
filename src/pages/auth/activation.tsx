import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Upload, Building2, UserCheck, FileText, Clock, CheckCircle2 } from 'lucide-react'

const StepIndicator = ({ step, isCompleted, isActive, children }: { step: number; isCompleted: boolean; isActive: boolean; children: React.ReactNode }) => (
    <div className={`flex items-center mb-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${isCompleted ? 'bg-primary border-primary' : isActive ? 'border-primary' : 'border-muted'}`}>
            {isCompleted ? <Check className="w-5 h-5 text-primary-foreground" /> : step}
        </div>
        <span className="ml-2 text-sm font-medium">{children}</span>
    </div>
)

export default function AccountActivationPage() {
    const [activationStep, setActivationStep] = useState(1)

    const steps = [
        { title: "Create your account", icon: <Building2 className="w-6 h-6" /> },
        { title: "Business Details", icon: <Building2 className="w-6 h-6" /> },
        { title: "Authorized Signatory", icon: <UserCheck className="w-6 h-6" /> },
        { title: "Documents", icon: <FileText className="w-6 h-6" /> },
        { title: "Verification in progress", icon: <Clock className="w-6 h-6" /> },
        { title: "Account activated", icon: <CheckCircle2 className="w-6 h-6" /> }
    ]

    const handleNextStep = () => {
        if (activationStep < steps.length) {
            setActivationStep(activationStep + 1)
        }
    }

    const handlePreviousStep = () => {
        if (activationStep > 1) {
            setActivationStep(activationStep - 1)
        }
    }

    const renderStepContent = () => {
        switch (activationStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Create your account</h2>
                        <p>Your account has been created successfully. Please proceed to complete your business details.</p>
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold">Business Details</h2>
                        <div>
                            <Label htmlFor="business-logo">Business Logo*</Label>
                            <div className="mt-2 flex items-center space-x-4">
                                <div className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                                    <Building2 className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <Button variant="outline">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Logo
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">Must be at least 200px by 200px. File format must be in .jpg or .png with max file size of 1MB.</p>
                        </div>
                        <div>
                            <Label htmlFor="company-name">Legal Company Name*</Label>
                            <Input id="company-name" placeholder="e.g. Saigon Enterprises" />
                            <p className="text-sm text-muted-foreground mt-1">This name must match the one in your legal documents</p>
                        </div>
                        <div>
                            <Label htmlFor="business-description">Business Description*</Label>
                            <Textarea id="business-description" placeholder="e.g. We're selling second-hand smartphones via Instagram" />
                            <p className="text-sm text-muted-foreground mt-1">Briefly tell us what you sell and where you sell them on</p>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold">Authorized Signatory</h2>
                        <div>
                            <Label htmlFor="full-name">Full Name*</Label>
                            <Input id="full-name" placeholder="e.g. Nguyen Van A" />
                        </div>
                        <div>
                            <Label htmlFor="email">Email*</Label>
                            <Input id="email" type="email" placeholder="e.g. yourname@email.com" />
                        </div>
                        <div>
                            <Label htmlFor="mobile-number">Mobile Number*</Label>
                            <div className="flex">
                                <Select>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="+84" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+84">+84</SelectItem>
                                        <SelectItem value="+1">+1</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input id="mobile-number" className="flex-1 ml-2" placeholder="910 345 6789" />
                            </div>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold">Documents</h2>
                        <div>
                            <Label>Document Upload</Label>
                            <p className="text-sm text-muted-foreground mb-2">Please upload the required documents for verification</p>
                            <Button variant="outline">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Documents
                            </Button>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div className="text-center py-12">
                        <Clock className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
                        <h2 className="text-2xl font-semibold mb-2">Verification in Progress</h2>
                        <p className="text-muted-foreground">We are reviewing your information. This process may take 1-3 business days.</p>
                    </div>
                )
            case 6:
                return (
                    <div className="text-center py-12">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Account Activated</h2>
                        <p className="text-muted-foreground">Congratulations! Your account has been successfully activated.</p>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 pr-6 mb-6 md:mb-0">
                            <h1 className="text-2xl font-bold tracking-tight mb-6">Account Activation</h1>
                            {steps.map((step, index) => (
                                <StepIndicator
                                    key={index}
                                    step={index + 1}
                                    isCompleted={index + 1 < activationStep}
                                    isActive={index + 1 === activationStep}
                                >
                                    {step.title}
                                </StepIndicator>
                            ))}
                        </div>
                        <div className="md:w-2/3 md:border-l md:pl-6">
                            <div className="space-y-6">
                                {renderStepContent()}
                                <div className="flex justify-between mt-6">
                                    <Button variant="outline" onClick={handlePreviousStep} disabled={activationStep === 1}>
                                        Back
                                    </Button>
                                    <Button onClick={handleNextStep} disabled={activationStep === steps.length}>
                                        {activationStep === steps.length - 1 ? 'Finish' : 'Next'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}