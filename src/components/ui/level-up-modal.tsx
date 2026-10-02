"use client";

import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Zap,
  Flame,
  Shield,
  Trophy,
  ArrowRight,
  Award,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface LevelUpData {
  level: number;
  tier: string;
  title: string;
  quote: string;
  streak: number;
  badgeColor?: string;
}

interface LevelUpModalProps {
  data: LevelUpData | null;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ data, onClose }) => {
  const audioPlayedRef = useRef(false);

  useEffect(() => {
    if (!data) {
      audioPlayedRef.current = false;
      return;
    }

    // 0. Play celebratory ascending sound chime
    if (!audioPlayedRef.current) {
      audioPlayedRef.current = true;
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const now = ctx.currentTime;
          const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now + i * 0.09);
            gain.gain.setValueAtTime(0.001, now + i * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.18, now + i * 0.09 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.09);
            osc.stop(now + i * 0.09 + 0.42);
          });
        }
      } catch (e) {
        // Ignore audio block if user hasn't interacted
      }
    }

    // 1. Trigger Canvas Confetti Explosion
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ["#38bdf8", "#06b6d4", "#f59e0b", "#10b981", "#ffffff"];

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 40 * (timeLeft / duration);

      confetti({
        particleCount,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
    }, 250);

    return () => clearInterval(interval);
  }, [data]);

  if (!data) return null;

  const color = data.badgeColor || "#38bdf8";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-slate-900/90 border border-cyan-400/40 p-8 shadow-[0_0_80px_rgba(6,182,212,0.3)] text-center space-y-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cyberpunk Radial Lighting Backing */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40 animate-pulse"
          style={{ backgroundColor: color }}
        />

        {/* Top Protocol Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs tracking-widest uppercase">
          <Sparkles size={14} className="text-cyan-400 animate-spin" />
          <span>NEURAL ADVANCEMENT RATIFIED</span>
        </div>

        {/* 3D Glowing Level Badge Container */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          {/* Outer rotating pulse ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed animate-[spin_12s_linear_infinite] opacity-60"
            style={{ borderColor: color }}
          />
          {/* Inner solid glow ring */}
          <div
            className="absolute inset-2 rounded-full border-2 shadow-[0_0_30px_rgba(56,189,248,0.5)] bg-slate-950/80 flex flex-col items-center justify-center"
            style={{ borderColor: color }}
          >
            <Crown size={22} className="text-amber-400 animate-bounce mb-1" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              LEVEL
            </span>
            <span
              className="text-4xl font-black font-mono tracking-tighter drop-shadow-lg"
              style={{ color }}
            >
              {data.level < 10 ? `0${data.level}` : data.level}
            </span>
          </div>
        </div>

        {/* Milestone Headline & Titles */}
        <div className="space-y-2">
          <div className="text-xs font-mono tracking-widest uppercase text-amber-400 flex items-center justify-center gap-1.5">
            <Flame size={14} className="text-amber-400 fill-amber-400 animate-pulse" />
            <span>DAY {data.streak} CONTINUOUS CONSISTENCY SEALED</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-mono">
            {data.title}
          </h2>

          <div
            className="inline-block text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-slate-800/80 border"
            style={{ color, borderColor: `${color}60` }}
          >
            {data.tier}
          </div>
        </div>

        {/* Sovereign Decree Quote */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
          <p className="text-sm text-slate-200 leading-relaxed font-sans italic">
            &ldquo;{data.quote}&rdquo;
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-mono font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
        >
          <span>EMBRACE ADVANCEMENT & LOCK IN</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
