"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface QuantumSpecCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
  maxShift?: number;
  liftDistance?: number;
  badge?: string;
  indexNumber?: string;
}

export const QuantumSpecCard: React.FC<QuantumSpecCardProps> = ({
  children,
  className,
  glowColor = "rgba(56, 189, 248, 0.22)",
  maxTilt = 5.5,
  maxShift = 4,
  liftDistance = 6,
  badge,
  indexNumber,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [deviceScale, setDeviceScale] = useState(1); // 1 = desktop, 0.5 = tablet, 0 = mobile

  const [targetTransform, setTargetTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    transX: 0,
    transY: 0,
    transZ: 0,
    scale: 1,
  });

  const [glowPos, setGlowPos] = useState({ x: 0, y: 0, opacity: 0 });

  // Detect device capabilities & responsive tilt scaling
  useEffect(() => {
    const checkDevice = () => {
      const isTouch =
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);

      const width = window.innerWidth;
      if (width < 640 || isTouch) {
        setDeviceScale(0); // Mobile / Touch: Disable 3D tilt
      } else if (width < 1024) {
        setDeviceScale(0.5); // Tablet: Half intensity
      } else {
        setDeviceScale(1); // Desktop: Full intensity
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || deviceScale === 0) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const normX = (x - centerX) / centerX; // -1 to 1
        const normY = (y - centerY) / centerY; // -1 to 1

        const activeTilt = maxTilt * deviceScale;
        const activeShift = maxShift * deviceScale;

        // Cursor toward upper-right (normX > 0, normY < 0) -> tilts toward upper-right (rotateY > 0, rotateX > 0)
        const rotX = -normY * activeTilt;
        const rotY = normX * activeTilt;
        const trX = normX * activeShift;
        const trY = -liftDistance + normY * (activeShift * 0.5);

        setTargetTransform({
          rotateX: rotX,
          rotateY: rotY,
          transX: trX,
          transY: trY,
          transZ: 10 * deviceScale,
          scale: 1.012,
        });

        setGlowPos({ x, y, opacity: 1 });
      });
    },
    [deviceScale, maxTilt, maxShift, liftDistance]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsHovered(false);
    setTargetTransform({
      rotateX: 0,
      rotateY: 0,
      transX: 0,
      transY: 0,
      transZ: 0,
      scale: 1,
    });
    setGlowPos((prev) => ({ ...prev, opacity: 0 }));
  };

  const transformStyle =
    deviceScale === 0
      ? undefined
      : `perspective(1000px) rotateX(${targetTransform.rotateX.toFixed(2)}deg) rotateY(${targetTransform.rotateY.toFixed(2)}deg) translate3d(${targetTransform.transX.toFixed(1)}px, ${targetTransform.transY.toFixed(1)}px, ${targetTransform.transZ.toFixed(1)}px) scale(${targetTransform.scale})`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered
          ? "transform 0.1s cubic-bezier(0.1, 0.9, 0.2, 1), box-shadow 0.25s ease, border-color 0.25s ease"
          : "transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease, border-color 0.4s ease",
        willChange: deviceScale > 0 ? "transform" : "auto",
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative rounded-2xl select-none p-6 sm:p-7 flex flex-col justify-between overflow-hidden",
        // Base normal state: subtle dark obsidian glass, very restrained border
        "bg-slate-950/75 backdrop-blur-xl border border-white/[0.08]",
        // Cursor interaction: soft cyan illumination, brighter edge, slight elevation
        isHovered
          ? "border-sky-400/50 shadow-[0_20px_45px_rgba(56,189,248,0.18),0_0_20px_rgba(56,189,248,0.12)] bg-slate-950/90 z-20"
          : "shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:border-white/20 z-0",
        // Mobile tap state
        isTouchDevice && "active:scale-[0.99] active:border-sky-400/40",
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Light Reflection / Spotlight Glow */}
      {deviceScale > 0 && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 z-0"
          style={{
            opacity: glowPos.opacity,
            background: `radial-gradient(420px circle at ${glowPos.x}px ${glowPos.y}px, ${glowColor}, transparent 65%)`,
          }}
        />
      )}

      {/* Subtle internal border gradient shimmer on hover */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl border border-sky-400/30 transition-opacity duration-500",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Card Header Metadata (if badge or index provided) */}
      {(badge || indexNumber) && (
        <div className="relative z-10 flex items-center justify-between gap-2 mb-4 font-mono text-[10px] tracking-widest uppercase">
          {indexNumber && (
            <span className="text-sky-400/70 font-semibold group-hover:text-sky-300 transition-colors">
              {indexNumber}
            </span>
          )}
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/25 text-sky-300 font-medium tracking-wider text-[9px] group-hover:border-sky-400/50 transition-colors">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Main Internal Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

export default QuantumSpecCard;
