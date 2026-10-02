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

      {/* Main unobtrusive control pill */}
      <div className="flex items-center gap-1 bg-slate-950/80 hover:bg-slate-900/90 border border-slate-800/80 hover:border-sky-500/40 rounded-full px-2.5 py-1.5 shadow-lg backdrop-blur-md transition-all">
        <button
          onClick={toggleSound}
          className="p-1 text-slate-400 hover:text-sky-300 transition"
          title={soundEnabled ? "Mute Ambient Audio" : "Enable Ambient Audio"}
        >
          {soundEnabled && isPlaying ? (
            <Volume2 size={15} className="text-sky-400" />
          ) : (
            <VolumeX size={15} className="text-slate-500" />
          )}
        </button>

        <span className="text-[10px] font-mono text-slate-400 px-1 hidden sm:inline">
          {soundEnabled ? (
            <span className="text-sky-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              SOUND
            </span>
          ) : (
            "OFF"
          )}
        </span>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 text-slate-400 hover:text-slate-200 transition"
          title="Audio Settings"
        >
          <Sliders size={13} />
        </button>
      </div>
    </div>
  );
};

export default AudioController;
