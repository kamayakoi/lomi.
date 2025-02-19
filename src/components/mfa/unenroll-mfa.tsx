import { MFA } from "./mfa";

interface UnenrollMFAProps {
  onUnenrollComplete?: () => void;
}

export function UnenrollMFA({ onUnenrollComplete }: UnenrollMFAProps) {
  return (
    <div>
      <MFA onUnenrollComplete={onUnenrollComplete} />
    </div>
  );
}
