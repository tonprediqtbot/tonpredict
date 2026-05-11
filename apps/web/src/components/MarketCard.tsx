"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MarketCardProps {
  market: {
    id: string;
    title: string;
    category: string;
    total_volume: number;
    end_time: Date;
    image_url?: string;
  };
  index?: number;
}

export function MarketCard({ market, index = 0 }: MarketCardProps) {
  const timeLeft = new Date(market.end_time).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-3xl border border-white/5 bg-card/40 p-5 backdrop-blur-xl transition-all hover:border-white/10"
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-neon-blue/10 blur-2xl transition-all group-hover:bg-neon-blue/20"></div>
      
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-neon-purple/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon-purple">
            {market.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
            <Clock className="h-3 w-3" />
            {daysLeft > 0 ? `${daysLeft}d left` : "Ending soon"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold text-neon-blue">
          <TrendingUp className="h-3 w-3" />
          {market.total_volume.toLocaleString()} TON
        </div>
      </div>

      <Link href={`/market/${market.id}`}>
        <h3 className="mb-6 line-clamp-2 text-base font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
          {market.title}
        </h3>
      </Link>

      <div className="relative mb-6 h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div className="absolute left-0 h-full w-[65%] bg-neon-green shadow-[0_0_10px_rgba(0,255,102,0.5)]"></div>
        <div className="absolute right-0 h-full w-[35%] bg-red-500/30"></div>
      </div>

      <div className="flex gap-3">
        <Button variant="neon" className="flex-1 bg-neon-green/5 text-neon-green hover:bg-neon-green/10 border-neon-green/20">
          YES 65%
        </Button>
        <Button variant="neon" className="flex-1 bg-red-500/5 text-red-500 hover:bg-red-500/10 border-red-500/20">
          NO 35%
        </Button>
      </div>
    </motion.div>
  );
}
