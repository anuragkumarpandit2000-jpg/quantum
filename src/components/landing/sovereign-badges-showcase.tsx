"use client";

import React, { useState } from "react";
import { Crown, Gem, Flame, Shield, Sparkles, ShieldAlert, Award, ArrowUpRight, FlameKindling, Info } from "lucide-react";
import { QuantumSovereignBadge } from "@/components/ui/quantum-sovereign-badge";
import { SOVEREIGN_BADGES, SovereignBadge } from "@/lib/badges";
import { QuantumTiltCard } from "@/components/ui/quantum-tilt-card";

export const SovereignBadgesShowcase: React.FC = () => {
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);

  const badgeOrder: Array<"admin-prime" | "level-10-mythic" | "level-9-titan" | "level-5-centurion"> = [
    "admin-prime",
    "level-10-mythic",
    "level-9-titan",
    "level-5-centurion",
  ];

  return (
    <section id="sovereign-badges" className="py-28 px-6 relative border-t border-slate-900/60 bg-transparent overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-sky-500/15 border border-amber-400/40 text-amber-300 font-mono text-xs tracking-[0.25em] uppercase shadow-[0_0_20px_rgba(251,191,36,0.25)]">
            <Sparkles size={13} className="text-amber-400 animate-pulse" />
            <span>SOVEREIGN SCARCITY HIERARCHY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            IMMUTABLE PROOF OF{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-400 to-sky-400">
              SUPREMACY
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
            In Quantum, prestige is strictly finite. Badges cannot be bought, gifted, or inflated. They are minted in limited cohorts for the earliest and most disciplined challengers who break physical and mental friction.
          </p>
        </div>

        {/* Live Scarcity Ledger Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center">
          <div className="space-y-1 border-r border-white/10 last:border-none pr-2">
            <div className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">ADMIN FOUNDER</div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              1 OF 1 UNIQUE
            </div>
            <div className="text-[10px] text-slate-400">EXCLUSIVELY ALLOCATED</div>
          </div>

          <div className="space-y-1 border-r border-white/10 last:border-none pr-2">
            <div className="text-[10px] text-yellow-400 font-bold tracking-widest uppercase">LEVEL 10 MYTHIC</div>
            <div className="text-xl sm:text-2xl font-black text-yellow-300 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">
              FIRST 10 PLAYERS
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              10 SLOTS REMAINING
            </div>
          </div>

          <div className="space-y-1 border-r border-white/10 last:border-none pr-2">
            <div className="text-[10px] text-fuchsia-400 font-bold tracking-widest uppercase">LEVEL 9 TITAN</div>
            <div className="text-xl sm:text-2xl font-black text-fuchsia-300 drop-shadow-[0_0_15px_rgba(217,70,239,0.4)]">
              FIRST 50 PLAYERS
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              50 SLOTS REMAINING
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] text-sky-400 font-bold tracking-widest uppercase">LEVEL 5 CENTURION</div>
            <div className="text-xl sm:text-2xl font-black text-sky-300 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              FIRST 100 PLAYERS
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              100 SLOTS REMAINING
            </div>
          </div>
        </div>

        {/* 4 Sovereign Badges Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badgeOrder.map((badgeId) => (
            <QuantumSovereignBadge
              key={badgeId}
              badgeId={badgeId}
              variant="card"
              className="h-full"
            />
          ))}
        </div>

        {/* Bottom Rules / Proof Note */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-400 shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <span className="text-white font-bold block sm:inline">FIRST-COME, FIRST-VERIFIED PROTOCOL: </span>
              Milestone badges are awarded sequentially in real time. Once the 10th slot for Level 10, 50th for Level 9, or 100th for Level 5 is claimed, no more badges will ever be issued.
            </div>
          </div>

          <a
            href="/about#sovereign-badges"
            className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 flex items-center gap-1.5 transition-colors"
          >
            <span>LEARN SPECIFICATION</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};
