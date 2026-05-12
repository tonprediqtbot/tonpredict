"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, Zap, Trophy } from "lucide-react";
import { getMarkets, getGlobalStats } from "@/lib/actions";
import { MarketCard } from "@/components/MarketCard";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import Link from "next/link";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // 1. Initialize Telegram WebApp
    if (typeof window !== "undefined" && WebApp.initData) {
      WebApp.ready();
      WebApp.expand();

      // 2. Sync User with Backend
      const syncUser = async () => {
        if (WebApp.initDataUnsafe?.user) {
          try {
            const user = WebApp.initDataUnsafe.user;
            const startParam = WebApp.initDataUnsafe.start_param; // Referral code
            
            await fetch("/api/user/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                telegram_id: user.id.toString(),
                username: user.username,
                firstName: user.first_name,
                referred_by: startParam
              }),
            });
          } catch (e) {
            console.error("User Sync Failed:", e);
          }
        }
      };
      syncUser();
    }
  }, []);

  const { data: markets, isLoading } = useQuery({
    queryKey: ["markets", activeTab],
    queryFn: async () => {
      const res = await getMarkets(activeTab);
      return res.data || [];
    },
  });
  
  const { data: stats } = useQuery({
    queryKey: ["global-stats"],
    queryFn: async () => {
      const res = await getGlobalStats();
      return res.data;
    },
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-neon-blue/20 via-background to-neon-purple/20 p-8 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-neon-blue/10 blur-3xl"></div>
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neon-blue/20">
              <Zap className="h-3 w-3 text-neon-blue" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neon-blue">Live on TON</span>
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight leading-[0.9]">
            The Future <br />
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">is Tradable.</span>
          </h1>
          <p className="mb-8 text-sm text-muted-foreground leading-relaxed font-medium">
            Join the most liquid prediction market. Predict on world events, win TON.
          </p>
          <div className="flex gap-3">
            <Link href="/markets" className="flex-1">
              <Button size="lg" className="w-full rounded-2xl py-7 font-black shadow-xl shadow-primary/20">Start Trading</Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="neon" size="lg" className="rounded-2xl h-14 bg-white/5 border-white/5 px-6">
                <Trophy className="h-5 w-5 text-neon-purple" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-3xl p-5 border border-white/5 bg-white/5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Volume</span>
          <p className="text-xl font-black text-neon-green mt-1">
            {stats?.totalVolume ? parseFloat(stats.totalVolume.toString()).toLocaleString() : "0"} TON
          </p>
        </div>
        <div className="glass-panel rounded-3xl p-5 border border-white/5 bg-white/5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Markets</span>
          <p className="text-xl font-black text-neon-blue mt-1">{stats?.activeMarkets || 0}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {["all", "crypto", "sports", "tech", "politics"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white/5 text-muted-foreground hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Market Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-black tracking-tight">
            <TrendingUp className="h-5 w-5 text-neon-blue" />
            Active Markets
          </h2>
          <Link href="/markets" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition">VIEW ALL</Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 w-full animate-pulse rounded-[2rem] bg-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {markets?.slice(0, 5).map((market: any, i: number) => (
              <MarketCard key={market.id} market={market} index={i} />
            ))}
          </div>
        )}
      </div>
      <div className="pt-8 pb-4 text-center">
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-30">
          TonBet v1.0.1-PROD-REALTIME
        </p>
      </div>
    </div>
  );
}
