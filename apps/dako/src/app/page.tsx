"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Shield, CheckCircle, Plus } from "lucide-react";
import { CreateDealForm } from "@/components/create-deal-form";
import { cn, formatCurrency } from "@/lib/actions/utils";

export default function HomePage() {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const features = [
    {
      icon: Shield,
      title: "Paiement sécurisé",
      description: "Vos fonds sont protégés jusqu'à confirmation de réception",
    },
    {
      icon: Smartphone,
      title: "Simple et rapide",
      description: "Créez un lien de transaction en moins de 2 minutes",
    },
    {
      icon: CheckCircle,
      title: "Confiance garantie",
      description: "Système de réputation et médiation en cas de litige",
    },
  ];

  const testimonials = [
    {
      name: "Aminata D.",
      rating: 5,
      text: "Enfin je peux vendre en toute sécurité sur WhatsApp !",
      deals: 12,
    },
    {
      name: "Moussa K.",
      rating: 5,
      text: "Plus de stress avec les arnaques. Dako me protège.",
      deals: 8,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-sage-50 dark:from-green-950/20 dark:to-sage-950/20">
      {/* Hero Section */}
      <div className="px-4 py-8 text-center">
        <div className="mx-auto max-w-md">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-green-700 dark:text-green-400">
              dako.
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Le deal est bouclé.
            </p>
          </div>

          {/* Headline */}
          <h2 className="text-2xl font-bold text-foreground mb-4 leading-tight">
            La façon la plus sûre d&apos;acheter et vendre sur WhatsApp
          </h2>

          <p className="text-muted-foreground mb-8 text-base">
            Fini les arnaques ! Créez des liens de transaction sécurisés pour vos ventes sur les réseaux sociaux.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className={cn(
              "mobile-button bg-green-600 hover:bg-green-700 text-white",
              "flex items-center justify-center gap-2 mx-auto mb-8"
            )}
          >
            <Plus className="h-5 w-5" />
            Créer une transaction sécurisée
          </button>

          {/* Trust indicators */}
          <div className="text-center text-sm text-muted-foreground mb-8">
            <p>✅ Utilisé par plus de 500 vendeurs</p>
            <p>🛡️ {formatCurrency(5420000)} sécurisés ce mois</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-8">
        <div className="mx-auto max-w-md">
          <h3 className="text-xl font-semibold text-center mb-6">
            Comment ça marche ?
          </h3>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-sm flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="px-4 py-8 bg-white/50 dark:bg-black/20">
        <div className="mx-auto max-w-md">
          <h3 className="text-xl font-semibold text-center mb-6">
            En 3 étapes simples
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <p className="text-sm">
                <strong>Créez</strong> votre lien de transaction avec le prix et la description
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <p className="text-sm">
                <strong>Partagez</strong> le lien à votre acheteur sur WhatsApp
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <p className="text-sm">
                <strong>Recevez</strong> votre paiement une fois l&apos;acheteur satisfait
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-4 py-8">
        <div className="mx-auto max-w-md">
          <h3 className="text-xl font-semibold text-center mb-6">
            Ils nous font confiance
          </h3>

          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="deal-card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.deals} transactions
                    </p>
                  </div>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  &quot;{testimonial.text}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-8 text-center text-xs text-muted-foreground">
        <p>Powered by lomi. • Sécurisé et certifié</p>
        <p className="mt-2">
          Des questions ? <a href="mailto:hello@dako.ci" className="text-green-600 hover:underline">Contactez-nous</a>
        </p>
      </div>

      {/* Create Deal Modal */}
      {showCreateForm && (
        <CreateDealForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={(dealId) => {
            setShowCreateForm(false);
            router.push(`/deal/${dealId}`);
          }}
        />
      )}
    </div>
  );
}