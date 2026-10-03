"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Check,
  Loader2,
  Sparkles,
  Camera,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AvatarCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (avatarUrl: string) => void;
}

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const CROP_SIZE = 260; // Size of circular viewport in pixels

  // Load image dimensions when source changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      // Initial scale so that image fills the crop area
      const minDimension = Math.min(img.naturalWidth, img.naturalHeight);
      const initialScale = Math.max(1, (CROP_SIZE / minDimension) * 1.05);
      setScale(initialScale);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Generate cropped preview on canvas
  const generateCroppedImage = useCallback(
    (targetSize: number = 400): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Unable to create canvas context"));
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // Center of target canvas
          const cx = targetSize / 2;
          const cy = targetSize / 2;

          // Apply circular clip
          ctx.beginPath();
          ctx.arc(cx, cy, targetSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          // Move to center, apply rotation and position offset, then draw
          ctx.translate(cx, cy);
          ctx.rotate((rotation * Math.PI) / 180);

          // Calculate drawing scale ratio between CROP_SIZE on screen and targetSize
          const ratio = targetSize / CROP_SIZE;
          const drawScale = scale * ratio;

          ctx.translate(position.x * ratio, position.y * ratio);

          const drawWidth = img.naturalWidth * (CROP_SIZE / Math.min(img.naturalWidth, img.naturalHeight)) * (scale * ratio);
          const drawHeight = img.naturalHeight * (CROP_SIZE / Math.min(img.naturalWidth, img.naturalHeight)) * (scale * ratio);

          ctx.drawImage(
            img,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight
          );

          resolve(canvas.toDataURL("image/webp", 0.92));
        };
        img.onerror = reject;
        img.src = imageSrc;
      });
    },
    [imageSrc, scale, rotation, position]
  );

  // Update live preview occasionally
  useEffect(() => {
    if (!isOpen || !imageSrc || imageSize.width === 0) return;
    const timeout = setTimeout(() => {
      generateCroppedImage(128)
        .then((dataUrl) => setPreviewDataUrl(dataUrl))
        .catch(() => {});
    }, 100);
    return () => clearTimeout(timeout);
  }, [isOpen, imageSrc, scale, rotation, position, imageSize, generateCroppedImage]);

  // Drag handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Confirm and upload
  const handleConfirmCrop = async () => {
    try {
      setIsSaving(true);
      const dataUrl = await generateCroppedImage(400);

      // Upload to server
      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        // Fallback to data URL directly if endpoint encountered an issue
        onCropComplete(dataUrl);
      } else {
        onCropComplete(data.url);
      }
      onClose();
    } catch (err) {
      console.error("Crop save error:", err);
      // Fallback
      try {
        const fallbackDataUrl = await generateCroppedImage(320);
        onCropComplete(fallbackDataUrl);
        onClose();
      } catch {
        alert("Failed to save avatar image.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#030712] border border-sky-400/40 p-6 shadow-[0_0_50px_rgba(56,189,248,0.25)] space-y-5 text-slate-100 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Camera size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wider uppercase">
                REPOSITION PROFILE PHOTO
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                Drag to center main area • Zoom & align for profile frame
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewport Workspace */}
        <div className="relative flex flex-col items-center justify-center">
          <div
            ref={containerRef}
            className="relative w-[280px] h-[280px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center select-none shadow-inner"
            style={{ touchAction: "none" }}
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={(e) => {
              if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchEnd={handlePointerUp}
          >
            {/* The draggable, scaled, rotated image */}
            {imageSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt="Source Crop"
                draggable={false}
                className="absolute max-w-none pointer-events-none transition-transform duration-75"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`,
                  cursor: isDragging ? "grabbing" : "grab",
                }}
              />
            )}

            {/* Dark vignette mask with clear circular aperture */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle 130px at center, transparent 129px, rgba(2, 6, 23, 0.75) 130px)",
              }}
            />

            {/* Outer Circular Glowing Frame */}
            <div
              className="absolute w-[260px] h-[260px] rounded-full pointer-events-none border-2 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
              style={{
                boxShadow: "0 0 0 9999px rgba(2, 6, 23, 0.65), 0 0 25px rgba(56,189,248,0.35)",
              }}
            />

            {/* Subtle center crosshair guide */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-4 h-[1px] bg-sky-400/50" />
              <div className="h-4 w-[1px] bg-sky-400/50 absolute" />
            </div>

            {/* Hint overlay */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-slate-950/80 border border-sky-400/30 text-[10px] text-sky-300 flex items-center gap-1.5 shadow pointer-events-none">
              <Move size={10} />
              <span>DRAG TO POSITION</span>
            </div>
          </div>
        </div>

        {/* Controls: Zoom slider & Rotation */}
        <div className="space-y-3 px-1">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-400 text-slate-300 transition"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <input
              type="range"
              min={0.6}
              max={3.5}
              step={0.05}
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setScale((s) => Math.min(3.5, s + 0.2))}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-400 text-slate-300 transition"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center gap-1.5 transition text-[11px]"
              >
                <RotateCw size={12} />
                <span>Rotate 90°</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPosition({ x: 0, y: 0 });
                  setScale(1.2);
                  setRotation(0);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center gap-1.5 transition text-[11px]"
              >
                <RefreshCw size={12} />
                <span>Center</span>
              </button>
            </div>

            {/* Live Mini Preview */}
            {previewDataUrl && (
              <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                <span>Result:</span>
                <div className="w-7 h-7 rounded-full border border-sky-400/60 overflow-hidden shadow-sm aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewDataUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
            className="text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="quantum"
            size="sm"
            onClick={handleConfirmCrop}
            disabled={isSaving}
            className="text-xs gap-1.5"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                SAVING CROP...
              </>
            ) : (
              <>
                <Check size={14} />
                APPLY PHOTO
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropModal;
