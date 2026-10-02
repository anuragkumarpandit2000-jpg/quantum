"use client";

import React, { useState } from "react";
import {
  Download,
  Printer,
  CheckCircle2,
  Flame,
  Sparkles,
  Maximize2,
  X,
  FileCheck,
  Check,
  Shield,
  Clock,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PhysicalHabitTrackerProps {
  selectedHabits?: string[];
  userName?: string;
  className?: string;
}

export const PhysicalHabitTracker: React.FC<PhysicalHabitTrackerProps> = ({
  selectedHabits = [],
  userName = "Challenger",
  className,
}) => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [stampHabits, setStampHabits] = useState(false);

  // Trigger high-res image download
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (stampHabits && selectedHabits.length > 0) {
        // Stamp user's selected habits into the goal slots on canvas
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load habit tracker template"));
          img.src = "/assets/images/document/habit-tracker.png";
        });

        const canvas = document.createElement("canvas");
        canvas.width = 1772;
        canvas.height = 887;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1772, 887);

          // Goal slots on the left (Slots 1 to 10)
          // Slot 1 starts around Y: 218, each slot height is ~38px, spacing is ~44px
          // Slot X range is ~57 to 260
          ctx.font = "bold 13px 'Inter', sans-serif";
          ctx.fillStyle = "#0f172a";
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";

          const slotStartY = 236;
          const slotSpacing = 43.5;

          selectedHabits.slice(0, 10).forEach((habit, idx) => {
            const y = slotStartY + idx * slotSpacing;
            const habitText = habit.length > 24 ? habit.slice(0, 22) + "..." : habit;
            ctx.fillText(habitText.toUpperCase(), 62, y);
          });

          const dataUrl = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = `QUANTUM_90_DAY_HABIT_TRACKER_${userName.toUpperCase().replace(/\s+/g, "_")}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setIsDownloading(false);
          return;
        }
      }

      // Default: Clean high-res download
      const link = document.createElement("a");
      link.href = "/assets/images/document/habit-tracker.png";
      link.download = `QUANTUM_90_DAY_HABIT_TRACKER_${userName.toUpperCase().replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Download tracker error:", e);
      // Fallback
      window.open("/assets/images/document/habit-tracker.png", "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  // Trigger A4 Landscape Print
  const handlePrint = () => {
    setIsPrinting(true);
    document.body.classList.add("printing-landscape");

    // Small delay to ensure styles apply before print dialog renders
    setTimeout(() => {
      window.print();
      document.body.classList.remove("printing-landscape");
      setIsPrinting(false);
    }, 250);
  };

  return (
    <section
      aria-label="Physical 90-Day Habit Tracker System"
      className={cn("w-full space-y-6", className)}
    >
      {/* Top Banner & Action Controls */}
      <div className="no-print bg-slate-900/90 border border-sky-500/30 p-5 sm:p-7 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-[0_0_40px_rgba(2,132,199,0.15)]">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/40 text-sky-400 font-mono text-[11px] font-bold tracking-wider uppercase">
              <Sparkles size={12} />
              Tangible Accountability
            </span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
              A4 Landscape Printable
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            OFFICIAL 90-DAY PHYSICAL HABIT TRACKER
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
            Download and print this official habit tracker. Keep it on your desk or wall and tick off each day physically with a pen. Let it serve as your daily tangible reminder that you are completely locked in.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            disabled={isPrinting}
            className="flex-1 sm:flex-none font-mono text-xs gap-1.5 border-slate-700 hover:border-slate-500 text-slate-200 hover:bg-slate-800"
          >
            <Printer size={15} />
            <span>{isPrinting ? "PREPARING..." : "PRINT (A4)"}</span>
          </Button>

          <Button
            onClick={handleDownload}
            variant="quantum"
            size="sm"
            disabled={isDownloading}
            className="flex-1 sm:flex-none font-mono text-xs gap-1.5 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
          >
            <Download size={15} />
            <span>{isDownloading ? "DOWNLOADING..." : "DOWNLOAD PNG"}</span>
          </Button>
        </div>
      </div>

      {/* Main Document Display Box */}
      <div className="relative group">
        <div
          id="quantum-habit-tracker-printable"
          className="relative w-full rounded-2xl overflow-hidden bg-white border-2 border-slate-800/80 shadow-[0_15px_50px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:border-sky-500/40 group-hover:shadow-[0_20px_60px_rgba(56,189,248,0.15)]"
        >
          {/* Printable Sheet Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/images/document/habit-tracker.png"
            alt="Official QUANTUM x Winter Arc 90-Day Physical Habit Tracker"
            className="w-full h-auto object-contain block select-none"
            loading="eager"
          />

          {/* Quick Click to Zoom Hover Overlay */}
          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="no-print absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 text-white font-mono text-xs font-bold tracking-wider backdrop-blur-[2px]"
            title="Click to view full screen"
          >
            <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-sky-400/50 shadow-2xl flex items-center gap-2 text-sky-300">
              <Maximize2 size={16} />
              <span>CLICK TO EXPAND HIGH-RESOLUTION VIEW</span>
            </div>
          </button>
        </div>

        {/* Format & Dimensions Label */}
        <div className="no-print flex items-center justify-between pt-2 px-1 text-[11px] font-mono text-slate-500">
          <span>DIMENSIONS: 1772 × 887 PX (A4 LANDSCAPE SPECIFICATION)</span>
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="text-sky-400 hover:text-sky-300 underline underline-offset-4 flex items-center gap-1"
          >
            <Maximize2 size={11} /> FULLSCREEN PREVIEW
          </button>
        </div>
      </div>

      {/* Rationale & Tactical Physical Execution Protocol */}
      <div className="no-print grid grid-cols-1 md:grid-cols-4 gap-3.5 pt-2">
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold">
            <Printer size={15} />
            <span>01. PRINT ON A4</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Print in landscape orientation on clean A4 white paper or cardstock for durability.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <Target size={15} />
            <span>02. INSCRIBE GOALS</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Handwrite your 10 critical habits and daily commitments in the left-hand goal slots.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
            <Shield size={15} />
            <span>03. MOUNT ON WALL</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Tape or pin it directly in front of your workstation or beside your bed where you cannot avoid it.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
            <Flame size={15} />
            <span>04. TICK DAILY BY HAND</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Every night before sleep, strike through each completed day with a black pen. Never break the chain.
          </p>
        </div>
      </div>

      {/* Tactical Lock-In Callout */}
      <div className="no-print p-4 sm:p-5 rounded-xl bg-sky-950/20 border border-sky-500/25 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
          <Clock size={18} />
        </div>
        <div className="space-y-1 text-xs">
          <div className="font-mono text-sky-300 font-bold uppercase tracking-wider">
            WHY PHYSICAL TICKING MATTERS
          </div>
          <p className="text-slate-300 leading-relaxed">
            Digital tracking records data, but physical ink creates neurological permanence. When you hold a pen and manually check off Day 01 through Day 90, your mind acknowledges the completion. Keep this sheet anchored to your physical environment throughout your entire 90-day transformation.
          </p>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {isPreviewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn"
        >
          {/* Modal Header */}
          <div className="w-full max-w-5xl flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-sky-400 font-bold tracking-widest uppercase">
                QUANTUM PHYSICAL SPECIFICATION • 90 DAYS
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrint}
                className="font-mono text-xs gap-1.5"
              >
                <Printer size={14} />
                <span>PRINT</span>
              </Button>
              <Button
                size="sm"
                variant="quantum"
                onClick={handleDownload}
                className="font-mono text-xs gap-1.5"
              >
                <Download size={14} />
                <span>DOWNLOAD</span>
              </Button>
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Modal Image Area */}
          <div className="flex-1 w-full max-w-6xl flex items-center justify-center p-2 sm:p-6 overflow-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/document/habit-tracker.png"
              alt="Official Habit Tracker High-Resolution View"
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg border border-slate-700 shadow-2xl"
            />
          </div>

          {/* Modal Footer */}
          <div className="w-full max-w-5xl text-center text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
            Press ESC or click close to return to onboarding.
          </div>
        </div>
      )}
    </section>
  );
};

export default PhysicalHabitTracker;
