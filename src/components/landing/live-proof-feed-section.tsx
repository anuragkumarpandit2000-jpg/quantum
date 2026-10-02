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
            PROOFS GRID (9:16 Vertical Ratio)
            ==================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProofs.map((item) => {
            const avatarUrl = item.user.profile?.avatar || "/assets/images/avatars/avatar_01.png";
            const currentClass = item.user.profile?.currentClass || "Initiate Challenger";
            const level = item.user.profile?.level || 1;
            const isVideo =
              item.fileType === "video" ||
              item.fileUrl.endsWith(".mp4") ||
              item.fileUrl.startsWith("data:video");

            return (
              <div
                key={item.id}
                onClick={() => setActiveModalProof(item)}
                className="group relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-cyan-400/60 shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Media (9:16 Photo or Video) */}
                {isVideo ? (
                  <video
                    src={item.fileUrl}
                    loop
                    muted
                    playsInline
                    autoPlay
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Image
                    src={item.fileUrl}
                    alt={item.caption}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                )}

                {/* Dark Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/70 opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top Badge: Day Number + Media Type */}
                <div className="relative z-10 p-2.5 flex items-center justify-between">
                  <div className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-400/40 text-cyan-300 font-mono text-[10px] font-extrabold tracking-wider shadow">
                    DAY {String(item.dayNumber).padStart(2, "0")}
                  </div>

                  <div className="p-1 rounded-full bg-slate-900/80 text-cyan-300 border border-white/10 shadow text-[10px] font-mono">
                    9:16
                  </div>
                </div>

                {/* Center Hover Action */}
                <div className="relative z-10 mx-auto w-10 h-10 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-400/50 flex items-center justify-center text-cyan-300 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <Maximize2 size={16} />
                </div>

                {/* Bottom Overlay: Author Details & Caption */}
                <div className="relative z-10 p-3 space-y-1.5 font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="relative w-5 h-5 rounded-full overflow-hidden border border-cyan-400/40 shrink-0">
                      <Image src={avatarUrl} alt={item.user.name} fill className="object-cover" />
                    </div>
                    <span className="text-[11px] font-bold text-white truncate max-w-[85px]">
                      {item.user.name}
                    </span>
                    <span className="text-[9px] px-1 rounded bg-sky-500/20 text-sky-300 font-extrabold shrink-0">
                      L{level}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-200 font-sans line-clamp-2 leading-snug">
                    {item.caption}
                  </p>

                  <div className="text-[9px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/10">
                    <span className="truncate">{currentClass}</span>
                    <span className="text-cyan-400 font-semibold uppercase">
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

        {/* Modal: Full 9:16 Story Lightbox */}
        {activeModalProof && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200"
            onClick={() => setActiveModalProof(null)}
          >
            <div
              className="relative w-full max-w-sm rounded-3xl bg-slate-950 border border-cyan-400/40 overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.35)] flex flex-col max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3.5 px-4 flex items-center justify-between border-b border-white/10 bg-slate-900/80">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-cyan-400">
                    <Image
                      src={activeModalProof.user.profile?.avatar || "/assets/images/avatars/avatar_01.png"}
                      alt={activeModalProof.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1">
                      {activeModalProof.user.name}
                      <ShieldCheck size={13} className="text-cyan-400" />
                    </h3>
                    <p className="text-[10px] font-mono text-cyan-300">
                      @{activeModalProof.user.username} • DAY {activeModalProof.dayNumber} PROOF
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalProof(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* 9:16 Media Viewport */}
              <div className="relative w-full aspect-[9/16] max-h-[62vh] bg-black flex items-center justify-center overflow-hidden">
                {activeModalProof.fileType === "video" ||
                activeModalProof.fileUrl.endsWith(".mp4") ||
                activeModalProof.fileUrl.startsWith("data:video") ? (
                  <video
                    src={activeModalProof.fileUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={activeModalProof.fileUrl}
                    alt={activeModalProof.caption}
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              <div className="p-4 bg-slate-900/90 border-t border-white/10 space-y-1.5">
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center justify-between">
                  <span>Verified 9:16 Daily Proof</span>
                  <span>{new Date(activeModalProof.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  &ldquo;{activeModalProof.caption}&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
