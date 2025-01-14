import { Suspense } from 'react'
import { Hero } from "@/components/landing/animated-hero"
import { ButtonExpandIconRight, ButtonExpandTalkToUs } from "@/components/design/button-expand"
import { TopBanner } from '@/components/landing/top-banner'
import { Footer } from '@/components/landing/Footer'
import ThreeDImage from '@/components/landing/3d-image'

export default function Page() {
  return (
    <main className="relative bg-background">
      <div className="min-h-[80vh] sm:min-h-screen select-none">
        <TopBanner />
        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 flex flex-col min-h-[calc(80vh-40px)] sm:min-h-[calc(100vh-40px)] pt-8 sm:pt-16">
          {/* Hero Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-1 -mt-12 sm:-mt-24">
            <div className="text-zinc-900 dark:text-white w-full sm:max-w-2xl relative z-20">
              <Hero />
              {/* Custom Buttons */}
              <div className="flex flex-row items-start gap-3 mt-6 sm:mt-8 relative z-20 pl-4 sm:pl-2">
                <ButtonExpandTalkToUs />
                <ButtonExpandIconRight />
              </div>
            </div>

            {/* 3D Image */}
            <div className="hidden sm:block mt-12 sm:mt-0 absolute right-0 z-0 translate-x-[32%] translate-y-[30%] scale-150 lg:scale-[1.6] origin-center">
              <Suspense fallback={<div className="w-[700px] h-[500px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />}>
                <ThreeDImage
                  src={{
                    light: "/portal.png",
                    dark: "/portal2.png"
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

      <div className="scroll-footer bottom-0 left-0 mt-16 right-0 pb-0">
        <Footer />
      </div>
    </main>
  )
}