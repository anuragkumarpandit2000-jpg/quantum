"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Disc3, Music2, SkipForward } from "lucide-react";
import { useAudio } from "./audio-provider";
import { cn } from "@/lib/utils";

export const FloatingMusicController: React.FC = () => {
  const { soundEnabled, isPlaying, currentTrack, toggleSound, playTrack } = useAudio();
  const [isHovered, setIsHovered] = useState(false);

  const tracks: Array<"landing" | "dashboard" | "epic" | "mix"> = [
    "landing",
    "dashboard",
    "epic",
    "mix",
  ];

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = tracks.indexOf(currentTrack as any);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };

  const getTrackLabel = () => {
    switch (currentTrack) {
      case "landing":
        return "Raya Slowed";
      case "dashboard":
        return "Sem Demora";
      case "epic":
        return "Montagem Tenta";
      case "mix":
        return "Brazilian Phonk";
      default:
        return "Quantum Phonk";
    }
  };

  return (
    <div
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Extended Track Info Pill on Hover */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-xl border border-cyan-500/30 text-xs font-mono shadow-[0_0_25px_rgba(6,182,212,0.25)]",
          isHovered ? "max-w-xs opacity-100 scale-100" : "max-w-0 opacity-0 scale-95 p-0 border-0 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-1.5 shrink-0 text-cyan-300">
          <Music2 size={13} className="animate-pulse" />
          <span className="font-bold text-[11px] truncate max-w-[110px]">{getTrackLabel()}</span>
        </div>

        {/* Skip Track Button */}
        <button
          onClick={handleNextTrack}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition shrink-0"
          title="Switch Quantum Track"
        >
          <SkipForward size={13} />
        </button>
      </div>

      {/* Main Rotating Vinyl Disc & Sound Toggle Button */}
      <button
        onClick={toggleSound}
        className={cn(
          "relative h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-xl border",
          soundEnabled && isPlaying
            ? "bg-slate-950/90 border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.4)] text-cyan-300 hover:scale-105"
            : "bg-slate-900/90 border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-500 hover:scale-105"
        )}
        title={soundEnabled && isPlaying ? "Mute Background Music" : "Play Background Music"}
        aria-label="Toggle Sound"
      >
        {/* Pulsing Outer Glow Ring when playing */}
        {soundEnabled && isPlaying && (
          <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping pointer-events-none opacity-40" />
        )}

        {/* Rotating Vinyl Disc */}
        <div
          className={cn(
            "relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-transform",
            soundEnabled && isPlaying ? "animate-[spin_3.5s_linear_infinite]" : "rotate-0"
          )}
        >
          <Disc3
            size={32}
            className={cn(
              "transition-colors",
              soundEnabled && isPlaying ? "text-cyan-400" : "text-slate-500"
            )}
          />
        </div>

        {/* Center Volume Indicator Badge */}
        <div className="absolute -top-1 -right-1 p-1 rounded-full bg-slate-950 border border-cyan-400/40 text-[9px] shadow">
          {soundEnabled && isPlaying ? (
            <Volume2 size={11} className="text-cyan-300" />
          ) : (
            <VolumeX size={11} className="text-rose-400" />
          )}
        </div>
      </button>
    </div>
  );
};

export default FloatingMusicController;
