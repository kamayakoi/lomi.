import { currency_code, conversion_type, ConversionRate } from './types';
import { supabase } from '@/utils/supabase/client';

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

// Cache for conversion rates with expiration
let ratesCache: {
  rates: ConversionRate[];
  timestamp: number;
} | null = null;

// Cache expiration time in milliseconds (1 hour)
const CACHE_EXPIRATION = 60 * 60 * 1000;

// Fetch latest conversion rates from database
export async function fetchLatestRates(): Promise<ConversionRate[]> {
  try {
    const { data, error } = await supabase.rpc('fetch_latest_conversion_rates');

    if (error) {
      console.error('Error fetching conversion rates:', error);
      return getConversionRates(); // Fallback to local storage or defaults
    }

    if (data && data.length > 0) {
      // Update cache
      ratesCache = {
        rates: data as ConversionRate[],
        timestamp: Date.now()
      };
      
      // Also update localStorage for offline access
      saveConversionRates(data as ConversionRate[]);
      
      return data as ConversionRate[];
    }

    return getConversionRates(); // Fallback to local storage or defaults
  } catch (error) {
    console.error('Error in fetchLatestRates:', error);
    return getConversionRates(); // Fallback to local storage or defaults
  }
}

// Get stored conversion rates or use defaults
export function getConversionRates(): ConversionRate[] {
  // Check if we have valid cached rates
  if (ratesCache && (Date.now() - ratesCache.timestamp) < CACHE_EXPIRATION) {
    return ratesCache.rates;
  }
  
  try {
    const storedRates = localStorage.getItem('conversionRates');
    return storedRates ? JSON.parse(storedRates) : DEFAULT_CONVERSION_RATES;
  } catch (error) {
    console.error('Error retrieving conversion rates:', error);
    return DEFAULT_CONVERSION_RATES;
  }
}

// Save conversion rates to localStorage
export function saveConversionRates(rates: ConversionRate[]): void {
  try {
    localStorage.setItem('conversionRates', JSON.stringify(rates));
  } catch (error) {
    console.error('Error saving conversion rates:', error);
  }
}

// Save conversion rates to database
export async function saveConversionRatesToDB(fromCurrency: currency_code, toCurrency: currency_code, rate: number): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('save_conversion_rates', {
      p_from_currency: fromCurrency,
      p_to_currency: toCurrency,
      p_rate: rate
    });

    if (error) {
      console.error('Error saving conversion rates to DB:', error);
      return false;
    }

    return data && data[0] && data[0].success;
  } catch (error) {
    console.error('Error in saveConversionRatesToDB:', error);
    return false;
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

// Convert amount between currencies
export async function convertCurrency(
  amount: number,
  fromCurrency: currency_code,
  toCurrency: currency_code,
  merchantId?: string,
  organizationId?: string,
  conversionType: conversion_type = 'manual',
  referenceId?: string
): Promise<number> {
  if (fromCurrency === toCurrency) return amount;

  try {
    const { data, error } = await supabase.rpc('convert_currency', {
      p_amount: amount,
      p_from_currency: fromCurrency,
      p_to_currency: toCurrency,
      p_merchant_id: merchantId,
      p_organization_id: organizationId,
      p_conversion_type: conversionType,
      p_reference_id: referenceId
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in convertCurrency:', error);
    // Fallback to local conversion
    const rates = getConversionRates();
    const rate = findConversionRate(rates, fromCurrency, toCurrency);
    
    if (rate !== null) {
      return amount * rate;
    }
    
    // Hardcoded fallback if all else fails
    if (fromCurrency === 'XOF' && toCurrency === 'USD') {
      return amount * 0.00165;
    } else if (fromCurrency === 'USD' && toCurrency === 'XOF') {
      return amount * 605;
    }
    
    return amount;
  }
}

// Format currency for display
export function formatCurrency(amount: number, currency: currency_code): string {
  return `${currency} ${amount.toLocaleString(undefined, { 
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0
  })}`;
}

// Get dual currency display (show both currencies)
export async function getDualCurrencyDisplay(
  amount: number,
  primaryCurrency: currency_code,
  secondaryCurrency: currency_code,
  merchantId?: string,
  organizationId?: string
): Promise<string> {
  const primaryFormatted = formatCurrency(amount, primaryCurrency);
  
  if (primaryCurrency === secondaryCurrency) {
    return primaryFormatted;
  }
  
  const convertedAmount = await convertCurrency(
    amount,
    primaryCurrency,
    secondaryCurrency,
    merchantId,
    organizationId
  );
  const secondaryFormatted = formatCurrency(convertedAmount, secondaryCurrency);
  
  return `${primaryFormatted} (${secondaryFormatted})`;
}

// Initialize rates - call this when the app starts
export async function initializeRates(): Promise<void> {
  try {
    const rates = await fetchLatestRates();
    ratesCache = {
      rates,
      timestamp: Date.now()
    };
    saveConversionRates(rates);
  } catch (error) {
    console.error('Error initializing rates:', error);
  }
} 