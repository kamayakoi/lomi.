import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { toast } from "@/components/ui/use-toast"
import { SmartphoneIcon } from 'lucide-react'
import { PinInput, PinInputField } from '@/components/custom/pin-input'
import { supabase } from '@/utils/supabase/client'
import QRCode from 'qrcode'
import { cn } from "@/lib/actions/utils"
import { authenticator } from 'otplib'

interface TwoFactorAuthProps {
    merchantId: string;
    initialStatus?: boolean;
}

// Function to generate a hex secret
function generateSecret(): string {
    const length = 20;
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);

    return Array.from(randomValues)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export default function TwoFactorAuth({ merchantId, initialStatus = false }: TwoFactorAuthProps) {
    const [showSetupModal, setShowSetupModal] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState('');
    const [secret, setSecret] = useState('');
    const [isEnabled, setIsEnabled] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const generateQRCode = async (secret: string) => {
        try {
            const otpAuthUrl = authenticator.keyuri(merchantId, 'Lomi', secret);
            const qrCode = await QRCode.toDataURL(otpAuthUrl);
            setQrCodeUrl(qrCode);
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw error;
        }
    };

    const handleAction = async () => {
        if (!isEnabled) {
            try {
                setIsLoading(true);
                // Generate a proper TOTP secret
                const newSecret = generateSecret();
                setSecret(newSecret);
                await generateQRCode(newSecret);
                setShowSetupModal(true);
            } catch (error) {
                console.error('Error setting up 2FA:', error);
                toast({
                    title: "Error",
                    description: "Failed to setup 2FA",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                setIsLoading(true);
                const { error } = await supabase.rpc('disable_2fa', {
                    p_merchant_id: merchantId
                });

                if (error) throw error;

                setIsEnabled(false);
                toast({
                    title: "Success",
                    description: "2FA has been disabled",
                });
            } catch (error) {
                console.error('Error disabling 2FA:', error);
                toast({
                    title: "Error",
                    description: "Failed to disable 2FA",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const verifyAndEnable = async () => {
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
            const { error } = await supabase.rpc('enable_2fa', {
                p_merchant_id: merchantId,
                p_totp_secret: secret,
                p_verification_code: verificationCode
            });

            if (error) {
                if (error.message.includes('Invalid verification code')) {
                    toast({
                        title: "Error",
                        description: "Invalid verification code. Please try again.",
                        variant: "destructive",
                    });
                    return;
                }
                throw error;
            }

            setIsEnabled(true);
            setShowSetupModal(false);
            setVerificationCode('');
            toast({
                title: "Success",
                description: "2FA has been enabled successfully",
            });
        } catch (error) {
            console.error('Error enabling 2FA:', error);
            toast({
                title: "Error",
                description: "Failed to verify 2FA code",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div>
                <h4 className="text-sm font-medium">2-factor Authentication</h4>
                <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account.
                </p>
            </div>
            <Button
                variant="outline"
                onClick={handleAction}
                disabled={isLoading}
                className="rounded-none"
            >
                {isEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>

            {showSetupModal && (
                <Dialog open={showSetupModal} onOpenChange={setShowSetupModal}>
                    <DialogContent className="sm:max-w-[400px] rounded-none">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <SmartphoneIcon className="w-5 h-5" />
                                Set up 2FA
                            </DialogTitle>
                            <DialogDescription>
                                Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4">
                            {qrCodeUrl && (
                                <div className={cn(
                                    "p-4 bg-white",
                                    "border border-input rounded-none",
                                    "shadow-sm"
                                )}>
                                    <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                                </div>
                            )}
                            <div className="w-full space-y-2">
                                <Label htmlFor="verification-code">Enter the 6-digit code from your authenticator app</Label>
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
                                                    "focus:outline-none focus:ring-1 focus:ring-primary",
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
                                onClick={() => setShowSetupModal(false)}
                                className="rounded-none"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={verifyAndEnable}
                                disabled={verificationCode.length !== 6 || isLoading}
                                className="rounded-none"
                            >
                                Enable
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
} 