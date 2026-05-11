"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, Search, Filter, Trophy, Zap } from "lucide-react";
import { getMarkets } from "@/lib/actions";
import { MarketCard } from "@/components/MarketCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");

  const { data: markets, isLoading } = useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const res = await getMarkets();
      return res.data || [];
    },
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-neon-blue/20 via-background to-neon-purple/20 p-8 border border-white/5">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-neon-blue/10 blur-3xl"></div>
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neon-blue/20">
              <Zap className="h-3 w-3 text-neon-blue" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neon-blue">Live Predictions</span>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight">
            The Future <br />
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">is Tradable.</span>
          </h1>
          <p className="mb-8 text-sm text-muted-foreground leading-relaxed">
            Join the world's most liquid prediction market on TON. Real events. Real payouts.
          </p>
          <div className="flex gap-3">
            <Button size="lg" className="rounded-xl px-8 shadow-xl shadow-primary/20">Start Trading</Button>
            <Button variant="neon" size="lg" className="rounded-xl">Leaderboard</Button>
          </div>
        </div>
      </section>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-white/5">
          <span className="text-[10px] font-medium text-muted-foreground uppercase">24h Volume</span>
          <p className="text-lg font-bold text-neon-green mt-1">1.2M TON</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-white/5">
          <span className="text-[10px] font-medium text-muted-foreground uppercase">Active Traders</span>
          <p className="text-lg font-bold text-neon-blue mt-1">45.8K</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {["all", "crypto", "sports", "tech", "politics"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-tighter transition-all ${
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
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <TrendingUp className="h-5 w-5 text-neon-blue" />
            Active Markets
          </h2>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground font-bold">VIEW ALL</Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 w-full animate-pulse rounded-3xl bg-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {markets?.map((market: any, i: number) => (
              <MarketCard key={market.id} market={market} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
