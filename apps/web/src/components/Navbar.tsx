"use client";

import { useTheme } from "next-themes";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Moon, Sun, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/60 backdrop-blur-md max-w-md mx-auto px-4 py-3">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg">
            <img 
              src="/logo.png" 
              alt="TonBet Logo" 
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-lg font-bold tracking-tight">TonBet</span>
        </Link>

        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-full bg-white/5"
            >
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-neon-purple" />
              )}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-white/5"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <TonConnectButton />
        </div>
      </div>
    </header>
  );
}
