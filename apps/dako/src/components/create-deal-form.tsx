"use client";

import { useState } from "react";
import { X, Loader2, Smartphone } from "lucide-react";
import { cn, generateDealId, formatCurrency, validatePhoneNumber } from "@/lib/actions/utils";
import type { CreateDealForm as CreateDealFormType, CurrencyCode } from "@/lib/dat";

interface CreateDealFormProps {
    onClose: () => void;
    onSuccess: (dealId: string) => void;
}

export function CreateDealForm({ onClose, onSuccess }: CreateDealFormProps) {
    const [formData, setFormData] = useState<CreateDealFormType>({
        itemDescription: "",
        price: "",
        currency: "XOF",
        buyerPhone: "",
        sellerPhone: "",
    });

    const [errors, setErrors] = useState<Partial<CreateDealFormType>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
        { code: "XOF", label: "Franc CFA", symbol: "CFA" },
        { code: "USD", label: "Dollar US", symbol: "$" },
        { code: "EUR", label: "Euro", symbol: "€" },
    ];

    const validateForm = (): boolean => {
        const newErrors: Partial<CreateDealFormType> = {};

        if (!formData.itemDescription.trim()) {
            newErrors.itemDescription = "Description requise";
        }

        const price = parseFloat(formData.price);
        if (!formData.price || isNaN(price) || price <= 0) {
            newErrors.price = "Prix valide requis";
        }

        if (!validatePhoneNumber(formData.buyerPhone)) {
            newErrors.buyerPhone = "Numéro de téléphone invalide";
        }

        if (!validatePhoneNumber(formData.sellerPhone)) {
            newErrors.sellerPhone = "Numéro de téléphone invalide";
        }

        if (formData.buyerPhone === formData.sellerPhone) {
            newErrors.buyerPhone = "Les numéros doivent être différents";
            newErrors.sellerPhone = "Les numéros doivent être différents";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Simulate API call - replace with actual API integration
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate deal ID
            const dealId = generateDealId();

            // In real implementation, this would call your API to create the deal
            // const response = await createDeal({
            //   itemDescription: formData.itemDescription,
            //   price: parseFloat(formData.price),
            //   currency: formData.currency,
            //   buyerPhone: formData.buyerPhone,
            //   sellerPhone: formData.sellerPhone,
            // });

            onSuccess(dealId);
        } catch (error) {
            console.error("Error creating deal:", error);
            // Handle error
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePhoneChange = (field: "buyerPhone" | "sellerPhone", value: string) => {
        // Auto-format phone number
        const cleaned = value.replace(/\D/g, "");
        let formatted = cleaned;

        // Add country code if not present
        if (cleaned.length > 0 && !cleaned.startsWith("221")) {
            formatted = "221" + cleaned;
        }

        setFormData(prev => ({ ...prev, [field]: formatted }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handlePriceChange = (value: string) => {
        // Only allow numbers and decimal point
        const cleanedValue = value.replace(/[^\d.]/g, "");
        setFormData(prev => ({ ...prev, price: cleanedValue }));

        if (errors.price) {
            setErrors(prev => ({ ...prev, price: undefined }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-background w-full max-w-md rounded-t-lg sm:rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Nouvelle transaction</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-sm transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Item Description */}
                    <div>
                        <label htmlFor="itemDescription" className="block text-sm font-medium mb-2">
                            Description de l&apos;article
                        </label>
                        <textarea
                            id="itemDescription"
                            value={formData.itemDescription}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, itemDescription: e.target.value }));
                                if (errors.itemDescription) {
                                    setErrors(prev => ({ ...prev, itemDescription: undefined }));
                                }
                            }}
                            placeholder="Ex: iPhone 13 Pro, état neuf avec boîte"
                            className={cn(
                                "w-full p-3 border rounded-sm resize-none text-base",
                                "focus:ring-2 focus:ring-green-500 focus:border-transparent",
                                "prevent-zoom",
                                errors.itemDescription && "border-red-500"
                            )}
                            rows={3}
                            maxLength={200}
                        />
                        {errors.itemDescription && (
                            <p className="text-red-500 text-xs mt-1">{errors.itemDescription}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            {formData.itemDescription.length}/200 caractères
                        </p>
                    </div>

                    {/* Price and Currency */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium mb-2">
                                Prix
                            </label>
                            <input
                                id="price"
                                type="text"
                                inputMode="decimal"
                                value={formData.price}
                                onChange={(e) => handlePriceChange(e.target.value)}
                                placeholder="150000"
                                className={cn(
                                    "w-full p-3 border rounded-sm text-base",
                                    "focus:ring-2 focus:ring-green-500 focus:border-transparent",
                                    "prevent-zoom",
                                    errors.price && "border-red-500"
                                )}
                            />
                            {errors.price && (
                                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="currency" className="block text-sm font-medium mb-2">
                                Devise
                            </label>
                            <select
                                id="currency"
                                value={formData.currency}
                                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as CurrencyCode }))}
                                className="w-full p-3 border rounded-sm text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                {currencies.map((currency) => (
                                    <option key={currency.code} value={currency.code}>
                                        {currency.symbol}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Price Preview */}
                    {formData.price && !isNaN(parseFloat(formData.price)) && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-sm">
                            <p className="text-sm text-green-700 dark:text-green-300">
                                Prix: <strong>{formatCurrency(parseFloat(formData.price), formData.currency)}</strong>
                            </p>
                        </div>
                    )}

                    {/* Buyer Phone */}
                    <div>
                        <label htmlFor="buyerPhone" className="block text-sm font-medium mb-2">
                            <Smartphone className="inline h-4 w-4 mr-1" />
                            Numéro de l&apos;acheteur
                        </label>
                        <input
                            id="buyerPhone"
                            type="tel"
                            inputMode="tel"
                            value={formData.buyerPhone}
                            onChange={(e) => handlePhoneChange("buyerPhone", e.target.value)}
                            placeholder="221XXXXXXXXX"
                            className={cn(
                                "w-full p-3 border rounded-sm text-base",
                                "focus:ring-2 focus:ring-green-500 focus:border-transparent",
                                "prevent-zoom",
                                errors.buyerPhone && "border-red-500"
                            )}
                        />
                        {errors.buyerPhone && (
                            <p className="text-red-500 text-xs mt-1">{errors.buyerPhone}</p>
                        )}
                    </div>

                    {/* Seller Phone */}
                    <div>
                        <label htmlFor="sellerPhone" className="block text-sm font-medium mb-2">
                            <Smartphone className="inline h-4 w-4 mr-1" />
                            Votre numéro (vendeur)
                        </label>
                        <input
                            id="sellerPhone"
                            type="tel"
                            inputMode="tel"
                            value={formData.sellerPhone}
                            onChange={(e) => handlePhoneChange("sellerPhone", e.target.value)}
                            placeholder="221XXXXXXXXX"
                            className={cn(
                                "w-full p-3 border rounded-sm text-base",
                                "focus:ring-2 focus:ring-green-500 focus:border-transparent",
                                "prevent-zoom",
                                errors.sellerPhone && "border-red-500"
                            )}
                        />
                        {errors.sellerPhone && (
                            <p className="text-red-500 text-xs mt-1">{errors.sellerPhone}</p>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-sm">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            💡 <strong>Comment ça marche :</strong> Nous créons un lien sécurisé que vous partagez à votre acheteur.
                            Il peut payer en toute sécurité et vous recevrez l&apos;argent une fois qu&apos;il confirme avoir reçu l&apos;article.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "mobile-button bg-green-600 hover:bg-green-700 text-white",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "flex items-center justify-center gap-2"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Création en cours...
                            </>
                        ) : (
                            "Créer le lien sécurisé"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
