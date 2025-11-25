/* @proprietary license */

import React from 'react';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';
import { CardHeader, Card, CardContent } from '@/components/ui/card';
import {
  Smartphone,
  ArrowRight,
  Landmark,
  CornerDownRight,
  Star,
  Terminal,
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  blueVsTheme,
  blueVsDarkTheme,
} from '@/lib/utils/code-highlighting-theme';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { GitHubIcon } from '@/components/preview/icons';
import { useGithubStars } from '@/lib/hooks/use-github-stars-hooks';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { useTheme } from '@/lib/hooks/use-theme';
import { playClickSound } from '@/lib/utils/sound';

// Demo Revenue Chart Component with Interactive Features
const DemoRevenueChart = () => {
  // Fixed total revenue that doesn't change
  const totalRevenue = 49847392;

  // Generate realistic yearly growth data from 0 to totalRevenue
  const generateYearlyData = (): Array<{
    date: string;
    value: number;
    fullDate: string;
  }> => {
    const monthlyData: Array<{
      date: string;
      value: number;
      fullDate: string;
    }> = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setDate(1); // Start from the beginning of the month

    // Use fixed growth factors instead of random ones to ensure deterministic rendering
    const growthFactors = [
      0.8, 0.9, 1.2, 0.7, 1.1, 0.6, 1.4, 0.8, 1.3, 0.9, 1.0, 1.2,
    ];

    // Add spikes for sudden growth periods (using fixed indices)
    const spikeIndices = [2, 6, 8]; // Fixed spike positions
    const spikedFactors = [...growthFactors];
    spikeIndices.forEach((index) => {
      spikedFactors[index] = spikedFactors[index] * 2.5; // 2.5x spike for sudden rises
    });

    // 2. Calculate sum of factors
    const totalFactor = spikedFactors.reduce((sum, factor) => sum + factor, 0);

    // 3. Normalize factors and calculate monthly growth
    const monthlyGrowths = spikedFactors.map(
      (factor) => (factor / totalFactor) * totalRevenue,
    );

    // 4. Calculate cumulative sum
    let cumulative = 0;
    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);

      const growth = monthlyGrowths[i];
      if (growth) {
        cumulative += growth;
      }

      monthlyData.push({
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        }),
        value: Math.round(cumulative),
        fullDate: date.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        }),
      });
    }

    // 5. Ensure the last point is exactly the total revenue due to rounding
    const lastIndex = monthlyData.length - 1;
    if (monthlyData[lastIndex]) {
      const lastItem = monthlyData[lastIndex];
      if (lastItem) {
        lastItem.value = totalRevenue;
      }
    }

    return monthlyData;
  };

  const chartData: Array<{ date: string; value: number; fullDate: string }> =
    React.useMemo(() => generateYearlyData(), []);

  // Calculate accurate growth percentage over the full year
  const calculateGrowth = () => {
    if (chartData.length < 2) return 0;
    const first = chartData[0]?.value;
    const last = chartData[chartData.length - 1]?.value;
    if (first === undefined || last === undefined || first === 0) return 0;
    return ((last - first) / first) * 100;
  };

  const growthRate = calculateGrowth();

  const [hoveredPoint, setHoveredPoint] = React.useState<{
    x: number;
    y: number;
    value: number;
    date: string;
    fullDate: string;
  } | null>(null);

  // Chart dimensions
  const width = 365;
  const height = 180;
  const padding = { top: 10, right: 0, bottom: 5, left: 20 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const xScale = (index: number) =>
    (index / (chartData.length - 1)) * chartWidth;
  const yScale = (value: number) =>
    chartHeight - (value / totalRevenue) * chartHeight;

  // Generate smooth curve path
  const generatePath = () => {
    if (chartData.length === 0) return '';

    const firstPoint = chartData[0];
    if (!firstPoint) return '';

    let path = `M ${xScale(0)} ${yScale(firstPoint.value)}`;

    for (let i = 1; i < chartData.length; i++) {
      const prev = chartData[i - 1];
      const curr = chartData[i];

      if (!prev || !curr) continue;

      // Simple curve between points
      const cp1x = xScale(i - 1) + (xScale(i) - xScale(i - 1)) / 3;
      const cp1y = yScale(prev.value);
      const cp2x = xScale(i) - (xScale(i) - xScale(i - 1)) / 3;
      const cp2y = yScale(curr.value);

      path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${xScale(i)} ${yScale(curr.value)}`;
    }

    return path;
  };

  const pathD = generatePath();

  // Generate area fill path
  const generateAreaPath = () => {
    const lastIndex = chartData.length - 1;
    const lastPoint = chartData[lastIndex];
    if (!lastPoint) return pathD;

    return `${pathD} L ${xScale(lastIndex)} ${chartHeight} L ${xScale(0)} ${chartHeight} Z`;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - padding.left;

    // Find closest data point
    const closestIndex = Math.round((x / chartWidth) * (chartData.length - 1));
    const clampedIndex = Math.max(
      0,
      Math.min(chartData.length - 1, closestIndex),
    );
    const point = chartData[clampedIndex];

    if (point) {
      setHoveredPoint({
        x: xScale(clampedIndex) + padding.left,
        y: yScale(point.value) + padding.top,
        value: point.value,
        date: point.date,
        fullDate: point.fullDate,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-semibold">
          <span className="text-2xl font-semibold text-foreground">
            {totalRevenue.toLocaleString('fr-FR').replace(/\u202F/g, ' ')}
          </span>
          <span className="text-sm font-normal text-muted-foreground ml-1">
            F CFA
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-medium w-fit ${
            growthRate >= 0
              ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}
        >
          {growthRate >= 0 ? '+' : ''}
          {growthRate.toFixed(1)}%
        </span>
      </div>

      <div className="relative md:-ml-6">
        <svg
          width="102%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible cursor-crosshair focus:outline-none focus:ring-0 focus:border-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          tabIndex={-1}
        >
          <defs>
            <linearGradient id="demoGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Area fill */}
            <path d={generateAreaPath()} fill="url(#demoGradient)" />

            {/* Line */}
            <path d={pathD} stroke="#3b82f6" strokeWidth="2" fill="none" />

            {/* Data points */}
            {chartData.map((point, index) => (
              <circle
                key={index}
                cx={xScale(index)}
                cy={yScale(point?.value || 0)}
                r="2"
                fill="#3b82f6"
                opacity={hoveredPoint ? 0.5 : 0.8}
              />
            ))}
          </g>

          {/* Hover point */}
          {hoveredPoint && (
            <circle
              cx={hoveredPoint.x}
              cy={hoveredPoint.y}
              r="4"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            />
          )}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-10 bg-background border border-border rounded-sm px-3 py-2 shadow-sm text-xs pointer-events-none min-w-[140px] whitespace-nowrap"
            style={{
              left: `${hoveredPoint.x}px`,
              top: `${hoveredPoint.y}px`,
              transform:
                hoveredPoint.x < chartWidth / 2
                  ? 'translate(0%, -120%)'
                  : 'translate(-100%, -120%)',
            }}
          >
            <div className="text-muted-foreground mb-1">
              {hoveredPoint.fullDate}
            </div>
            <div className="font-semibold">
              {hoveredPoint.value.toLocaleString('fr-FR')} F CFA
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Card configuration with IDs
const CARD_CONFIGS = {
  payment_providers: {
    id: 'payment_providers',
    refIndex: 0,
    title: 'features.card1.title',
    component: 'payment_providers',
  },
  seamless_checkout: {
    id: 'seamless_checkout',
    refIndex: 1,
    title: 'features.card2.title',
    component: 'seamless_checkout',
  },
  data_insights: {
    id: 'data_insights',
    refIndex: 4,
    title: 'features.card5.title',
    component: 'data_insights',
  },
  mobile_payouts: {
    id: 'mobile_payouts',
    refIndex: 3,
    title: 'features.card4.title',
    component: 'mobile_payouts',
  },
  selling_models: {
    id: 'selling_models',
    refIndex: 2,
    title: 'features.card3.title',
    component: 'selling_models',
  },
  coupons_discounts: {
    id: 'coupons_discounts',
    refIndex: 5,
    title: 'features.card6.title',
    component: 'coupons_discounts',
  },
} as const;

// Card ordering configurations for different themes
const CARD_ORDERS = {
  light: [
    'payment_providers',
    'selling_models',
    'data_insights',
    'mobile_payouts',
    'seamless_checkout',
    'coupons_discounts',
  ] as const,
  dark: [
    'payment_providers',
    'seamless_checkout',
    'data_insights',
    'mobile_payouts',
    'selling_models',
    'coupons_discounts',
  ] as const,
};

export function FeaturesSection() {
  const { currentLanguage } = useTranslation();
  const { mounted, resolvedTheme } = useTheme();
  const featuresRef = React.useRef<HTMLElement>(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const starCount = useGithubStars();
  const isMobile = useIsMobile();

  // Determine card order based on theme
  const currentCardOrder = React.useMemo(() => {
    if (!mounted) return CARD_ORDERS.light; // Default to light during hydration
    return resolvedTheme === 'dark' ? CARD_ORDERS.dark : CARD_ORDERS.light;
  }, [mounted, resolvedTheme]);

  const card1Ref = React.useRef<HTMLDivElement>(null);
  const card2Ref = React.useRef<HTMLDivElement>(null);
  const card3Ref = React.useRef<HTMLDivElement>(null);
  const card4Ref = React.useRef<HTMLDivElement>(null);
  const card5Ref = React.useRef<HTMLDivElement>(null);
  const card6Ref = React.useRef<HTMLDivElement>(null);

  const card1InView = useInView(card1Ref, { once: true, amount: 0.5 });
  const card2InView = useInView(card2Ref, { once: true, amount: 0.5 });
  const card3InView = useInView(card3Ref, { once: true, amount: 0.5 });
  const card4InView = useInView(card4Ref, { once: true, amount: 0.5 });
  const card5InView = useInView(card5Ref, { once: true, amount: 0.5 });
  const card6InView = useInView(card6Ref, { once: true, amount: 0.5 });

  // State to track CLI animation trigger
  const [cliAnimationTriggered, setCliAnimationTriggered] =
    React.useState(false);

  // Trigger CLI animation when card 6 becomes visible
  React.useEffect(() => {
    if (card6InView && !cliAnimationTriggered) {
      setCliAnimationTriggered(true);
    }
  }, [card6InView, cliAnimationTriggered]);

  const cardRefs = [card1Ref, card2Ref, card3Ref, card4Ref, card5Ref, card6Ref];
  const cardInViews = [
    card1InView,
    card2InView,
    card3InView,
    card4InView,
    card5InView,
    card6InView,
  ];

  // Function to render a card based on its configuration
  const renderCard = (cardId: keyof typeof CARD_CONFIGS, index: number) => {
    const config = CARD_CONFIGS[cardId];
    const ref = cardRefs[config.refIndex];
    const inView = cardInViews[config.refIndex];
    const delay = 0.1 + index * 0.05; // Stagger animation delays

    switch (config.component) {
      case 'payment_providers':
        return (
          <motion.div
            key={cardId}
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            className="size-full"
          >
            <Card className="flex flex-col h-[450px] md:h-[400px] rounded-sm">
              <CardHeader className="p-6 pb-4 text-base font-medium">
                {String(t('features.card1.title', currentLanguage))}
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0 text-sm text-muted-foreground grow">
                <p className="mb-4">
                  {String(t('features.card1.description', currentLanguage))}
                </p>
                <div className="w-full max-h-[230px] overflow-y-auto space-y-2 pr-2 hide-scrollbar">
                  {providerNames.map((name, i) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        inView
                          ? {
                              opacity: 1,
                              x: 0,
                              transition: {
                                delay: 0.5 + i * 0.1,
                                type: 'spring',
                                stiffness: 120,
                                damping: 20,
                              },
                            }
                          : {}
                      }
                      className="flex items-center justify-between p-1 h-12.5 bg-background border border-zinc-200 dark:border-zinc-800 rounded-sm hover:bg-muted/40 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-background border border-zinc-200 dark:border-zinc-800 rounded-sm flex items-center justify-center shadow-sm overflow-hidden">
                          <Image
                            src={`/payment_channels/${name === 'SPI' ? `${spiImages[spiImageIndex]}` : name === 'Visa' ? `${visaImages[visaImageIndex]}` : name.toLowerCase().replace(' ', '_')}.webp`}
                            alt={`${name} logo`}
                            width={
                              name === 'SPI' &&
                              spiImages[spiImageIndex] === 'spi'
                                ? 24
                                : 32
                            }
                            height={
                              name === 'SPI' &&
                              spiImages[spiImageIndex] === 'spi'
                                ? 24
                                : 32
                            }
                            className={
                              name === 'SPI' &&
                              spiImages[spiImageIndex] === 'spi'
                                ? 'w-6 h-6 object-cover rounded-sm'
                                : 'w-full h-full object-cover rounded-sm'
                            }
                          />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            {name === 'SPI'
                              ? 'Mobile Money'
                              : name === 'Visa'
                                ? 'Cards'
                                : name}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {name === 'SPI' &&
                              String(
                                t(
                                  'features.card1.spi_description',
                                  currentLanguage,
                                ),
                              )}
                            {name === 'Visa' &&
                              String(
                                t(
                                  'features.card1.visa_description',
                                  currentLanguage,
                                ),
                              )}
                            {name === 'PayPal' &&
                              String(
                                t(
                                  'features.card1.paypal_description',
                                  currentLanguage,
                                ),
                              )}
                            {name === 'Google Pay' &&
                              String(
                                t(
                                  'features.card1.google_pay_description',
                                  currentLanguage,
                                ),
                              )}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={paymentToggles[name] || false}
                        onCheckedChange={() => handlePaymentToggle(name)}
                        aria-label={`${paymentToggles[name] ? 'Disable' : 'Enable'} ${name} payments`}
                        className="data-[state=checked]:bg-[#56A5F9] data-[state=checked]:border-[#56A5F9] dark:data-[state=checked]:bg-sky-600 dark:data-[state=checked]:border-sky-600 mr-2"
                      />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'seamless_checkout':
        return (
          <motion.div
            key={cardId}
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            className="size-full"
          >
            <Card className="flex flex-col h-[400px] rounded-sm overflow-hidden">
              <CardHeader className="p-6 pb-4 text-base font-medium">
                {String(
                  t(
                    mounted && resolvedTheme === 'light'
                      ? 'features.card2.title_light'
                      : 'features.card2.title',
                    currentLanguage,
                  ),
                )}
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0 text-sm text-muted-foreground grow relative flex flex-col">
                <p className="mb-4">
                  {String(
                    t(
                      mounted && resolvedTheme === 'light'
                        ? 'features.card2.description_light'
                        : 'features.card2.description',
                      currentLanguage,
                    ),
                  )}
                </p>
                <div className="relative grow rounded-sm overflow-hidden">
                  {mounted && (
                    <>
                      <Image
                        src="/okra/okra_api_receipts.svg"
                        alt="Seamless checkout architecture"
                        width={400}
                        height={300}
                        className="absolute inset-0 w-full h-full object-contain -ml-2 md:ml-0 block dark:hidden"
                      />
                      <Image
                        src="/random/arch_l.webp"
                        alt="Seamless checkout architecture"
                        width={400}
                        height={300}
                        className="absolute inset-0 w-full h-full object-contain -ml-2 md:ml-0 hidden dark:block"
                        priority
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'data_insights':
        return (
          <motion.div
            key={cardId}
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            className="size-full"
          >
            <Card className="flex flex-col h-[400px] rounded-sm">
              <CardHeader className="px-6 pt-6 pb-4 text-base font-medium">
                {String(t('features.card5.title', currentLanguage))}
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0 text-sm text-muted-foreground grow">
                <p className="mb-4">
                  {String(t('features.card5.description', currentLanguage))}
                </p>
                <div className="w-full">
                  <DemoRevenueChart />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'mobile_payouts':
        return (
          <motion.div
            key={cardId}
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            className="size-full"
          >
            <Card className="flex flex-col h-[400px] rounded-sm">
              <CardHeader className="p-6 pb-4 text-base font-medium">
                {String(t('features.card4.title', currentLanguage))}
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0 text-sm text-muted-foreground grow">
                <p className="mb-2">
                  {String(t('features.card4.description', currentLanguage))}
                </p>
                <div
                  data-animate
                  className="flex flex-col items-start justify-center gap-3 lomi-demo-card-content w-full"
                >
                  <div className="payout-dashboard w-full">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {String(t('features.card4.balance', currentLanguage))}
                      </span>
                      <div className="flex items-center gap-2 rounded-sm p-1.5 bg-green-50 dark:bg-green-900/30 border w-48 h-8 justify-center">
                        <span className="font-mono text-[11px] font-bold text-green-700 dark:text-green-300">
                          {(49847392)
                            .toLocaleString('fr-FR')
                            .replace(/\u202F/g, ' ')}{' '}
                          F CFA
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full items-start pt-0">
                    <CornerDownRight className="size-5 text-muted-foreground/80 mt-20 mr-4" />
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <p className="text-[11px] text-muted-foreground mb-2">
                          {String(
                            t('features.card4.payout_phone', currentLanguage),
                          )}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col gap-2 translate-x-12 mr-12">
                            <div
                              className="flex items-center gap-2 rounded-sm p-1.5 bg-muted/40 border w-36 h-8 justify-center cursor-pointer transition-colors hover:bg-muted/60 focus:outline-none focus:ring-0 focus:border-none"
                              onMouseEnter={handlePhoneNumberHover1}
                            >
                              <span className="font-mono text-[11px]">
                                {phoneNumbers[phoneNumberIndex1]?.number}
                              </span>
                            </div>
                            <div
                              className="flex items-center gap-2 rounded-sm p-1.5 bg-muted/40 border w-36 h-8 justify-center cursor-pointer transition-colors hover:bg-muted/60 focus:outline-none focus:ring-0 focus:border-none"
                              onMouseEnter={handlePhoneNumberHover2}
                            >
                              <span className="font-mono text-[11px]">
                                {phoneNumbers[phoneNumberIndex2]?.number}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="size-4 text-muted-foreground/80" />
                          <div className="h-8 w-8 rounded-sm bg-muted/40 border flex items-center justify-center">
                            <Smartphone className="size-4 text-foreground" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-[11px] text-muted-foreground translate-x-0 mt-2 mb-2">
                          {String(
                            t('features.card4.payout_bank', currentLanguage),
                          )}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col translate-x-0 mr-0">
                            <div
                              className="flex items-center gap-2 rounded-sm px-0 py-1.5 bg-muted/40 border w-48 h-8 justify-center cursor-pointer transition-colors hover:bg-muted/60 focus:outline-none focus:ring-0 focus:border-none"
                              onMouseEnter={handleBankAccountHover}
                            >
                              <span className="font-mono text-[11px]">
                                {bankAccounts[bankAccountIndex]?.number}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="size-4 text-muted-foreground/80" />
                          <div className="h-8 w-8 rounded-sm bg-muted/40 border flex items-center justify-center">
                            <Landmark className="size-4 text-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'selling_models':
        return (
          <motion.div
            key={cardId}
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            className="size-full"
          >
            <Card className="flex flex-col h-[400px] rounded-sm">
              <CardHeader className="p-6 pb-4 text-base font-medium">
                {String(t('features.card3.title', currentLanguage))}
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0 text-sm text-muted-foreground grow flex flex-col">
                <p className="mb-4">
                  {String(t('features.card3.description', currentLanguage))}
                </p>
                <div className="w-full">
                  <div className="flex gap-1 rounded-sm bg-muted/30 border border-border p-1 w-full h-10">
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setActiveTab('product');
                      }}
                      className={`flex-1 px-3 pt-1.5 pb-2.5 text-sm font-normal rounded-sm transition-all duration-200 h-7.5 focus:outline-none focus:ring-0 focus:border-none ${
                        activeTab === 'product'
                          ? 'bg-[#E9EAEF] dark:bg-[#2A2B30] text-foreground shadow-sm border border-border/50'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {String(
                        t('features.card3.tab_products', currentLanguage),
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setActiveTab('subscription');
                      }}
                      className={`flex-1 px-3 pt-1.5 pb-2.5 text-sm font-normal rounded-sm transition-all duration-200 h-7.5 focus:outline-none focus:ring-0 focus:border-none ${
                        activeTab === 'subscription'
                          ? 'bg-[#E9EAEF] dark:bg-[#2A2B30] text-foreground shadow-sm border border-border/50'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {String(
                        t('features.card3.tab_subscriptions', currentLanguage),
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setActiveTab('checkout');
                      }}
                      className={`flex-1 px-3 pt-1.5 pb-2.5 text-sm font-normal rounded-sm transition-all duration-200 h-7.5 focus:outline-none focus:ring-0 focus:border-none ${
                        activeTab === 'checkout'
                          ? 'bg-[#E9EAEF] dark:bg-[#2A2B30] text-foreground shadow-sm border border-border/50'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {String(
                        t('features.card3.tab_checkout', currentLanguage),
                      )}
                    </button>
                  </div>
                  <div className="mt-2">
                    <div className="relative">
                      {activeTab === 'product' && (
                        <div className="bg-muted/50 dark:bg-blue-950/30 rounded-sm overflow-hidden shadow-sm h-54 md:h-50 overflow-y-auto hide-scrollbar">
                          {mounted && (
                            <SyntaxHighlighter
                              language="json"
                              style={
                                resolvedTheme === 'dark'
                                  ? blueVsDarkTheme
                                  : blueVsTheme
                              }
                              customStyle={{
                                margin: 0,
                                padding: '1rem',
                                fontSize: '0.75rem',
                                lineHeight: '1.5',
                              }}
                              wrapLines={true}
                              codeTagProps={{
                                style: {
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                },
                              }}
                            >
                              {productCode}
                            </SyntaxHighlighter>
                          )}
                        </div>
                      )}
                      {activeTab === 'subscription' && (
                        <div className="bg-muted/50 dark:bg-blue-950/30 rounded-sm overflow-hidden shadow-sm h-54 md:h-50 overflow-y-auto hide-scrollbar">
                          {mounted && (
                            <SyntaxHighlighter
                              language="json"
                              style={
                                resolvedTheme === 'dark'
                                  ? blueVsDarkTheme
                                  : blueVsTheme
                              }
                              customStyle={{
                                margin: 0,
                                padding: '1rem',
                                fontSize: '0.75rem',
                                lineHeight: '1.5',
                              }}
                              wrapLines={true}
                              codeTagProps={{
                                style: {
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                },
                              }}
                            >
                              {subscriptionCode}
                            </SyntaxHighlighter>
                          )}
                        </div>
                      )}
                      {activeTab === 'checkout' && (
                        <div className="bg-muted/50 dark:bg-blue-950/30 rounded-sm overflow-hidden shadow-sm h-54 md:h-50 overflow-y-auto hide-scrollbar">
                          {mounted && (
                            <SyntaxHighlighter
                              language="json"
                              style={
                                resolvedTheme === 'dark'
                                  ? blueVsDarkTheme
                                  : blueVsTheme
                              }
                              customStyle={{
                                margin: 0,
                                padding: '1rem',
                                fontSize: '0.75rem',
                                lineHeight: '1.5',
                              }}
                              wrapLines={true}
                              codeTagProps={{
                                style: {
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                },
                              }}
                            >
                              {checkoutCode}
                            </SyntaxHighlighter>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'coupons_discounts':
        return (
          <motion.div
            key={cardId}
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            className="size-full"
          >
            <Card className="flex flex-col h-[400px] rounded-sm">
              <CardHeader className="p-6 pb-4 text-base font-medium">
                {String(t('features.card6.title', currentLanguage))}
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0 text-sm text-muted-foreground grow flex flex-col">
                <p className="mb-4">
                  {String(t('features.card6.description', currentLanguage))}
                </p>

                <div className="relative my-4">
                  <div className="grid grid-cols-[1fr_2fr_1fr] h-[120px] *:border-foreground/10 *:border-dashed mask-radial-circle-long">
                    <div className="border-r border-b" />
                    <div className="border-b" />
                    <div className="border-l border-b" />

                    <div className="border-r" />
                    <div />
                    <div className="border-l" />

                    <div className="border-r border-t" />
                    <div className="border-t" />
                    <div className="border-l border-t" />
                  </div>
                  <code className="absolute inset-0 flex items-center justify-center">
                    <code
                      className={`cli-command-animated ${cliAnimationTriggered && !isMobile ? 'animate' : ''}`}
                    >
                      <code className="text-sm text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-foreground font-medium" />
                    </code>
                  </code>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-1">
                    <Terminal className="size-4 text-blue-500 shrink-0" />
                    <span>
                      {String(
                        t('features.card6.open_source_note', currentLanguage),
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row gap-3 mt-6">
                  <a
                    href="https://github.com/lomiafrica/lomi./"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playClickSound}
                    className="w-full rounded-sm font-normal border border-zinc-200 dark:border-zinc-800 flex items-center h-8 text-sm overflow-hidden"
                  >
                    <div className="inline-flex items-center justify-center gap-2 bg-transparent px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border-zinc-200 dark:border-zinc-800 h-full">
                      <GitHubIcon className="h-5 w-5" />
                    </div>
                    <div className="bg-transparent px-2 py-2 text-amber-500 hover:text-amber-600 border-l border-zinc-200 dark:border-zinc-800 h-full flex items-center justify-center flex-1">
                      <span className="mr-1 font-semibold text-amber-600 dark:text-amber-300 hover:text-amber-700 dark:hover:text-amber-200">
                        {formatStars(starCount)}
                      </span>
                      <Star className="h-3.5 w-3.5 text-amber-600 dark:text-amber-300 hover:text-amber-700 dark:hover:text-amber-200 fill-current shrink-0" />
                    </div>
                  </a>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-8"
                    onClick={playClickSound}
                  >
                    <a
                      href="/docs/core/introduction/what-is-lomi"
                      className="flex items-center justify-center text-foreground"
                    >
                      {String(
                        t(
                          'features.card6.documentation_button',
                          currentLanguage,
                        ),
                      )}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const providerNames = ['SPI', 'Visa', 'PayPal', 'Google Pay'] as const;

  // Payment method toggle states
  const [paymentToggles, setPaymentToggles] = React.useState<
    Record<string, boolean>
  >({
    SPI: true,
    Visa: true,
    PayPal: false,
    'Google Pay': true,
  });

  // Phone numbers hover state - separate for each field
  const [phoneNumberIndex1, setPhoneNumberIndex1] = React.useState(0);
  const [phoneNumberIndex2, setPhoneNumberIndex2] = React.useState(1);

  // Visa image rotation state
  const [visaImageIndex, setVisaImageIndex] = React.useState(0);
  const visaImages = ['visa', 'mastercard', 'amex', 'gim'];

  // SPI image rotation state
  const [spiImageIndex, setSpiImageIndex] = React.useState(0);
  const spiImages = ['orange', 'wave', 'mtn', 'airtel', 'moov', 'free'];
  const phoneNumbers = [
    { country: 'SN', number: '+221 77 123 45 67' },
    { country: 'CI', number: '+225 01 12 34 56 78' },
    { country: 'SN', number: '+221 76 987 65 43' },
    { country: 'CI', number: '+225 05 87 65 43 21' },
    { country: 'SN', number: '+221 78 456 78 90' },
    { country: 'CI', number: '+225 01 23 45 67 89' },
  ];

  // Bank account hover state
  const [bankAccountIndex, setBankAccountIndex] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('product');
  const bankAccounts = [
    { code: 'NL', number: 'NL91 ABNA 0417 1643 00' },
    { code: 'CI', number: 'CI05 SGBS 1234 5678 9012 34' },
    { code: 'SN', number: 'SN12 3456 7890 1234 5678 9012' },
  ];

  const formatStars = (count: number | null): string => {
    if (count === null) return '...';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handlePhoneNumberHover1 = () => {
    setPhoneNumberIndex1((prev) => (prev + 2) % phoneNumbers.length);
  };

  const handlePhoneNumberHover2 = () => {
    setPhoneNumberIndex2((prev) => (prev + 2) % phoneNumbers.length);
  };

  const handleBankAccountHover = () => {
    setBankAccountIndex((prev) => (prev + 1) % bankAccounts.length);
  };

  const handlePaymentToggle = (providerName: string) => {
    setPaymentToggles((prev) => ({
      ...prev,
      [providerName]: !prev[providerName],
    }));
  };

  // Visa image rotation effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setVisaImageIndex((prev) => (prev + 1) % visaImages.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [visaImages.length]);

  // SPI image rotation effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSpiImageIndex((prev) => (prev + 1) % spiImages.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [spiImages.length]);

  const productCode = `{
  "name": "Just a mug",
  "description": "A high-quality ceramic mug for your daily coffee.",
  "price": 5000,
  "currency_code": "XOF",
  "display_on_storefront": true,
  "image_url": "https://cdn.img.co/+++"
}`;

  const subscriptionCode = `{
  "name": "Pro",
  "description": "Access to all pro features, billed monthly.",
  "price": 19,99,
  "currency_code": "EUR",
  "billing_frequency": "monthly",
  "display_on_storefront": true
}`;

  const checkoutCode = `{
  "product_id": "4348-94cj-45W3--f05x-dnc3-844d",
  "allowed_providers": ["SPI", "WAVE", "CARDS", "BNPL"],
  "customer_email": "kwame@happy.ai",
  "allow_coupon_code": true,
  "allow_quantity": true
}`;

  return (
    <>
      <style>{`
        :root {
          --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
          --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        /* General Card Demo Styling */
        .lomi-demo-card-content {
          min-height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        /* Animations: Play when in view */
        #features:not(.in-view) [data-animate],
        #features:not(.in-view) .analytics-bar,
        #features:not(.in-view) .coupon-price-original-animated,
        #features:not(.in-view) .coupon-price-new-animated,
        #features:not(.in-view) .coupon-code-animated::after,
        #features:not(.in-view) [data-animate] > *,
        #features:not(.in-view) .cli-command-animated:not(.animate) > code::before,
        #features:not(.in-view) .cli-command-animated:not(.animate)::after {
          animation: none !important;
        }

        /* CLI animation triggers when card is in view */
        .cli-command-animated.animate > code::before {
          animation: typeCliCommand 4s steps(21, end) 0.8s forwards;
        }
        .cli-command-animated.animate::after {
          animation: cliCaret 5s linear 0.8s forwards;
        }

        /* Ensure CLI animation works on mobile */
        @media (max-width: 640px) {
          .cli-command-animated.animate > code::before,
          .cli-command-animated.animate::after {
            animation-fill-mode: forwards !important;
          }
        }

        /* Card 3: Selling Models */
        .selling-model-card {
          background: hsl(var(--muted) / 0.4);
          border: 1px solid hsl(var(--border));
          border-radius: 4px;
          padding: 0.75rem;
          width: 100px;
          text-align: center;
        }

        [data-animate] > * {
          opacity: 0;
          transform: translateY(10px);
          animation: fadeInStagger 0.6s var(--ease-out-cubic) forwards;
        }

        [data-animate] > *:nth-child(2) { animation-delay: 0.2s; }
        [data-animate] > *:nth-child(3) { animation-delay: 0.4s; }
        [data-animate] > *:nth-child(4) { animation-delay: 0.6s; }

        @keyframes fadeInStagger {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Card 4: Payouts */
        .payout-dashboard {
          width: 100%;
          background: hsl(var(--muted) / 0.4);
          border: 1px solid hsl(var(--border));
          border-radius: 6px;
          padding: 0.75rem;
          font-family: monospace;
        }

        /* Card 5: Analytics */
        .analytics-bar {
          background-color: hsl(var(--primary));
          border-radius: 2px;
          transform-origin: bottom;
          animation: growBar 0.8s var(--ease-out-cubic) forwards;
        }
        @keyframes growBar {
          from {
            transform: scaleY(0);
          }
        }

        .cli-command-animated {
          position: relative;
          display: inline-block;
        }
        .cli-command-animated::after {
          content: '|';
          display: inline-block;
          color: hsl(var(--foreground) / 0.8);
          animation: cliCaret 5s linear 0.8s forwards;
          opacity: 0;
          margin-left: 2px;
        }
        .cli-command-animated > code::before {
          content: '';
          display: inline-block;
          animation: typeCliCommand 4s steps(21, end) 0.8s forwards;
        }

        @keyframes typeCliCommand {
          0% { content: ''; }
          4.7% { content: 'n'; }
          9.5% { content: 'np'; }
          14.2% { content: 'npx'; }
          19% { content: 'npx '; }
          23.8% { content: 'npx i'; }
          28.5% { content: 'npx in'; }
          33.3% { content: 'npx ins'; }
          38% { content: 'npx inst'; }
          42.8% { content: 'npx insta'; }
          47.6% { content: 'npx instal'; }
          52.3% { content: 'npx install'; }
          57.1% { content: 'npx install '; }
          61.9% { content: 'npx install l'; }
          66.6% { content: 'npx install lo'; }
          71.4% { content: 'npx install lom'; }
          76.1% { content: 'npx install lomi'; }
          80.9% { content: 'npx install lomi.'; }
          85.7% { content: 'npx install lomi.c'; }
          90.4% { content: 'npx install lomi.cl'; }
          95.2% { content: 'npx install lomi.cli'; }
          100% { content: 'npx install lomi.cli'; }
        }

        @keyframes cliCaret {
          0%, 100% { opacity: 0; }
          1% { opacity: 1; }
          80% { opacity: 1; }
          81%, 83%, 85%, 87%, 89%, 91%, 93%, 95%, 97%, 99% { opacity: 1; }
          82%, 84%, 86%, 88%, 90%, 92%, 94%, 96%, 98% { opacity: 0; }
        }
      `}</style>
      <section
        id="features"
        ref={featuresRef}
        aria-labelledby="features-heading"
        className={`py-12 pb-10 pt-36 lg:pt-10 lg:pb-8 ${isFeaturesInView ? 'in-view' : ''}`}
      >
        <div className="max-w-7xl mx-auto pl-2 pr-4 py-2">
          <div className="mb-6 md:mb-8">
            <h2
              id="features-heading"
              className="max-w-3xl text-4xl font-normal tracking-tighter text-left text-zinc-800 dark:text-white md:text-5xl"
            >
              {String(t('features.title', currentLanguage))}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {currentCardOrder.map((cardId, index) => renderCard(cardId, index))}
          </div>
        </div>
      </section>
    </>
  );
}
