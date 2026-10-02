"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  altBefore?: string;
  altAfter?: string;
  labelBefore?: string;
  labelAfter?: string;
  className?: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  beforeImage,
  afterImage,
  altBefore = "Day 01",
  altAfter = "After 90 Days",
  labelBefore = "DAY 01",
  labelAfter = "AFTER 90 DAYS",
  className,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let newPosition = ((clientX - rect.left) / rect.width) * 100;
      newPosition = Math.max(0, Math.min(100, newPosition));
      setSliderPosition(newPosition);
    },
    [isDragging]
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);

  const handleTouchStart = () => setIsDragging(true);
  const handleTouchEnd = () => setIsDragging(false);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full mx-auto select-none rounded-2xl overflow-hidden shadow-2xl border border-sky-500/30 bg-slate-950 group cursor-ew-resize aspect-[1086/1448]",
        className
      )}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Base Layer: AFTER (Muscular) on the Right side */}
      <div className="relative h-full w-full">
        <img
          src={afterImage}
          alt={altAfter}
          className="block h-full w-full object-cover object-center pointer-events-none"
          draggable="false"
        />
        <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md border border-cyan-400/50 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold px-2.5 py-1 rounded-full shadow-lg z-0">
          {labelAfter}
        </div>
      </div>

      {/* Top Clipped Layer: BEFORE (Skinny) on the Left side */}
      <div
        className="absolute top-0 left-0 h-full w-full overflow-hidden z-10"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={altBefore}
          className="h-full w-full object-cover object-center pointer-events-none"
          draggable="false"
        />
        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-600/80 text-slate-200 text-[10px] sm:text-xs font-mono font-bold px-2.5 py-1 rounded-full shadow-lg">
          {labelBefore}
        </div>
      </div>

      {/* Slider Divider Line with Cyan Glow & Light Trail */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-sky-400 via-cyan-100 to-sky-400 cursor-ew-resize flex items-center justify-center z-20 shadow-[0_0_20px_rgba(56,189,248,0.9),0_0_40px_rgba(34,211,238,0.5)]"
        style={{ left: `calc(${sliderPosition}% - 1px)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Sleek Directional Control Orb */}
        <div
          className={cn(
            "bg-[#030712] border-2 border-cyan-400 rounded-full h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.8)] transition-transform duration-150 ease-out select-none",
            isDragging ? "scale-110 border-white shadow-[0_0_30px_rgba(56,189,248,1)] ring-2 ring-cyan-300" : "group-hover:scale-105"
          )}
        >
          <div className="flex items-center gap-0.5 text-cyan-300 font-mono text-[10px] font-bold pointer-events-none">
            <span className="text-[12px] leading-none">‹</span>
            <div className="w-[1.5px] h-3 bg-cyan-400/80 rounded-full" />
            <span className="text-[12px] leading-none">›</span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-slate-950/80 backdrop-blur-md border border-sky-500/30 px-3.5 py-1 rounded-full text-[10px] font-mono text-cyan-300 tracking-wider shadow-lg opacity-85 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        DRAG TO REVEAL TRANSFORMATION
      </div>
    </div>
  );
};

export default ImageComparison;
