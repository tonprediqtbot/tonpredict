import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TonBet | Professional Prediction Markets on TON",
  description: "Predict on world events, sports, and crypto markets with high liquidity and security on the TON blockchain.",
  keywords: ["TON", "Telegram", "Prediction Markets", "Crypto", "Betting", "DeFi"],
  openGraph: {
    title: "TonBet | The Future is Tradable",
    description: "The world's most liquid prediction market on TON. Real events. Real payouts.",
    type: "website",
    url: "https://tonbet.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "TonBet | Prediction Markets on TON",
    description: "Real events. Real payouts. Secure and fast on the TON blockchain.",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-neon-purple/30`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col max-w-md mx-auto border-x border-white/5 bg-background shadow-2xl">
            <Navbar />
            <main className="flex-1 px-4 py-6 pb-32">
              {children}
            </main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
