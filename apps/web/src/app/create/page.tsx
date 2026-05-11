"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Calendar, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createMarket } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import WebApp from "@twa-dev/sdk";

export default function CreateMarketPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [tgId, setTgId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && WebApp.initDataUnsafe?.user) {
      setTgId(WebApp.initDataUnsafe.user.id.toString());
    }
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "crypto",
    endDate: "",
    resolutionSource: "",
    initialLiquidity: "10",
  });

  const handleSubmit = async () => {
    if (!tgId) {
      toast.error("Please launch from Telegram");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createMarket({
        ...formData,
        creatorId: tgId,
      });

      if (res.success) {
        toast.success("Market proposed successfully! 🚀");
        router.push("/markets");
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create market");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Will Bitcoin hit $100k?"
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm focus:border-neon-blue focus:outline-none transition"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Details about the market..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm focus:border-neon-blue focus:outline-none transition min-h-[100px]"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm focus:border-neon-blue focus:outline-none transition"
              >
                <option value="crypto">Crypto</option>
                <option value="sports">Sports</option>
                <option value="politics">Politics</option>
                <option value="tech">Tech</option>
              </select>
            </div>
            <Button className="w-full rounded-2xl py-7 font-black text-lg" onClick={nextStep} disabled={!formData.title}>CONTINUE</Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold">Details & Resolution</h2>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Resolution Source</label>
              <input 
                type="text" 
                value={formData.resolutionSource}
                onChange={(e) => setFormData({...formData, resolutionSource: e.target.value})}
                placeholder="e.g. CoinMarketCap Price"
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm focus:border-neon-blue focus:outline-none transition"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Initial Liquidity (TON)</label>
              <input 
                type="number" 
                value={formData.initialLiquidity}
                onChange={(e) => setFormData({...formData, initialLiquidity: e.target.value})}
                placeholder="10"
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm focus:border-neon-blue focus:outline-none transition"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="date" 
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm focus:border-neon-blue focus:outline-none transition"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="neon" className="flex-1 rounded-2xl py-7 font-black" onClick={prevStep}>BACK</Button>
              <Button className="flex-[2] rounded-2xl py-7 font-black text-lg" onClick={nextStep} disabled={!formData.endDate}>PREVIEW</Button>
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
               Your market will be live instantly. Initial liquidity provides the base for community trading.
             </p>
             
             <div className="rounded-2xl bg-white/5 p-6 text-left space-y-4 border border-white/5">
                <div className="flex justify-between border-b border-white/5 pb-2">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">Initial Liquidity</span>
                   <span className="text-xs font-black">{formData.initialLiquidity} TON</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">Status</span>
                   <span className="text-xs font-black text-neon-green">Ready</span>
                </div>
             </div>

             <div className="flex gap-4 pt-4">
              <Button variant="neon" className="flex-1 rounded-2xl py-7 font-black" onClick={prevStep}>EDIT</Button>
              <Button 
                className="flex-[2] rounded-2xl py-7 font-black text-lg bg-neon-green text-black hover:bg-neon-green/90"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "SUBMIT MARKET"}
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-3xl bg-amber-500/5 p-6 text-xs leading-relaxed text-amber-500/80 border border-amber-500/10 font-medium">
        <ShieldAlert className="h-5 w-5 shrink-0" />
        Important: Misleading markets or markets with invalid resolution sources will be penalized by the DAO.
      </div>
    </div>
  );
}
