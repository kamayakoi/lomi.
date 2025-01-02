import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { toast } from "@/components/ui/use-toast"
import { SmartphoneIcon } from 'lucide-react'
import { PinInput, PinInputField } from '@/components/custom/pin-input'
import { supabase } from '@/utils/supabase/client'
import { cn } from "@/lib/actions/utils"

interface Verify2FAProps {
    merchantId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function Verify2FA({ merchantId, onSuccess, onCancel }: Verify2FAProps) {
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            toast({
                title: "Error",
                description: "Please enter a valid 6-digit code",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsLoading(true);
            const { error } = await supabase.rpc('verify_2fa_login', {
                p_merchant_id: merchantId,
                p_verification_code: verificationCode
            });

            if (error) {
                if (error.message.includes('Invalid verification code')) {
                    toast({
                        title: "Error",
                        description: "Invalid code. Please try again.",
                        variant: "destructive",
                    });
                    return;
                }
                throw error;
            }

            toast({
                title: "Success",
                description: "2FA verification successful",
            });
            onSuccess();
        } catch (error) {
            console.error('Error verifying 2FA:', error);
            toast({
                title: "Error",
                description: "Failed to verify code",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={() => !isLoading && onCancel()}>
            <DialogContent className="sm:max-w-[400px] rounded-none">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <SmartphoneIcon className="w-5 h-5" />
                        Two-Factor Authentication
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-full space-y-2">
                        <Label htmlFor="verification-code">
                            Enter the 6-digit code from your authenticator app
                        </Label>
                        <div className="flex justify-center">
                            <PinInput
                                value={verificationCode}
                                onChange={setVerificationCode}
                                type="numeric"
                                placeholder="○"
                                className="flex gap-2"
                            >
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <PinInputField
                                        key={i}
                                        className={cn(
                                            "w-10 h-10 text-center text-xl",
                                            "bg-muted rounded-none",
                                            "focus:outline-none focus:ring-2 focus:ring-primary",
                                            "border border-input"
                                        )}
                                    />
                                ))}
                            </PinInput>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="rounded-none"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleVerify}
                        disabled={verificationCode.length !== 6 || isLoading}
                        className="rounded-none"
                    >
                        Verify
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 