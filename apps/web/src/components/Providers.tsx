"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && WebApp.initData) {
      WebApp.ready();
      WebApp.expand();
    }
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-black" />; // Prevent rendering children that depend on TonConnect Context
  }

  return (
    <TonConnectUIProvider manifestUrl="https://tonbetweb-production.up.railway.app/tonconnect-manifest.json">

      {children}
    </TonConnectUIProvider>
  );
}
