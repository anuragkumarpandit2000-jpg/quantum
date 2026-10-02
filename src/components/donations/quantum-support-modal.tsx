"use client";

import React from "react";
import { X, Heart, Sparkles } from "lucide-react";
import QuantumSupportCard from "./quantum-support-card";

interface QuantumSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuantumSupportModal({
  isOpen,
  onClose,
}: QuantumSupportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 rounded-3xl bg-slate-950 border border-sky-500/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(56,189,248,0.35)] space-y-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Heart size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-sans flex items-center gap-2">
                <span>SUPPORT QUANTUM PROTOCOL</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                  VOLUNTARY CONTRIBUTION
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Contributions directly reinforce ongoing development, high-frequency infrastructure, and autonomous AI coaching systems.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-400 text-slate-400 hover:text-white flex items-center justify-center transition shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <QuantumSupportCard compact={false} showPatronWall={true} />
      </div>
    </div>
  );
}
