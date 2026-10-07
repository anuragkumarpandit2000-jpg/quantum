"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileRotatingShowcaseProps {
  className?: string;
  totalFrames?: number;
  frameRate?: number; // frames per second (e.g. 24 or 30)
  autoPlay?: boolean;
  activeFeatureIndex?: number;
}

const TOTAL_FRAMES = 240;
const NATIVE_WIDTH = 303;
const NATIVE_HEIGHT = 684;

export const MobileRotatingShowcase: React.FC<MobileRotatingShowcaseProps> = ({
  className,
  totalFrames = TOTAL_FRAMES,
  frameRate = 30,
  autoPlay = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef<number>(1);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startFrameRef = useRef<number>(1);
  const animFrameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(true);

  // Pause rendering when canvas is scrolled off-screen to save CPU & GPU
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      setIsPlaying(false);
    }

    const handler = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      if (e.matches) setIsPlaying(false);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const getFrameUrl = (frameIndex: number) => {
    const numStr = String(frameIndex).padStart(3, "0");
    return `/assets/mobile-frames/frame_${numStr}.png`;
  };

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check target frame, or find nearest loaded frame so canvas is never blank
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Find nearest loaded frame
      for (let offset = 1; offset < 20; offset++) {
        const prev = ((frameIndex - offset - 1 + totalFrames) % totalFrames) + 1;
        const candidate = imagesRef.current[prev];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          img = candidate;
          break;
        }
      }
    }

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, NATIVE_WIDTH, NATIVE_HEIGHT);
      ctx.drawImage(img, 0, 0, NATIVE_WIDTH, NATIVE_HEIGHT);
    }
  }, [totalFrames]);

  // Robust Progressive Frame Preloading
  useEffect(() => {
    let isCancelled = false;
    imagesRef.current = new Array(totalFrames + 1).fill(null);

    const loadFrame = (index: number) => {
      if (isCancelled || index > totalFrames) return;
      const img = new window.Image();
      img.src = getFrameUrl(index);
      imagesRef.current[index] = img;

      img.onload = () => {
        if (isCancelled) return;
        setLoadedCount((c) => c + 1);
        setIsReady(true);
        if (index === 1 && currentFrameRef.current === 1) {
          drawFrame(1);
        }
      };

      img.onerror = () => {
        // Silently mark as loaded to not halt loop
      };
    };

    // 1. Immediately kick off first 40 frames
    for (let i = 1; i <= Math.min(40, totalFrames); i++) {
      loadFrame(i);
    }

    // 2. Stream the remaining frames in chunks to prevent network choking
    const timer = setTimeout(() => {
      if (isCancelled) return;
      for (let i = 41; i <= totalFrames; i++) {
        loadFrame(i);
      }
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [totalFrames, drawFrame]);

  // High-DPI Canvas Initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = NATIVE_WIDTH * dpr;
    canvas.height = NATIVE_HEIGHT * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    }

    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Continuous 360° Animation Loop (Pauses automatically when off-screen)
  useEffect(() => {
    if (!isPlaying || isReducedMotion || !isInView) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      return;
    }

    const frameInterval = 1000 / frameRate;

    const render = (time: number) => {
      if (!lastFrameTimeRef.current) lastFrameTimeRef.current = time;
      const elapsed = time - lastFrameTimeRef.current;

      if (elapsed >= frameInterval) {
        lastFrameTimeRef.current = time - (elapsed % frameInterval);

        // Always advance to next frame continuously
        let nextFrame = currentFrameRef.current + 1;
        if (nextFrame > totalFrames) {
          nextFrame = 1;
        }

        currentFrameRef.current = nextFrame;
        drawFrame(nextFrame);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [isPlaying, isReducedMotion, isInView, frameRate, totalFrames, drawFrame]);

  // Interactive Drag / Touch Scrubbing
  const handlePointerDown = (clientX: number) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    startFrameRef.current = currentFrameRef.current;
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - startXRef.current;
    const frameDelta = Math.round(deltaX / 4);
    let target = ((startFrameRef.current + frameDelta - 1) % totalFrames) + 1;
    if (target < 1) target += totalFrames;

    currentFrameRef.current = target;
    drawFrame(target);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className={cn("relative flex flex-col items-center justify-center select-none group", className)}>
      {/* Background Volumetric Blue Ambient Aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-[340px] sm:w-[420px] h-[520px] rounded-full bg-gradient-to-tr from-sky-600/25 via-cyan-500/20 to-indigo-600/15 blur-[80px] animate-pulse" />
        <div className="w-[280px] h-[360px] rounded-full bg-sky-400/15 blur-[50px]" />
      </div>

      {/* Frame Container */}
      <div
        className="relative cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={handlePointerUp}
      >
        <canvas
          ref={canvasRef}
          className="w-auto h-[440px] sm:h-[520px] md:h-[560px] max-w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] filter group-hover:drop-shadow-[0_25px_60px_rgba(56,189,248,0.4)] transition-all duration-300"
          style={{
            aspectRatio: `${NATIVE_WIDTH} / ${NATIVE_HEIGHT}`,
          }}
          aria-label="Quantum Mobile 3D Rotating Smartphone"
        />

        {/* Loading Indicator for first batch */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm rounded-3xl" aria-label="Loading interactive preview">
            <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      {/* Tactical Controls & Continuous Rotation Indicator */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 text-slate-300 hover:text-white text-[11px] font-mono backdrop-blur-md transition shadow-md cursor-pointer"
          title={isPlaying ? "Pause rotation" : "Play rotation"}
        >
          {isPlaying ? <Pause size={12} className="text-sky-400" /> : <Play size={12} className="text-sky-400" />}
          <span>{isPlaying ? "PAUSE" : "ROTATE"}</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-[11px] font-mono">
          <RotateCw size={12} className={cn("text-sky-400", isPlaying && "animate-spin [animation-duration:8s]")} />
          <span>360° CONTINUOUS SPIN</span>
        </div>

        <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500">
          DRAG TO SCRUB
        </span>
      </div>
    </div>
  );
};

export default MobileRotatingShowcase;
