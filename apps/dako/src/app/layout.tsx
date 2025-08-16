import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#22c55e" },
    { media: "(prefers-color-scheme: dark)", color: "#15803d" },
  ],
};

export const metadata: Metadata = {
  title: "Dako - Le deal est bouclé",
  description: "La façon la plus sûre d'acheter et vendre sur les réseaux sociaux. Plus de risque d'arnaque.",
  keywords: "escrow, paiement sécurisé, commerce social, WhatsApp, Afrique de l'Ouest",
  authors: [{ name: "Dako", url: "https://dako.ci" }],
  creator: "Dako",
  publisher: "Dako",
  robots: "index, follow",

  // Open Graph / Facebook
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: "https://dako.ci",
    siteName: "Dako",
    title: "Dako - Le deal est bouclé",
    description: "La façon la plus sûre d'acheter et vendre sur les réseaux sociaux. Plus de risque d'arnaque.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dako - Transactions sécurisées",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@dako_ci",
    creator: "@dako_ci",
    title: "Dako - Le deal est bouclé",
    description: "La façon la plus sûre d'acheter et vendre sur les réseaux sociaux.",
    images: ["/twitter-image.jpg"],
  },

  // WhatsApp specific
  other: {
    "og:image:alt": "Dako - Transactions sécurisées pour le commerce social",
    "whatsapp:title": "Dako - Transaction sécurisée",
    "whatsapp:description": "Consultez les détails de cette transaction sécurisée",
  },

  // PWA
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dako",
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#22c55e",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Prevent iOS Safari zoom on form inputs */}
        <meta name="format-detection" content="telephone=no" />

        {/* PWA specific meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dako" />

        {/* WhatsApp preview optimization */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-background safe-area">
          {/* Mobile status bar spacing */}
          <div className="pt-safe-top" />

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Bottom safe area for iOS home indicator */}
          <div className="pb-safe-bottom" />
        </div>
      </body>
    </html>
  );
}