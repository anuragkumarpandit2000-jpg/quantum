"use client";

import React, { useEffect, useRef } from "react";

interface TubesCursorProps {
  className?: string;
  fullPage?: boolean;
}

export default function TubesCursor({ className, fullPage = true }: TubesCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<any>(null);

  /**
   * Generates an array of random hex color strings.
   * @param count - The number of random colors to generate.
   */
  const randomColors = (count: number) => {
    return new Array(count)
      .fill(0)
      .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"));
  };

  const handleColorChange = () => {
    if (appRef.current?.tubes) {
      const newTubeColors = randomColors(3);
      const newLightColors = randomColors(4);

      appRef.current.tubes.setColors(newTubeColors);
      appRef.current.tubes.setLightsColors(newLightColors);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Skip heavy 3D WebGL Three.js canvas on mobile / touch-only devices to save GPU & battery
    if (typeof window !== "undefined") {
      const isMobileDevice =
        window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
      if (isMobileDevice) {
        return;
      }
    }

    // Delaying initialization ensures DOM is painted and final dimensions are ready
    const initTimer = setTimeout(async () => {
      try {
        if (!canvasRef.current) return;

        const loadESModule = (url: string) => {
          return new Function("modulePath", "return import(modulePath)")(url);
        };

        let module: any;
        try {
          // Local bundle for fast offline/local loading
          module = await loadESModule("/assets/scripts/tubes1.min.js");
        } catch {
          // Fallback to CDN as provided in user specification
          module = await loadESModule(
            "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
          );
        }

        const TubesCursorLib = module?.default || module;

        if (canvasRef.current && isMounted && typeof TubesCursorLib === "function") {
          const app = TubesCursorLib(canvasRef.current, {
            tubes: {
              colors: ["#5e72e4", "#8965e0", "#f5365c"],
              lights: {
                intensity: 220,
                colors: ["#21d4fd", "#b721ff", "#f4d03f", "#11cdef"],
              },
            },
          });
          appRef.current = app;
        }
      } catch (err) {
        console.error("Failed to load TubesCursor module:", err);
      }
    }, 100);

    // Global click listener: when user clicks outside buttons or inputs, change colors dynamically
    const handlePageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.closest("button") ||
          target.closest("a") ||
          target.closest("input"))
      ) {
        return;
      }
      handleColorChange();
    };

    window.addEventListener("click", handlePageClick);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      window.removeEventListener("click", handlePageClick);
      if (appRef.current && typeof appRef.current.dispose === "function") {
        try {
          appRef.current.dispose();
        } catch {}
      }
    };
  }, []);

  if (fullPage) {
    return (
      <div className={`hidden md:block fixed inset-0 pointer-events-none overflow-hidden z-0 ${className || ""}`}>
        <canvas
          ref={canvasRef}
          className="fixed inset-0 w-screen h-screen pointer-events-none z-0 opacity-90"
        />
      </div>
    );
  }

  return (
    <div
      onClick={handleColorChange}
      className={`hidden md:block absolute inset-0 overflow-hidden cursor-pointer z-0 ${className || ""}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-0"
      />
    </div>
  );
}
