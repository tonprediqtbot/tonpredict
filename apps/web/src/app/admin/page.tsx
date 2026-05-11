"use client";

import { useState } from "react";
import { ShieldCheck, Database, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMarkets } from "@/lib/actions";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("markets");
  const queryClient = useQueryClient();

  const { data: markets, isLoading } = useQuery({
    queryKey: ["admin_markets"],
    queryFn: async () => {
      const res = await getMarkets();
      return res.data || [];
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ marketId, outcome }: { marketId: string, outcome: string }) => {
      const response = await fetch("/api/market/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketId,
          outcome,
          adminId: "platform-admin", // Replace with real admin session
          evidenceUrl: "https://tonbet.app/resolution-evidence"
        }),
      });
      if (!response.ok) throw new Error("Failed to resolve market");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Market resolved successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin_markets"] });
    },
    onError: (err: any) => {
      toast.error(err.message);
    }
  });

  if (isLoading) return <div className="p-10 text-center">Loading Console...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2 text-neon-green">
            <ShieldCheck className="h-8 w-8" />
            Admin Console
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">Manage markets and platform health.</p>
        </div>
      </div>

      {/* Admin Nav */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-2">
        <button 
          onClick={() => setActiveTab("markets")}
          className={`text-sm font-bold pb-2 transition-colors ${activeTab === 'markets' ? 'text-neon-green border-b-2 border-neon-green' : 'text-muted-foreground'}`}
        >
          MARKETS
        </button>
      </div>

      {/* Pending Resolutions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <Database className="h-5 w-5 text-neon-green" />
            Active Markets
          </h2>
          <span className="rounded-full bg-neon-green/20 px-3 py-1 text-[10px] font-black text-neon-green uppercase tracking-widest">{markets?.length} Active</span>
        </div>

        <div className="space-y-3">
          {markets?.map((market: any) => (
            <div key={market.id} className="rounded-3xl border border-white/5 bg-white/5 p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{market.category}</span>
                  <h3 className="text-sm font-bold mt-1">{market.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Volume</span>
                  <p className="text-sm font-black">{parseFloat(market.totalVolume).toFixed(2)} TON</p>
                </div>
              </div>
              <div className="flex gap-3">
                 <Button 
                    onClick={() => resolveMutation.mutate({ marketId: market.id, outcome: "YES" })}
                    disabled={resolveMutation.isPending}
                    className="flex-1 rounded-xl bg-neon-green text-black hover:bg-neon-green/90 font-black text-xs h-10"
                 >
                  RESOLVE YES
                 </Button>
                 <Button 
                    onClick={() => resolveMutation.mutate({ marketId: market.id, outcome: "NO" })}
                    disabled={resolveMutation.isPending}
                    className="flex-1 rounded-xl bg-red-500 text-white hover:bg-red-500/90 font-black text-xs h-10"
                 >
                  RESOLVE NO
                 </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Alerts */}
      <div className="rounded-3xl border border-amber-500/10 bg-amber-500/5 p-6">
        <div className="flex items-center gap-2 mb-4 text-amber-500">
           <AlertCircle className="h-5 w-5" />
           <h3 className="text-sm font-black tracking-tight">Security Alerts</h3>
        </div>
        <p className="text-xs text-muted-foreground font-medium">All platform operations are currently normal.</p>
      </div>
    </div>
  );
}
