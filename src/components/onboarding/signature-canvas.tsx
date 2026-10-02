"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { RotateCcw, Check, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignatureCanvasProps {
  onSignatureChange: (signatureDataUrl: string | null) => void;
  initialSignature?: string | null;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onSignatureChange,
  initialSignature = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(Boolean(initialSignature));
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Adjust canvas resolution for high-DPI screens
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Initial clear with crisp transparent background
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initCanvas]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCanvasCoordinates(e);
    setIsDrawing(true);
    setLastPoint(coords);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    // Drawing style: smooth, high-precision dark pen
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#020617"; // pure dark ink for print clarity

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const currentCoords = getCanvasCoordinates(e);

    // Smooth quadratic curve midpoint for cursive fluidity
    const midX = (lastPoint.x + currentCoords.x) / 2;
    const midY = (lastPoint.y + currentCoords.y) / 2;

    ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midX, midY);
    ctx.stroke();

    setLastPoint(currentCoords);
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setLastPoint(null);

    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      onSignatureChange(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onSignatureChange(null);
  };

  return (
    <div className="space-y-3 w-full">
      {/* Canvas container with paper aesthetic */}
      <div className="relative rounded-2xl bg-white border border-slate-300 shadow-inner overflow-hidden select-none touch-none h-44 sm:h-52">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair"
        />

        {/* Subtle Watermark Guideline */}
        <div className="absolute inset-x-8 bottom-10 pointer-events-none border-b border-dashed border-slate-300/80 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
            SIGNATURE BASELINE
          </span>
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <PenTool size={11} /> DRAW CURSIVE SIGNATURE
          </span>
        </div>

        {/* Empty placeholder prompt when untouched */}
        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 gap-1.5 font-mono text-xs">
            <PenTool size={20} className="text-slate-400/80 animate-bounce" />
            <span>Draw your signature with your mouse, finger, or stylus</span>
          </div>
        )}
      </div>

      {/* Signature Controls */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          {hasDrawn ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <Check size={14} className="stroke-[3]" />
              SIGNATURE CAPTURED
            </span>
          ) : (
            <span className="text-slate-500">
              PENDING PARTICIPANT SIGNATURE
            </span>
          )}
        </div>

        <Button
          type="button"
          onClick={clearCanvas}
          variant="outline"
          size="sm"
          disabled={!hasDrawn}
          className="font-mono text-xs border-slate-700 hover:border-red-500/50 hover:text-red-400 gap-1.5"
        >
          <RotateCcw size={13} />
          CLEAR
        </Button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
