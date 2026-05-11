"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, TrendingUp, Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const leaderboardData = [
  { rank: 1, name: "CryptoKing", pnl: "+12,450.50", volume: "450K", avatar: "👑" },
  { rank: 2, name: "TonMaster", pnl: "+8,120.00", volume: "320K", avatar: "🥈" },
  { rank: 3, name: "PavelProphet", pnl: "+5,400.20", volume: "210K", avatar: "🥉" },
  { rank: 4, name: "Web3Whale", pnl: "+3,200.00", volume: "180K", avatar: "🐋" },
  { rank: 5, name: "BetRunner", pnl: "+2,100.00", volume: "95K", avatar: "🏃" },
  { rank: 6, name: "TonWiz", pnl: "+1,850.00", volume: "82K", avatar: "🧙" },
  { rank: 7, name: "AlphaTrader", pnl: "+1,200.00", volume: "65K", avatar: "🐺" },
];

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <div className="text-center pt-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neon-purple/20 shadow-[0_0_20px_rgba(157,0,255,0.3)]">
          <Trophy className="h-8 w-8 text-neon-purple" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Hall of Fame</h1>
        <p className="text-sm text-muted-foreground font-medium mt-1">Top traders by total Profit & Loss</p>
      </div>

      {/* Podium for Top 3 */}
      <div className="flex items-end justify-center gap-2 pt-6">
        {/* 2nd Place */}
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-white/5 border-2 border-slate-400 p-1 mb-2">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-400/20 text-2xl font-bold">
              {leaderboardData[1].avatar}
            </div>
          </div>
          <div className="h-20 w-24 rounded-t-2xl bg-slate-400/20 flex flex-col items-center justify-center border-x border-t border-slate-400/30">
            <span className="text-[10px] font-black uppercase text-slate-400">#2</span>
            <span className="text-[10px] font-bold truncate max-w-[80px]">{leaderboardData[1].name}</span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center">
          <Crown className="h-6 w-6 text-yellow-500 mb-1 animate-bounce" />
          <div className="h-20 w-20 rounded-full bg-yellow-500/10 border-2 border-yellow-500 p-1 mb-2 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-yellow-500/20 text-3xl font-bold">
              {leaderboardData[0].avatar}
            </div>
          </div>
          <div className="h-28 w-28 rounded-t-2xl bg-yellow-500/10 flex flex-col items-center justify-center border-x border-t border-yellow-500/30">
            <span className="text-[10px] font-black uppercase text-yellow-500">#1</span>
            <span className="text-[10px] font-bold truncate max-w-[100px]">{leaderboardData[0].name}</span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 rounded-full bg-white/5 border-2 border-amber-700 p-1 mb-2">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-amber-700/20 text-2xl font-bold">
              {leaderboardData[2].avatar}
            </div>
          </div>
          <div className="h-16 w-24 rounded-t-2xl bg-amber-700/20 flex flex-col items-center justify-center border-x border-t border-amber-700/30">
            <span className="text-[10px] font-black uppercase text-amber-700">#3</span>
            <span className="text-[10px] font-bold truncate max-w-[80px]">{leaderboardData[2].name}</span>
          </div>
        </div>
      </div>

      {/* Main Leaderboard List */}
      <div className="space-y-3">
        {leaderboardData.map((user, i) => (
          <motion.div
            key={user.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/5"
          >
            <div className="flex items-center gap-4">
              <span className="w-4 text-xs font-black text-muted-foreground">#{user.rank}</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-xl">
                {user.avatar}
              </div>
              <div>
                <p className="text-sm font-bold">{user.name}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Vol: {user.volume} TON</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-neon-green">{user.pnl} TON</p>
              <div className="flex items-center justify-end gap-1">
                 <div className="h-1 w-1 rounded-full bg-neon-green"></div>
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-3xl bg-primary/10 p-6 text-center border border-primary/20">
        <p className="mb-4 text-sm font-bold leading-relaxed">You are currently ranked <span className="text-primary">#1,245</span></p>
        <Button className="w-full rounded-2xl py-6 font-black shadow-lg">BOOST MY RANK</Button>
      </div>
    </div>
  );
}
