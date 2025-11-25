/* @proprietary license */

// Formatting utilities for currency and numbers

export type Currency = 'USD' | 'XOF' | 'EUR';

/**
 * Formats a currency amount according to the specified currency.
 * Accepts both database currency codes (XOF, USD, EUR) and display formats (F CFA).
 *
 * @param amount The amount to format
 * @param currency The currency code or display format (defaults to XOF). "F CFA" is automatically converted to XOF.
 * @param options Additional formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency = 'XOF',
  options?: {
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
    style?: 'currency' | 'decimal';
    notation?: 'standard' | 'compact';
  },
): string {
  // Convert display currency to database currency
  const normalizedCurrency = currency === 'F CFA' ? 'XOF' : currency;

  const defaultMaxDigits = normalizedCurrency === 'XOF' ? 1 : 2; // Default max 1 for XOF, 2 otherwise
  const defaultMinDigits = 0; // Default min 0 for all

  const {
    maximumFractionDigits = defaultMaxDigits,
    minimumFractionDigits = defaultMinDigits,
    style = 'currency',
    notation = 'standard',
  } = options || {};

  // Determine locale based on currency for desired separators
  // 'fr-FR' uses space for thousands, comma for decimal
  // 'en-US' uses comma for thousands, dot for decimal
  const locale =
    normalizedCurrency === 'XOF' ||
    normalizedCurrency === 'USD' ||
    normalizedCurrency === 'EUR'
      ? 'fr-FR'
      : 'en-US';

  // Format the number part using the chosen locale
  try {
    // Ensure minimumFractionDigits is not negative
    const effectiveMinDigits = Math.max(0, minimumFractionDigits);
    // Ensure max digits is at least min digits
    const effectiveMaxDigits = Math.max(
      effectiveMinDigits,
      maximumFractionDigits,
    );

    const numberFormatter = new Intl.NumberFormat(locale, {
      style: 'decimal', // Get number only first
      maximumFractionDigits: effectiveMaxDigits,
      minimumFractionDigits: effectiveMinDigits,
      notation,
    });
    let formattedNumber = numberFormatter.format(amount);

    // Manually replace decimal separator if locale used comma (fr-FR)
    if (locale === 'fr-FR') {
      formattedNumber = formattedNumber.replace(',', '.');
    }

    // Ensure proper space handling for PDF compatibility
    // Replace any potential non-breaking spaces or other space characters with regular spaces
    formattedNumber = formattedNumber.replace(/\s/g, ' ');

    if (style === 'currency') {
      // Append symbol/code
      if (normalizedCurrency === 'XOF') {
        // For XOF, ensure we use proper space separators for thousands
        // Use a more explicit formatting to avoid PDF encoding issues
        const xofFormatted = new Intl.NumberFormat('fr-FR', {
          style: 'decimal',
          maximumFractionDigits: effectiveMaxDigits,
          minimumFractionDigits: effectiveMinDigits,
          notation,
        })
          .format(amount)
          .replace(/\s/g, ' '); // Ensure regular spaces
        return `${xofFormatted} F CFA`;
      } else if (normalizedCurrency === 'USD') {
        return `${formattedNumber} $`;
      } else if (normalizedCurrency === 'EUR') {
        return `${formattedNumber} €`;
      } else {
        // Fallback for other currencies: standard Intl format (might have wrong separators)
        return new Intl.NumberFormat('en-US', {
          style,
          currency: normalizedCurrency,
          maximumFractionDigits: effectiveMaxDigits,
          minimumFractionDigits: effectiveMinDigits,
          notation,
        }).format(amount);
      }
    } else {
      return formattedNumber; // Return only number if style is 'decimal'
    }
  } catch {
    // Fallback for invalid currency codes
    console.warn(
      `Invalid currency code: ${normalizedCurrency}. Using default format.`,
    );
    const fallbackFormatted = amount.toLocaleString('en-US', {
      maximumFractionDigits: options?.maximumFractionDigits ?? defaultMaxDigits, // Use provided or default options
      minimumFractionDigits: options?.minimumFractionDigits ?? defaultMinDigits,
    });
    // Adjust fallback to match desired format (number symbol/code) if possible
    if (style === 'currency') {
      if (normalizedCurrency === 'USD')
        return `${fallbackFormatted.replace(/\s/g, ' ')} $`;
      if (normalizedCurrency === 'EUR')
        return `${fallbackFormatted.replace(/\s/g, ' ')} €`;
      // For XOF or other unknowns, append the code
      if (normalizedCurrency === 'XOF') {
        // Ensure proper space formatting for XOF in fallback
        const xofFallback = fallbackFormatted.replace(/\s/g, ' ');
        return `${xofFallback} F CFA`;
      }
      return `${fallbackFormatted.replace(/\s/g, ' ')} ${normalizedCurrency}`;
    }
    return fallbackFormatted;
  }
}

/**
 * Formats currency for display (alias for formatCurrency)
 * XOF is now automatically displayed as F CFA
 */
