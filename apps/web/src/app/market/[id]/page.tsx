"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Info, Activity, History, MessageSquare, Timer } from "lucide-react";
import { getMarkets } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BetModal } from "@/components/BetModal";

export default function MarketDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [betSide, setBetSide] = useState<"YES" | "NO" | null>(null);

  const { data: market, isLoading } = useQuery({
    queryKey: ["market", id],
    queryFn: async () => {
      const res = await getMarkets();
      return res.data?.find((m: any) => m.id === id);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!market) return <div>Market not found</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-white/5">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="rounded-full bg-white/5">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-neon-blue/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon-blue">
            {market.category}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <Timer className="h-3 w-3 text-neon-purple" />
            Resolves July 1, 2025
          </div>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight leading-tight">{market.title}</h1>
      </div>

      {/* Chart Section (Placeholder for high-fidelity) */}
      <div className="relative h-48 w-full overflow-hidden rounded-3xl bg-white/5 border border-white/5 p-6">
        <div className="flex h-full items-end gap-1">
          {[40, 45, 30, 55, 60, 58, 65, 70, 68, 75].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05 }}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-neon-blue/40 to-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.3)]"
            />
          ))}
        </div>
        <div className="absolute left-6 top-6">
          <span className="text-3xl font-black text-neon-blue">75%</span>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Chance of YES</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-4 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Volume</p>
          <p className="mt-1 text-lg font-bold text-foreground">{market.total_volume.toLocaleString()} TON</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Liquidity</p>
          <p className="mt-1 text-lg font-bold text-neon-purple">85.4K TON</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {market.description || "No description provided for this market."}
        </p>
        <div className="flex items-center gap-2 text-[10px] font-bold text-neon-blue uppercase tracking-widest">
          <Info className="h-3 w-3" />
          Resolution Source: CoinMarketCap / Official Blog
        </div>
      </div>

      <div className="flex flex-col gap-6 pt-4">
        <div className="flex gap-4">
          <Button 
            className="h-16 flex-1 rounded-2xl bg-neon-green/10 text-neon-green border-2 border-neon-green/20 text-lg font-black hover:bg-neon-green/20"
            onClick={() => setBetSide("YES")}
          >
            YES 75%
          </Button>
          <Button 
            className="h-16 flex-1 rounded-2xl bg-red-500/10 text-red-500 border-2 border-red-500/20 text-lg font-black hover:bg-red-500/20"
            onClick={() => setBetSide("NO")}
          >
            NO 25%
          </Button>
        </div>

        <div className="border-t border-white/5 pt-6">
          <div className="flex items-center gap-6 mb-6">
             <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b-2 border-primary pb-2">
                <Activity className="h-4 w-4" /> Activity
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground pb-2">
                <History className="h-4 w-4" /> History
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground pb-2">
                <MessageSquare className="h-4 w-4" /> Discussion
             </div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-800"></div>
                  <div>
                    <p className="text-xs font-bold">UQp3...9k2a</p>
                    <p className="text-[10px] text-muted-foreground">Bought YES shares</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-neon-green">+450 TON</p>
                  <p className="text-[10px] text-muted-foreground">2m ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BetModal 
        isOpen={!!betSide} 
        onClose={() => setBetSide(null)} 
        market={market} 
        side={betSide as "YES" | "NO"} 
      />
    </div>
  );
}
