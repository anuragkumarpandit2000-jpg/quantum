"use client";

import React, { useState } from "react";
import {
  Crown,
  Gem,
  Flame,
  Shield,
  Sparkles,
  Lock,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
  Award,
} from "lucide-react";
import { SovereignBadge, SOVEREIGN_BADGES } from "@/lib/badges";
import { cn } from "@/lib/utils";

interface QuantumSovereignBadgeProps {
  badgeId: "admin-prime" | "level-10-mythic" | "level-9-titan" | "level-5-centurion";
  variant?: "showcase" | "card" | "compact" | "pill";
  isUnlocked?: boolean;
  userSlot?: number;
  className?: string;
  onClick?: () => void;
}

export const QuantumSovereignBadge: React.FC<QuantumSovereignBadgeProps> = ({
  badgeId,
  variant = "card",
  isUnlocked = false,
  userSlot,
  className,
  onClick,
}) => {
  const badge = SOVEREIGN_BADGES[badgeId] || SOVEREIGN_BADGES["admin-prime"];
  const [modalOpen, setModalOpen] = useState(false);

  const getIcon = () => {
    switch (badge.iconName) {
      case "crown":
        return <Crown size={variant === "compact" ? 14 : variant === "pill" ? 12 : 24} className="text-amber-300" />;
      case "gem":
        return <Gem size={variant === "compact" ? 14 : variant === "pill" ? 12 : 24} className="text-yellow-300" />;
      case "flame":
        return <Flame size={variant === "compact" ? 14 : variant === "pill" ? 12 : 24} className="text-fuchsia-400" />;
      case "shield":
      default:
        return <Shield size={variant === "compact" ? 14 : variant === "pill" ? 12 : 24} className="text-sky-400" />;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setModalOpen(true);
    }
  };

  // 1. PILL VARIANT (For tags, tables, and leaderboard user cards)
  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold transition-all duration-200 select-none",
          badge.id === "admin-prime" &&
            "bg-gradient-to-r from-amber-500/25 via-rose-500/20 to-cyan-500/25 border border-amber-400/60 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.35)] hover:scale-105",
          badge.id === "level-10-mythic" &&
            "bg-gradient-to-r from-yellow-500/20 via-amber-500/25 to-yellow-600/20 border border-yellow-400/60 text-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:scale-105",
          badge.id === "level-9-titan" &&
            "bg-gradient-to-r from-fuchsia-600/20 via-purple-600/20 to-amber-500/20 border border-fuchsia-400/50 text-fuchsia-200 shadow-[0_0_12px_rgba(217,70,239,0.3)] hover:scale-105",
          badge.id === "level-5-centurion" &&
            "bg-sky-500/20 border border-sky-400/50 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.25)] hover:scale-105",
          className
        )}
        title={`${badge.name} • ${badge.rarityLabel}`}
      >
        {getIcon()}
        <span>
          {badge.id === "admin-prime"
            ? "ADMIN (1 OF 1)"
            : badge.id === "level-10-mythic"
            ? "MYTHIC 10"
            : badge.id === "level-9-titan"
            ? "TITAN 50"
            : "VANGUARD 100"}
        </span>
      </button>
    );
  }

  // 2. COMPACT VARIANT (For profile headers and sidebar badges)
  if (variant === "compact") {
    return (
      <div
        onClick={handleClick}
        className={cn(
          "p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer group transition-all duration-300 font-mono",
          badge.id === "admin-prime" &&
            "bg-gradient-to-br from-amber-950/60 via-slate-950 to-cyan-950/50 border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:border-amber-300",
          badge.id === "level-10-mythic" &&
            "bg-gradient-to-br from-yellow-950/50 via-slate-950 to-slate-900 border-yellow-400/60 shadow-[0_0_20px_rgba(250,204,21,0.25)] hover:border-yellow-300",
          badge.id === "level-9-titan" &&
            "bg-gradient-to-br from-purple-950/50 via-slate-950 to-fuchsia-950/40 border-fuchsia-400/50 shadow-[0_0_15px_rgba(217,70,239,0.25)] hover:border-fuchsia-300",
          badge.id === "level-5-centurion" &&
            "bg-slate-950/80 border-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:border-sky-300",
          className
        )}
      >
        <div className="p-2 rounded-lg bg-black/50 border border-white/10 shrink-0">
          {getIcon()}
        </div>
        <div className="truncate">
          <div className="text-xs font-extrabold text-white truncate flex items-center gap-1.5">
            <span>{badge.name}</span>
            {badge.isExclusiveAdmin && <Sparkles size={11} className="text-amber-400 animate-pulse" />}
          </div>
          <div className="text-[10px] text-slate-400 truncate">{badge.rarityLabel}</div>
        </div>
      </div>
    );
  }

  // 3. FULL CARD & SHOWCASE VARIANT (Default)
  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          "relative p-6 sm:p-7 rounded-3xl border-2 transition-all duration-300 cursor-pointer group flex flex-col justify-between overflow-hidden font-mono select-none",
          badge.id === "admin-prime" &&
            "bg-gradient-to-br from-amber-950/50 via-slate-950/95 to-cyan-950/60 border-amber-400/70 shadow-[0_0_50px_rgba(251,191,36,0.35)] hover:border-amber-300 hover:shadow-[0_0_70px_rgba(251,191,36,0.5)]",
          badge.id === "level-10-mythic" &&
            "bg-gradient-to-br from-yellow-950/45 via-slate-950/95 to-slate-900 border-yellow-400/70 shadow-[0_0_45px_rgba(250,204,21,0.3)] hover:border-yellow-300 hover:shadow-[0_0_60px_rgba(250,204,21,0.45)]",
          badge.id === "level-9-titan" &&
            "bg-gradient-to-br from-fuchsia-950/45 via-slate-950/95 to-purple-950/50 border-fuchsia-400/60 shadow-[0_0_35px_rgba(217,70,239,0.3)] hover:border-fuchsia-300 hover:shadow-[0_0_50px_rgba(217,70,239,0.45)]",
          badge.id === "level-5-centurion" &&
            "bg-gradient-to-br from-sky-950/40 via-slate-950/95 to-slate-900 border-sky-400/60 shadow-[0_0_30px_rgba(56,189,248,0.25)] hover:border-sky-300 hover:shadow-[0_0_40px_rgba(56,189,248,0.4)]",
          className
        )}
      >
        {/* Iridescent background glow aura */}
        <div
          className={cn(
            "absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl pointer-events-none transition-opacity duration-300",
            badge.id === "admin-prime" ? "bg-amber-400/25 group-hover:bg-amber-400/35" : "",
            badge.id === "level-10-mythic" ? "bg-yellow-400/20 group-hover:bg-yellow-400/30" : "",
            badge.id === "level-9-titan" ? "bg-fuchsia-400/20 group-hover:bg-fuchsia-400/30" : "",
            badge.id === "level-5-centurion" ? "bg-sky-400/20 group-hover:bg-sky-400/30" : ""
          )}
        />

        {/* Top Header Row: Emblem + Scarcity Tag */}
        <div className="relative z-10 flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-3 rounded-2xl border flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                badge.id === "admin-prime" && "bg-amber-400/20 border-amber-400/60 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.4)]",
                badge.id === "level-10-mythic" && "bg-yellow-400/20 border-yellow-400/60 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.35)]",
                badge.id === "level-9-titan" && "bg-fuchsia-500/20 border-fuchsia-400/60 text-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.35)]",
                badge.id === "level-5-centurion" && "bg-sky-500/20 border-sky-400/60 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
              )}
            >
              {getIcon()}
            </div>

            <div>
              <div
                className={cn(
                  "text-[10px] font-mono tracking-widest uppercase font-bold",
                  badge.id === "admin-prime" && "text-amber-400",
                  badge.id === "level-10-mythic" && "text-yellow-400",
                  badge.id === "level-9-titan" && "text-fuchsia-400",
                  badge.id === "level-5-centurion" && "text-sky-400"
                )}
              >
                {badge.tier}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-snug group-hover:text-amber-200 transition-colors">
                {badge.name}
              </h3>
            </div>
          </div>

          {/* Rarity Pill Badge */}
          <div
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-mono font-extrabold border tracking-wider shrink-0",
              badge.id === "admin-prime" && "bg-amber-400/20 border-amber-400/70 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.4)]",
              badge.id === "level-10-mythic" && "bg-yellow-400/20 border-yellow-400/70 text-yellow-200 shadow-[0_0_12px_rgba(250,204,21,0.3)]",
              badge.id === "level-9-titan" && "bg-fuchsia-500/20 border-fuchsia-400/60 text-fuchsia-200 shadow-[0_0_12px_rgba(217,70,239,0.3)]",
              badge.id === "level-5-centurion" && "bg-sky-500/20 border-sky-400/60 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.25)]"
            )}
          >
            {badge.capacity === 1 ? "1 OF 1 UNIQUE" : `LIMITED: ${badge.capacity} SLOTS`}
          </div>
        </div>

        {/* Subtitle & Criteria Description */}
        <div className="relative z-10 py-4 space-y-2.5">
          <div className="text-xs text-slate-300 font-sans leading-relaxed">
            {badge.criteria}
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1 text-[11px]">
            <div className="flex justify-between items-center text-slate-400">
              <span>TOTAL CAPACITY:</span>
              <span className="text-white font-bold">{badge.capacity} Total Slots</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>STATUS:</span>
              <span
                className={cn(
                  "font-bold",
                  badge.isExclusiveAdmin ? "text-amber-400" : "text-emerald-400"
                )}
              >
                {badge.isExclusiveAdmin ? "LOCKED TO ADMIN" : "ACTIVE CHALLENGER RACE"}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer: Interactive CTA */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span
            className={cn(
              "font-bold flex items-center gap-1",
              badge.id === "admin-prime" ? "text-amber-400" : "text-sky-400"
            )}
          >
            {badge.isExclusiveAdmin ? "ADMIN ARCHITECT CREDENTIAL" : "VIEW BADGE DOSSIER"}
          </span>
          <ChevronRight size={15} className="text-slate-500 group-hover:translate-x-1 group-hover:text-white transition-all" />
        </div>
      </div>

      {/* ====================================================================
          SOVEREIGN BADGE DOSSIER MODAL
          ==================================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div
            className={cn(
              "relative w-full max-w-lg p-6 sm:p-8 rounded-3xl border-2 text-left font-mono space-y-6 max-h-[90vh] overflow-y-auto",
              badge.id === "admin-prime" && "bg-slate-950 border-amber-400/70 shadow-[0_0_60px_rgba(251,191,36,0.35)]",
              badge.id === "level-10-mythic" && "bg-slate-950 border-yellow-400/70 shadow-[0_0_50px_rgba(250,204,21,0.3)]",
              badge.id === "level-9-titan" && "bg-slate-950 border-fuchsia-400/60 shadow-[0_0_40px_rgba(217,70,239,0.3)]",
              badge.id === "level-5-centurion" && "bg-slate-950 border-sky-400/60 shadow-[0_0_35px_rgba(56,189,248,0.25)]"
            )}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 text-center border-b border-white/10 pb-5">
              <div
                className={cn(
                  "inline-flex p-4 rounded-3xl border shadow-xl mb-1",
                  badge.id === "admin-prime" && "bg-amber-400/20 border-amber-400/70 text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.5)]",
                  badge.id === "level-10-mythic" && "bg-yellow-400/20 border-yellow-400/70 text-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.4)]",
                  badge.id === "level-9-titan" && "bg-fuchsia-500/20 border-fuchsia-400/70 text-fuchsia-300 shadow-[0_0_20px_rgba(217,70,239,0.4)]",
                  badge.id === "level-5-centurion" && "bg-sky-500/20 border-sky-400/70 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                )}
              >
                {getIcon()}
              </div>

              <div className="text-[11px] font-mono tracking-widest uppercase text-slate-400">
                {badge.tier}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{badge.name}</h2>
              <div className="text-xs text-sky-300">{badge.subtitle}</div>
            </div>

            {/* Scarcity Ledger Box */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">SCARCITY TIER:</span>
                <span className="text-white font-bold">{badge.rarityLabel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">TOTAL MAX SLOTS:</span>
                <span className="text-amber-300 font-extrabold">{badge.capacity} Slots</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">HOLDER RESTRICTION:</span>
                <span className="text-white">
                  {badge.isExclusiveAdmin ? "Anurag Pandit (Lead Architect)" : `First ${badge.capacity} Qualifying Players`}
                </span>
              </div>
            </div>

            {/* Criteria */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-300">UNLOCK REQUIREMENT</div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed p-3 rounded-xl bg-slate-900/50 border border-white/5">
                {badge.criteria}
              </p>
            </div>

            {/* Exclusive Perks */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300">SOVEREIGN PERKS & HONORS</div>
              <div className="space-y-1.5 font-sans text-xs">
                {badge.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/40 border border-white/5">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span className="text-slate-300">{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-white/30 text-white font-bold text-xs transition"
            >
              CLOSE BADGE DOSSIER
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuantumSovereignBadge;
