"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Award,
  Sparkles,
  Download,
  Printer,
  CheckCircle2,
  ExternalLink,
  X,
  Flame,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QuantumCompletionCertificate, {
  QuantumCertificateData,
  downloadCertificateImage,
} from "./quantum-completion-certificate";
import { useAudio } from "@/components/audio/audio-provider";

interface ArcCompletionCelebrationProps {
  data: QuantumCertificateData;
  onClose?: () => void;
  autoPlayAudio?: boolean;
}

export const ArcCompletionCelebration: React.FC<ArcCompletionCelebrationProps> = ({
  data,
  onClose,
  autoPlayAudio = true,
}) => {
  // Steps: 'intro' -> 'title' -> 'sweep' -> 'earned' -> 'certificate'
  const [step, setStep] = useState<
    "intro" | "title" | "sweep" | "earned" | "certificate"
  >("intro");

  const [isExporting, setIsExporting] = useState(false);
  const audioContext = useAudio();
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Play epic victory music on mount
  useEffect(() => {
    if (autoPlayAudio && audioContext?.playTrack) {
      audioContext.playTrack("epic");
    }
  }, [autoPlayAudio, audioContext]);

  // Subtle floating particles canvas
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.6 + 0.2,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Orchestrate Cinematic Celebration Sequence
  useEffect(() => {
    // 1. Intro: 0 to 1.8s
    const timer1 = setTimeout(() => {
      setStep("title");
    }, 1800);

    // 2. Title: 1.8s to 4.5s
    const timer2 = setTimeout(() => {
      setStep("sweep");
    }, 4500);

    // 3. Light Sweep: 4.5s to 6.0s
    const timer3 = setTimeout(() => {
      setStep("earned");
    }, 6000);

    // 4. Certificate Fade-in: 7.6s
    const timer4 = setTimeout(() => {
      setStep("certificate");
    }, 7600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Print Handler
  const handlePrint = () => {
    document.body.classList.add("printing-landscape");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("printing-landscape");
    }, 1000);
  };

  // Direct PNG Download
  const handleDownloadImage = async () => {
    setIsExporting(true);
    try {
      await downloadCertificateImage(data);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#02050f] text-slate-100 flex flex-col items-center justify-center overflow-y-auto selection:bg-sky-500 selection:text-slate-950 font-sans">
      {/* Background Particle Layer */}
      <canvas
        ref={particleCanvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-70"
      />

      {/* Ambient Radial Gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#02050f]/80 via-transparent to-[#02050f]/90 pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-500/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Top Controls: Close / Fast Forward */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3 no-print">
        {step !== "certificate" && (
          <button
            onClick={() => setStep("certificate")}
            className="text-[11px] font-mono tracking-widest text-slate-400 hover:text-sky-400 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/10 transition-colors"
          >
            SKIP ANIMATION ➔
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ========================================================
          CELEBRATION STAGES (0 to 7 seconds)
          ======================================================== */}
      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center space-y-4 z-10"
          >
            <div className="relative w-20 h-20 rounded-3xl bg-slate-950/80 border-2 border-sky-400/50 p-2 flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.4)] overflow-hidden">
              <Image
                src="/assets/images/logo/logo.png"
                alt="Quantum Sovereign Logo"
                width={72}
                height={72}
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]"
                priority
              />
            </div>
            <div className="font-mono text-xs tracking-[0.4em] text-sky-400 uppercase">
              QUANTUM PROTOCOL
            </div>
            <div className="font-mono text-4xl sm:text-5xl font-black tracking-widest text-white">
              90 / 90
            </div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              CONSECUTIVE DAYS COMPLETED
            </div>
          </motion.div>
        )}

        {step === "title" && (
          <motion.div
            key="title"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex flex-col items-center text-center space-y-4 max-w-xl px-4 z-10"
          >
            <div className="font-mono text-xs tracking-[0.4em] text-cyan-400 uppercase">
              MISSION STATUS: COMPLETE
            </div>

            <h1 className="font-mono text-5xl sm:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-white to-cyan-300 drop-shadow-[0_0_35px_rgba(56,189,248,0.5)] uppercase">
              ARC COMPLETE
            </h1>

            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent my-2" />

            <div className="font-mono text-sm sm:text-base text-slate-300 tracking-[0.2em] leading-relaxed uppercase">
              90 DAYS.
              <br />
              ONE COMMITMENT.
              <br />
              ONE COMPLETED ARC.
            </div>
          </motion.div>
        )}

        {step === "sweep" && (
          <motion.div
            key="sweep"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center text-center space-y-4"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_30px_rgba(56,189,248,1)] max-w-2xl w-full"
            />
            <div className="font-mono text-sm tracking-[0.3em] text-sky-300 animate-pulse uppercase">
              SEALING RECOGNITION DATA...
            </div>
          </motion.div>
        )}

        {step === "earned" && (
          <motion.div
            key="earned"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center space-y-4 z-10"
          >
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border-2 border-amber-400/50 flex items-center justify-center text-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.35)]">
              <Award size={40} className="animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="font-mono text-xs tracking-[0.4em] text-amber-400 uppercase">
                ACHIEVEMENT RATIFIED
              </div>
              <h2 className="font-mono text-3xl sm:text-5xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                CERTIFICATE EARNED
              </h2>
            </div>
          </motion.div>
        )}

        {/* ========================================================
            STAGE 5: FINAL CERTIFICATE REVEAL (A4 Landscape)
            ======================================================== */}
        {step === "certificate" && (
          <motion.div
            key="certificate"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center space-y-6"
          >
            {/* Header Controls Banner */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-xl no-print">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-emerald-400 tracking-wider">
                    90-DAY WINTER ARC COMPLETED
                  </div>
                  <div className="font-mono text-[10px] text-slate-400">
                    ARC ID: {data.arcId} • OFFICIALLY CRYPTOGRAPHICALLY AUTHENTICATED
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs gap-1.5 border-slate-700 hover:border-slate-500 text-slate-200"
                >
                  <Printer size={14} />
                  <span>PRINT (A4)</span>
                </Button>

                <Button
                  onClick={handleDownloadImage}
                  disabled={isExporting}
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs gap-1.5 border-sky-600 hover:border-sky-500 text-sky-300 hover:bg-sky-950/40"
                >
                  <Download size={14} />
                  <span>{isExporting ? "GENERATING..." : "DOWNLOAD CERTIFICATE"}</span>
                </Button>

                <a
                  href={`/verify/${data.arcId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  <span>QR SEAL</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Official Realistic A4 Landscape Certificate Document */}
            <div className="w-full flex justify-center py-2">
              <QuantumCompletionCertificate data={data} />
            </div>

            {/* Post-Completion Motivational Bottom Callout */}
            <div className="w-full max-w-2xl text-center space-y-3 pt-4 no-print">
              <div className="font-mono text-[11px] text-sky-400 tracking-widest uppercase">
                &ldquo;Discipline builds freedom. You have endured 90 days.&rdquo;
              </div>
              <p className="font-sans text-xs text-slate-400 leading-relaxed">
                Your sovereign certificate of completion is permanently recorded. You may revisit, print, or download it from your Command Center dashboard at any time.
              </p>
              {onClose && (
                <div className="pt-2">
                  <Button
                    onClick={onClose}
                    variant="quantum"
                    size="lg"
                    className="font-mono text-xs gap-2"
                  >
                    <span>RETURN TO COMMAND CENTER</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArcCompletionCelebration;
