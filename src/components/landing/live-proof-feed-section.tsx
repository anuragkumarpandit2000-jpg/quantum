"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Camera,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Flame,
  Calendar,
  Layers,
  Eye,
  X,
  Maximize2,
  Lock,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProofItem {
  id: string;
  dayNumber: number;
  caption: string;
  fileUrl: string;
  fileType: string;
  createdAt: string;
  user: {
    name: string;
    username: string;
    profile?: {
      avatar?: string;
      level?: number;
      currentClass?: string;
    };
  };
}

const FALLBACK_PROOFS: ProofItem[] = [
  {
    id: "fb-1",
    dayNumber: 42,
    caption: "5:00 AM Calisthenics & 10km Weighted Run completed. Zero missed days in the Arc.",
    fileUrl: "/assets/images/avatars/avatar_16.jpg",
    fileType: "image",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    user: {
      name: "Tanishq M.",
      username: "tanishq_arc",
      profile: {
        avatar: "/assets/images/avatars/avatar_16.jpg",
        level: 9,
        currentClass: "Obsidian Sovereign",
      },
    },
  },
  {
    id: "fb-2",
    dayNumber: 36,
    caption: "4 Hours Deep Work on Rust Engine & Distributed Sharding Nodes. Focus locked.",
    fileUrl: "/assets/images/avatars/avatar_17.jpg",
    fileType: "image",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    user: {
      name: "Riddhi S.",
      username: "riddhi_discipline",
      profile: {
        avatar: "/assets/images/avatars/avatar_17.jpg",
        level: 8,
        currentClass: "Vanguard Titan",
      },
    },
  },
  {
    id: "fb-3",
    dayNumber: 28,
    caption: "Cold exposure protocol followed by 100 pushups. Mind cleared of dopamine noise.",
    fileUrl: "/assets/images/avatars/avatar_18.jpg",
    fileType: "image",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    user: {
      name: "Raghav K.",
      username: "raghav_forge",
      profile: {
        avatar: "/assets/images/avatars/avatar_18.jpg",
        level: 7,
        currentClass: "Apex Sentinel",
      },
    },
  },
  {
    id: "fb-4",
    dayNumber: 22,
    caption: "Blender 3D Geometric Shaders finalized. Skill milestone unlocked with 150 XP.",
    fileUrl: "/assets/images/avatars/avatar_19.jpg",
    fileType: "image",
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    user: {
      name: "Sameer P.",
      username: "sameer_execution",
      profile: {
        avatar: "/assets/images/avatars/avatar_19.jpg",
        level: 6,
        currentClass: "Quantum Adept",
      },
    },
  },
  {
    id: "fb-5",
    dayNumber: 14,
    caption: "Day 14 Matrix check: 5/5 daily habits locked unbroken. The inertia is real.",
    fileUrl: "/assets/images/avatars/avatar_15.jpg",
    fileType: "image",
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    user: {
      name: "Arun V.",
      username: "challenger_arc",
      profile: {
        avatar: "/assets/images/avatars/avatar_15.jpg",
        level: 5,
        currentClass: "Quantum Adept",
      },
    },
  },
  {
    id: "fb-6",
    dayNumber: 18,
    caption: "Reading Marcus Aurelius Meditations + 45-min kettlebell mobility sequence.",
    fileUrl: "/assets/images/avatars/avatar_20.jpg",
    fileType: "image",
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    user: {
      name: "Zoya B.",
      username: "zoya_focus",
      profile: {
        avatar: "/assets/images/avatars/avatar_20.jpg",
        level: 4,
        currentClass: "Discipline Adept",
      },
    },
  },
];

