import "./globals.css";
import Providers from "@/components/Providers";
import type { Metadata } from "next";

import Script from "next/script";

export const metadata: Metadata = {
  title: "TonBet | The Premier Prediction Market",
  description: "Predict outcomes, trade shares, and earn TON on the leading prediction market platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
