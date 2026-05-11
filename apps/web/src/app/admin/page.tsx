"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Database, LayoutDashboard, BarChart3, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("markets");

  const stats = [
    { label: "Total TVL", value: "4.2M TON", trend: "+12%" },
    { label: "Daily Revenue", value: "12.5K TON", trend: "+5%" },
    { label: "New Users", value: "1.2K", trend: "+18%" },
  ];

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

      {/* Global Admin Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel rounded-2xl p-4 border border-neon-green/10 bg-neon-green/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
            <p className="mt-1 text-sm font-black text-foreground">{stat.value}</p>
            <span className="text-[10px] font-bold text-neon-green">{stat.trend}</span>
          </div>
        ))}
      </div>

      {/* Admin Nav */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-2">
        <button 
          onClick={() => setActiveTab("markets")}
          className={`text-sm font-bold pb-2 transition-colors ${activeTab === 'markets' ? 'text-neon-green border-b-2 border-neon-green' : 'text-muted-foreground'}`}
        >
          MARKETS
        </button>
        <button 
          onClick={() => setActiveTab("users")}
          className={`text-sm font-bold pb-2 transition-colors ${activeTab === 'users' ? 'text-neon-green border-b-2 border-neon-green' : 'text-muted-foreground'}`}
        >
          USERS
        </button>
        <button 
          onClick={() => setActiveTab("security")}
          className={`text-sm font-bold pb-2 transition-colors ${activeTab === 'security' ? 'text-neon-green border-b-2 border-neon-green' : 'text-muted-foreground'}`}
        >
          SECURITY
        </button>
      </div>

      {/* Pending Resolutions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <Database className="h-5 w-5 text-neon-green" />
            Pending Resolutions
          </h2>
          <span className="rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-black text-red-500 uppercase tracking-widest">3 Urgent</span>
        </div>

        <div className="space-y-3">
          {[
            { title: "TON to reach $10", category: "Crypto", volume: "1.2M TON" },
            { title: "Champions League Winner", category: "Sports", volume: "850K TON" },
          ].map((market, i) => (
            <div key={i} className="rounded-3xl border border-white/5 bg-white/5 p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{market.category}</span>
                  <h3 className="text-sm font-bold mt-1">{market.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Volume</span>
                  <p className="text-sm font-black">{market.volume}</p>
                </div>
              </div>
              <div className="flex gap-3">
                 <Button className="flex-1 rounded-xl bg-neon-green text-black hover:bg-neon-green/90 font-black text-xs h-10">RESOLVE YES</Button>
                 <Button className="flex-1 rounded-xl bg-red-500 text-white hover:bg-red-500/90 font-black text-xs h-10">RESOLVE NO</Button>
                 <Button variant="ghost" className="flex-1 rounded-xl bg-white/5 font-black text-xs h-10">CANCEL</Button>
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
        <div className="space-y-2">
           <div className="flex items-center justify-between text-xs font-medium py-2 border-b border-white/5">
              <span className="text-muted-foreground">High volume from single user</span>
              <span className="text-amber-500">Review</span>
           </div>
           <div className="flex items-center justify-between text-xs font-medium py-2">
              <span className="text-muted-foreground">Multiple accounts same IP</span>
              <span className="text-amber-500">Review</span>
           </div>
        </div>
      </div>
    </div>
  );
}
