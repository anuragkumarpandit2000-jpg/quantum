"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, FastForward } from "lucide-react";

interface DoorSequencePlayerProps {
  onComplete: () => void;
  soundEnabled?: boolean;
}

const TOTAL_FRAMES = 80;

export const DoorSequencePlayer: React.FC<DoorSequencePlayerProps> = ({
  onComplete,
  soundEnabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isPreloading, setIsPreloading] = useState(true);
  const [phase, setPhase] = useState<"loading" | "playing" | "whitelight" | "title" | "fadeout" | "done">("loading");
  const [isMuted, setIsMuted] = useState(!soundEnabled);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // 1. Preload all 80 frames into memory
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `/assets/frames/frame_${frameNum}.png`;

      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        if (loadedCount === TOTAL_FRAMES) {
          framesRef.current = loadedImages;
          setIsPreloading(false);
          setPhase("playing");
        }
      };

      img.onerror = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        if (loadedCount === TOTAL_FRAMES) {
          framesRef.current = loadedImages;
          setIsPreloading(false);
          setPhase("playing");
        }
      };

      loadedImages[i - 1] = img;
    }

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  // 2. Audio setup
  useEffect(() => {
    const audio = new Audio("/assets/audio/montagem_tenta_slowed.m4a");
    audio.loop = false;
    audio.volume = isMuted ? 0 : 0.65;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 0.65;
    }
  }, [isMuted]);

  // 3. Cinematic Slow-Paced Sequential Frame Playback
  useEffect(() => {
    if (phase !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (audioRef.current && !isMuted) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    let frameIdx = 0;
    let lastTime = performance.now();
    let sequenceEnded = false;

    // Optimized pacing: slightly faster (~14-16 FPS), buttery smooth progression with mechanical impact
    const getFrameInterval = (idx: number) => {
      if (idx < 15) return 72; // ~13.8 FPS (deliberate mechanical start)
      if (idx < 62) return 62; // ~16.1 FPS (buttery smooth vault movement)
      return 75;               // ~13.3 FPS (cinematic climax into white light)
    };

    const render = (time: number) => {
      if (sequenceEnded) return;

      const currentInterval = getFrameInterval(frameIdx);
      const delta = time - lastTime;

      if (delta >= currentInterval) {
        lastTime = time - (delta % currentInterval);

        if (frameIdx < TOTAL_FRAMES) {
          const img = framesRef.current[frameIdx];
          if (img && img.complete) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
          frameIdx++;
          setCurrentFrame(frameIdx);
        } else {
          // ALL 80 FRAMES COMPLETED -> Instant transition directly to dashboard
          sequenceEnded = true;
          setPhase("whitelight");
          if (audioRef.current) {
            audioRef.current.pause();
          }
          setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 350);

          return;
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [phase, onComplete]);

  const handleSkip = () => {
    if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    if (audioRef.current) audioRef.current.pause();
    onComplete();
  };

  // Natural slow white light build-up from frame 62 to 80
  const bloomOpacity = currentFrame >= 62 ? Math.min(0.85, (currentFrame - 61) * 0.045) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Loading state before animation begins */}
      {isPreloading && (
        <div className="flex flex-col items-center justify-center gap-4 z-30">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-cyan-500/30 border-b-cyan-300 animate-spin reverse" />
          </div>
          <div className="font-mono text-xs tracking-widest text-sky-400 uppercase">
            CALIBRATING PORTAL... {Math.round((imagesLoaded / TOTAL_FRAMES) * 100)}%
          </div>
        </div>
      )}

      {/* Frame Sequence Canvas */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Organic Bloom build-up during climax frames (62-80) */}
      {phase === "playing" && bloomOpacity > 0 && (
        <div
          className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-200"
          style={{ opacity: bloomOpacity }}
        />
      )}

      {/* Quick White Light Flash into transition */}
      <AnimatePresence>
        {phase === "whitelight" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 bg-white z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <div className="absolute top-6 right-6 z-40 flex items-center gap-3">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition backdrop-blur-md"
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition backdrop-blur-md"
        >
          <FastForward size={14} /> SKIP
        </button>
      </div>

      {/* Current Frame indicator (subtle) */}
      <div className="absolute bottom-6 left-6 z-40 font-mono text-[10px] text-slate-500 tracking-wider">
        PORTAL SEQUENCE : {String(currentFrame).padStart(2, "0")} / {TOTAL_FRAMES}
      </div>
    </div>
  );
};

export default DoorSequencePlayer;
