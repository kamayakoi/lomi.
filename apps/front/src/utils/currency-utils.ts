import { currency_code, ConversionRate } from '@/pages/portal/balance/components/types';
import nowPaymentsClient from './nowpayments/client';
import type { NOWPaymentsCurrency } from './nowpayments/types';

// ============================================================================
// TYPES
// ============================================================================

// Extended NOWPaymentsCurrency type with optional native amount
export type ExtendedCurrency = NOWPaymentsCurrency & { 
  minimum_amount_native?: number 
};

// Cache for crypto estimates (valid for short time)
interface CryptoEstimateCache {
  [key: string]: {
    estimate: number;
    timestamp: number;
    minAmount: number;
    maxAmount: number;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Default conversion rates for fiat currencies
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

// 5 minute cache validity for crypto estimates
const CACHE_VALIDITY_MS = 5 * 60 * 1000;
const cryptoEstimateCache: CryptoEstimateCache = {};

// ============================================================================
// FIAT CURRENCY FUNCTIONS
// ============================================================================

/**
 * Get stored conversion rates or use defaults
 */
export function getConversionRates(): ConversionRate[] {
  try {
    const storedRates = localStorage.getItem('conversionRates');
    return storedRates ? JSON.parse(storedRates) : DEFAULT_CONVERSION_RATES;
  } catch (error) {
    console.error('Error retrieving conversion rates:', error);
    return DEFAULT_CONVERSION_RATES;
  }
}

/**
 * Find a conversion rate in the rates array
 */
export function findConversionRate(
  rates: ConversionRate[], 
  fromCurrency: currency_code, 
  toCurrency: currency_code
): number | null {
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

// ============================================================================
// CRYPTOCURRENCY FUNCTIONS
// ============================================================================

/**
 * Converts local currency (e.g., XOF) to cryptocurrency via USD
 * Most crypto markets are quoted in USD, so we do a two-step conversion:
 * 1. XOF -> USD
 * 2. USD -> Cryptocurrency
 */
export async function convertToCrypto(
  amount: number,
  fromCurrency: currency_code,
  toCryptoCurrency: string
): Promise<{
  cryptoAmount: number;
  usdAmount: number;
  minimumAmount: number;
  valid: boolean;
}> {
  try {
    // Step 1: Convert from local currency to USD
    let usdAmount = amount;
    if (fromCurrency !== 'USD') {
      const rates = getConversionRates();
      const rate = findConversionRate(rates, fromCurrency, 'USD');
      
      if (!rate) {
        throw new Error(`No conversion rate found for ${fromCurrency} to USD`);
      }
      
      usdAmount = convertCurrencyWithPrecision(amount, fromCurrency, 'USD', rates);
    }
    
    // Step 2: Convert USD to cryptocurrency using NOWPayments estimate API
    const cacheKey = `USD_${toCryptoCurrency}_${usdAmount}`;
    const cachedEstimate = cryptoEstimateCache[cacheKey];
    
    // Use cached value if available and still valid
    if (cachedEstimate && (Date.now() - cachedEstimate.timestamp < CACHE_VALIDITY_MS)) {
      return {
        cryptoAmount: cachedEstimate.estimate,
        usdAmount,
        minimumAmount: cachedEstimate.minAmount,
        valid: usdAmount >= cachedEstimate.minAmount && usdAmount <= cachedEstimate.maxAmount
      };
    }
    
    // Get fresh estimate from API
    const estimate = await nowPaymentsClient.getEstimate(usdAmount, 'USD', toCryptoCurrency);
    
    // Cache the result
    cryptoEstimateCache[cacheKey] = {
      estimate: estimate.estimated_amount,
      timestamp: Date.now(),
      minAmount: estimate.min_amount,
      maxAmount: estimate.max_amount
    };
    
    return {
      cryptoAmount: estimate.estimated_amount,
      usdAmount,
      minimumAmount: estimate.min_amount,
      valid: usdAmount >= estimate.min_amount && usdAmount <= estimate.max_amount
    };
  } catch (error) {
    console.error('Error converting to cryptocurrency:', error);
    throw error;
  }
}

/**
 * Formats a cryptocurrency amount for display
 */
export function formatCryptoAmount(amount: number, cryptoCurrency: string): string {
  // Different cryptocurrencies have different precision standards
  let precision = 8; // Default for most cryptocurrencies (e.g., BTC)
  
  // Specific precision for common cryptocurrencies
  if (['ETH', 'BNB'].includes(cryptoCurrency.toUpperCase())) {
    precision = 6;
  } else if (['USDT', 'USDC', 'DAI'].includes(cryptoCurrency.toUpperCase())) {
    precision = 2; // Stablecoins often use 2 decimal places
  }
  
  return `${amount.toFixed(precision)} ${cryptoCurrency.toUpperCase()}`;
}

/**
 * Gets a list of available cryptocurrencies with minimum amounts
 */
export async function getAvailableCryptocurrencies(
  baseCurrency: currency_code = 'USD'
): Promise<ExtendedCurrency[]> {
  try {
    // Get currencies from NOWPayments
    const currencies = await nowPaymentsClient.getAvailableCurrencies();
    
    // Filter enabled currencies
    const enabledCurrencies = currencies.filter(c => c.enabled);
    
    // If base currency is USD, return as is
    if (baseCurrency === 'USD') {
      return enabledCurrencies;
    }
    
    // For other base currencies, convert the minimum amounts
    const rates = getConversionRates();
    const rate = findConversionRate(rates, 'USD', baseCurrency);
    
    if (!rate) {
      // If conversion rate not found, just return the raw data
      return enabledCurrencies;
    }
    
    // Convert all minimum amounts to the native currency
    return enabledCurrencies.map(currency => {
      const minAmount = parseFloat(currency.minimum_amount);
      return {
        ...currency,
        minimum_amount_native: convertCurrencyWithPrecision(minAmount, 'USD', baseCurrency, rates)
      };
    });
  } catch (error) {
    console.error('Error fetching available cryptocurrencies:', error);
    throw error;
  }
}

/**
 * Get a suggested cryptocurrency and amount for a given amount in local currency
 * This is useful when we want to recommend a suitable cryptocurrency for payment
 */
export async function getSuggestedCrypto(
  amount: number,
  fromCurrency: currency_code
): Promise<{
  suggestedCrypto: string;
  suggestedAmount: number;
  usdAmount: number;
  valid: boolean;
}> {
  try {
    // Convert to USD first
    const usdAmount = fromCurrency === 'USD' 
      ? amount 
      : convertCurrencyWithPrecision(amount, fromCurrency, 'USD');
    
    // Get available cryptocurrencies
    const cryptoCurrencies = await getAvailableCryptocurrencies();
    
    // Find suitable cryptocurrency based on min amount
    const suitable = cryptoCurrencies.filter(c => 
      usdAmount >= parseFloat(c.minimum_amount)
    );
    
    // If none suitable, use BTC (most common) but mark as invalid
    if (suitable.length === 0) {
      // Find BTC in available currencies
      const btcCurrency = cryptoCurrencies.find(c => 
        c.code.toLowerCase() === 'btc'
      );
      
      // If BTC not found (highly unlikely), throw error
      if (!btcCurrency) {
        throw new Error('Bitcoin (BTC) not found in available cryptocurrencies');
      }
      
      // Get estimate even though below minimum
      const estimate = await nowPaymentsClient.getEstimate(usdAmount, 'USD', 'btc');
      
      return {
        suggestedCrypto: 'btc',
        suggestedAmount: estimate.estimated_amount,
        usdAmount,
        valid: false
      };
    }
    
    // Prefer stablecoins for smaller amounts, major coins for larger amounts
    // Initialize with first suitable cryptocurrency to ensure it's never undefined
    let selectedCrypto: ExtendedCurrency = suitable[0] as ExtendedCurrency;
    
    if (usdAmount <= 100) {
      // For smaller amounts, prefer stablecoins
      const stablecoin = suitable.find(c => 
        ['usdt', 'usdc', 'dai', 'busd'].includes(c.code.toLowerCase())
      );
      
      if (stablecoin) {
        selectedCrypto = stablecoin;
      }
    } else {
      // For larger amounts, prefer BTC, ETH
      const major = suitable.find(c => 
        ['btc', 'eth'].includes(c.code.toLowerCase())
      );
      
      if (major) {
        selectedCrypto = major;
      }
    }
    
    // Get crypto estimate
    const estimate = await convertToCrypto(amount, fromCurrency, selectedCrypto.code);
    
    return {
      suggestedCrypto: selectedCrypto.code,
      suggestedAmount: estimate.cryptoAmount,
      usdAmount: estimate.usdAmount,
      valid: estimate.valid
    };
  } catch (error) {
    console.error('Error getting suggested cryptocurrency:', error);
    throw error;
  }
}

// ============================================================================
// BALANCE PAGE FORMATTING UTILITIES 
// ============================================================================

import { payout_status } from '@/pages/portal/balance/components/types';

/**
 * Format an amount for display with proper thousand separators and decimals
 */
export function formatAmountForDisplay(amount: number): string {
    // Return simple "0" for zero values
    if (amount === 0) return "0";

    // Format with thousands separators as spaces and decimal as comma
    const integerPart = Math.floor(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    // Get decimal part if it exists and format with comma
    const decimalPart = (amount % 1).toFixed(2).substring(2);

    // Only show decimal part if it's not .00
    if (decimalPart === "00") {
        return integerPart;
    }

    return `${integerPart},${decimalPart}`;
}

/**
 * Format a payout status to a more readable format
 */
export function formatPayoutStatus(status: payout_status): string {
    switch (status) {
        case 'pending':
            return 'Pending'
        case 'processing':
            return 'Processing'
        case 'completed':
            return 'Completed'
        case 'failed':
            return 'Failed'
        default:
            return status
    }
}

/**
 * Format a date string to a more readable format
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * Shorten a payout ID for display
 */
export function shortenPayoutId(payoutId: string): string {
    return `${payoutId.slice(0, 6)}...${payoutId.slice(-4)}`
} 