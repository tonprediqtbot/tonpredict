"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, TrendingUp, Search } from "lucide-react";
import { getMarkets } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { BettingEngine } from "@/lib/betting-engine";

export default function MarketsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data: markets, isLoading } = useQuery({
    queryKey: ["markets", category],
    queryFn: async () => {
      const res = await getMarkets(category);
      return res.data || [];
    },
  });

  const filteredMarkets = useMemo(() => {
    if (!markets) return [];
    return markets.filter((m: any) => 
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [markets, search]);

  const categories = ["all", "crypto", "sports", "politics", "tech"];

  return (
    <main className="min-h-screen p-4 pb-24 flex flex-col max-w-md mx-auto relative">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <Link href="/" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">All Markets</h1>
      </header>

      {/* Search & Categories */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search markets..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-neon-blue/50 transition"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                category === cat 
                  ? "bg-primary text-white shadow-[0_0_10px_rgba(157,0,255,0.4)]" 
                  : "bg-white/5 text-muted-foreground border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredMarkets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
          <TrendingUp className="w-12 h-12 opacity-20" />
          <p>No active markets found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMarkets.map((market: any, i: number) => {
            const probs = BettingEngine.getProbabilities({
              yesPool: market.yesPool,
              noPool: market.noPool
            });

            return (
              <Link href={`/market/${market.id}`} key={market.id}>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel p-5 rounded-3xl border border-white/5 hover:border-white/10 transition mb-4 active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-black text-neon-blue bg-neon-blue/10 px-2 py-1 rounded-md">
                        {market.category}
                      </span>
                      <h4 className="font-bold mt-3 text-base leading-tight">{market.title}</h4>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        <span>Yes {probs.yes}%</span>
                        <span>No {probs.no}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                        <div className="h-full bg-neon-green" style={{ width: `${probs.yes}%` }} />
                        <div className="h-full bg-red-500" style={{ width: `${probs.no}%` }} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest border-t border-white/5 pt-4">
                    <span>Ends {new Date(market.endDate).toLocaleDateString()}</span>
                    <span className="text-white">{parseFloat(market.totalVolume).toFixed(2)} TON Volume</span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
