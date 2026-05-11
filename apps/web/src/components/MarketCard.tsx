"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BettingEngine } from "@/lib/betting-engine";

interface MarketCardProps {
  market: any;
  index?: number;
}

export function MarketCard({ market, index = 0 }: MarketCardProps) {
  const timeLeft = new Date(market.endDate).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  const probs = BettingEngine.getProbabilities({
    yesPool: market.yesPool,
    noPool: market.noPool
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-card/40 p-6 backdrop-blur-xl transition-all hover:border-white/10"
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-neon-blue/10 blur-2xl transition-all group-hover:bg-neon-blue/20"></div>
      
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-neon-purple/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-neon-purple">
            {market.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <Clock className="h-3 w-3" />
            {daysLeft > 0 ? `${daysLeft}d left` : "Ending soon"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-neon-blue uppercase tracking-widest">
          <TrendingUp className="h-3 w-3" />
          {parseFloat(market.totalVolume.toString()).toFixed(2)} TON
        </div>
      </div>

      <Link href={`/market/${market.id}`}>
        <h3 className="mb-6 line-clamp-2 text-lg font-black leading-tight text-foreground transition-colors group-hover:text-primary">
          {market.title}
        </h3>
      </Link>

      <div className="relative mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/5 flex">
        <div 
          className="h-full bg-neon-green shadow-[0_0_10px_rgba(0,255,102,0.5)] transition-all duration-1000" 
          style={{ width: `${probs.yes}%` }}
        />
        <div 
          className="h-full bg-red-500/30 transition-all duration-1000" 
          style={{ width: `${probs.no}%` }}
        />
      </div>

      <div className="flex gap-3">
        <Link href={`/market/${market.id}`} className="flex-1">
          <Button variant="neon" className="w-full bg-neon-green/5 text-neon-green hover:bg-neon-green/10 border-neon-green/20 text-[10px] font-black uppercase tracking-widest h-11">
            YES {probs.yes}%
          </Button>
        </Link>
        <Link href={`/market/${market.id}`} className="flex-1">
          <Button variant="neon" className="w-full bg-red-500/5 text-red-500 hover:bg-red-500/10 border-red-500/20 text-[10px] font-black uppercase tracking-widest h-11">
            NO {probs.no}%
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
