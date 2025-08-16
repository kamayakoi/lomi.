import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "XOF"): string {
  if (currency === "XOF") {
    return `${amount.toLocaleString("fr-FR")} CFA`;
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatPhoneNumber(phone: string): string {
  // Format phone numbers for West African countries
  const cleaned = phone.replace(/\D/g, "");
  
  // Common West African country codes
  const countryPrefixes: Record<string, string> = {
    "221": "+221", // Senegal
    "223": "+223", // Mali
    "224": "+224", // Guinea
    "225": "+225", // Côte d'Ivoire
    "226": "+226", // Burkina Faso
    "227": "+227", // Niger
    "228": "+228", // Togo
    "229": "+229", // Benin
  };
  
  // Check if it starts with a country code
  for (const [code, prefix] of Object.entries(countryPrefixes)) {
    if (cleaned.startsWith(code)) {
      return `${prefix} ${cleaned.slice(3)}`;
    }
  }
  
  // Default formatting
  return `+${cleaned}`;
}

export function generateDealId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function createWhatsAppShareUrl(dealId: string, message?: string): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const dealUrl = `${baseUrl}/deal/${dealId}`;
  
  const defaultMessage = `🛡️ Dako - Transaction sécurisée\n\nConsultez les détails de notre transaction ici: ${dealUrl}\n\n✅ Paiement sécurisé avec garantie`;
  
  const encodedMessage = encodeURIComponent(message || defaultMessage);
  return `https://wa.me/?text=${encodedMessage}`;
}

export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function getDeviceInfo() {
  if (typeof window === "undefined") {
    return { isMobile: false, isIOS: false, isAndroid: false };
  }
  
  const userAgent = navigator.userAgent;
  const isMobile = isMobileDevice();
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  
  return { isMobile, isIOS, isAndroid };
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    return new Promise((resolve) => {
      try {
        document.execCommand("copy");
        resolve(true);
      } catch {
        resolve(false);
      } finally {
        document.body.removeChild(textArea);
      }
    });
  }
}

export function validatePhoneNumber(phone: string): boolean {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");
  
  // West African phone numbers are typically 8-12 digits including country code
  if (cleaned.length < 8 || cleaned.length > 15) {
    return false;
  }
  
  // Common West African country codes
  const validCountryCodes = ["221", "223", "224", "225", "226", "227", "228", "229"];
  
  // Check if it starts with a valid country code
  return validCountryCodes.some(code => cleaned.startsWith(code));
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function getDealStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "pending":
      return "status-pending";
    case "funded":
      return "status-funded";
    case "completed":
      return "status-completed";
    case "disputed":
      return "status-disputed";
    default:
      return "status-pending";
  }
}

export function getDealStatusIcon(status: string): string {
  switch (status.toLowerCase()) {
    case "pending":
      return "⏳";
    case "funded":
      return "✅";
    case "completed":
      return "🎉";
    case "disputed":
      return "⚠️";
    default:
      return "⏳";
  }
}
