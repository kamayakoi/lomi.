/**
 * Formats a currency amount according to the specified currency.
 * 
 * @param amount The amount to format
 * @param currency The currency code (defaults to XOF)
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
  }
): string {
  const {
    maximumFractionDigits = 2,
    minimumFractionDigits = 0,
    style = 'currency',
    notation = 'standard'
  } = options || {};

  // For XOF (CFA Franc), which doesn't have a standard symbol in many browsers
  if (currency === 'XOF') {
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      maximumFractionDigits,
      minimumFractionDigits,
      notation
    }).format(amount);
    
    return `${formatted} FCFA`;
  }

  // For other currencies, use the standard formatter
  try {
    return new Intl.NumberFormat('en-US', {
      style,
      currency,
      maximumFractionDigits,
      minimumFractionDigits,
      notation
    }).format(amount);
  } catch (error) {
    // Fallback for invalid currency codes
    console.warn(`Invalid currency code: ${currency}. Using default format.`);
    return `${currency} ${amount.toLocaleString('en-US', {
      maximumFractionDigits,
      minimumFractionDigits
    })}`;
  }
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
  }
): string {
  const {
    maximumFractionDigits = 2,
    minimumFractionDigits = 0,
    notation = 'standard'
  } = options || {};

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
    minimumFractionDigits,
    notation
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
  }
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const { format = 'medium', includeTime = false } = options || {};
  
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    dateStyle: format,
    ...(includeTime ? { timeStyle: 'short' } : {})
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
    includeSymbol?: boolean;
  }
): string {
  const { 
    maximumFractionDigits = 2,
    includeSymbol = true
  } = options || {};
  
  const formatted = new Intl.NumberFormat('en-US', {
    style: includeSymbol ? 'percent' : 'decimal',
    maximumFractionDigits
  }).format(includeSymbol ? value / 100 : value);
  
  return formatted;
} 