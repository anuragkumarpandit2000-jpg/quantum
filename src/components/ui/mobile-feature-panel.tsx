"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface MobileFeaturePanelProps {
  icon: React.ReactNode;
  badge?: string;
  featureNumber?: string;
  name: string;
  subtitle?: string;
  description: string;
  statusText?: string;
  statusVariant?: "online" | "warning" | "active" | "neutral" | "danger";
  className?: string;
  children?: React.ReactNode;
  headerRight?: React.ReactNode;
  glow?: boolean;
}

export const MobileFeaturePanel: React.FC<MobileFeaturePanelProps> = ({
  icon,
  badge,
  featureNumber,
  name,
  subtitle,
  description,
  statusText = "ONLINE",
  statusVariant = "online",
  className,
  children,
  headerRight,
  glow = true,
}) => {
  const getStatusStyles = () => {
    switch (statusVariant) {
      case "online":
        return {
          dot: "bg-emerald-400 animate-pulse",
          text: "text-emerald-400/90",
          bg: "bg-emerald-500/10 border-emerald-500/20",
        };
      case "active":
        return {
          dot: "bg-sky-400 animate-ping",
          text: "text-sky-300",
          bg: "bg-sky-500/10 border-sky-400/30",
        };
      case "warning":
        return {
          dot: "bg-amber-400 animate-pulse",
          text: "text-amber-300",
          bg: "bg-amber-500/10 border-amber-500/30",
        };
      case "danger":
        return {
          dot: "bg-rose-500 animate-pulse",
          text: "text-rose-400",
          bg: "bg-rose-500/10 border-rose-500/30",
        };
      case "neutral":
      default:
        return {
          dot: "bg-slate-400",
          text: "text-slate-400",
          bg: "bg-slate-800/40 border-slate-700/40",
        };
    }
  };

  const status = getStatusStyles();

  // 3D Tilt & Cursor Lift State
  const [transform, setTransform] = useState<string>(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)"
  );
  const [glowStyle, setGlowStyle] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`
    );
    setGlowStyle({ x, y, opacity: 1 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)");
    setGlowStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        willChange: "transform",
      }}
      className={cn(
        "relative rounded-2xl p-5 sm:p-6 transition-all duration-300 ease-out flex flex-col justify-between select-none",
        "bg-slate-950/40 backdrop-blur-md border border-sky-500/20",
        isHovered
          ? "border-sky-400/80 shadow-[0_20px_45px_rgba(56,189,248,0.25)] bg-slate-900/55 z-10"
          : "border-sky-500/20 shadow-[0_0_30px_rgba(56,189,248,0.08)] z-0",
        className
      )}
    >
      {/* Dynamic Cursor Follow Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: glowStyle.opacity,
          background: `radial-gradient(350px circle at ${glowStyle.x}px ${glowStyle.y}px, rgba(56,189,248,0.22), transparent 70%)`,
        }}
      />
      {/* Subtle corner tech accent */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-40">
        <span className="w-1 h-1 rounded-full bg-sky-400" />
        <span className="w-4 h-[1px] bg-sky-400/50" />
      </div>

      <div className="space-y-4">
        {/* Top Header: Icon + Number/Badge + Status */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)] shrink-0">
              {icon}
            </div>
            <div>
              {featureNumber && (
                <div className="font-mono text-[10px] tracking-widest text-sky-400 uppercase font-semibold">
                  FEATURE {featureNumber}
                </div>
              )}
              {badge && (
                <span className="inline-block font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                  {badge}
                </span>
              )}
            </div>
          </div>

          {headerRight || (
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[10px] tracking-wider uppercase backdrop-blur-sm",
                status.bg,
                status.text
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", status.dot)} />
              <span>{statusText}</span>
            </div>
          )}
        </div>

        {/* Feature Title & Subtitle */}
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            {name}
          </h3>
          {subtitle && (
            <div className="font-mono text-xs text-sky-400 tracking-wider uppercase font-medium">
              {subtitle}
            </div>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-sans font-normal">
          {description}
        </p>

        {/* Dynamic Micro-Animation / Interactive Children Slot */}
        {children && <div className="pt-2">{children}</div>}
      </div>

      {/* Bottom Technical Watermark */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span className="tracking-widest uppercase">QUANTUM OS • MOBILE PROTOCOL</span>
        <span className="text-sky-400/60 tracking-wider">SECURE SYNC</span>
      </div>
    </div>
  );
};

export default MobileFeaturePanel;
