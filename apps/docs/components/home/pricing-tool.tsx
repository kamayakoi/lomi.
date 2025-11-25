/* @proprietary license */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';
import { playClickSound } from '@/lib/utils/sound';
import {
  formatCurrency,
  parseFormattedNumber,
  type Currency,
} from '@/lib/utils/format';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

export default function PricingTool() {
  const { currentLanguage } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // Calculator state
  const [currency, setCurrency] = useState<Currency>('XOF');
  const [averageAmount, setAverageAmount] = useState<number | string>(18000);
  const [transactionCount, setTransactionCount] = useState<number | string>(30);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  const getCurrencyLimits = (curr: Currency) => {
    const minAmount = 0;
    let maxAmount = 1800000; // Default XOF, capped at 1.8M

    if (curr === 'USD') {
      maxAmount = 3000;
    } else if (curr === 'EUR') {
      maxAmount = 2750; // Max €3000 for EUR
    }

    return { minAmount, maxAmount };
  };

  const calculateMonthlyCosts = () => {
    const percentageRate = 0.02;
    let fixedFee = 200; // Default XOF

    if (currency === 'USD') {
      fixedFee = 0.3;
    } else if (currency === 'EUR') {
      fixedFee = 0.25; // EUR fixed fee
    }

    // Safely parse state, defaulting "" to 0
    const numAverageAmount =
      typeof averageAmount === 'number'
        ? averageAmount
        : (parseFormattedNumber(averageAmount) ?? 0);

    const numTransactionCount =
      typeof transactionCount === 'number' ? transactionCount : 0;

    const validAverageAmount = Math.max(0, numAverageAmount);

    // Ensure transaction count is at least 1 for calculation if originally > 0 or "", but 0 if explicitly 0
    const validTransactionCount =
      typeof transactionCount === 'number' && transactionCount === 0
        ? 0
        : Math.max(1, numTransactionCount);

    const totalVariableFee =
      validAverageAmount * percentageRate * validTransactionCount;
    const totalFixedFee = fixedFee * validTransactionCount;

    const monthlyFees = totalVariableFee + totalFixedFee;

    const totalProcessed = validAverageAmount * validTransactionCount;

    const monthlyAmountReceived = Math.max(0, totalProcessed - monthlyFees);

    return { monthlyFees, monthlyAmountReceived };
  };

  const { monthlyFees, monthlyAmountReceived } = calculateMonthlyCosts();

  // Custom ToggleGroup component to ensure no gap
  const CurrencyToggle = () => (
    <div className="flex w-fit rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800">
      {(
        [
          { code: 'XOF', display: 'F CFA' },
          { code: 'USD', display: 'USD' },
          { code: 'EUR', display: 'EUR' },
        ] as const
      ).map(({ code: curr, display }, index, arr) => (
        <button
          key={curr}
          type="button"
          onClick={() => {
            playClickSound();
            const newLimits = getCurrencyLimits(curr);
            const oldCurrency = currency; // Store old currency
            const oldAmount = averageAmount; // Store old amount
            setCurrency(curr); // Set the new currency first

            // Currency Conversion Logic
            if (typeof oldAmount === 'number') {
              let currentNumericAmount: number = oldAmount;
              const xofToUsdRate = 1 / 600;
              const xofToEurRate = 1 / 650;
              const usdToXofRate = 600;
              const eurToXofRate = 650;
              const usdToEurRate = 0.92; // Approx 1 USD = 0.92 EUR
              const eurToUsdRate = 1 / usdToEurRate; // Approx 1 EUR = 1.08 USD

              if (oldCurrency === 'XOF' && curr === 'USD') {
                currentNumericAmount =
                  Math.round(currentNumericAmount * xofToUsdRate * 100) / 100;
              } else if (oldCurrency === 'XOF' && curr === 'EUR') {
                currentNumericAmount =
                  Math.round(currentNumericAmount * xofToEurRate * 100) / 100;
              } else if (oldCurrency === 'USD' && curr === 'XOF') {
                currentNumericAmount = Math.round(
                  currentNumericAmount * usdToXofRate,
                );
              } else if (oldCurrency === 'EUR' && curr === 'XOF') {
                currentNumericAmount = Math.round(
                  currentNumericAmount * eurToXofRate,
                );
              } else if (oldCurrency === 'USD' && curr === 'EUR') {
                currentNumericAmount =
                  Math.round(currentNumericAmount * usdToEurRate * 100) / 100;
              } else if (oldCurrency === 'EUR' && curr === 'USD') {
                currentNumericAmount =
                  Math.round(currentNumericAmount * eurToUsdRate * 100) / 100;
              }

              // Clamp to new currency limits
              currentNumericAmount = Math.max(
                newLimits.minAmount,
                Math.min(currentNumericAmount, newLimits.maxAmount),
              );

              setAverageAmount(currentNumericAmount);
            } else if (oldAmount === '') {
              // Keep empty string if it was empty
              setAverageAmount('');
            } else {
              // If it wasn't a number or empty (shouldn't happen often, but just in case)
              // Clamp the original value if it exceeds the new limit
              if (
                typeof oldAmount === 'number' &&
                oldAmount > newLimits.maxAmount
              ) {
                setAverageAmount(newLimits.maxAmount);
              } else {
                // Otherwise, keep the original value (might be 0 or potentially invalid string input temporarily)
                setAverageAmount(oldAmount);
              }
            }

            // Clamp transaction count just in case (though limits are currently the same)
            const minTx = 1; // Note: Input allows 0, but slider/calc uses min 1
            const maxTx = 2500; // Updated Max Tx
            if (typeof transactionCount === 'number') {
              if (transactionCount > maxTx) setTransactionCount(maxTx);
              // Allow 0, but if less than 1 (and not 0), set to 1 for slider/calc, state can hold lower if typed
              else if (transactionCount < minTx && transactionCount !== 0) {
                // If calculation/slider needs minimum 1, handle it there. Let state hold typed value if needed.
                // setTransactionCount(minTx); // Optional: Force state to min 1 if < 1 and not 0
              }
            } else if (transactionCount === '') {
              // Keep empty
              setTransactionCount('');
            }
          }}
          className={
            `px-4 sm:px-6 py-2 transition-colors ${
              currency === curr
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                : 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            } ${index < arr.length - 1 ? 'border-r border-zinc-200 dark:border-zinc-800' : ''}` // Add right border except for last
          }
        >
          {display}
        </button>
      ))}
    </div>
  );

  // Handler for Average Amount Input
  const handleAverageAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    // Allow empty input
    if (value === '') {
      setAverageAmount('');
      return;
    }

    // Allow only digits, at most one dot, and handle currency-specific formats
    let cleanedValue = value.replace(/\s/g, ''); // Remove spaces

    if (currency !== 'XOF') {
      cleanedValue = cleanedValue.replace(/,/g, ''); // Allow comma removal for USD/EUR if needed
    }

    // Regex to allow digits, at most one dot, and max two decimal places.
    const isValidFormat = /^[0-9]*(\.[0-9]{0,1})?$/.test(cleanedValue);

    if (isValidFormat) {
      // Try parsing to check against limits, but set the raw valid string in state
      const parsedNum = parseFormattedNumber(cleanedValue);

      if (parsedNum !== null) {
        const { minAmount, maxAmount } = getCurrencyLimits(currency);

        // Check if the parsed number exceeds limits, prevent setting if it does
        // (We don't clamp the raw string, just prevent invalid state)
        if (parsedNum <= maxAmount && parsedNum >= minAmount) {
          setAverageAmount(cleanedValue); // Set the potentially intermediate raw string
        } else if (parsedNum > maxAmount) {
          // If typing would exceed max, set state to the max value formatted as string
          setAverageAmount(maxAmount.toString());
        }

        // If less than min (only 0 allowed), let it be set (handled by state)
        else if (parsedNum >= minAmount) {
          // Check again to be sure it's >= min
          setAverageAmount(cleanedValue);
        }
      } else if (cleanedValue === '.' || cleanedValue === '0.') {
        // Allow starting with decimal
        setAverageAmount(cleanedValue);
      } else if (/^[0-9]+\.?$/.test(cleanedValue)) {
        // Allow ending with decimal
        setAverageAmount(cleanedValue);
      }

      // Potentially handle other intermediate valid states if needed
    } // else: If format is invalid, do nothing, keeping the previous valid state
  };

  // Handler for Transaction Count Input
  const handleTransactionCountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    const minValue = 0;
    const maxValue = 2500; // Updated Max Value

    if (value === '') {
      setTransactionCount('');
      return;
    }

    // Allow only digits, parse after stripping formatting
    const cleanedValue = value.replace(/\D/g, ''); // Remove non-digits

    if (/^[0-9]*$/.test(cleanedValue)) {
      const num = parseInt(cleanedValue, 10);

      if (!Number.isNaN(num)) {
        // Clamp the value between minValue and maxValue
        const clampedNum = Math.max(minValue, Math.min(num, maxValue));

        setTransactionCount(clampedNum);
      } else {
        // Handle potential edge case where parseInt fails despite regex
        setTransactionCount(''); // Or fallback to a default/previous value
      }
    } else {
      // Ignore invalid non-digit characters, potentially reset or keep old state
      setTransactionCount('');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto pl-2 pr-4 py-2 pb-36">
        <div className="flex flex-col space-y-6 text-left mt-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: '-100px' }}
                className="mb-2"
              >
                <Card className="w-full max-w-7xl mx-auto bg-card border border-border/50 rounded-sm shadow-sm overflow-hidden -mt-8">
                  <TooltipProvider delayDuration={100}>
                    <CardContent className="p-3 sm:p-4 md:p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
                        <div className="space-y-4 sm:space-y-5 flex flex-col">
                          <div className="flex justify-center sm:justify-start">
                            <CurrencyToggle />
                          </div>

                          <div>
                            <Label
                              htmlFor="averageAmountInput"
                              className="text-base font-semibold mb-2 sm:mb-3 block text-zinc-700 dark:text-zinc-300"
                            >
                              {
                                t(
                                  'pricing.calculator.transaction_amount',
                                  currentLanguage,
                                ) as string
                              }
                            </Label>

                            <div className="flex items-center gap-3 mb-3 sm:mb-4">
                              <Input
                                id="averageAmountInput"
                                type="text"
                                inputMode="numeric"
                                // Format the displayed value, but allow raw intermediate input
                                value={(() => {
                                  const parsedNum = parseFormattedNumber(
                                    averageAmount.toString(),
                                  );
                                  // Show raw value if it's empty, ends with '.', or is just '-' (intermediate states)
                                  if (
                                    averageAmount === '' ||
                                    averageAmount.toString().endsWith('.') ||
                                    averageAmount === '-'
                                  ) {
                                    return averageAmount;
                                  }
                                  // Otherwise, format the parsed number if valid, default to raw state if parsing failed unexpectedly
                                  return parsedNum !== null
                                    ? formatCurrency(parsedNum, currency, {
                                        style: 'decimal',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits:
                                          currency === 'XOF' ? 0 : 1,
                                      })
                                    : averageAmount; // Fallback to raw state
                                })()}
                                onChange={handleAverageAmountChange}
                                className={`hide-number-spinners bg-transparent hover:bg-transparent border-0 focus:bg-transparent focus:ring-0 focus:outline-none focus:border-transparent p-0 caret-current ${currency === 'XOF' ? 'w-32' : 'w-24'} text-xl sm:text-2xl font-normal text-zinc-900 dark:text-white tracking-wide`}
                                min={0}
                              />
                            </div>

                            {/* Single Slider for Average Amount */}
                            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-sm overflow-hidden">
                              <Slider
                                id="averageAmountSlider"
                                min={0}
                                max={getCurrencyLimits(currency).maxAmount} // Dynamically set max
                                step={
                                  currency === 'XOF'
                                    ? 1000
                                    : currency === 'USD' || currency === 'EUR'
                                      ? 0.1
                                      : 10
                                } // Decimal step for USD/EUR
                                // Parse state for slider value, default to 0 if parsing fails (e.g., intermediate ".")
                                value={[
                                  parseFormattedNumber(
                                    averageAmount.toString(),
                                  ) ?? 0,
                                ]}
                                // Update state directly from slider (always a number)
                                onValueChange={(value) =>
                                  setAverageAmount(value[0] ?? 0)
                                }
                                className="w-full p-2 **:[[role=slider]]:rounded-sm **:[[role=slider]]:bg-zinc-600 **:[[role=slider]]:border-0" // Added p-3 and custom thumb styling
                              />
                            </div>
                          </div>

                          <div>
                            <Label
                              htmlFor="transactionCountInput"
                              className="text-base font-semibold mb-2 sm:mb-3 block text-zinc-700 dark:text-zinc-300"
                            >
                              {
                                t(
                                  'pricing.calculator.transaction_count',
                                  currentLanguage,
                                ) as string
                              }
                            </Label>

                            <div className="flex items-center mb-3 sm:mb-4">
                              <Input
                                id="transactionCountInput"
                                type="text"
                                inputMode="numeric"
                                // Format the displayed value, allow raw intermediate input (like empty string)
                                value={(() => {
                                  // Allow empty string directly
                                  if (transactionCount === '') {
                                    return '';
                                  }
                                  const parsedNum =
                                    typeof transactionCount === 'number'
                                      ? transactionCount
                                      : parseFormattedNumber(
                                          transactionCount.toString(),
                                        );
                                  // Format if parsedNum is a valid number (not null)
                                  return parsedNum !== null
                                    ? formatCurrency(parsedNum, currency, {
                                        // Use currency for locale consistency
                                        style: 'decimal',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                      })
                                    : transactionCount; // Fallback to raw state if parsing fails
                                })()}
                                onChange={handleTransactionCountChange}
                                className="hide-number-spinners bg-transparent hover:bg-transparent border-0 focus:bg-transparent focus:ring-0 focus:outline-none focus:border-transparent p-0 caret-current w-24 text-xl sm:text-2xl font-normal text-zinc-900 dark:text-white tracking-wide"
                                min={0}
                              />
                            </div>

                            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-sm overflow-hidden">
                              <Slider
                                id="transactionCountSlider"
                                min={0}
                                max={2500} // Updated Max Value
                                step={1}
                                value={[
                                  typeof transactionCount === 'number' &&
                                  transactionCount >= 0
                                    ? transactionCount
                                    : 0,
                                ]}
                                onValueChange={(value) =>
                                  setTransactionCount(
                                    Math.max(0, value[0] ?? 0),
                                  )
                                }
                                className="w-full p-2 **:[[role=slider]]:rounded-sm **:[[role=slider]]:bg-zinc-600 **:[[role=slider]]:border-0"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-5 sm:space-y-7 flex flex-col justify-center md:border-l border-zinc-200 dark:border-zinc-800 md:pl-5 lg:pl-7 h-full pt-3 md:pt-0 border-t md:border-t-0 mt-5 md:mt-0 text-right sm:text-left">
                          <div>
                            <div className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2 -mt-1.5">
                              {
                                t(
                                  'pricing.calculator.our_fee',
                                  currentLanguage,
                                ) as string
                              }
                              <span className="text-red-500">*</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3 w-3 sm:h-4 sm:w-4 text-zinc-400 dark:text-zinc-500 cursor-help ml-2" />
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  align="start"
                                  className="max-w-[200px] text-left text-[11px] leading-tight bg-white text-zinc-700 dark:bg-black/90 dark:text-gray-300 rounded-sm p-4 sm:p-3 shadow-sm border border-zinc-200 dark:border-zinc-700"
                                >
                                  {
                                    t(
                                      'pricing.calculator.fee_tooltip',
                                      currentLanguage,
                                    ) as string
                                  }
                                </TooltipContent>
                              </Tooltip>
                            </div>

                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal tracking-normal text-zinc-900 dark:text-white wrap-break-word leading-tight">
                              <span className="font-normal">
                                {formatCurrency(monthlyFees, currency, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits:
                                    currency === 'XOF' ? 0 : 2,
                                }).match(/[\d.,\s]+/)?.[0] || ''}
                              </span>
                              <span className="font-normal ml-2">
                                {formatCurrency(monthlyFees, currency, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits:
                                    currency === 'XOF' ? 0 : 2,
                                }).replace(/^[\d.,\s]+/, '')}
                              </span>
                            </p>
                          </div>

                          <div className="pb-7 sm:pb-0">
                            <p className="text-base sm:text-lg font-normal text-zinc-600 dark:text-zinc-400 mb-2 flex items-center gap-2 -translate-y-1">
                              {
                                t(
                                  'pricing.calculator.you_receive',
                                  currentLanguage,
                                ) as string
                              }
                            </p>

                            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-normal text-[#56A5F9] dark:text-sky-300 wrap-break-word leading-tight translate-y-0">
                              <span className="font-semibold">
                                {formatCurrency(
                                  monthlyAmountReceived,
                                  currency,
                                  {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits:
                                      currency === 'XOF' ? 0 : 2,
                                  },
                                ).match(/[\d.,\s]+/)?.[0] || ''}
                              </span>
                              <span className="font-normal ml-2">
                                {formatCurrency(
                                  monthlyAmountReceived,
                                  currency,
                                  {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits:
                                      currency === 'XOF' ? 0 : 2,
                                  },
                                ).replace(/^[\d.,\s]+/, '')}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="text-red-500 text-xs -mr-2">*</span>
                          <div className="space-y-0">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {
                                t(
                                  'pricing.calculator.disclaimer',
                                  currentLanguage,
                                ) as string
                              }
                              <a
                                href="https://docs.lomi.africa/docs/core/merchant-of-record/pricing"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={playClickSound}
                                aria-label="See how our fees apply (opens in new tab)"
                                className="text-xs text-sky-600 hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200 inline-flex items-center ml-1"
                              >
                                {
                                  t(
                                    'pricing.calculator.see_fees',
                                    currentLanguage,
                                  ) as string
                                }
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </TooltipProvider>
                </Card>
              </motion.section>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
}
