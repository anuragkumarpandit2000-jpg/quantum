"use client";

import React, { useState } from "react";
import { useAudio } from "./audio-provider";
import { Volume2, VolumeX, Music, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const AudioController: React.FC = () => {
  const {
    soundEnabled,
    volume,
    currentTrack,
    isPlaying,
    needsInteraction,
    toggleSound,
    setVolume,
    playTrack,
    unlockAudio,
  } = useAudio();

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 select-none">
      {/* Autoplay blocked first-visit prompt */}
      <AnimatePresence>
        {needsInteraction && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={unlockAudio}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-200 text-xs font-mono tracking-wider shadow-lg shadow-sky-500/20 backdrop-blur-md animate-bounce"
          >
            <Music size={13} className="animate-spin" />
            <span>SOUND ON (CLICK TO PLAY)</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded track & volume selector panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            className="w-56 p-3 rounded-xl bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-xl text-xs space-y-3 font-mono"
          >
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-1.5">
              <span className="text-[10px] tracking-widest text-sky-400 font-bold uppercase">
                ATMOSPHERE AUDIO
              </span>
              <span className="text-[10px] text-slate-500">{isPlaying ? "STREAMING" : "MUTED"}</span>
            </div>

            {/* Volume slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>VOLUME</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>

            {/* Track Switcher */}
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase">CHOOSE TRACK</div>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { key: "landing", label: "Raya (Slowed)" },
                  { key: "dashboard", label: "Sem Demora (Dark)" },
                  { key: "epic", label: "Montagem Tenta (Climax)" },
                  { key: "mix", label: "Brazilian Phonk (Ambient)" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => playTrack(t.key as any)}
                    className={cn(
                      "text-left px-2 py-1 rounded text-[11px] transition-colors truncate",
                      currentTrack === t.key
                        ? "bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    )}
                  >
                    • {t.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main unobtrusive control pill with rotating vinyl disc */}
      <div className="flex items-center gap-1.5 bg-slate-950/90 hover:bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 rounded-full px-3 py-1.5 shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-xl transition-all">
        {/* Rotating Vinyl Disc */}
        <div
          onClick={toggleSound}
          className="cursor-pointer flex items-center justify-center p-0.5"
          title={soundEnabled && isPlaying ? "Click to Turn Off Music" : "Click to Turn On Music"}
        >
          <div
            className={cn(
              "w-5 h-5 flex items-center justify-center transition-transform",
              soundEnabled && isPlaying ? "animate-[spin_3s_linear_infinite] text-cyan-400" : "text-slate-500"
            )}
          >
            <Music size={15} />
          </div>
        </div>

        <button
          onClick={toggleSound}
          className="p-1 text-slate-300 hover:text-cyan-300 transition flex items-center gap-1"
          title={soundEnabled ? "Turn Off Music" : "Turn On Music"}
        >
          {soundEnabled && isPlaying ? (
            <Volume2 size={15} className="text-cyan-400" />
          ) : (
            <VolumeX size={15} className="text-rose-400" />
          )}

          <span
            className={cn(
              "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded transition",
              soundEnabled && isPlaying
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                : "bg-rose-500/20 text-rose-300 border border-rose-400/30"
            )}
          >
            {soundEnabled && isPlaying ? "ON" : "OFF"}
          </span>
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 text-slate-400 hover:text-cyan-300 transition ml-0.5"
          title="Audio Tracks & Volume"
        >
          <Sliders size={13} />
        </button>
      </div>
    </div>
  );
};

export default AudioController;
