"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Bell, Shield, Wallet, Globe, Info, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const settingsGroups = [
    {
      title: "Display",
      items: [
        { icon: Monitor, label: "System Theme", action: () => setTheme("system"), active: theme === "system" },
        { icon: Moon, label: "Dark Mode", action: () => setTheme("dark"), active: theme === "dark" },
        { icon: Sun, label: "Light Mode", action: () => setTheme("light"), active: theme === "light" },
      ]
    },
    {
      title: "Security & Alerts",
      items: [
        { icon: Bell, label: "Push Notifications", toggle: true, enabled: true },
        { icon: Shield, label: "Two-Factor Auth", toggle: true, enabled: false },
        { icon: Wallet, label: "Auto-Disconnect", toggle: true, enabled: true },
      ]
    },
    {
      title: "Preference",
      items: [
        { icon: Globe, label: "Currency (TON)", value: "TON" },
        { icon: Info, label: "About TonBet", value: "v1.0.0" },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="pt-4">
        <h1 className="text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground font-medium mt-1">Personalize your trading experience.</p>
      </div>

      <div className="space-y-8">
        {settingsGroups.map((group, i) => (
          <div key={i} className="space-y-4">
            <h2 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              {group.title}
            </h2>
            <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/5">
              {group.items.map((item, j) => (
                <div 
                  key={j} 
                  onClick={item.action}
                  className={`flex items-center justify-between p-5 transition cursor-pointer ${
                    j !== group.items.length - 1 ? "border-b border-white/5" : ""
                  } ${item.active ? "bg-primary/10" : "hover:bg-white/5"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-xl p-2 ${item.active ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"}`}>
                       <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold">{item.label}</span>
                  </div>
                  
                  {item.toggle ? (
                    <div className={`h-6 w-11 rounded-full p-1 transition-colors ${item.enabled ? "bg-neon-green" : "bg-white/10"}`}>
                       <div className={`h-4 w-4 rounded-full bg-white transition-transform ${item.enabled ? "translate-x-5" : ""}`} />
                    </div>
                  ) : item.value ? (
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.value}</span>
                  ) : item.active ? (
                    <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(157,0,255,0.8)]" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button variant="ghost" className="w-full rounded-2xl py-8 text-red-500 hover:bg-red-500/10 hover:text-red-500 font-black gap-2 border border-red-500/10">
          <LogOut className="h-4 w-4" />
          DISCONNECT WALLET
        </Button>
      </div>

      <div className="text-center pb-10">
         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-20">TonBet Protocol | Powered by TON</p>
      </div>
    </div>
  );
}
