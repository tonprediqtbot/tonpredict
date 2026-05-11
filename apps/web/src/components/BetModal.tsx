"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { BettingEngine } from "@/lib/betting-engine";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toNano } from "@ton/core";

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: {
    id: string;
    title: string;
    yesPool: number | string;
    noPool: number | string;
    liquidity: number | string;
  };
  side: "YES" | "NO";
}

export function BetModal({ isOpen, onClose, market, side }: BetModalProps) {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const queryClient = useQueryClient();

  const shares = useMemo(() => {
    if (!amount || isNaN(parseFloat(amount))) return "0";
    return BettingEngine.calculateShares(amount, side, {
      yesPool: market.yesPool,
      noPool: market.noPool,
      liquidity: market.liquidity
    }).toFixed(2);
  }, [amount, side, market]);

  const handlePlaceBet = async () => {
    if (!tonConnectUI.connected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Send Transaction to TON
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
        messages: [
          {
            address: "UQAnH3L8qF5e-B0E9q_HIoBMDyyK_aYShY0gAM9V2xXyXyXy", // Platform Wallet (Replace with real address)
            amount: toNano(amount).toString(),
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      const txHash = result.boc; // In a real app, you'd calculate the hash from the BOC

      // 2. Notify Backend
      const response = await fetch("/api/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketId: market.id,
          userId: "current-user-id", // Get this from auth/context
          side,
          amount,
          txHash
        }),
      });

      if (!response.ok) throw new Error("Failed to record bet on backend");

      toast.success("Bet placed successfully! 🚀");
      queryClient.invalidateQueries({ queryKey: ["markets"] });
      onClose();
    } catch (error: any) {
      console.error("Bet Error:", error);
      toast.error(error.message || "Failed to place bet");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center p-4">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className="relative w-full max-w-md overflow-hidden rounded-t-[2.5rem] bg-background p-8 border-t border-white/10 sm:rounded-[2.5rem] sm:border"
        >
          <div className="absolute right-6 top-6">
            <button onClick={onClose} className="rounded-full bg-white/5 p-2 text-muted-foreground hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-8">
            <div className={cn(
              "mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
              side === "YES" ? "bg-neon-green/10 text-neon-green" : "bg-red-500/10 text-red-500"
            )}>
              <Zap className="h-3 w-3" />
              Prediction: {side}
            </div>
            <h2 className="text-xl font-bold leading-tight">{market.title}</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount (TON)</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-2xl font-bold focus:border-primary focus:outline-none"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground text-sm tracking-tight">TON</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Estimated Shares</span>
                <span className="font-bold">{shares}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Potential Payout</span>
                <span className="font-bold text-neon-green">{shares} TON</span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-neon-blue/5 p-3 text-[10px] leading-relaxed text-neon-blue/80 font-medium">
              <Info className="h-4 w-4 shrink-0" />
              Once confirmed, your TON will be locked in the smart contract until the market is resolved.
            </div>

            <Button
              size="lg"
              onClick={handlePlaceBet}
              disabled={!amount || isProcessing || parseFloat(amount) <= 0}
              className={cn(
                "w-full rounded-2xl py-8 text-lg font-bold shadow-2xl",
                side === "YES" ? "bg-neon-green hover:bg-neon-green/90 text-black" : "bg-red-500 hover:bg-red-500/90 text-white"
              )}
            >
              {isProcessing ? "Signing Transaction..." : `Confirm ${side} Bet`}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
              <ShieldCheck className="h-3 w-3" />
              Secured by TON Blockchain
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