export function formatCurrencyDisplay(
  amount: number,
  currency = 'XOF',
  options?: {
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
    style?: 'currency' | 'decimal';
    notation?: 'standard' | 'compact';
  },
): string {
  // formatCurrency now handles F CFA display automatically
  return formatCurrency(amount, currency, options);
}

/**
 * Formats currency for checkout display, replacing XOF with F CFA
 * This maintains all the existing formatting while using F CFA for XOF
 */
export function formatCheckoutCurrency(
  amount: number,
  currency = 'XOF',
  options?: {
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
    style?: 'currency' | 'decimal';
    notation?: 'standard' | 'compact';
  },
): string {
  return formatCurrencyDisplay(amount, currency, options);
}

/**
 * Gets the display currency code (XOF → F CFA)
 */
export function getDisplayCurrencyCode(currencyCode: string): string {
  if (!currencyCode) return currencyCode;
  return currencyCode === 'XOF' ? 'F CFA' : currencyCode;
}

/**
 * Parses a potentially formatted number string into a number.
 * Handles common separators and removes non-numeric characters (except decimal point).
 *
 * @param formattedValue The formatted string to parse.
 * @returns The parsed number, or null if parsing fails.
 */
export function parseFormattedNumber(formattedValue: string): number | null {
  // Remove thousands separators (commas or spaces) and other non-essential chars.
  // Keep digits, decimal point '.', and minus sign '-'.
  const cleaned = formattedValue
    .replace(/,/g, '') // Remove commas (common thousands separator)
    .replace(/\s/g, '') // Remove spaces (another potential separator, e.g., XOF)
    .replace(/[^\d.-]/g, ''); // Remove anything not a digit, dot, or minus sign

  // Basic validation: check for empty string, just '-', just '.', or multiple dots
  if (
    cleaned === '' ||
    cleaned === '-' ||
    cleaned === '.' ||
    cleaned.split('.').length > 2
  ) {
    return null;
  }

  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? null : num;
}

/**
 * Formats a decimal number with specified precision
 */
export function formatNumber(
  value: number,
  options?: {
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
    notation?: 'standard' | 'compact';
  },
): string {
  const {
    maximumFractionDigits = 2,
    minimumFractionDigits = 0,
    notation = 'standard',
  } = options || {};

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
    minimumFractionDigits,
    notation,
  }).format(value);
}

/**
 * Formats a date according to the specified format
 */
export function formatDate(
  date: Date | string | number,
  options?: {
    format?: 'short' | 'medium' | 'long' | 'full';
    includeTime?: boolean;
  },
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  const { format = 'medium', includeTime = false } = options || {};

  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    dateStyle: format,
    ...(includeTime ? { timeStyle: 'short' } : {}),
  };

  return new Intl.DateTimeFormat('en-US', dateFormatOptions).format(dateObj);
}

/**
 * Formats a percentage value
 */
export function formatPercentage(
  value: number,
  options?: {
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
    includeSymbol?: boolean;
  },
): string {
  const {
    maximumFractionDigits = 1,
    minimumFractionDigits = 1,
    includeSymbol = true,
  } = options || {};

  const valueForFormatter = includeSymbol ? value / 100 : value;

  const formatted = new Intl.NumberFormat('en-US', {
    style: includeSymbol ? 'percent' : 'decimal',
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(valueForFormatter);

  return formatted;
}
