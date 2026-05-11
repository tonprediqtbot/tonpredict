"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, TrendingUp, Search } from "lucide-react";
import { getMarkets } from "@/lib/actions";

export default function MarketsPage() {
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getMarkets();
      if (res.success) {
        setMarkets(res.data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="min-h-screen p-4 pb-24 flex flex-col max-w-md mx-auto relative">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <Link href="/" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">All Markets</h1>
      </header>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search markets..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-neon-blue/50 transition"
        />
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : markets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
          <TrendingUp className="w-12 h-12 opacity-20" />
          <p>No active markets found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {markets.map((market, i) => (
            <motion.div 
              key={market.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/10 transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-neon-blue bg-neon-blue/10 px-2 py-1 rounded-md">
                    {market.category}
                  </span>
                  <h4 className="font-semibold mt-2 text-sm leading-relaxed">{market.title}</h4>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-neon-green/10 text-neon-green border border-neon-green/20 py-2.5 rounded-lg text-xs font-bold hover:bg-neon-green/20 transition uppercase tracking-tight">
                  Bet Yes
                </button>
                <button className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 py-2.5 rounded-lg text-xs font-bold hover:bg-red-500/20 transition uppercase tracking-tight">
                  Bet No
                </button>
              </div>
              
              <div className="mt-3 flex justify-between items-center text-[10px] text-gray-500 font-medium">
                <span>Ends {new Date(market.end_time).toLocaleDateString()}</span>
                <span>{market.total_volume} TON Volume</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
