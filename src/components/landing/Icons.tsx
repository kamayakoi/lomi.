import icon from "/company/transparent_dark.webp";
import iconDark from "/company/transparent.webp";
import mtnLogo from '/payment_channels/mtn.webp';
import waveLogo from '/payment_channels/wave.webp';
import cardsLogo from '/payment_channels/mastercard.webp';
import ecobankLogo from '/payment_channels/ecobank_blue.webp';
import visaLogo from '/payment_channels/visa.webp';
import mastercardLogo from '/payment_channels/mastercard.webp';

import { useTheme } from '@/lib/hooks/use-theme';
import { useEffect, useState } from "react";

export const LogoIcon = () => {
  const { theme } = useTheme();
  const [currentIcon, setCurrentIcon] = useState(icon);

  useEffect(() => {
    setCurrentIcon(theme === 'dark' ? iconDark : icon);
  }, [theme]);

  return (
    <img
      src={currentIcon}
      alt="lomi.africa logo"
      className="lucide lucide-panels-top-left mr-2"
      width="38"
      height="38"
      style={{ borderRadius: '5px' }}
    />
  );
};

export const MtnLogo = () => {
  return (
    <img
      src={mtnLogo}
      alt="MTN logo"
      className="lucide lucide-panels-top-left mr-2"
      width="100"
      height="100"
      style={{ borderRadius: '50%' }}
    />
  );
};

export const WaveLogo = () => {
  return (
    <img
      src={waveLogo}
      alt="Wave logo"
      className="lucide lucide-panels-top-left mr-2"
      width="180"
      height="100"
      style={{ borderRadius: '50%' }}
    />
  );
};

export const ApplePayLogo = () => {
  return (
    <img
      src={cardsLogo}
      alt="Mastercard logo"
      className="lucide lucide-panels-top-left mr-2"
      width="100"
      height="100"
      style={{ borderRadius: '50%' }}
    />
  );
};

export const EcobankLogo = () => {
  return (
    <img
      src={ecobankLogo}
      alt="Ecobank logo"
      className="lucide lucide-panels-top-left mr-2"
      width="100"
      height="100"
      style={{ borderRadius: '50%' }}
    />
  );
};

export const VisaLogo = () => {
  return (
    <img
      src={visaLogo}
      alt="Visa logo"
      className="lucide lucide-panels-top-left mr-2"
      width="100"
      height="100"
      style={{ borderRadius: '50%' }}
    />
  );
};

export const MastercardLogo = () => {
  return (
    <img
      src={mastercardLogo}
      alt="Mastercard logo"
      className="lucide lucide-panels-top-left mr-2"
      width="100"
      height="100"
      style={{ borderRadius: '50%' }}
    />
  );
};


export function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

export function CreditCardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

export function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}