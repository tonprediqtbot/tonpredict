"use client";

import { motion } from "framer-motion";
import { PieChart, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/actions";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";

export default function PortfolioPage() {
  const [tgId, setTgId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && WebApp.initDataUnsafe?.user) {
      setTgId(WebApp.initDataUnsafe.user.id.toString());
    }
  }, []);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", tgId],
    queryFn: async () => {
      if (!tgId) return null;
      const res = await getUserProfile(tgId);
      return res.data || null;
    },
    enabled: !!tgId,
  });

  if (isLoading || !tgId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const positions = profile?.positions || [];
  const totalValue = positions.reduce((acc: number, pos: any) => acc + (parseFloat(pos.shares.toString()) * parseFloat(pos.avgPrice.toString())), 0);

  return (
    <div className="space-y-8">
      <div className="pt-4">
        <h1 className="text-3xl font-black tracking-tight">Portfolio</h1>
        <p className="text-sm text-muted-foreground font-medium mt-1">Manage your positions and claim winnings.</p>
      </div>

      {/* Portfolio Balance Card */}
      <div className="rounded-[2.5rem] bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,243,255,0.1)]">
        <div className="flex items-center justify-between mb-8">
           <div className="rounded-2xl bg-white/10 p-3">
              <PieChart className="h-6 w-6 text-white" />
           </div>
           <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
            {profile?.username || "Predictor"}
           </span>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Est. Portfolio Value</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black text-white">{totalValue.toFixed(2)}</h2>
            <span className="text-lg font-bold text-white/80">TON</span>
          </div>
        </div>
        <div className="mt-8 flex gap-4">
           <div className="flex-1 rounded-2xl bg-white/10 p-4 border border-white/10">
              <span className="block text-[10px] font-bold text-white/50 uppercase tracking-widest">Active Bets</span>
              <span className="text-lg font-black text-white">{positions.length}</span>
           </div>
           <div className="flex-1 rounded-2xl bg-white/10 p-4 border border-white/10">
              <span className="block text-[10px] font-bold text-white/50 uppercase tracking-widest">Points</span>
              <div className="flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4 text-neon-green" />
                <span className="text-lg font-black text-neon-green">{profile?.points || 0}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Tabs for Positions */}
      <div className="flex items-center gap-6 border-b border-white/5 pb-2">
        <button className="text-sm font-bold text-foreground border-b-2 border-primary pb-2">OPEN POSITIONS</button>
        <button className="text-sm font-bold text-muted-foreground pb-2">HISTORY</button>
      </div>

      {/* Active Positions List */}
      <div className="space-y-4">
        {positions.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-muted-foreground font-medium">No active positions yet.</p>
            <Button variant="outline" className="rounded-xl px-8" onClick={() => window.location.href = "/"}>Start Trading</Button>
          </div>
        ) : (
          positions.map((pos: any, i: number) => (
            <motion.div
              key={pos.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-3xl p-5 border border-white/5 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-black ${
                  pos.side === "YES" ? "bg-neon-green/10 text-neon-green" : "bg-red-500/10 text-red-500"
                }`}>
                  {pos.side}
                </div>
                <div>
                  <h4 className="text-sm font-bold truncate max-w-[150px]">{pos.market.title}</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{parseFloat(pos.shares.toString()).toFixed(2)} Shares</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-white">
                  Avg: {parseFloat(pos.avgPrice.toString()).toFixed(2)}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                   <Clock className="h-3 w-3 text-muted-foreground" />
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Settled & Claimable (Phase 7 Integration) */}
      <div className="rounded-3xl bg-neon-purple/5 p-6 border border-neon-purple/10">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-neon-purple" />
              <h3 className="text-lg font-black tracking-tight">Claim Center</h3>
           </div>
        </div>
        
        <p className="text-xs text-muted-foreground mb-6 font-medium">When a market is resolved, your winnings will appear here for claiming back to your TON wallet.</p>

        <Button disabled className="w-full rounded-2xl py-7 font-black text-lg bg-white/5 text-muted-foreground border border-white/5 shadow-none">
          NO PENDING CLAIMS
        </Button>
      </div>
    </div>
  );
}
