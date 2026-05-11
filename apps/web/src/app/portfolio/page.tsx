"use client";

import { motion } from "framer-motion";
import { PieChart, Wallet, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PortfolioPage() {
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
           <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">Active Status</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Total Value</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black text-white">4,850.20</h2>
            <span className="text-lg font-bold text-white/80">TON</span>
          </div>
        </div>
        <div className="mt-8 flex gap-4">
           <div className="flex-1 rounded-2xl bg-white/10 p-4 border border-white/10">
              <span className="block text-[10px] font-bold text-white/50 uppercase tracking-widest">Open Positions</span>
              <span className="text-lg font-black text-white">12</span>
           </div>
           <div className="flex-1 rounded-2xl bg-white/10 p-4 border border-white/10">
              <span className="block text-[10px] font-bold text-white/50 uppercase tracking-widest">Net Profit</span>
              <div className="flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4 text-neon-green" />
                <span className="text-lg font-black text-neon-green">+1.4K</span>
              </div>
           </div>
        </div>
      </div>

      {/* Tabs for Positions */}
      <div className="flex items-center gap-6 border-b border-white/5 pb-2">
        <button className="text-sm font-bold text-foreground border-b-2 border-primary pb-2">OPEN BETS</button>
        <button className="text-sm font-bold text-muted-foreground pb-2">HISTORY</button>
        <button className="text-sm font-bold text-muted-foreground pb-2">CLAIMS</button>
      </div>

      {/* Active Positions List */}
      <div className="space-y-4">
        {[
          { title: "TON to reach $10", side: "YES", amount: "500 TON", value: "+120 TON", status: "Active" },
          { title: "BTC New ATH in Q2", side: "YES", amount: "1,200 TON", value: "-45 TON", status: "Pending" }
        ].map((bet, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel rounded-3xl p-5 border border-white/5 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-black ${
                bet.side === "YES" ? "bg-neon-green/10 text-neon-green" : "bg-red-500/10 text-red-500"
              }`}>
                {bet.side}
              </div>
              <div>
                <h4 className="text-sm font-bold truncate max-w-[150px]">{bet.title}</h4>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{bet.amount} Initial</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-black ${bet.value.startsWith('+') ? 'text-neon-green' : 'text-red-500'}`}>
                {bet.value}
              </p>
              <div className="flex items-center justify-end gap-1 mt-1">
                 <Clock className="h-3 w-3 text-muted-foreground" />
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{bet.status}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Settled & Claimable */}
      <div className="rounded-3xl bg-neon-purple/5 p-6 border border-neon-purple/10">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-neon-purple" />
              <h3 className="text-lg font-black tracking-tight">Ready to Claim</h3>
           </div>
           <span className="text-xs font-black text-neon-purple tracking-widest uppercase">2 Won</span>
        </div>
        
        <div className="space-y-3 mb-6">
           <div className="flex justify-between items-center bg-black/20 rounded-2xl p-4 border border-white/5">
              <span className="text-xs font-bold truncate max-w-[150px]">Premier League Winner</span>
              <span className="text-xs font-black text-neon-green">+850.00 TON</span>
           </div>
        </div>

        <Button className="w-full rounded-2xl py-7 font-black text-lg bg-neon-purple hover:bg-neon-purple/90 shadow-xl shadow-neon-purple/20">
          CLAIM ALL WINNINGS
        </Button>
      </div>
    </div>
  );
}
