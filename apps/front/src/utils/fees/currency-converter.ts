import { currency_code, ConversionRate } from '../../pages/portal/balance/components/types';

// Default conversion rates
const DEFAULT_CONVERSION_RATES: ConversionRate[] = [
  {
    from_currency: 'XOF',
    to_currency: 'USD',
    rate: 0.00165,
    inverse_rate: 605,
    created_at: new Date().toISOString()
  },
  {
    from_currency: 'USD',
    to_currency: 'XOF',
    rate: 605,
    inverse_rate: 0.00165,
    created_at: new Date().toISOString()
  }
];

// Get stored conversion rates or use defaults
export function getConversionRates(): ConversionRate[] {
  try {
    const storedRates = localStorage.getItem('conversionRates');
    return storedRates ? JSON.parse(storedRates) : DEFAULT_CONVERSION_RATES;
  } catch (error) {
    console.error('Error retrieving conversion rates:', error);
    return DEFAULT_CONVERSION_RATES;
  }
}

// Helper function to find a rate in the rates array
export function findConversionRate(rates: ConversionRate[], fromCurrency: currency_code, toCurrency: currency_code): number | null {
  const rate = rates.find(r => 
    r.from_currency === fromCurrency && r.to_currency === toCurrency
  );
  
  if (rate) {
    return rate.rate;
  }
  
  // Try to find inverse rate
  const inverseRate = rates.find(r => 
    r.from_currency === toCurrency && r.to_currency === fromCurrency
  );
  
  if (inverseRate) {
    return inverseRate.inverse_rate;
  }
  
  return null;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: currency_code): string {
  return `${currency} ${amount.toLocaleString(undefined, { 
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0
  })}`;
}

/**
 * Converts an amount from one currency to another using provided conversion rates
 * with proper precision handling
 */
export function convertCurrencyWithPrecision(
  amount: number,
  fromCurrency: currency_code,
  toCurrency: currency_code,
  conversionRates?: ConversionRate[]
): number {
  if (fromCurrency === toCurrency) return amount;

  // First try to use the provided conversion rates
  if (conversionRates && conversionRates.length > 0) {
    const directRate = conversionRates.find(rate => 
      rate.from_currency === fromCurrency && rate.to_currency === toCurrency
    );
    
    if (directRate) {
      return parseFloat((amount * directRate.rate).toFixed(toCurrency === 'USD' ? 2 : 0));
    }
    
    const inverseRate = conversionRates.find(rate => 
      rate.from_currency === toCurrency && rate.to_currency === fromCurrency
    );
    
    if (inverseRate && inverseRate.inverse_rate) {
      return parseFloat((amount * inverseRate.inverse_rate).toFixed(toCurrency === 'USD' ? 2 : 0));
    }
  }

  // Fallback to local storage rates
  const rates = getConversionRates();
  const rate = findConversionRate(rates, fromCurrency, toCurrency);

  if (rate !== null) {
    return parseFloat((amount * rate).toFixed(toCurrency === 'USD' ? 2 : 0));
  }

  // Hardcoded fallback if all else fails
  if (fromCurrency === 'XOF' && toCurrency === 'USD') {
    return parseFloat((amount * 0.00165).toFixed(2));
  } else if (fromCurrency === 'USD' && toCurrency === 'XOF') {
    return parseFloat((amount * 605).toFixed(0));
  }

  return amount;
}

/**
 * Formats the current conversion rates for display
 */
export function formatCurrentRates(conversionRates?: ConversionRate[]): string {
  if (!conversionRates || conversionRates.length === 0) return 'Loading rates...';

  // Find the rates for USD to XOF and XOF to USD
  const usdToXofRate = conversionRates.find(rate =>
    rate.from_currency === 'USD' && rate.to_currency === 'XOF'
  );

  const xofToUsdRate = conversionRates.find(rate =>
    rate.from_currency === 'XOF' && rate.to_currency === 'USD'
  );

  return `Current rates: 1 USD = ${usdToXofRate?.rate.toFixed(0) || 605} XOF | 1 XOF = ${parseFloat((xofToUsdRate?.rate || 0.00165).toFixed(5))} USD`;
}

/**
 * Formats a balance with conversion to another currency
 */
export function formatBalanceWithConversion(
  amount: number, 
  currency: currency_code, 
  targetCurrency: currency_code,
  conversionRates?: ConversionRate[],
  formatCurrencyFn?: (amount: number, currency: currency_code) => string
): string {
  if (currency === targetCurrency) {
    return formatCurrencyFn ? formatCurrencyFn(amount, currency) : `${currency} ${amount.toLocaleString()}`;
  }

  try {
    const convertedAmount = convertCurrencyWithPrecision(amount, currency, targetCurrency, conversionRates);
    return `${formatCurrencyFn ? formatCurrencyFn(amount, currency) : `${currency} ${amount.toLocaleString()}`} (≈ ${formatCurrencyFn ? formatCurrencyFn(convertedAmount, targetCurrency) : `${targetCurrency} ${convertedAmount.toLocaleString()}`})`;
  } catch (error) {
    console.error('Error converting currency:', error);
    return formatCurrencyFn ? formatCurrencyFn(amount, currency) : `${currency} ${amount.toLocaleString()}`;
  }
} 