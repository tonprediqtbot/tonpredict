"use client";

import { TonConnectButton } from "@tonconnect/ui-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Activity, Trophy, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen p-4 flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-purple/20 via-black to-black -z-10 blur-3xl"></div>
      
      <header className="flex justify-between items-center mb-8 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(157,0,255,0.5)]">
            T
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">TonBet</h1>
        </div>
        <TonConnectButton />
      </header>

      <section className="mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/20 blur-2xl -z-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <h2 className="text-3xl font-bold mb-2">Predict & Win</h2>
          <p className="text-gray-400 mb-6 text-sm">Trade shares on the world's most anticipated events directly from Telegram.</p>
          
          <Link href="/markets" className="block w-full">
            <button className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Explore Markets
            </button>
          </Link>
        </motion.div>
      </section>

      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-neon-blue" />
        Trending Now
      </h3>

      <div className="space-y-4 mb-24">
        {/* Mock Market Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/10 transition cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs font-medium text-neon-purple bg-neon-purple/10 px-2 py-1 rounded-full">Crypto</span>
              <h4 className="font-semibold mt-2 text-sm">Will TON reach $10 before 2025?</h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Vol: 12.5K TON</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 bg-neon-green/10 text-neon-green border border-neon-green/30 py-2 rounded-lg text-sm font-semibold hover:bg-neon-green/20 transition">
              YES 75%
            </button>
            <button className="flex-1 bg-red-500/10 text-red-500 border border-red-500/30 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/20 transition">
              NO 25%
            </button>
          </div>
        </motion.div>

        {/* Mock Market Card 2 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/10 transition cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs font-medium text-neon-blue bg-neon-blue/10 px-2 py-1 rounded-full">Sports</span>
              <h4 className="font-semibold mt-2 text-sm">Who will win the Champions League 2024?</h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Vol: 45.2K TON</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 bg-white/5 border border-white/10 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition">
              View Odds
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 p-4 max-w-md mx-auto z-50">
        <ul className="flex justify-between items-center px-4">
          <li>
            <Link href="/" className="flex flex-col items-center gap-1 text-neon-blue">
              <Activity className="w-5 h-5" />
              <span className="text-[10px] font-medium">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/markets" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition">
              <TrendingUp className="w-5 h-5" />
              <span className="text-[10px] font-medium">Markets</span>
            </Link>
          </li>
          <li>
            <Link href="/leaderboard" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition">
              <Trophy className="w-5 h-5" />
              <span className="text-[10px] font-medium">Rankings</span>
            </Link>
          </li>
          <li>
            <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition">
              <Users className="w-5 h-5" />
              <span className="text-[10px] font-medium">Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
