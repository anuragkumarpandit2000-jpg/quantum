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
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isPreloading, setIsPreloading] = useState(true);
  const [phase, setPhase] = useState<"loading" | "playing" | "whitelight" | "title" | "fadeout" | "done">("loading");
  const [isMuted, setIsMuted] = useState(!soundEnabled);
  const [videoProgress, setVideoProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Detect mobile device
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mobile = window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(mobile);
      if (mobile) {
        setIsPreloading(false);
        setPhase("playing");
      }
    }
  }, []);

  // 1. Preload desktop frames into memory ONLY when on desktop
  useEffect(() => {
    if (typeof window !== "undefined" && (window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches)) {
      return; // Skip on mobile
    }

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
    <div
      className="fixed inset-0 z-50 bg-[#02050e] flex items-center justify-center overflow-hidden select-none"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Background Cybernetic Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-950/20 via-[#02050e] to-black pointer-events-none" />

      {/* MOBILE FULLSCREEN CONTINUOUS CINEMATIC EXPERIENCE */}
      {isMobile ? (
        <div className="relative w-full h-full flex flex-col items-center justify-between z-20">
          {/* Mobile Top HUD */}
          <div className="relative z-30 w-full px-6 pt-5 pb-2 flex flex-col items-center text-center shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-mono text-[10px] tracking-widest text-cyan-400 uppercase">
                QUANTUM PROTOCOL ACTIVE
              </span>
            </div>
            <h1 className="text-lg font-extrabold tracking-widest text-white font-mono flex items-center gap-2">
              <span className="text-sky-400">WINTER ARC</span> PORTAL
            </h1>
          </div>

          {/* Center 9:16 Seamless Cinematic Video Chamber */}
          <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden px-2">
            <video
              ref={videoRef}
              src="/assets/videos/quantum_mobile_entry.mp4"
              playsInline
              autoPlay
              muted={isMuted}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) {
                  setVideoProgress((v.currentTime / v.duration) * 100);
                }
              }}
              onEnded={() => {
                setPhase("whitelight");
                setTimeout(() => {
                  setPhase("done");
                  onComplete();
                }, 350);
              }}
              className="w-full h-full object-contain object-center pointer-events-none"
            />
          </div>

          {/* Mobile Bottom HUD (Unified Timeline + Controls) */}
          <div className="relative z-30 w-full px-6 pb-6 pt-2 flex flex-col items-center gap-3 shrink-0">
            {/* Unified Progress Track */}
            <div className="w-full max-w-[320px] space-y-1">
              <div className="flex justify-between font-mono text-[10px] text-slate-400">
                <span className="text-sky-400">CALIBRATING NEURAL CORE</span>
                <span>{Math.round(videoProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-white transition-all duration-75"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
            </div>

            {/* Action Controls for Mobile */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const nextMuted = !isMuted;
                  setIsMuted(nextMuted);
                  if (videoRef.current) {
                    videoRef.current.muted = nextMuted;
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-[11px] font-mono text-slate-300 active:scale-95 transition backdrop-blur-md"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{isMuted ? "UNMUTE" : "MUTED"}</span>
              </button>

              <button
                onClick={handleSkip}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-[11px] font-mono text-sky-300 active:scale-95 transition backdrop-blur-md"
              >
                <FastForward size={14} /> SKIP INTRO
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* DESKTOP APPROVED FULL BLEED CANVAS SEQUENCE */
        <>
          {/* Loading state before desktop animation begins */}
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

          {/* Desktop Frame Sequence Canvas */}
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="w-full h-full object-cover object-center pointer-events-none"
          />

          {/* Organic Bloom build-up during climax frames (62-80) */}
          {phase === "playing" && bloomOpacity > 0 && (
            <div
              className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-200 z-30"
              style={{ opacity: bloomOpacity }}
            />
          )}

          {/* Desktop Controls Overlay */}
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

          {/* Desktop Current Frame indicator */}
          <div className="absolute bottom-6 left-6 z-40 font-mono text-[10px] text-slate-500 tracking-wider">
            PORTAL SEQUENCE : {String(currentFrame).padStart(2, "0")} / {TOTAL_FRAMES}
          </div>
        </>
      )}

      {/* Quick White Light Flash into transition (Applies to both Mobile and Desktop) */}
      <AnimatePresence>
        {phase === "whitelight" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoorSequencePlayer;
