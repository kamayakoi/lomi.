import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";
import { currency_code, ConversionRate } from './types';
import { convertCurrencyWithPrecision, formatCurrentRates, formatCurrency } from '../../../../utils/fees/currency-converter';

interface CurrencyConverterProps {
    conversionRates?: ConversionRate[];
}

const CurrencyConverter = ({ conversionRates }: CurrencyConverterProps) => {
    const [conversionAmount, setConversionAmount] = useState("");
    const [fromCurrency, setFromCurrency] = useState<currency_code>('XOF');
    const [toCurrency, setToCurrency] = useState<currency_code>('USD');
    const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
    const { toast } = useToast();

    const handleCurrencyConversion = useCallback(() => {
        if (!conversionAmount || !fromCurrency || !toCurrency || fromCurrency === toCurrency) {
            setConvertedAmount(null);
            return;
        }

        try {
            const amount = parseFloat(conversionAmount);
            if (isNaN(amount) || amount <= 0) {
                setConvertedAmount(null);
                return;
            }

            const converted = convertCurrencyWithPrecision(amount, fromCurrency, toCurrency, conversionRates);
            setConvertedAmount(converted);
        } catch (error) {
            console.error('Error converting currency:', error);
            toast({
                title: "Conversion Error",
                description: "Failed to convert currency. Please try again.",
                variant: "destructive",
            });
            setConvertedAmount(null);
        }
    }, [conversionAmount, fromCurrency, toCurrency, conversionRates, toast]);

    // Effect to handle conversion when inputs change
    useEffect(() => {
        if (conversionAmount) {
            handleCurrencyConversion();
        }
    }, [conversionAmount, handleCurrencyConversion]);

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setConvertedAmount(null);
        if (conversionAmount) {
            const amount = parseFloat(conversionAmount);
            if (!isNaN(amount) && amount > 0) {
                const converted = convertCurrencyWithPrecision(amount, toCurrency, fromCurrency, conversionRates);
                setConvertedAmount(converted);
            }
        }
    };

    return (
        <Card className="rounded-none mb-6">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Currency Converter</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="space-y-2">
                        <Label htmlFor="conversion-amount">Amount</Label>
                        <Input
                            id="conversion-amount"
                            type="text"
                            value={conversionAmount}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*\.?\d*$/.test(value)) {
                                    setConversionAmount(value);
                                }
                            }}
                            className="rounded-none"
                            placeholder="Enter amount"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="from-currency">From</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={swapCurrencies}
                                className="h-6 w-6 p-0"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Label htmlFor="to-currency">To</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={fromCurrency} onValueChange={(value) => setFromCurrency(value as currency_code)}>
                                <SelectTrigger className="rounded-none flex-1">
                                    <SelectValue placeholder="From" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="XOF">XOF</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={toCurrency} onValueChange={(value) => setToCurrency(value as currency_code)}>
                                <SelectTrigger className="rounded-none flex-1">
                                    <SelectValue placeholder="To" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="XOF">XOF</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Result</Label>
                        <div className="h-10 border px-3 py-2 flex items-center rounded-none bg-muted/50">
                            {convertedAmount !== null ? (
                                <span>
                                    {formatCurrency(convertedAmount, toCurrency)}
                                </span>
                            ) : (
                                <span className="text-muted-foreground">
                                    Enter an amount to see conversion
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                    <p>{formatCurrentRates(conversionRates)}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default CurrencyConverter; 