/* @proprietary license */

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { LottieIcon } from '@/components/preview/lottie-icon';
import { animations, LottieAnimationData } from '@/lib/utils/lottie-animations';
import { useTheme } from '@/lib/hooks/use-theme';
import { playClickSound } from '@/lib/utils/sound';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t as translate } from '@/lib/i18n/translations';

type UseCase = {
  name: string;
  description?: string;
};

type Product = {
  id: string;
  name: string;
  icon: LottieAnimationData;
  description: string;
  useCases: UseCase[];
};

type NativeFeature = {
  name: string;
};

export function IntegrationsDropdown({
  onMouseLeave,
}: {
  onMouseLeave?: () => void;
}) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const { theme } = useTheme();
  const { currentLanguage } = useTranslation();

  // Create t function that uses currentLanguage
  const t = (key: string) => String(translate(key, currentLanguage));

  const products: Product[] = [
    {
      id: 'payments',
      name: t('productsDropdown.products.payments.name'),
      icon: animations.cash,
      description: t('productsDropdown.products.payments.description'),
      useCases: [
        {
          name: t(
            'productsDropdown.products.payments.useCases.ecommerceMarketplaces.name',
          ),
          description: t(
            'productsDropdown.products.payments.useCases.ecommerceMarketplaces.description',
          ),
        },
        {
          name: t(
            'productsDropdown.products.payments.useCases.invoicesPayments.name',
          ),
          description: t(
            'productsDropdown.products.payments.useCases.invoicesPayments.description',
          ),
        },
      ],
    },
    {
      id: 'refund-api',
      name: t('productsDropdown.products.refunds.name'),
      icon: animations.autorenew,
      description: t('productsDropdown.products.refunds.description'),
      useCases: [
        {
          name: t(
            'productsDropdown.products.refunds.useCases.returnsCancellations.name',
          ),
          description: t(
            'productsDropdown.products.refunds.useCases.returnsCancellations.description',
          ),
        },
        {
          name: t(
            'productsDropdown.products.refunds.useCases.customerSubscriptions.name',
          ),
          description: t(
            'productsDropdown.products.refunds.useCases.customerSubscriptions.description',
          ),
        },
      ],
    },
    {
      id: 'payout-transfer-api',
      name: t('productsDropdown.products.payouts.name'),
      icon: animations.takeoff,
      description: t('productsDropdown.products.payouts.description'),
      useCases: [
        {
          name: t(
            'productsDropdown.products.payouts.useCases.payVendorsProviders.name',
          ),
          description: t(
            'productsDropdown.products.payouts.useCases.payVendorsProviders.description',
          ),
        },
        {
          name: t(
            'productsDropdown.products.payouts.useCases.payYourselfStaff.name',
          ),
          description: t(
            'productsDropdown.products.payouts.useCases.payYourselfStaff.description',
          ),
        },
      ],
    },
    {
      id: 'fraud-api',
      name: t('productsDropdown.products.fraud.name'),
      icon: animations.flag,
      description: t('productsDropdown.products.fraud.description'),
      useCases: [
        {
          name: t(
            'productsDropdown.products.fraud.useCases.builtInFraudDetection.name',
          ),
          description: t(
            'productsDropdown.products.fraud.useCases.builtInFraudDetection.description',
          ),
        },
        {
          name: t(
            'productsDropdown.products.fraud.useCases.preventChargebacks.name',
          ),
          description: t(
            'productsDropdown.products.fraud.useCases.preventChargebacks.description',
          ),
        },
      ],
    },
  ];

  const nativeFeatures: NativeFeature[] = [
    {
      name: t('productsDropdown.nativeFeatures.sellOnlineGlobally'),
    },
    {
      name: t('productsDropdown.nativeFeatures.buildComplexWorkflows'),
    },
    {
      name: t('productsDropdown.nativeFeatures.manageBusinessFinances'),
    },
    {
      name: t('productsDropdown.nativeFeatures.manageCustomerBilling'),
    },
  ];

  const nativeFeatureIcons = [
    {
      animation: animations.globe,
      color: [0.13, 0.45, 0.85] as [number, number, number],
    }, // Blue
    {
      animation: animations.cube,
      color: [0.1, 0.64, 0.25] as [number, number, number],
    }, // Green
    {
      animation: animations.highpriority,
      color: [0.9, 0.45, 0.1] as [number, number, number],
    }, // Orange
    {
      animation: animations.calculate,
      color: [0.5, 0.2, 0.8] as [number, number, number],
    }, // Purple
  ];

  const toggleSection = (id: string) => {
    playClickSound();

    // Define row groups
    const rows = [
      ['payments', 'refund-api'], // Row 1
      ['payout-transfer-api', 'fraud-api'], // Row 2
    ];

    // Find which row the clicked card belongs to
    const currentRowIndex = rows.findIndex((row) => row.includes(id));

    if (currentRowIndex === -1) return;

    const currentRow = rows[currentRowIndex];

    // If clicking the same section that's already open, close the entire row
    if (expandedSections.includes(id)) {
      // Close all cards in the current row
      setExpandedSections((prev) =>
        prev.filter((cardId) => !currentRow.includes(cardId)),
      );
      return;
    }

    // Check if any card from the current row is already open
    const isCurrentRowOpen = currentRow.some((cardId) =>
      expandedSections.includes(cardId),
    );

    if (isCurrentRowOpen) {
      // If current row is already open, just ensure all cards in row are open
      setExpandedSections((prev) => {
        const newExpanded = prev.filter(
          (cardId) => !currentRow.includes(cardId),
        ); // Remove current row
        return [...newExpanded, ...currentRow]; // Add all cards in current row
      });
    } else {
      // Close any open cards from other rows and open all cards in current row
      const otherRows = rows
        .filter((_, index) => index !== currentRowIndex)
        .flat();
      setExpandedSections((prev) => {
        const withoutOtherRows = prev.filter(
          (cardId) => !otherRows.includes(cardId),
        );
        return [...withoutOtherRows, ...currentRow];
      });
    }
  };

  return (
    <div
      className="w-full max-w-7xl max-h-[480px] overflow-y-auto -translate-y-2"
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-col">
        {/* Core Features Section */}
        <div className="px-2">
          <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 px-0">
            {t('productsDropdown.featuresTitle')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {nativeFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group relative flex flex-col h-[57px] rounded-sm transition-all cursor-pointer hover:shadow-sm overflow-hidden"
                onMouseEnter={() => setHoveredIcon(`feature-${index}`)}
                onMouseLeave={() => setHoveredIcon(null)}
                onClick={playClickSound}
              >
                <CardContent className="p-3 text-sm">
                  <div className="flex items-center gap-3 pt-1">
                    <div className="shrink-0">
                      <div className="flex items-center justify-center w-6 h-6 rounded-sm hover:bg-[#2a2f3d]/3 dark:hover:bg-[#2a2f3d]/10 transition-colors">
                        <LottieIcon
                          animationData={
                            nativeFeatureIcons[index]?.animation ||
                            animations.globe
                          }
                          size={18}
                          loop={false}
                          autoplay={false}
                          initialFrame={0}
                          isHovered={hoveredIcon === `feature-${index}`}
                          customColor={
                            hoveredIcon === `feature-${index}`
                              ? theme === 'dark'
                                ? [0.922, 0.922, 0.941] // Very light in dark mode (zinc-200)
                                : [0.4, 0.4, 0.427] // zinc-700 in light mode
                              : theme === 'dark'
                                ? [0.631, 0.631, 0.667] // zinc-400 in dark mode
                                : [0.322, 0.322, 0.357] // zinc-600 in light mode
                          }
                        />
                      </div>
                    </div>
                    <p
                      className={`text-sm font-semibold leading-tight flex-1 ${
                        hoveredIcon === `feature-${index}`
                          ? 'text-zinc-900 dark:text-zinc-100'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {feature.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="px-2 mt-4">
        <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 px-0">
          {t('productsDropdown.integrateTitle')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group relative flex flex-col rounded-sm transition-all cursor-pointer hover:shadow-sm overflow-hidden"
            >
              <CardHeader
                className="p-3 pb-2 cursor-pointer transition-all"
                onClick={() => toggleSection(product.id)}
                onMouseEnter={() => setHoveredIcon(product.id)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <div className="flex items-center gap-2">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center w-6 h-6 rounded-sm hover:bg-[#2a2f3d]/3 dark:hover:bg-[#2a2f3d]/10 transition-colors">
                      <LottieIcon
                        animationData={product.icon}
                        size={18}
                        loop={false}
                        autoplay={false}
                        initialFrame={0}
                        isHovered={hoveredIcon === product.id}
                        customColor={
                          hoveredIcon === product.id
                            ? theme === 'dark'
                              ? [0.922, 0.922, 0.941] // Very light in dark mode (zinc-200)
                              : [0.4, 0.4, 0.427] // zinc-700 in light mode
                            : theme === 'dark'
                              ? [0.631, 0.631, 0.667] // zinc-400 in dark mode
                              : [0.322, 0.322, 0.357] // zinc-600 in light mode
                        }
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pl-1.5">
                    <p
                      className={`text-sm font-semibold leading-tight ${
                        hoveredIcon === product.id
                          ? 'text-zinc-900 dark:text-zinc-100'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 leading-tight">
                      {product.description}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-3 w-3 text-muted-foreground transition-transform shrink-0 ${
                      expandedSections.includes(product.id) ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </CardHeader>

              {expandedSections.includes(product.id) && (
                <CardContent className="px-3 py-2 pt-0">
                  <div className="grid grid-cols-1 gap-2">
                    {product.useCases.map((useCase, index) => (
                      <Card
                        key={index}
                        className={`rounded-sm transition-all cursor-pointer hover:shadow-sm ${index === 0 ? 'mt-1' : ''}`}
                        onClick={playClickSound}
                      >
                        <CardContent className="p-3 text-sm">
                          <p className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 leading-tight">
                            {useCase.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-tight">
                            {useCase.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
