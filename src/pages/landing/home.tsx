import { Suspense, useEffect } from 'react'
import { Hero } from "@/components/landing/animated-hero"
import { ButtonExpandIconRight, ButtonExpandTalkToUs } from "@/components/design/button-expand"
import { TopBanner } from '@/components/landing/top-banner'
import { Footer } from '@/components/landing/Footer'
import ThreeDImage from '@/components/landing/3d-image'
import { ButtonCta } from "@/components/landing/button-cta"
import { useNavigate } from 'react-router-dom'
import CookieConsent from '@/components/ui/tracking-cookie'
import { BackgroundLines } from '@/components/aceternity/background-lines'
import mixpanelService from '@/utils/mixpanel/mixpanel'

export default function Page() {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user has explicitly set a theme preference
    const storedTheme = localStorage.getItem('theme')

    if (!storedTheme) {
      // If no explicit preference, force dark mode
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }

    // Add keyboard event listener
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        navigate('/sign-in')
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [navigate])

  // Track page view when component mounts
  useEffect(() => {
    // Track landing page view with device and browser information
    mixpanelService.track('Landing Page Viewed', {
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'direct',
      url: window.location.href,
      path: window.location.pathname,
      utm_source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
      device_type: /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      browser: getBrowserInfo()
      // operating_system is automatically added by the mixpanelService
    });
  }, []);

  // Helper function to get browser information
  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    let browserName;

    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = "Chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = "Firefox";
    } else if (userAgent.match(/safari/i)) {
      browserName = "Safari";
    } else if (userAgent.match(/opr\//i)) {
      browserName = "Opera";
    } else if (userAgent.match(/edg/i)) {
      browserName = "Edge";
    } else {
      browserName = "Unknown";
    }

    return browserName;
  };

  // Custom onClick handlers with Mixpanel tracking
  const handleTalkToUsClick = () => {
    mixpanelService.track('Talk To Us Button Clicked', {
      location: 'landing_page',
      timestamp: new Date().toISOString()
    });
    // The original onClick in ButtonExpandTalkToUs will still execute
  };

  const handleConnectClick = () => {
    mixpanelService.track('Connect Button Clicked', {
      location: 'landing_page',
      timestamp: new Date().toISOString()
    });
    // The original onClick in ButtonExpandIconRight will still execute
  };

  const handleCtaClick = () => {
    mixpanelService.track('CTA Button Clicked', {
      location: 'landing_page',
      timestamp: new Date().toISOString()
    });
    // The original onClick in ButtonCta will still execute
  };

  return (
    <div className="overflow-hidden relative bg-background">
      {/* Background Lines positioned absolutely */}
      <div className="fixed inset-0 z-0">
        <BackgroundLines className="w-full h-full" svgOptions={{ duration: 15 }}>
          <div className="w-full h-full" />
        </BackgroundLines>
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="min-h-[80vh] sm:min-h-screen select-none">
          <TopBanner />
          <div className="container mx-auto px-4 sm:px-6 flex flex-col min-h-[calc(80vh-40px)] sm:min-h-[calc(100vh-40px)] pt-8 sm:pt-16">
            {/* Hero Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-1 -mt-24 sm:-mt-24">
              <div className="text-zinc-900 dark:text-white w-full sm:max-w-3xl relative z-20">
                <Hero />
                {/* Custom Buttons */}
                <div className="flex flex-row items-start gap-3 mt-6 sm:mt-8 relative z-20 pl-4 sm:pl-2">
                  <div onClick={handleTalkToUsClick}>
                    <ButtonExpandTalkToUs />
                  </div>
                  <div onClick={handleConnectClick}>
                    <ButtonExpandIconRight />
                  </div>
                </div>
                <div className="mt-2 pl-4 sm:pl-2 hidden sm:block">
                  <div onClick={handleCtaClick}>
                    <ButtonCta />
                  </div>
                </div>
              </div>

              {/* 3D Image */}
              <div className="hidden sm:block mt-12 sm:mt-0 absolute right-0 z-0 translate-x-[36%] translate-y-[30%] scale-150 lg:scale-[1.6] origin-center">
                <Suspense fallback={<div className="w-[700px] h-[500px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />}>
                  <ThreeDImage
                    src={{
                      light: "/company/portal.webp",
                      dark: "/company/portal_dark.webp"
                    }}
                    alt="Dashboard Preview"
                    width={700}
                    height={500}
                    className="w-full max-w-[900px]"
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-footer bottom-0 left-0 mt-12 sm:mt-32 right-0 pb-0">
          <Footer />
        </div>
      </main>
      <CookieConsent />
    </div>
  )
}