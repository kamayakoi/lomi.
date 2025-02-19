import { EnrollMFA } from "@/components/mfa/enroll-mfa";

export interface SetupMfaProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function SetupMfa({ onComplete, onCancel }: SetupMfaProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <EnrollMFA onComplete={onComplete} onCancel={onCancel} />
    </div>
  );
}
