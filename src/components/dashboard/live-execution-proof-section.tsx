"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Camera,
  Film,
  Play,
  Pause,
  Sparkles,
  ShieldCheck,
  Flame,
  Eye,
  Upload,
  X,
  Maximize2,
  Globe,
  Lock,
  RefreshCw,
  Clock,
  Layers,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ProofItem {
  id: string;
  dayNumber: number;
  caption: string;
  fileUrl: string;
  fileType?: string; // "image" | "video"
  isPublic?: boolean;
  createdAt: string;
  user?: {
    name?: string;
    username?: string;
    profile?: {
      avatar?: string;
      level?: number;
      currentClass?: string;
    };
  };
}

const FALLBACK_COMMAND_PROOFS: ProofItem[] = [
  {
    id: "cp-1",
    dayNumber: 52,
    caption: "04:30 AM Wakeup • 5km weighted ruck + ice recovery. Unbroken Arc discipline.",
    fileUrl: "/assets/images/avatars/avatar_16.jpg",
    fileType: "image",
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    user: {
      name: "Tanishq M.",
      username: "tanishq_arc",
      profile: {
        avatar: "/assets/images/avatars/avatar_16.jpg",
        level: 7,
        currentClass: "Arc Master",
      },
    },
  },
  {
    id: "cp-2",
    dayNumber: 30,
    caption: "1/3rd of the Winter Arc conquered! 4 hours uninterrupted coding + clean nutrition.",
    fileUrl: "/assets/images/avatars/avatar_17.jpg",
    fileType: "image",
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    user: {
      name: "Riddhi S.",
      username: "riddhi_discipline",
      profile: {
        avatar: "/assets/images/avatars/avatar_17.jpg",
        level: 5,
        currentClass: "Quantum Adept",
      },
    },
  },
  {
    id: "cp-3",
    dayNumber: 25,
    caption: "Day 25 milestone unlocked. Dopamine baseline permanently restored. 100 pushups done.",
    fileUrl: "/assets/images/avatars/avatar_18.jpg",
    fileType: "image",
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    user: {
      name: "Raghav K.",
      username: "raghav_forge",
      profile: {
        avatar: "/assets/images/avatars/avatar_18.jpg",
        level: 4,
        currentClass: "Focus Vanguard",
      },
    },
  },
  {
    id: "cp-4",
    dayNumber: 14,
    caption: "Two weeks straight without skipping a single habit. The momentum is unstoppable.",
    fileUrl: "/assets/images/avatars/avatar_19.jpg",
    fileType: "image",
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    user: {
      name: "Sameer P.",
      username: "sameer_execution",
      profile: {
        avatar: "/assets/images/avatars/avatar_19.jpg",
        level: 3,
        currentClass: "Kinetic Operator",
      },
    },
  },
  {
    id: "cp-5",
    dayNumber: 7,
    caption: "Week 1 completed! Obsidian persistence ratified. Level 2 upgrade sealed.",
    fileUrl: "/assets/images/avatars/avatar_15.jpg",
    fileType: "image",
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    user: {
      name: "Arun V.",
      username: "challenger_arc",
      profile: {
        avatar: "/assets/images/avatars/avatar_15.jpg",
        level: 2,
        currentClass: "Discipline Neophyte",
      },
    },
  },
  {
    id: "cp-6",
    dayNumber: 1,
    caption: "Day 01 Quantum Induction ratified. The 90-day transformation begins right now.",
    fileUrl: "/assets/images/avatars/avatar_20.jpg",
    fileType: "image",
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 620).toISOString(),
    user: {
      name: "Zoya B.",
      username: "zoya_focus",
      profile: {
        avatar: "/assets/images/avatars/avatar_20.jpg",
        level: 1,
        currentClass: "Initiate Tier I",
      },
    },
  },
];

interface LiveExecutionProofSectionProps {
  onOpenUploadModal: () => void;
  currentUserId?: string;
  onSelectProof?: (proof: ProofItem) => void;
}