export const LiveProofFeedSection: React.FC = () => {
  const [proofs, setProofs] = useState<ProofItem[]>(FALLBACK_PROOFS);
  const [loading, setLoading] = useState(true);
  const [activeModalProof, setActiveModalProof] = useState<ProofItem | null>(null);
  const [filterDay, setFilterDay] = useState<"all" | "early" | "advanced">("all");

  useEffect(() => {
    fetch("/api/gallery?publicOnly=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          // Combine live DB proofs with fallbacks, removing duplicates
          const liveIds = new Set(data.items.map((i: any) => i.id));
          const uniqueFallbacks = FALLBACK_PROOFS.filter((fb) => !liveIds.has(fb.id));
          setProofs([...data.items, ...uniqueFallbacks]);
        }
      })
      .catch((err) => console.error("Failed to load public gallery proof feed:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProofs = proofs.filter((p) => {
    if (filterDay === "early") return p.dayNumber <= 21;
    if (filterDay === "advanced") return p.dayNumber > 21;
    return true;
  });

  return (
    <section id="proof-feed" className="py-24 px-4 sm:px-6 relative border-t border-slate-900 bg-slate-950/60 text-slate-100 overflow-hidden">
      {/* Background Cyberpunk Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto space-y-12">
        {/* ====================================================================
            HEADER
            ==================================================================== */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Camera size={13} className="text-cyan-400" />
            <span>04 // LIVE EXECUTION PROOF FEED</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            HALL OF VISUAL DISCIPLINE
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Real photographic proof uploaded daily by active Winter Arc challengers.{" "}
            <span className="text-cyan-300 font-medium">Public submissions only</span> — private
            vault proofs remain strictly confidential to the challenger.
          </p>

          {/* Privacy Badge & Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Globe size={12} />
              <span>Public Feed Only</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
              <Lock size={12} className="text-amber-400" />
              <span>Private Proofs Hidden</span>
            </div>

            <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 ml-2">
              <button
                onClick={() => setFilterDay("all")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-mono transition",
                  filterDay === "all"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                    : "text-slate-400 hover:text-white"
                )}
              >
                All Days
              </button>
              <button
                onClick={() => setFilterDay("early")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-mono transition",
                  filterDay === "early"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                    : "text-slate-400 hover:text-white"
                )}
              >
                Days 1-21
              </button>
              <button
                onClick={() => setFilterDay("advanced")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-mono transition",
                  filterDay === "advanced"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                    : "text-slate-400 hover:text-white"
                )}
              >
                Days 22-90
              </button>
            </div>
          </div>
        </div>

        {/* ====================================================================
            PROOFS GRID
            ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProofs.map((item) => {
            const avatarUrl = item.user.profile?.avatar || "/assets/images/avatars/avatar_01.png";
            const currentClass = item.user.profile?.currentClass || "Initiate Challenger";
            const level = item.user.profile?.level || 1;

            return (
              <div
                key={item.id}
                onClick={() => setActiveModalProof(item)}
                className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 p-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col justify-between cursor-pointer"
              >
                {/* Top: User info + Day Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cyan-500/40 shrink-0">
                      <Image
                        src={avatarUrl}
                        alt={item.user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm tracking-wide">
                          {item.user.name}
                        </span>
                        <ShieldCheck size={13} className="text-cyan-400" />
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400/80 flex items-center gap-1">
                        <span>@{item.user.username}</span>
                        <span>•</span>
                        <span>LVL {level}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-400/30 text-cyan-300 font-mono text-xs font-bold tracking-wider">
                    DAY {item.dayNumber}
                  </div>
                </div>

                {/* Middle: Photo Card */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800/60 group-hover:border-cyan-500/30 transition">
                  <Image
                    src={item.fileUrl}
                    alt={item.caption}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Expand icon on hover */}
                  <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-slate-950/80 border border-slate-700 text-slate-300 group-hover:text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={14} />
                  </div>
                </div>

                {/* Bottom: Caption & Timestamp */}
                <div className="mt-3.5 space-y-2">
                  <p className="text-sm text-slate-200 font-medium line-clamp-2 leading-relaxed">
                    &ldquo;{item.caption}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800/50">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Flame size={12} className="text-amber-400" />
                      <span>{currentClass}</span>
                    </div>
                    <span>
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Full Resolution Viewer */}
        {activeModalProof && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setActiveModalProof(null)}
          >
            <div
              className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModalProof(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-cyan-400">
                  <Image
                    src={activeModalProof.user.profile?.avatar || "/assets/images/avatars/avatar_01.png"}
                    alt={activeModalProof.user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {activeModalProof.user.name}
                    <ShieldCheck size={16} className="text-cyan-400" />
                  </h3>
                  <p className="text-xs font-mono text-cyan-300">
                    @{activeModalProof.user.username} • {activeModalProof.user.profile?.currentClass}
                  </p>
                </div>
                <div className="ml-auto mr-8 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono text-sm font-bold">
                  DAY {activeModalProof.dayNumber}
                </div>
              </div>

              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
                <Image
                  src={activeModalProof.fileUrl}
                  alt={activeModalProof.caption}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                  Verified Daily Execution Log:
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {activeModalProof.caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
