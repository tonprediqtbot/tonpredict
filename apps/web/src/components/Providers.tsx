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
    return <>{children}</>;
  }

  return (
    <TonConnectUIProvider manifestUrl="https://tonbet.vercel.app/tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  );
}
