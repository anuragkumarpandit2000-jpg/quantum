"use client";

import React, { useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantumWelcomeVideoSectionProps {
  className?: string;
}

export const QuantumWelcomeVideoSection: React.FC<QuantumWelcomeVideoSectionProps> = ({
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Seamless viewport-triggered autoplay via IntersectionObserver
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const playVideo = async () => {
      try {
        if (video.paused) {
          await video.play();
        }
      } catch {
        // Handled silently by browser policy
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playVideo();
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: "120px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="welcome-protocol"
      className={cn(
        "relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-24",
        className
      )}
    >
      {/* Subtle Background Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Cinematic Transition Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-[11px] tracking-widest uppercase shadow-[0_0_20px_rgba(56,189,248,0.2)]">
          <Sparkles size={12} className="text-sky-400 animate-pulse" />
          <span>CINEMATIC ARCHITECTURE • SCENE 02</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
          THE ENGINE OF <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">TRANSFORMATION</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
          From intention to daily action, from action to indisputable proof. Watch the complete Quantum behavioral flywheel in continuous motion.
        </p>
      </div>

      {/* Cinematic Video Presentation Chassis */}
      <div className="relative mx-auto max-w-5xl rounded-2xl sm:rounded-3xl overflow-hidden border border-sky-500/25 bg-slate-950/80 backdrop-blur-2xl shadow-[0_0_60px_rgba(56,189,248,0.15)] group transition-all duration-500 hover:border-sky-400/40">
        {/* Top Status Bar of the Chassis */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/[0.08] bg-slate-900/60 font-mono text-[11px] text-slate-400 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-white font-semibold tracking-wider">TRANSFORMATION ENGINE</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-sky-400 text-[10px] hidden sm:inline">INTENTION → ACTION → PROOF</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">LIVE FEED</span>
          </div>
        </div>

        {/* Video Player Container with strict 16:9 aspect ratio */}
        <div className="relative w-full aspect-video bg-black overflow-hidden select-none">
          <video
            ref={videoRef}
            src="/assets/videos/welcome.mp4"
            poster="/assets/videos/welcome_poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            preload="metadata"
            className="w-full h-full object-cover"
          />

          {/* Subtle Ambient Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>
      </div>
    </section>
  );
};

export default QuantumWelcomeVideoSection;
