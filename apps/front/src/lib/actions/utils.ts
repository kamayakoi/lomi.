import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Existing utility function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// New utility functions or constants
export const initialState = {
  theme: "system",
  setTheme: () => null,
};

export type Theme = "dark" | "light" | "system";

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export function formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/**
 * Formats a number into a compact representation with a maximum of 1 decimal place
 * Examples:
 * - 1234 -> 1.2K
 * - 1234567 -> 1.2M
 * - 1234567890 -> 1.2B
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCurrency(amount: number, currency = 'XOF'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatProvider(provider: string): string {
    const formattedNames: Record<string, string> = {
        ORANGE: 'Orange',
        WAVE: 'Wave',
        ECOBANK: 'Cards',
        MTN: 'MTN',
        NOWPAYMENTS: 'Crypto',
        PAYPAL: 'PayPal',
        APPLE: 'Apple Pay',
        GOOGLE: 'Google Pay',
        MOOV: 'Moov',
        AIRTEL: 'Airtel',
        MPESA: 'M-Pesa',
        WIZALL: 'Wizall',
        OPAY: 'OPay',
        OTHER: 'Other'
    }
    return formattedNames[provider] || 'Other'
} 