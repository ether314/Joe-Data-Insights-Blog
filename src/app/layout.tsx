import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Header } from "@/components/Header";
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
  title: {
    default: "Data Insights | Visual Analytics Platform",
    template: "%s | Data Insights",
  },
  description:
    "Data-driven visual stories exploring economics, technology, demographics, and the forces shaping our world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${sourceSerif.variable} h-full`}>
      <body className="flex min-h-full w-full flex-col bg-slate-50 font-sans text-slate-900 antialiased">
        <GoogleAnalytics />
        <Header />
        <main className="w-full min-w-0 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
