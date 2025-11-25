/* @proprietary license */

'use client';

import { Hero } from '@/components/home/hero';
import { FeaturesSection } from '@/components/home/features-section';
import { CareersSection } from '@/components/home/careers-section';
import { Features } from '@/components/home/features';
import { EarlyMemberPricing } from '@/components/home/early-member-pricing';
import { useHomePageInit } from '@/lib/hooks/use-home-page-init';

export function HomePageClient() {
  const { getDashboardImage, getMobileDashboardImage, getMobileJoinUsImage } =
    useHomePageInit();

  return (
    <>
      {/* Hero Section */}
      <Hero
        dashboardImage={getDashboardImage()}
        mobileDashboardImage={getMobileDashboardImage()}
      />
      <FeaturesSection />
      <Features />
      <CareersSection mobileJoinUsImage={getMobileJoinUsImage()} />
      <EarlyMemberPricing />
    </>
  );
}
