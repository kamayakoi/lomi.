import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MFA } from "./mfa";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SetupMfa } from "./setup-mfa";
import { supabase } from "@/utils/supabase/client";
import { useEffect } from "react";
import { toast } from "@/lib/hooks/use-toast";

export function MfaSettingsList() {
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [hasMFA, setHasMFA] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase.rpc('get_merchant_2fa_status', {
        p_merchant_id: user.id
      });

      if (error) throw error;

      setHasMFA(data?.[0]?.has_2fa || false);
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
        <MFA />
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
          <SetupMfa
            onComplete={handleMFAComplete}
            onCancel={() => setShowMFASetup(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
