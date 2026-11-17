import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Header } from "@/components/Header";
import { SiteJsonLd } from "@/components/JsonLd";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Research & Visual Analytics`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: `${SITE_NAME} | Research & Visual Analytics`,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [{ url: "/images/theta-scribe-icon.png", sizes: "512x512", type: "image/png" }],
    apple: "/images/theta-scribe-icon.png",
  },
  other: {
    "google-adsense-account": ADSENSE_CLIENT,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${sourceSerif.variable} h-full`}>
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          data-overlays="bottom"
        />
      </head>
      <body className="flex min-h-full w-full flex-col bg-slate-50 font-sans text-slate-900 antialiased">
        <SiteJsonLd />
        <GoogleAnalytics />
        <Header />
        <main className="w-full min-w-0 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
