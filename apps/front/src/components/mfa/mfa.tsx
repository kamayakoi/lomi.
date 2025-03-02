import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/lib/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import InfoBox from "@/components/ui/info-box";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { CopyInput } from "@/components/ui/copy-input";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { cn } from "@/lib/actions/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";

interface TOTPFactor {
    id: string;
    friendly_name?: string;
    factor_type: string;
    status: "verified" | "unverified";
    created_at: string;
}

interface TOTPData {
    id: string;
    totp: {
        qr_code: string;
        secret: string;
    };
}

interface MFAProps {
    onUnenrollComplete?: () => void;
}

export function MFA({ onUnenrollComplete }: MFAProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [factors, setFactors] = useState<TOTPFactor[]>([]);
    const [showSetup, setShowSetup] = useState(false);
    const [isOAuthUser, setIsOAuthUser] = useState(false);

    useEffect(() => {
        loadFactors();
        checkAuthProvider();
    }, []);

    const checkAuthProvider = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            const provider = session.user.app_metadata.provider;
            setIsOAuthUser(provider !== 'email');
        }
    };

    const loadFactors = async () => {
        try {
            setIsLoading(true);
            const { data: factorsData, error } = await supabase.auth.mfa.listFactors();
            if (error) throw error;

            const verifiedFactors = factorsData.totp?.filter(f => f.status === 'verified') || [];
            setFactors(verifiedFactors);
        } catch (error) {
            console.error('Error loading MFA factors:', error);
            toast({
                title: "Error",
                description: "Failed to load MFA devices",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetupComplete = async () => {
        setShowSetup(false); // Close the setup dialog
        await loadFactors(); // Reload the factors list
    };

    const handleSetupCancel = () => {
        setShowSetup(false); // Close the setup dialog
    };

    const handleRemoveFactor = async (factorId: string) => {
        try {
            const { error } = await supabase.auth.mfa.unenroll({ factorId });
            if (error) throw error;

            await loadFactors();
            onUnenrollComplete?.();
            toast({
                title: "Success",
                description: "MFA device removed successfully",
            });
        } catch (error) {
            console.error('Error removing MFA factor:', error);
            toast({
                title: "Error",
                description: "Failed to remove MFA device",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-2">
            {isOAuthUser && (
                <InfoBox
                    variant="yellow"
                    title="Authentication Provider Support"
                    type="warning"
                >
                    Two-factor authentication is currently only available for accounts created with email authentication.
                    Merchants signed in with Google or GitHub will need to use sign-in via email and password to see 2FA challenges.
                </InfoBox>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Multi-factor authentication</CardTitle>
                    <CardDescription>
                        Add an additional layer of security to your account by requiring more
                        than just a password to sign in.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-12 bg-muted rounded-md" />
                            <div className="h-12 bg-muted rounded-md" />
                        </div>
                    ) : factors.length > 0 ? (
                        <div className="space-y-4">
                            {factors.map((factor) => (
                                <div
                                    key={factor.id}
                                    className="flex items-center justify-between p-4 border rounded-md"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {factor.friendly_name || 'Authenticator'}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Added on {new Date(factor.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleRemoveFactor(factor.id)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <AlertCircle className="h-4 w-4" />
                            <p>No MFA devices configured</p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between">
                    <div />
                    <Button
                        onClick={() => setShowSetup(true)}
                        disabled={factors.length > 0}
                    >
                        Add new device
                    </Button>
                </CardFooter>

                {showSetup && (
                    <Dialog
                        open={showSetup}
                        onOpenChange={(open) => {
                            if (!open) handleSetupCancel();
                            setShowSetup(open);
                        }}
                    >
                        <DialogContent className="sm:max-w-[480px] p-6 bg-background border-border">
                            <MFASetup onComplete={handleSetupComplete} onCancel={handleSetupCancel} />
                        </DialogContent>
                    </Dialog>
                )}
            </Card>
        </div>
    );
}

interface MFASetupProps {
    onComplete: () => void;
    onCancel: () => void;
}

export function MFASetup({ onComplete, onCancel }: MFASetupProps) {
    const [isValidating, setValidating] = useState(false);
    const [factorId, setFactorId] = useState("");
    const [qr, setQR] = useState("");
    const [secret, setSecret] = useState<string | undefined>(undefined);
    const [error, setError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function setupMFA() {
            setIsLoading(true);
            try {
                // Refresh session before starting
                const { error: sessionError } = await supabase.auth.refreshSession();
                if (sessionError) throw sessionError;

                // First, get all existing factors
                const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
                if (factorsError) throw factorsError;

                // Clean up all existing factors (both verified and unverified)
                const existingFactors = factorsData.all || [];
                for (const factor of existingFactors) {
                    try {
                        await supabase.auth.mfa.unenroll({ factorId: factor.id });
                        // Add a small delay between operations
                        await new Promise(resolve => setTimeout(resolve, 500));
                    } catch (error) {
                        console.error('Error cleaning up factor:', error);
                    }
                }

                // Add a small delay before creating new factor
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Enroll new factor
                const timestamp = Date.now();
                const { data, error } = await supabase.auth.mfa.enroll({
                    factorType: "totp",
                    issuer: "lomi.africa",
                    friendlyName: `Authenticator n—${timestamp}`
                });

                if (error) {
                    if (error.message.includes('AAL2 required')) {
                        throw new Error('Please sign out and sign back in to set up MFA');
                    }
                    throw error;
                }

                const totpData = data as TOTPData;
                setFactorId(totpData.id);
                setQR(totpData.totp.qr_code);
                setSecret(totpData.totp.secret);
            } catch (error) {
                console.error('MFA enrollment error:', error);
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to start MFA setup. Please try again.",
                    variant: "destructive",
                });
                onCancel();
            } finally {
                setIsLoading(false);
            }
        }

        setupMFA();
    }, [onCancel]);

    const onCodeComplete = async (code: string) => {
        setError(false);

        if (!isValidating) {
            setValidating(true);

            try {
                const challenge = await supabase.auth.mfa.challenge({ factorId });
                if (!challenge.data?.id) {
                    throw new Error('Failed to create challenge');
                }

                const verify = await supabase.auth.mfa.verify({
                    factorId,
                    challengeId: challenge.data.id,
                    code,
                });

                if (verify.data) {
                    // Add a small delay to ensure the verification is processed
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Double-check the factor status
                    const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
                    if (factorsError) throw factorsError;

                    const verifiedFactor = factorsData?.totp?.find(f => f.id === factorId && f.status === 'verified');

                    if (verifiedFactor) {
                        toast({
                            title: "Success",
                            description: "Two-factor authentication enabled successfully",
                        });
                        // Reset all states
                        setFactorId("");
                        setQR("");
                        setSecret(undefined);
                        setError(false);
                        setIsOpen(false);
                        setValidating(false);
                        setIsLoading(false);
                        // Close the setup dialog last
                        onComplete();
                    } else {
                        throw new Error('Factor verification failed');
                    }
                } else {
                    setError(true);
                    toast({
                        title: "Error",
                        description: "Invalid verification code. Please try again.",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error('MFA verification error:', error);
                setError(true);
                toast({
                    title: "Error",
                    description: "Failed to verify MFA setup",
                    variant: "destructive",
                });
            } finally {
                setValidating(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-sm text-muted-foreground">Setting up MFA...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold">
                    Set up two-factor authentication
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Scan the QR code with your authenticator app
                </p>
            </div>

            <div className="border-2 border-border bg-card rounded-sm mb-6 p-0 overflow-hidden w-[250px] h-[250px] flex items-center justify-center">
                {qr && (
                    <img
                        src={qr}
                        alt="QR Code for 2FA Setup"
                        className="w-[250px] h-[250px]"
                    />
                )}
            </div>

            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="w-full mb-6"
            >
                <CollapsibleTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-between px-4 py-2 text-sm border-2 hover:bg-accent"
                    >
                        <span>Manual entry code</span>
                        <CaretSortIcon className="h-4 w-4 shrink-0 transition-transform duration-200"
                            style={{ transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }}
                        />
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                    {secret && (
                        <InfoBox variant="blue" mini>
                            <div className="space-y-3">
                                <p className="text-foreground">
                                    If you can&apos;t scan the QR code, enter this code manually in your authenticator app:
                                </p>
                                <CopyInput
                                    value={secret}
                                    className="w-full text-foreground bg-background/50 border-border/50"
                                />
                            </div>
                        </InfoBox>
                    )}
                </CollapsibleContent>
            </Collapsible>

            <div className="w-full space-y-4">
                <div className="space-y-3">
                    <p className="text-sm text-center">
                        Enter the 6-digit code from your authenticator app
                    </p>
                    <div className="flex justify-center">
                        <InputOTP
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                            autoFocus
                            onComplete={onCodeComplete}
                            disabled={isValidating}
                            className={cn(error && "invalid")}
                            render={({ slots }) => (
                                <InputOTPGroup className="gap-2">
                                    {slots.map((slot, idx) => (
                                        <InputOTPSlot
                                            key={idx}
                                            {...slot}
                                            className={cn(
                                                "w-10 h-12 text-lg border-2",
                                                error && "border-destructive"
                                            )}
                                        />
                                    ))}
                                </InputOTPGroup>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-center pt-4 border-t border-border">
                    <Button
                        onClick={onCancel}
                        variant="ghost"
                        className="text-sm hover:bg-accent"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
} 