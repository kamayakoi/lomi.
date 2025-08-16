"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Shield, Clock, CheckCircle, AlertTriangle, Copy, MessageCircle } from "lucide-react";
import { cn, formatCurrency, getDealStatusColor, getDealStatusIcon, createWhatsAppShareUrl, copyToClipboard } from "@/lib/actions/utils";
import type { Deal } from "@/lib/dat";
import Link from "next/link";

export default function DealPage() {
    const params = useParams();
    const dealId = params.dealId as string;
    const [deal, setDeal] = useState<Deal | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Mock deal data - replace with actual API call
    useEffect(() => {
        const fetchDeal = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock deal data
                const mockDeal: Deal = {
                    dealId,
                    status: "pending",
                    itemDescription: "iPhone 13 Pro - État neuf avec boîte et accessoires originaux",
                    price: 450000,
                    currency: "XOF",
                    sellerPhone: "221771234567",
                    buyerPhone: "221779876543",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    metadata: {
                        sellerName: "Fatou B.",
                    },
                };

                setDeal(mockDeal);
            } catch {
                setError("Transaction introuvable");
            } finally {
                setLoading(false);
            }
        };

        fetchDeal();
    }, [dealId]);

    const handleCopyLink = async () => {
        const url = window.location.href;
        const success = await copyToClipboard(url);
        if (success) {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const handleShareWhatsApp = () => {
        const whatsappUrl = createWhatsAppShareUrl(dealId);
        window.open(whatsappUrl, "_blank");
    };

    const handlePay = () => {
        setShowPaymentOptions(true);
    };

    const handleReleaseFunds = async () => {
        // Simulate releasing funds
        if (deal) {
            setDeal(prev => prev ? { ...prev, status: "completed" } : null);
        }
    };

    const handleDispute = () => {
        // Navigate to dispute form
        window.location.href = `mailto:support@dako.ci?subject=Litige - Transaction ${dealId}&body=Bonjour,%0D%0A%0D%0AJe souhaite ouvrir un litige pour la transaction ${dealId}.%0D%0A%0D%0ARaison:%0D%0A%0D%0ADescription:%0D%0A`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement de la transaction...</p>
                </div>
            </div>
        );
    }

    if (error || !deal) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h1 className="text-xl font-semibold mb-2">Transaction introuvable</h1>
                    <p className="text-muted-foreground mb-4">
                        Cette transaction n&apos;existe pas ou a été supprimée.
                    </p>
                    <Link
                        href="/"
                        className="mobile-button bg-green-600 hover:bg-green-700 text-white inline-block"
                    >
                        Retour à l&apos;accueil
                    </Link>
                </div>
            </div>
        );
    }

    const statusInfo = {
        pending: {
            title: "En attente de paiement",
            description: "L'acheteur doit effectuer le paiement pour sécuriser la transaction",
            canPay: true,
            canRelease: false,
        },
        funded: {
            title: "Fonds sécurisés",
            description: "Le paiement a été effectué et est maintenant sécurisé",
            canPay: false,
            canRelease: true,
        },
        completed: {
            title: "Transaction terminée",
            description: "L'acheteur a confirmé la réception et les fonds ont été libérés",
            canPay: false,
            canRelease: false,
        },
        disputed: {
            title: "Litige en cours",
            description: "Un litige a été ouvert et est en cours de résolution",
            canPay: false,
            canRelease: false,
        },
        cancelled: {
            title: "Transaction annulée",
            description: "Cette transaction a été annulée",
            canPay: false,
            canRelease: false,
        },
    };

    const currentStatus = statusInfo[deal.status];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b px-4 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">Transaction #{dealId}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={cn("status-badge", getDealStatusColor(deal.status))}>
                                {getDealStatusIcon(deal.status)} {currentStatus.title}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleCopyLink}
                            className="p-2 hover:bg-muted rounded-sm transition-colors"
                            title="Copier le lien"
                        >
                            {copySuccess ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                                <Copy className="h-5 w-5" />
                            )}
                        </button>

                        <button
                            onClick={handleShareWhatsApp}
                            className="p-2 hover:bg-muted rounded-sm transition-colors"
                            title="Partager sur WhatsApp"
                        >
                            <MessageCircle className="h-5 w-5 text-green-600" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 py-6 max-w-md mx-auto space-y-6">
                {/* Deal Details Card */}
                <div className="deal-card">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h2 className="font-semibold text-lg mb-2">Détails de la transaction</h2>
                            <p className="text-muted-foreground text-sm mb-3">
                                {deal.itemDescription}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Prix</span>
                            <span className="font-semibold text-lg">
                                {formatCurrency(deal.price, deal.currency)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Vendeur</span>
                            <span>{deal.metadata?.sellerName || "Vendeur"}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Créé le</span>
                            <span>{new Date(deal.createdAt).toLocaleDateString("fr-FR")}</span>
                        </div>
                    </div>
                </div>

                {/* Status Card */}
                <div className="deal-card">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            {deal.status === "pending" && <Clock className="h-6 w-6 text-orange-500" />}
                            {deal.status === "funded" && <Shield className="h-6 w-6 text-green-500" />}
                            {deal.status === "completed" && <CheckCircle className="h-6 w-6 text-green-500" />}
                            {deal.status === "disputed" && <AlertTriangle className="h-6 w-6 text-red-500" />}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium mb-1">{currentStatus.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {currentStatus.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {currentStatus.canPay && (
                        <button
                            onClick={handlePay}
                            className="mobile-button bg-green-600 hover:bg-green-700 text-white"
                        >
                            💳 Payer {formatCurrency(deal.price, deal.currency)} de façon sécurisée
                        </button>
                    )}

                    {currentStatus.canRelease && (
                        <div className="space-y-3">
                            <button
                                onClick={handleReleaseFunds}
                                className="mobile-button bg-green-600 hover:bg-green-700 text-white"
                            >
                                ✅ J&apos;ai reçu l&apos;article - Libérer le paiement
                            </button>

                            <button
                                onClick={handleDispute}
                                className="mobile-button bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                            >
                                ⚠️ Problème avec l&apos;article ? Ouvrir un litige
                            </button>
                        </div>
                    )}

                    {deal.status === "completed" && (
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-sm">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                            <p className="font-medium text-green-700 dark:text-green-300 mb-1">
                                Transaction terminée avec succès !
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                                Merci d&apos;avoir utilisé Dako
                            </p>
                        </div>
                    )}
                </div>

                {/* Security Info */}
                <div className="deal-card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                                🛡️ Protection Dako
                            </p>
                            <p className="text-blue-600 dark:text-blue-400">
                                Vos fonds sont sécurisés jusqu&apos;à confirmation de réception.
                                En cas de problème, notre équipe vous accompagne.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Support */}
                <div className="text-center text-xs text-muted-foreground">
                    <p>
                        Besoin d&apos;aide ? {" "}
                        <a href="mailto:support@dako.ci" className="text-green-600 hover:underline">
                            Contactez notre support
                        </a>
                    </p>
                </div>
            </div>

            {/* Payment Options Modal */}
            {showPaymentOptions && (
                <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
                    <div className="bg-background w-full max-w-md rounded-t-lg shadow-xl">
                        <div className="p-4 border-b">
                            <h3 className="font-semibold">Choisir un moyen de paiement</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <button className="w-full p-4 border rounded-sm hover:bg-muted transition-colors text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-sm flex items-center justify-center">
                                        📱
                                    </div>
                                    <div>
                                        <p className="font-medium">Orange Money</p>
                                        <p className="text-xs text-muted-foreground">Paiement mobile</p>
                                    </div>
                                </div>
                            </button>

                            <button className="w-full p-4 border rounded-sm hover:bg-muted transition-colors text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-sm flex items-center justify-center">
                                        🌊
                                    </div>
                                    <div>
                                        <p className="font-medium">Wave</p>
                                        <p className="text-xs text-muted-foreground">Paiement mobile</p>
                                    </div>
                                </div>
                            </button>

                            <button className="w-full p-4 border rounded-sm hover:bg-muted transition-colors text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-sm flex items-center justify-center">
                                        💳
                                    </div>
                                    <div>
                                        <p className="font-medium">MTN Mobile Money</p>
                                        <p className="text-xs text-muted-foreground">Paiement mobile</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                        <div className="p-4 border-t">
                            <button
                                onClick={() => setShowPaymentOptions(false)}
                                className="mobile-button bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
