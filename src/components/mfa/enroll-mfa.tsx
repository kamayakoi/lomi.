import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
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
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { CopyInput } from "@/components/ui/copy-input";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { toast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/actions/utils";
import InfoBox from "@/components/ui/info-box";
import { v4 as uuidv4 } from "uuid";

interface TOTPData {
  id: string;
  totp: {
    qr_code: string;
    secret: string;
  };
}

interface EnrollMFAProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function EnrollMFA({ onComplete, onCancel }: EnrollMFAProps) {
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
        // First, check if there are any existing factors
        const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();

        if (factorsError) throw factorsError;

        // Find and remove any existing factors
        const existingFactors = factorsData?.all || [];

        // Unenroll all existing factors
        for (const factor of existingFactors) {
          try {
            await supabase.auth.mfa.unenroll({ factorId: factor.id });
            // Add a small delay after each unenroll to ensure it's processed
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (unenrollError) {
            console.error('Error unenrolling factor:', unenrollError);
          }
        }

        // Add a small delay before enrolling new factor
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Now enroll a new factor
        const factorUuid = uuidv4();
        const deviceName = `App n—${factorUuid}`;

        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: "totp",
          issuer: "lomi.africa",
          friendlyName: deviceName
        });

        if (error) throw error;

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
        onCancel?.();
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
          // Update merchant record
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('No user found');

          const deviceName = `App n—${Date.now()}`;

          const { error: updateError } = await supabase.rpc('update_merchant_2fa', {
            p_merchant_id: user.id,
            p_totp_secret: secret,
            p_has_2fa: true,
            p_name: deviceName
          });

          if (updateError) throw updateError;

          toast({
            title: "Success",
            description: "Two-factor authentication enabled successfully",
          });

          onComplete?.();
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

  const handleCancel = async () => {
    try {
      if (factorId) {
        await supabase.auth.mfa.unenroll({
          factorId,
        });
      }
      onCancel?.();
    } catch (error) {
      console.error('MFA unenrollment error:', error);
      onCancel?.(); // Still cancel even if unenroll fails
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
            onClick={handleCancel}
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
