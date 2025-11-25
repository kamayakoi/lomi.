/* @proprietary license */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LottieIcon } from '@/components/preview/lottie-icon';
import { animations, LottieAnimationData } from '@/lib/utils/lottie-animations';
import { playClickSound } from '@/lib/utils/sound';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { InfoBox } from '@/components/ui/info-box';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t as translate } from '@/lib/i18n/translations';

type DocCard = {
  id: string;
  title: string;
  description: string;
  icon: LottieAnimationData;
  href: string;
};

type FeaturedCard = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  badge?: string;
};

export function DocumentationDropdown({
  onMouseLeave,
}: {
  onMouseLeave?: () => void;
}) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const { currentLanguage } = useTranslation();

  // Create t function that uses currentLanguage
  const t = (key: string) => String(translate(key, currentLanguage));

  const featuredCard: FeaturedCard = {
    title: t('documentationDropdown.featuredTitle'),
    description: t('documentationDropdown.featuredDescription'),
    image: '/company/700x700.webp',
    imageAlt: 'Developers space',
    href: '/docs/core/fundamentals',
    badge: 'Getting started',
  };

  const docCards: DocCard[] = [
    {
      id: 'billing',
      title: t('documentationDropdown.billingTitle'),
      description: t('documentationDropdown.billingDescription'),
      icon: animations.code,
      href: '/docs/core/merchant-of-record/pricing',
    },
    {
      id: 'merchant-of-record',
      title: t('documentationDropdown.moneyManagementTitle'),
      description: t('documentationDropdown.moneyManagementDescription'),
      icon: animations.wallet,
      href: '/docs/core/merchant-of-record',
    },
  ];

  return (
    <div
      className="w-full max-w-7xl max-h-[420px] overflow-y-auto px-2 -translate-y-2"
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Featured Large Card */}
        <Link
          href={featuredCard.href}
          className="group flex-1 min-w-0 rounded-sm overflow-hidden bg-background border border-border hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer hover:shadow-sm"
          onClick={playClickSound}
        >
          <div className="relative h-full min-h-[280px] md:min-h-[320px] flex flex-col">
            {/* Image Background */}
            <div className="absolute inset-0 opacity-70 dark:opacity-40 group-hover:opacity-100 dark:group-hover:opacity-60 transition-opacity">
              <Image
                src={featuredCard.image}
                alt={featuredCard.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-8">
              {/* Title Section */}
              <div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white dark:text-zinc-100 mb-2 transition-colors">
                  {featuredCard.title}
                </h3>
              </div>

              {/* Bottom Section */}
              <div className="mt-auto">
                {featuredCard.badge && (
                  <InfoBox
                    variant="outline"
                    size="sm"
                    className="mb-2 pointer-events-none"
                  >
                    {featuredCard.badge}
                  </InfoBox>
                )}
                <p className="text-sm md:text-base text-white dark:text-zinc-400 leading-relaxed">
                  {featuredCard.description}
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* Grid of Larger Cards */}
        <div className="flex-1 grid grid-cols-1 gap-3 min-w-0">
          {docCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              onMouseEnter={() => setHoveredIcon(card.id)}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={playClickSound}
            >
              <Card className="group relative flex flex-col h-[155px] rounded-sm transition-all cursor-pointer hover:shadow-sm overflow-hidden">
                {/* Image Background */}
                <div className="absolute inset-0 opacity-70 dark:opacity-40 group-hover:opacity-100 dark:group-hover:opacity-60 transition-opacity">
                  <Image
                    src={
                      card.id === 'billing'
                        ? '/company/600x600.webp'
                        : '/company/500x500.webp'
                    }
                    alt="Background"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col h-full">
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-sm hover:bg-[#2a2f3d]/3 dark:hover:bg-[#2a2f3d]/10 transition-colors">
                          <LottieIcon
                            animationData={card.icon}
                            size={20}
                            loop={false}
                            autoplay={false}
                            initialFrame={0}
                            isHovered={hoveredIcon === card.id}
                            customColor={[1, 1, 1]} // White in both light and dark mode
                          />
                        </div>
                      </div>
                      <h4 className="text-lg md:text-xl font-bold text-white dark:text-zinc-100 transition-colors leading-tight">
                        {card.title}
                      </h4>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-8 pt-0 text-sm md:text-base text-white dark:text-zinc-400 grow flex flex-col">
                    <p className="leading-relaxed mt-auto">
                      {card.description}
                    </p>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