export const LiveExecutionProofSection: React.FC<LiveExecutionProofSectionProps> = ({
  onOpenUploadModal,
  currentUserId,
  onSelectProof,
}) => {
  const [proofs, setProofs] = useState<ProofItem[]>(FALLBACK_COMMAND_PROOFS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "mine" | "videos" | "photos">("all");
  const [activeStoryModal, setActiveStoryModal] = useState<ProofItem | null>(null);

  const fetchProofs = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          const liveIds = new Set(data.items.map((i: any) => i.id));
          const uniqueFallbacks = FALLBACK_COMMAND_PROOFS.filter((fb) => !liveIds.has(fb.id));
          setProofs([...data.items, ...uniqueFallbacks]);
        }
      }
    } catch (e) {
      console.error("Failed to load command center live execution proofs:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProofs();
    const interval = setInterval(fetchProofs, 25000); // 25s live telemetry poll
    return () => clearInterval(interval);
  }, []);

  const filteredProofs = proofs.filter((p) => {
    if (filterType === "mine" && currentUserId) {
      return (p as any).userId === currentUserId;
    }
    if (filterType === "videos") {
      return (
        p.fileType === "video" ||
        p.fileUrl.endsWith(".mp4") ||
        p.fileUrl.startsWith("data:video")
      );
    }
    if (filterType === "photos") {
      return (
        p.fileType !== "video" &&
        !p.fileUrl.endsWith(".mp4") &&
        !p.fileUrl.startsWith("data:video")
      );
    }
    return true;
  });

  const isVideo = (item: ProofItem) => {
    return (
      item.fileType === "video" ||
      item.fileUrl.endsWith(".mp4") ||
      item.fileUrl.startsWith("data:video")
    );
  };

  return (
    <section className="relative rounded-3xl bg-slate-950/45 backdrop-blur-xl border border-cyan-500/25 p-5 sm:p-7 shadow-[0_0_50px_rgba(6,182,212,0.08)] space-y-6 overflow-hidden">
      {/* Background Cyberpunk Accents */}
      <div className="absolute -top-32 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ====================================================================
          SECTION HEADER
          ==================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-[11px] font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Camera size={13} className="text-cyan-400" />
            <span>REAL-TIME EXECUTION FEED • 9:16 VERTICAL ARCHIVE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-mono flex items-center gap-2">
            <span>LIVE EXECUTION PROOFS</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-cyan-500/30 font-mono font-semibold">
              9:16 STORIES
            </span>
          </h2>

          <p className="text-xs text-slate-400 font-sans max-w-2xl leading-relaxed">
            Unfiltered photographic & video proof submitted daily by active Winter Arc challengers.
            Public proofs inspire the collective; private proofs stay secured in personal vaults.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={fetchProofs}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition flex items-center justify-center disabled:opacity-50"
            title="Refresh Live Execution Feed"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin text-cyan-400" : ""} />
          </button>

          <Button
            onClick={onOpenUploadModal}
            variant="quantum"
            size="sm"
            className="font-mono text-xs font-bold gap-2 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] h-10 px-4"
          >
            <Upload size={14} />
            <span>+ LOG 9:16 PROOF</span>
          </Button>
        </div>
      </div>

      {/* ====================================================================
          FILTER CONTROLS
          ==================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10">
          <button
            onClick={() => setFilterType("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg transition font-medium",
              filterType === "all"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold"
                : "text-slate-400 hover:text-white"
            )}
          >
            All Live Proofs ({proofs.length})
          </button>

          {currentUserId && (
            <button
              onClick={() => setFilterType("mine")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition font-medium",
                filterType === "mine"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold"
                  : "text-slate-400 hover:text-white"
              )}
            >
              My Vault Proofs
            </button>
          )}

          <button
            onClick={() => setFilterType("photos")}
            className={cn(
              "px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1",
              filterType === "photos"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Camera size={12} />
            <span>Photos</span>
          </button>

          <button
            onClick={() => setFilterType("videos")}
            className={cn(
              "px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1",
              filterType === "videos"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Film size={12} />
            <span>Videos</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <span className="flex items-center gap-1 text-emerald-400">
            <Globe size={12} /> Verified Public
          </span>
          <span>•</span>
          <span className="text-slate-400">Aspect Ratio: 9:16 Portrait</span>
        </div>
      </div>

      {/* ====================================================================
          9:16 VERTICAL PROOFS GRID
          ==================================================================== */}
      {filteredProofs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-white/10 bg-slate-900/30 space-y-3 font-mono">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Camera size={22} />
          </div>
          <div className="text-sm font-bold text-white">NO 9:16 PROOFS IN THIS CATEGORY</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Take a 9:16 vertical photo or short video of your training or deep work desk to record your proof of work.
          </p>
          <Button
            onClick={onOpenUploadModal}
            variant="outline"
            size="sm"
            className="text-xs font-mono border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 mt-2"
          >
            <Upload size={12} className="mr-1.5" /> BE THE FIRST TO LOG PROOF
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
          {filteredProofs.map((item) => {
            const hasVideo = isVideo(item);
            const avatarUrl = item.user?.profile?.avatar || "/assets/images/avatars/avatar_01.png";
            const level = item.user?.profile?.level || 1;
            const authorName = item.user?.name || "Challenger";

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (onSelectProof) {
                    onSelectProof(item);
                  } else {
                    setActiveStoryModal(item);
                  }
                }}
                className="group relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-cyan-400/60 shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Media Content (Image or Video) */}
                {hasVideo ? (
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

                {/* Cyberpunk Gradient Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/70 opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top Badge: Day Number + Media Type */}
                <div className="relative z-10 p-2.5 flex items-center justify-between">
                  <div className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-400/40 text-cyan-300 font-mono text-[10px] font-extrabold tracking-wider shadow">
                    DAY {String(item.dayNumber).padStart(2, "0")}
                  </div>

                  {hasVideo ? (
                    <div className="p-1 rounded-full bg-amber-500/80 text-slate-950 shadow">
                      <Film size={11} />
                    </div>
                  ) : (
                    <div className="p-1 rounded-full bg-slate-900/80 text-cyan-300 border border-white/10 shadow">
                      <Camera size={11} />
                    </div>
                  )}
                </div>

                {/* Center Hover Play/Expand Indicator */}
                <div className="relative z-10 mx-auto w-10 h-10 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-400/50 flex items-center justify-center text-cyan-300 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  {hasVideo ? <Play size={16} className="fill-cyan-300 ml-0.5" /> : <Maximize2 size={16} />}
                </div>

                {/* Bottom Overlay: Author Details & Caption */}
                <div className="relative z-10 p-3 space-y-1.5 font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="relative w-5 h-5 rounded-full overflow-hidden border border-cyan-400/40 shrink-0">
                      <Image src={avatarUrl} alt={authorName} fill className="object-cover" />
                    </div>
                    <span className="text-[11px] font-bold text-white truncate max-w-[90px]">
                      {authorName}
                    </span>
                    <span className="text-[9px] px-1 rounded bg-sky-500/20 text-sky-300 font-extrabold shrink-0">
                      L{level}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-200 font-sans line-clamp-2 leading-snug">
                    {item.caption}
                  </p>

                  <div className="text-[9px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/10">
                    <span className="truncate">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className="text-cyan-400 font-semibold uppercase">9:16 PROOF</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ====================================================================
          FULLSCREEN 9:16 STORY LIGHTBOX MODAL
          ==================================================================== */}
      {activeStoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setActiveStoryModal(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-slate-950 border border-cyan-400/40 overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.35)] flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="p-3.5 px-4 flex items-center justify-between border-b border-white/10 bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-cyan-400">
                  <Image
                    src={activeStoryModal.user?.profile?.avatar || "/assets/images/avatars/avatar_01.png"}
                    alt={activeStoryModal.user?.name || "Challenger"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>{activeStoryModal.user?.name || "Challenger"}</span>
                    <ShieldCheck size={12} className="text-cyan-400" />
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300">
                    DAY {activeStoryModal.dayNumber} PROOF • LVL {activeStoryModal.user?.profile?.level || 1}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveStoryModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* 9:16 Media Viewport */}
            <div className="relative w-full aspect-[9/16] max-h-[62vh] bg-black flex items-center justify-center overflow-hidden">
              {isVideo(activeStoryModal) ? (
                <video
                  src={activeStoryModal.fileUrl}
                  controls
                  autoPlay
                  playsInline
                  loop
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image
                  src={activeStoryModal.fileUrl}
                  alt={activeStoryModal.caption}
                  fill
                  className="object-contain"
                />
              )}
            </div>

            {/* Bottom Caption & Details */}
            <div className="p-4 bg-slate-900/90 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                <span>VERIFIED EXECUTION LOG</span>
                <span>{new Date(activeStoryModal.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                &ldquo;{activeStoryModal.caption}&rdquo;
              </p>
              <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Globe size={11} /> Publicly Ratified
                </span>
                <a
                  href={activeStoryModal.fileUrl}
                  download={`QUANTUM_DAY_${activeStoryModal.dayNumber}_PROOF`}
                  className="text-cyan-300 hover:underline flex items-center gap-1"
                >
                  Download Media
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
