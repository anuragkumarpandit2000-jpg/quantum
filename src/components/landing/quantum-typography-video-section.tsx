"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Play, Maximize2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantumTypographyVideoSectionProps {
  className?: string;
}

export const QuantumTypographyVideoSection: React.FC<QuantumTypographyVideoSectionProps> = ({
  className,
}) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCtaHovered, setIsCtaHovered] = useState(false);

  // Autoplay with IntersectionObserver: plays when visible, pauses when out of view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure muted is set before play attempt (browser policy requirement)
    video.muted = true;
    video.defaultMuted = true;

    const playVideo = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        // Autoplay may be deferred until user touches/scrolls on strict mobile browsers
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playVideo();
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      {
        threshold: 0.25,
        rootMargin: "50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/about");
  };

  return (
    <section
      ref={sectionRef}
      id="typography-spec"
      className={cn(
        "relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-24",
        className
      )}
    >
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-[11px] tracking-widest uppercase shadow-[0_0_20px_rgba(56,189,248,0.2)]">
          <Sparkles size={12} className="text-sky-400 animate-pulse" />
          <span>CINEMATIC ARCHITECTURE • SCENE 01</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
          YOU NEED A <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">SYSTEM</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
          Motivation is volatile. Discipline is engineered. Inspect the core Quantum transformation architecture below or click the interactive visual CTA inside the video.
        </p>
      </div>

      {/* Video Presentation Chassis */}
      <div className="relative mx-auto max-w-5xl rounded-3xl overflow-hidden border border-sky-500/25 bg-slate-950/80 backdrop-blur-2xl shadow-[0_0_60px_rgba(56,189,248,0.15)] group">
        {/* Top Status Bar of the Chassis */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/[0.08] bg-slate-900/60 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white font-semibold">QUANTUM TYPOGRAPHY SYSTEM</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-sky-400 text-[10px] hidden sm:inline">1280x720 PRO RES</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 hidden sm:inline">AUTOPLAYING LOOP</span>
            <Link
              href="/about"
              className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-bold transition-colors"
            >
              <span>SPECIFICATION</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Video Player Container with precise 16:9 aspect ratio */}
        <div className="relative w-full aspect-video bg-black overflow-hidden select-none">
          {/* Native Typography Video */}
          <video
            ref={videoRef}
            src="/assets/videos/typography_landing.mp4"
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            preload="auto"
            onLoadedData={() => setIsVideoLoaded(true)}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-700",
              isVideoLoaded ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Fallback / Loading Skeleton to prevent layout shifts */}
          {!isVideoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
              <div className="flex flex-col items-center gap-3 text-slate-500 font-mono text-xs">
                <div className="w-8 h-8 rounded-full border-2 border-sky-400/40 border-t-transparent animate-spin" />
                <span>INITIALIZING SYSTEM VIDEO...</span>
              </div>
            </div>
          )}

          {/* ============================================================
              INTERACTIVE CTA OVERLAY ("VIEW FULL ABOUT SPECIFICATION ↗")
              Precisely mapped to the video's central pill button:
              Left: 27.5%, Top: 37.8%, Width: 47.3%, Height: 24.3%
              ============================================================ */}
          <Link
            href="/about"
            onClick={handleCtaClick}
            onMouseEnter={() => setIsCtaHovered(true)}
            onMouseLeave={() => setIsCtaHovered(false)}
            aria-label="View Full About Specification"
            title="Click to view full Quantum Architecture & Specification"
            className={cn(
              "absolute z-20 cursor-pointer rounded-full transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-black",
              // Precise 16:9 positioning matching video pixel metrics
              "left-[27.5%] top-[37.8%] w-[47.3%] h-[24.3%]",
              // Subtle hover elevation & interactive ring
              isCtaHovered
                ? "shadow-[0_0_35px_rgba(56,189,248,0.45)] ring-1 ring-sky-400/60 scale-[1.02]"
                : "ring-0"
            )}
          >
            {/* Transparent click zone with subtle interactive cursor indicator on hover */}
            <span className="sr-only">VIEW FULL ABOUT SPECIFICATION ↗</span>

            {/* Subtle reactive glow hint on hover without obscuring the video typography */}
            <div
              className={cn(
                "w-full h-full rounded-full transition-opacity duration-300 pointer-events-none",
                isCtaHovered
                  ? "bg-sky-400/[0.08] shadow-[inset_0_0_20px_rgba(56,189,248,0.3)] opacity-100"
                  : "opacity-0"
              )}
            />
          </Link>

          {/* Subtle Hover Tooltip / Hint when approaching the video */}
          <div
            className={cn(
              "absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-300",
              "px-4 py-1.5 rounded-full bg-slate-950/80 border border-sky-400/30 backdrop-blur-md",
              "text-[10px] font-mono text-sky-300 flex items-center gap-2",
              isCtaHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            <Shield size={11} className="text-sky-400" />
            <span>INTERACTIVE CTA • CLICK TO OPEN SPECIFICATION PAGE</span>
            <ArrowRight size={11} className="text-sky-300" />
          </div>
        </div>

        {/* Bottom Bar with Direct Navigation Links */}
        <div className="px-6 py-4 bg-slate-950/95 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-sky-400 font-bold">PRO-TIP:</span>
            <span>Click the button in the video above to explore the complete 15-pillar architecture.</span>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/40 text-sky-300 hover:text-white font-mono text-xs font-bold tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
          >
            <span>VIEW FULL ABOUT SPECIFICATION</span>
            <ArrowRight size={14} className="text-sky-400" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QuantumTypographyVideoSection;
