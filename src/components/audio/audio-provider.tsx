"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
  soundEnabled: boolean;
  volume: number;
  currentTrack: string;
  isPlaying: boolean;
  needsInteraction: boolean;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVolume: (vol: number) => void;
  playTrack: (trackKey: "landing" | "dashboard" | "epic" | "mix") => void;
  duckAudio: (duck: boolean) => void;
  unlockAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const TRACKS = {
  landing: "/assets/audio/raya_slowed.m4a",
  dashboard: "/assets/audio/sem_demora_slowed.m4a",
  epic: "/assets/audio/montagem_tenta_slowed.m4a",
  mix: "/assets/audio/brazilian_phonk_mix.m4a",
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [volume, setVolumeState] = useState<number>(0.35);
  const [currentTrack, setCurrentTrack] = useState<string>("landing");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [needsInteraction, setNeedsInteraction] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  // Initialize preference from localStorage
  useEffect(() => {
    const savedSound = localStorage.getItem("quantum_sound_enabled");
    if (savedSound !== null) {
      setSoundEnabledState(savedSound === "true");
    }
    const savedVol = localStorage.getItem("quantum_sound_vol");
    if (savedVol !== null) {
      setVolumeState(parseFloat(savedVol));
    }
  }, []);

  // Initialize Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = volume;
    audioRef.current = audio;

    const tryAutoplay = async () => {
      audio.src = TRACKS.landing;
      if (soundEnabled) {
        try {
          await audio.play();
          setIsPlaying(true);
          setNeedsInteraction(false);
        } catch {
          // Autoplay blocked by browser policy
          setNeedsInteraction(true);
          setIsPlaying(false);
        }
      }
    };

    tryAutoplay();

    // User gesture listener to automatically unlock if blocked
    const handleFirstInteraction = () => {
      if (needsInteraction && soundEnabled && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setNeedsInteraction(false);
        }).catch(() => {});
      }
    };

    // Global listener: When any other video or audio element starts playing on page (e.g. proof video, motivational video, speech TTS),
    // automatically pause or duck background music, and resume when finished!
    const handleOtherMediaPlay = (e: Event) => {
      if (e.target !== audioRef.current) {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
          setIsPlaying(false);
          (audioRef.current as any).__pausedByExtraSound = true;
        }
      }
    };

    const handleOtherMediaStop = (e: Event) => {
      if (e.target !== audioRef.current) {
        if (audioRef.current && (audioRef.current as any).__pausedByExtraSound && soundEnabled) {
          (audioRef.current as any).__pausedByExtraSound = false;
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    };

    document.addEventListener("play", handleOtherMediaPlay, true);
    document.addEventListener("pause", handleOtherMediaStop, true);
    document.addEventListener("ended", handleOtherMediaStop, true);

    return () => {
      audio.pause();
      audio.src = "";
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("play", handleOtherMediaPlay, true);
      document.removeEventListener("pause", handleOtherMediaStop, true);
      document.removeEventListener("ended", handleOtherMediaStop, true);
    };
  }, [soundEnabled]);

  const unlockAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setNeedsInteraction(false);
      }).catch((e) => console.log("Unlock failed", e));
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabledState(next);
    localStorage.setItem("quantum_sound_enabled", String(next));

    if (audioRef.current) {
      if (next) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setNeedsInteraction(false);
        }).catch(() => setNeedsInteraction(true));
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem("quantum_sound_enabled", String(enabled));
    if (audioRef.current) {
      if (enabled) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    localStorage.setItem("quantum_sound_vol", String(clamped));
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  // Smooth Cross-Fade Track Change
  const playTrack = (trackKey: "landing" | "dashboard" | "epic" | "mix") => {
    if (currentTrack === trackKey && isPlaying) return;
    setCurrentTrack(trackKey);

    const targetSrc = TRACKS[trackKey];
    if (!audioRef.current || isTransitioningRef.current) return;

    if (!soundEnabled) {
      audioRef.current.src = targetSrc;
      return;
    }

    isTransitioningRef.current = true;
    const audio = audioRef.current;
    const initialVol = volume;

    // Fade out
    let fadeOutSteps = 10;
    const fadeOutInterval = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume = Math.max(0, audio.volume - initialVol / 10);
      } else {
        clearInterval(fadeOutInterval);
        audio.src = targetSrc;
        audio.play().then(() => {
          setIsPlaying(true);
          // Fade in
          let fadeInSteps = 10;
          const fadeInInterval = setInterval(() => {
            if (audio.volume < initialVol) {
              audio.volume = Math.min(initialVol, audio.volume + initialVol / 10);
            } else {
              clearInterval(fadeInInterval);
              audio.volume = initialVol;
              isTransitioningRef.current = false;
            }
          }, 60);
        }).catch(() => {
          isTransitioningRef.current = false;
        });
      }
    }, 50);
  };

  const duckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const preDuckVolumeRef = useRef<number>(volume);

  const duckAudio = (duck: boolean) => {
    const audio = audioRef.current;
    if (!audio || !soundEnabled) return;

    if (duckIntervalRef.current) {
      clearInterval(duckIntervalRef.current);
      duckIntervalRef.current = null;
    }

    if (duck) {
      preDuckVolumeRef.current = audio.volume;
      const targetVol = 0.03;
      const currentVol = audio.volume;
      const step = Math.max(0.01, (currentVol - targetVol) / 8);
      let count = 0;
      duckIntervalRef.current = setInterval(() => {
        count++;
        if (audio.volume > targetVol + 0.02 && count < 8) {
          audio.volume = Math.max(targetVol, audio.volume - step);
        } else {
          audio.volume = targetVol;
          if (duckIntervalRef.current) {
            clearInterval(duckIntervalRef.current);
            duckIntervalRef.current = null;
          }
        }
      }, 35);
    } else {
      const targetVol = Math.max(0.15, preDuckVolumeRef.current || volume);
      const currentVol = audio.volume;
      const step = Math.max(0.01, (targetVol - currentVol) / 8);
      let count = 0;
      duckIntervalRef.current = setInterval(() => {
        count++;
        if (audio.volume < targetVol - 0.02 && count < 8) {
          audio.volume = Math.min(targetVol, audio.volume + step);
        } else {
          audio.volume = targetVol;
          if (duckIntervalRef.current) {
            clearInterval(duckIntervalRef.current);
            duckIntervalRef.current = null;
          }
        }
      }, 45);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        soundEnabled,
        volume,
        currentTrack,
        isPlaying,
        needsInteraction,
        toggleSound,
        setSoundEnabled,
        setVolume,
        playTrack,
        duckAudio,
        unlockAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
