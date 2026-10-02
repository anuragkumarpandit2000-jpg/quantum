"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowRight,
  Shield,
  Sparkles,
  RefreshCw,
  Film,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/components/audio/audio-provider";
import { cn } from "@/lib/utils";

interface MotivationalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  consecutiveMissedDays?: number;
  brokenStreakLength?: number;
}

const MOTIVATIONAL_VIDEOS = [
  { id: "1", title: "RELENTLESS EXECUTION", src: "/assets/videos/motivational_1.mp4" },
  { id: "2", title: "UNBROKEN FOCUS", src: "/assets/videos/motivational_2.mp4" },
  { id: "3", title: "RE-IGNITE THE FIRE", src: "/assets/videos/motivational_3.mp4" },
  { id: "4", title: "THE 90-DAY CRUCIBLE", src: "/assets/videos/motivational_4.mp4" },
  { id: "5", title: "RISE ABOVE FRICTION", src: "/assets/videos/motivational_5.mp4" },
];

export const MotivationalModal: React.FC<MotivationalModalProps> = ({
  isOpen,
  onClose,
  title = "YOU BROKE THE STREAK.",
  subtitle = "BUT THE ARC ISN'T OVER.",
  consecutiveMissedDays,
  brokenStreakLength,
}) => {
  const { duckAudio, soundEnabled } = useAudio();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [currentVideoIdx, setCurrentVideoIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Fade background audio when modal opens, restore when it closes
  useEffect(() => {
    if (isOpen) {
      duckAudio(true);
      // Pick a random motivational video or start with 0
      const randIdx = Math.floor(Math.random() * MOTIVATIONAL_VIDEOS.length);
      setCurrentVideoIdx(randIdx);
    } else {
      duckAudio(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }

    return () => {
      duckAudio(false);
    };
  }, [isOpen, duckAudio]);

  // Handle Autoplay & Video Playback
  useEffect(() => {
    if (!isOpen) return;

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.muted = isMuted;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
          setHasStarted(true);
        })
        .catch(() => {
          // Autoplay unmuted failed: mute and retry
          video.muted = true;
          setIsMuted(true);
          video
            .play()
            .then(() => {
              setIsPlaying(true);
              setAutoplayBlocked(true); // show "tap to unmute"
              setHasStarted(true);
            })
            .catch(() => {
              setIsPlaying(false);
            });
        });
    }
  }, [isOpen, currentVideoIdx, isMuted]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMute = !isMuted;
    video.muted = nextMute;
    setIsMuted(nextMute);
    if (!nextMute) {
      setAutoplayBlocked(false);
    }
  };

  const handleSelectVideo = (index: number) => {
    setCurrentVideoIdx(index);
  };

  const handleClose = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
    duckAudio(false);
    onClose();
  };

  if (!isOpen) return null;

  const currentVideo = MOTIVATIONAL_VIDEOS[currentVideoIdx];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
      {/* Volumetric Radial Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
        <div className="w-[600px] h-[600px] rounded-full bg-sky-500/10 blur-[140px] animate-pulse" />
        <div className="w-[400px] h-[400px] rounded-full bg-blue-600/15 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-2xl bg-slate-950/90 border border-sky-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(56,189,248,0.25)] flex flex-col items-center text-center space-y-6">
        {/* Close Button in corner */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-sky-400 transition"
          title="Close intervention"
        >
          <X size={18} />
        </button>

        {/* Protocol Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-[11px] font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
            QUANTUM • PROTOCOL INTERVENTION
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans uppercase">
            {title}
          </h2>

          <p className="text-sky-300/90 font-mono text-xs sm:text-sm tracking-wider uppercase">
            {subtitle}
          </p>

          {(consecutiveMissedDays || brokenStreakLength) && (
            <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
              {consecutiveMissedDays ? (
                <span className="text-red-400 font-bold">
                  // {consecutiveMissedDays} MISSED DAY{consecutiveMissedDays > 1 ? "S" : ""} DETECTED
                </span>
              ) : null}
              {brokenStreakLength ? (
                <span className="text-amber-400">
                  // PREVIOUS PEAK STREAK: {brokenStreakLength} DAYS
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Video Player Frame */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-sky-400/40 bg-black shadow-[0_0_40px_rgba(56,189,248,0.2)] group">
          <video
            ref={videoRef}
            src={currentVideo.src}
            className="w-full h-full object-cover"
            playsInline
            loop
            onEnded={() => setIsPlaying(false)}
          />

          {/* Autoplay Unmute Chip if muted by browser */}
          {autoplayBlocked && isMuted && (
            <button
              onClick={handleToggleMute}
              className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/90 hover:bg-sky-400 text-slate-950 text-xs font-mono font-bold shadow-lg animate-bounce transition"
            >
              <VolumeX size={14} />
              <span>CLICK TO UNMUTE AUDIO</span>
            </button>
          )}

          {/* Video Controls Bar Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-sky-400 text-white transition"
                title={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>

              <button
                onClick={handleToggleMute}
                className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-sky-400 text-white transition"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>

              <span className="text-[11px] font-mono text-slate-300 ml-1 truncate max-w-[180px] sm:max-w-none">
                {currentVideo.title}
              </span>
            </div>

            {/* Quick Cycle Video Button */}
            <button
              onClick={() => handleSelectVideo((currentVideoIdx + 1) % MOTIVATIONAL_VIDEOS.length)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-sky-400 text-[11px] font-mono text-sky-300 transition"
              title="Next motivational sequence"
            >
              <RefreshCw size={11} />
              <span>TRACK {currentVideoIdx + 1}/{MOTIVATIONAL_VIDEOS.length}</span>
            </button>
          </div>
        </div>

        {/* Motivational Guidance & Tactical Action */}
        <div className="space-y-4 w-full">
          <div className="space-y-1">
            <div className="font-mono text-sm sm:text-base font-bold text-sky-400 tracking-wider">
              &ldquo;GET BACK IN THE ARC.&rdquo;
            </div>
            <div className="font-mono text-[11px] text-slate-500 uppercase tracking-widest">
              REMIND → RESET → RETURN
            </div>
          </div>

          <Button
            onClick={handleClose}
            variant="quantum"
            size="lg"
            className="w-full sm:w-auto px-10 shadow-xl gap-2 font-mono text-xs uppercase"
          >
            <span>CONTINUE YOUR WINTER ARC</span>
            <ArrowRight size={16} />
          </Button>

          <p className="text-[11px] font-mono text-slate-500">
            [ESC] OR CLICK CONTINUE TO RESTORE DASHBOARD
          </p>
        </div>
      </div>
    </div>
  );
};

export default MotivationalModal;
