"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { ThemeProvider } from "./ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && WebApp.initData) {
      WebApp.ready();
      WebApp.expand();
      
      // Sync Telegram theme if possible
      const tgTheme = WebApp.colorScheme;
      if (tgTheme) {
        document.documentElement.classList.toggle('dark', tgTheme === 'dark');
      }
    }
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <TonConnectUIProvider manifestUrl="https://tonbetweb-production.up.railway.app/tonconnect-manifest.json">
          {children}
        </TonConnectUIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
