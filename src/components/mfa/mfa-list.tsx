import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

interface MFAFactor {
  id: string;
  friendly_name?: string;
  factor_type: string;
  status: "verified" | "unverified";
  created_at: string;
  name?: string;
}

interface MFAListProps {
  onUnenrollComplete?: () => void;
}

export function MFAListSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-12 bg-muted rounded-md" />
      <div className="h-12 bg-muted rounded-md" />
    </div>
  );
}

export function MFAList({ onUnenrollComplete }: MFAListProps) {
  const [factors, setFactors] = useState<MFAFactor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFactors() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Get MFA status from our database
        const { data: mfaStatus, error: mfaError } = await supabase.rpc('get_merchant_2fa_status', {
          p_merchant_id: user.id
        });

        if (mfaError) throw mfaError;

        const has2FA = mfaStatus?.[0]?.has_2fa || false;
        const deviceName = mfaStatus?.[0]?.name;

        // Only fetch factors if 2FA is enabled
        if (has2FA) {
          const { data: factorsData, error } = await supabase.auth.mfa.listFactors();
          if (error) throw error;

          // Only show the most recent verified TOTP factor
          const verifiedFactors = factorsData.totp
            ?.filter(f => f.status === 'verified')
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 1) // Take only the most recent one
            .map(factor => ({
              ...factor,
              name: deviceName || 'Authenticator App'
            })) || [];

          setFactors(verifiedFactors);
        } else {
          setFactors([]);
        }
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
    }

    loadFactors();
  }, []);

  const handleUnenroll = async (factorId: string) => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;

      // Update merchant record
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error: updateError } = await supabase.rpc('update_merchant_2fa', {
        p_merchant_id: user.id,
        p_totp_secret: null,
        p_has_2fa: false,
        p_name: null
      });

      if (updateError) throw updateError;

      setFactors([]);
      onUnenrollComplete?.();

      toast({
        title: "Success",
        description: "MFA device removed successfully",
      });
    } catch (error) {
      console.error('Error unenrolling MFA:', error);
      toast({
        title: "Error",
        description: "Failed to remove MFA device",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <MFAListSkeleton />;
  }

  if (factors.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        <p>No MFA devices configured</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {factors.map((factor) => (
        <div
          key={factor.id}
          className="flex items-center justify-between p-4 border rounded-md"
        >
          <div>
            <p className="font-medium">
              {factor.name || 'Authenticator App'}
            </p>
            <p className="text-sm text-muted-foreground">
              Added on {new Date(factor.created_at).toLocaleDateString()}
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleUnenroll(factor.id)}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}
