"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Wallet, Share2, TrendingUp, History, Settings, ExternalLink, Trophy, ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import WebApp from "@twa-dev/sdk";
import { getUserProfile } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTonAddress } from "@tonconnect/ui-react";

export default function ProfilePage() {
  const walletAddress = useTonAddress();
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

  const tgUser = typeof window !== "undefined" ? WebApp.initDataUnsafe?.user : null;

  if (isLoading || !tgId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header Profile */}
      <div className="flex flex-col items-center text-center pt-4">
        <div className="relative mb-4">
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple p-[3px] shadow-[0_0_30px_rgba(157,0,255,0.3)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-background overflow-hidden">
               {tgUser?.photo_url ? (
                 <img src={tgUser.photo_url} alt="Profile" className="h-full w-full object-cover" />
               ) : (
                 <User className="h-10 w-10 text-muted-foreground" />
               )}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 rounded-full bg-neon-green p-1.5 shadow-lg">
            <ShieldCheck className="h-3 w-3 text-black" />
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-tight">{tgUser?.first_name || "Predictor"} {tgUser?.last_name || ""}</h1>
        <p className="text-sm font-bold text-muted-foreground">@{tgUser?.username || "tonbet_user"}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel flex flex-col items-center rounded-3xl p-5 border border-white/5">
          <TrendingUp className="mb-2 h-5 w-5 text-neon-green" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Points</span>
          <p className="mt-1 text-xl font-black text-neon-green">{profile?.points || 0}</p>
        </div>
        <div className="glass-panel flex flex-col items-center rounded-3xl p-5 border border-white/5">
          <Trophy className="mb-2 h-5 w-5 text-neon-blue" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rank</span>
          <p className="mt-1 text-xl font-black text-neon-blue">#1</p>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="rounded-3xl bg-gradient-to-br from-white/10 to-white/5 p-6 border border-white/10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-neon-blue/20 p-2">
              <Wallet className="h-5 w-5 text-neon-blue" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Wallet</p>
              <p className="text-sm font-black">{walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Not Connected"}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/5">
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="neon" 
            className="flex-1 rounded-xl bg-white/5 py-2 text-xs font-bold"
            onClick={() => {
              if (walletAddress) {
                navigator.clipboard.writeText(walletAddress);
                toast.success("Address copied!");
              }
            }}
          >
            Copy Address
          </Button>
        </div>
      </div>

      {/* Referral Section */}
      <div className="glass-panel rounded-3xl p-6 border border-white/5 bg-neon-purple/5">
        <div className="mb-4 flex items-center gap-2">
          <Share2 className="h-5 w-5 text-neon-purple" />
          <h2 className="text-lg font-black tracking-tight">Refer & Earn</h2>
        </div>
        <p className="mb-6 text-sm text-muted-foreground leading-relaxed font-medium">
          Invite friends and climb the Hall of Fame. Exclusive TON rewards for top referrers.
        </p>
        <div className="flex items-center gap-2 rounded-2xl bg-black/40 p-2 border border-white/5">
          <code className="flex-1 px-3 text-xs font-bold text-neon-purple uppercase tracking-widest">
            {profile?.referral_code || "GENERATE"}
          </code>
          <Button 
            className="rounded-xl px-6 font-black"
            onClick={() => {
              const link = `https://t.me/${process.env.NEXT_PUBLIC_BOT_NAME}?start=${profile?.referral_code}`;
              navigator.clipboard.writeText(link);
              toast.success("Invite link copied!");
            }}
          >
            COPY
          </Button>
        </div>
      </div>

      {/* Navigation List */}
      <div className="space-y-2">
        <button className="flex w-full items-center justify-between rounded-2xl bg-white/5 p-4 hover:bg-white/10 transition">
          <div className="flex items-center gap-4">
            <History className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-bold">Trade History</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="pt-4 text-center">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-30">TonBet v1.0.0 Production</p>
      </div>
    </div>
  );
}
