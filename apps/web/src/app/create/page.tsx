"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Image as ImageIcon, Calendar, Info, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateMarketPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "crypto",
    endTime: "",
    resolutionSource: "",
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="space-y-8 pb-10">
      <div className="pt-4">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-neon-blue" />
          Propose Market
        </h1>
        <p className="text-sm text-muted-foreground font-medium mt-1">Create a new prediction market for the community.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              step >= s ? "bg-primary shadow-[0_0_10px_rgba(157,0,255,0.5)]" : "bg-white/5"
            }`}
          />
        ))}
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-white/5">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold">Market Basics</h2>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Market Question</label>
              <input 
                type="text" 
                placeholder="e.g. Will Bitcoin hit $100k?"
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm focus:border-neon-blue focus:outline-none transition"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
              <select className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm focus:border-neon-blue focus:outline-none transition">
                <option value="crypto">Crypto</option>
                <option value="sports">Sports</option>
                <option value="politics">Politics</option>
                <option value="tech">Tech</option>
              </select>
            </div>
            <Button className="w-full rounded-2xl py-7 font-black text-lg" onClick={nextStep}>CONTINUE</Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold">Details & Resolution</h2>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Resolution Source</label>
              <input 
                type="text" 
                placeholder="e.g. CoinMarketCap Price"
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm focus:border-neon-blue focus:outline-none transition"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="date" 
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm focus:border-neon-blue focus:outline-none transition"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="neon" className="flex-1 rounded-2xl py-7 font-black" onClick={prevStep}>BACK</Button>
              <Button className="flex-[2] rounded-2xl py-7 font-black text-lg" onClick={nextStep}>PREVIEW</Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center">
             <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neon-green/10 text-neon-green mb-4">
                <PlusCircle className="h-10 w-10" />
             </div>
             <h2 className="text-2xl font-black">Ready to Submit?</h2>
             <p className="text-sm text-muted-foreground leading-relaxed">
               Your market will be reviewed by the TonBet DAO within 24 hours. A small listing fee of 1 TON is required.
             </p>
             
             <div className="rounded-2xl bg-white/5 p-6 text-left space-y-4 border border-white/5">
                <div className="flex justify-between border-b border-white/5 pb-2">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">Listing Fee</span>
                   <span className="text-xs font-black">1.00 TON</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">Security Deposit</span>
                   <span className="text-xs font-black">Refined on Approval</span>
                </div>
             </div>

             <div className="flex gap-4 pt-4">
              <Button variant="neon" className="flex-1 rounded-2xl py-7 font-black" onClick={prevStep}>EDIT</Button>
              <Button className="flex-[2] rounded-2xl py-7 font-black text-lg bg-neon-green text-black hover:bg-neon-green/90">SUBMIT MARKET</Button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-3xl bg-amber-500/5 p-6 text-xs leading-relaxed text-amber-500/80 border border-amber-500/10 font-medium">
        <ShieldAlert className="h-5 w-5 shrink-0" />
        Important: Misleading markets or markets with invalid resolution sources will be rejected and the listing fee will not be refunded.
      </div>
    </div>
  );
}
