import { MFAList } from "./mfa-list";

interface UnenrollMFAProps {
  onUnenrollComplete?: () => void;
}

export function UnenrollMFA({ onUnenrollComplete }: UnenrollMFAProps) {
  return (
    <div>
      <MFAList onUnenrollComplete={onUnenrollComplete} />
    </div>
  );
}
