import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UnenrollMFA } from "./unenroll-mfa";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MFASetup } from "./mfa";
import { supabase } from "@/utils/supabase/client";
import { toast } from "@/lib/hooks/use-toast";

export function MfaSettingsList() {
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [hasMFA, setHasMFA] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const { data: factorsData, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;

      const verifiedFactors = factorsData.totp?.filter(f => f.status === 'verified') || [];
      setHasMFA(verifiedFactors.length > 0);
    } catch (error) {
      console.error('Error checking MFA status:', error);
    }
  };

  const handleMFAComplete = async () => {
    setShowMFASetup(false);
    await checkMFAStatus();
    toast({
      title: "Success",
      description: "Two-factor authentication has been enabled",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-factor authentication</CardTitle>
        <CardDescription>
          Add an additional layer of security to your account by requiring more
          than just a password to sign in.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {hasMFA ? (
          <UnenrollMFA onUnenrollComplete={checkMFAStatus} />
        ) : (
          <div className="text-sm text-muted-foreground">
            No MFA devices configured. Add a device to enable two-factor authentication.
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div />
        <Button
          onClick={() => setShowMFASetup(true)}
          disabled={hasMFA}
        >
          Add new device
        </Button>
      </CardFooter>

      <Dialog open={showMFASetup} onOpenChange={setShowMFASetup}>
        <DialogContent className="sm:max-w-[480px] p-6 bg-background border-border">
          <MFASetup
            onComplete={handleMFAComplete}
            onCancel={() => setShowMFASetup(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
