"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface QuantumTiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
  liftDistance?: number;
  enableScrollBlur?: boolean;
}

export const QuantumTiltCard: React.FC<QuantumTiltCardProps> = ({
  children,
  className,
  glowColor = "rgba(56, 189, 248, 0.2)",
  maxTilt = 3,
  liftDistance = 3,
  enableScrollBlur = true,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)"
  );
  const [glowStyle, setGlowStyle] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(!enableScrollBlur);

  // Scroll depth blur observer: components down below are blurry until scrolled into view
  useEffect(() => {
    if (!enableScrollBlur) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [enableScrollBlur]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) translateY(-${liftDistance}px) scale3d(1.01, 1.01, 1.01)`
    );
    setGlowStyle({ x, y, opacity: 1 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)");
    setGlowStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "transition-all duration-700 ease-out",
        enableScrollBlur &&
          (isVisible
            ? "filter-none opacity-100 translate-y-0"
            : "opacity-60 translate-y-4 md:blur-[9px] md:translate-y-7")
      )}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform,
          transition: isHovered
            ? "transform 0.1s ease-out"
            : "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease",
          willChange: "transform",
        }}
        className={cn(
          "relative rounded-2xl select-none",
          "bg-slate-950/40 backdrop-blur-md border border-sky-500/20",
          "transition-colors duration-300 ease-out",
          // When hovered: "hawa me uth jaye" (lift into air + cyan glow shadow)
          isHovered
            ? "border-sky-400/80 shadow-[0_20px_50px_rgba(56,189,248,0.28),0_0_25px_rgba(56,189,248,0.18)] bg-slate-900/60 z-20"
            : "shadow-xl border-sky-500/15 z-0 hover:border-sky-400/40",
          className
        )}
        {...props}
      >
        {/* Dynamic Cursor Follow Spotlight Glow */}
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 z-0"
          style={{
            opacity: glowStyle.opacity,
            background: `radial-gradient(400px circle at ${glowStyle.x}px ${glowStyle.y}px, ${glowColor}, transparent 65%)`,
          }}
        />

        {/* Internal Content */}
        <div className="relative z-10 h-full w-full">{children}</div>
      </div>
    </div>
  );
};

export default QuantumTiltCard;
