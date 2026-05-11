"use client";

import { motion } from "framer-motion";
import { Users, Gift, DollarSign, ArrowRight, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/actions";
import WebApp from "@twa-dev/sdk";
import { toast } from "sonner";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
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

  const referralCode = profile?.referral_code || "INVITE";
  const referralLink = `https://t.me/${process.env.NEXT_PUBLIC_BOT_NAME}?start=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = encodeURIComponent(`🚀 Join me on TonBet! Predict world events and win TON. Start with bonus points using my link!`);
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`;
    WebApp.openTelegramLink(url);
  };

  if (isLoading || !tgId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="pt-4">
        <h1 className="text-3xl font-black tracking-tight">Referrals</h1>
        <p className="text-sm text-muted-foreground font-medium mt-1">Earn 5% of trading fees from everyone you invite.</p>
      </div>

      {/* Referral Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel flex flex-col items-center rounded-3xl p-6 border border-white/5">
          <Users className="mb-2 h-6 w-6 text-neon-blue" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Friends Invited</p>
          <p className="mt-1 text-2xl font-black text-foreground">{profile?._count.referrals || 0}</p>
        </div>
        <div className="glass-panel flex flex-col items-center rounded-3xl p-6 border border-white/5">
          <DollarSign className="mb-2 h-6 w-6 text-neon-green" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ref Points</p>
          <p className="mt-1 text-2xl font-black text-neon-green">{(profile?._count.referrals || 0) * 100}</p>
        </div>
      </div>

      {/* Main Referral Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-neon-purple/20 via-background to-primary/10 p-8 border border-white/10">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-neon-purple/20 blur-3xl"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neon-purple/20 shadow-[0_0_20px_rgba(157,0,255,0.3)]">
            <Gift className="h-6 w-6 text-neon-purple" />
          </div>
          
          <h2 className="text-2xl font-black leading-tight">Invite Friends. <br /> Earn Together.</h2>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Your Referral Link</label>
            <div className="flex items-center gap-2 rounded-2xl bg-black/40 p-2 border border-white/5">
              <code className="flex-1 px-3 text-xs font-bold truncate text-neon-purple">t.me/bot?start={referralCode}</code>
              <Button 
                onClick={handleCopy}
                className={`rounded-xl px-4 transition-all ${copied ? 'bg-neon-green text-black' : 'bg-primary'}`}
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleShare}
            className="w-full rounded-2xl py-8 text-lg font-black shadow-2xl shadow-primary/20 gap-2"
          >
            SHARE ON TELEGRAM <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-4">
        <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">How it works</h3>
        <div className="space-y-3">
          {[
            { step: 1, text: "Share your unique referral link." },
            { step: 2, text: "Friends join and trade on TonBet." },
            { step: 3, text: "You get bonus points for every active friend." },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-black text-primary">
                {item.step}
              </div>
              <p className="text-sm font-bold text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pb-10">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-20">Rewards are distributed based on community engagement</p>
      </div>
    </div>
  );
}
