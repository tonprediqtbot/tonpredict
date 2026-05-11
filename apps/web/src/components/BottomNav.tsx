"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, Trophy, User, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Markets", icon: TrendingUp, href: "/markets" },
  { label: "Create", icon: PlusCircle, href: "/create", primary: true },
  { label: "Ranks", icon: Trophy, href: "/leaderboard" },
  { label: "Profile", icon: User, href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/10 bg-background/80 px-4 pb-safe pt-2 backdrop-blur-xl max-w-md mx-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        if (item.primary) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative -top-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple shadow-[0_0_20px_rgba(157,0,255,0.4)] transition-transform active:scale-95"
            >
              <Icon className="h-7 w-7 text-white" />
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors py-2",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "animate-pulse-glow")} />
            <span className="text-[10px] font-medium uppercase tracking-tighter">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
