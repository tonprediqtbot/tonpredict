"use client";

import { motion } from "framer-motion";
import { Share2, Users, Gift, DollarSign, ArrowRight, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Invited</p>
          <p className="mt-1 text-2xl font-black text-foreground">124</p>
        </div>
        <div className="glass-panel flex flex-col items-center rounded-3xl p-6 border border-white/5">
          <DollarSign className="mb-2 h-6 w-6 text-neon-green" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Earned</p>
          <p className="mt-1 text-2xl font-black text-neon-green">450.5</p>
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
              <code className="flex-1 px-3 text-xs font-bold truncate text-neon-purple">t.me/tonbet_bot?start=TON8822</code>
              <Button 
                onClick={handleCopy}
                className={`rounded-xl px-4 transition-all ${copied ? 'bg-neon-green text-black' : 'bg-primary'}`}
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button className="w-full rounded-2xl py-8 text-lg font-black shadow-2xl shadow-primary/20 gap-2">
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
            { step: 3, text: "You get 5% of their fees INSTANTLY." },
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

      {/* Top Referrers Preview */}
      <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-sm font-black tracking-tight">Top Referrers</h3>
           <span className="text-[10px] font-bold text-primary uppercase tracking-widest">View All</span>
        </div>
        <div className="space-y-3">
           {[
             { name: "AlphaInvites", earned: "4,250 TON" },
             { name: "TelegramPromo", earned: "3,100 TON" },
           ].map((ref, i) => (
             <div key={i} className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">{ref.name}</span>
                <span className="text-xs font-black text-neon-green">{ref.earned}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="text-center pb-10">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-20">Rewards are distributed on-chain</p>
      </div>
    </div>
  );
}
