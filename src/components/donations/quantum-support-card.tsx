"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  Check,
  Copy,
  Lock,
  Award,
  CheckCircle2,
  Volume2,
  X,
  Trophy,
} from "lucide-react";
import confetti from "canvas-confetti";
import QuantumTiltCard from "@/components/ui/quantum-tilt-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QuantumSupportCardProps {
  compact?: boolean;
  onSuccess?: () => void;
  showPatronWall?: boolean;
  className?: string;
}

export default function QuantumSupportCard({
  compact = false,
  onSuccess,
  showPatronWall = true,
  className,
}: QuantumSupportCardProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [donationAmount, setDonationAmount] = useState("100");
  const [donorFeedback, setDonorFeedback] = useState("");
  const [donationSubmitting, setDonationSubmitting] = useState(false);
  const [donationStatus, setDonationStatus] = useState<string | null>(null);

  const [thankYouModalOpen, setThankYouModalOpen] = useState(false);
  const [lastPledge, setLastPledge] = useState<{
    name: string;
    rank: string;
    amount: number;
    feedback: string;
    xpEarned: number;
  } | null>(null);

  const [recentPatrons, setRecentPatrons] = useState<any[]>([]);
  const [patronsTotal, setPatronsTotal] = useState<number>(0);

  // Load auth state and recent patrons
  const fetchPatrons = () => {
    fetch("/api/donations")
      .then((res) => res.json())
      .then((data) => {
        if (data.recentDonations) {
          setRecentPatrons(data.recentDonations);
          setPatronsTotal(data.totalContributed || 0);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));

    fetchPatrons();
  }, []);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText("anuragkumar.pandit2000@okicici");
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2000);
  };

  const playThankYouTTS = async () => {
    const speechText = "Thank you brother for helping our community!";
    try {
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: speechText }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        await audio.play();
        return;
      }
    } catch (e) {
      console.warn("TTS API fallback to Web Speech Synthesis:", e);
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setDonationStatus("Authentication required: Please log in or sign up first to confirm your pledge.");
      return;
    }
    const amt = parseFloat(donationAmount);
    if (isNaN(amt) || amt <= 0) {
      setDonationStatus("Please choose or enter a valid contribution amount.");
      return;
    }

    setDonationSubmitting(true);
    setDonationStatus(null);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amt,
          feedback: donorFeedback,
          upiId: "anuragkumar.pandit2000@okicici",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Trigger celebratory confetti burst
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.6 },
          colors: ["#38bdf8", "#fbbf24", "#10b981", "#818cf8", "#f43f5e"],
        });

        // Trigger Gemini TTS brother voice
        playThankYouTTS();

        const userRank = currentUser.profile?.currentClass || `Level ${currentUser.profile?.level || 1}`;
        const pledgeData = {
          name: currentUser.name || currentUser.username || "Challenger",
          rank: userRank,
          amount: amt,
          feedback: donorFeedback.trim() || "Pledged support for Quantum Community",
          xpEarned: Math.round(amt * 5),
        };

        setLastPledge(pledgeData);
        setThankYouModalOpen(true);
        setDonorFeedback("");

        fetchPatrons();
        if (onSuccess) onSuccess();
      } else {
        setDonationStatus(data.error || "Failed to process pledge. Please try again.");
      }
    } catch {
      setDonationStatus("Network error. Please try again.");
    } finally {
      setDonationSubmitting(false);
    }
  };

  return (
    <div className={cn("space-y-8", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch text-left">
        {/* QR Code Card */}
        <QuantumTiltCard className="p-6 space-y-4 flex flex-col items-center justify-center">
          <div className="text-center font-mono space-y-1">
            <div className="text-xs text-sky-400 font-bold tracking-widest uppercase flex items-center justify-center gap-1.5">
              <Sparkles size={13} className="text-sky-400" />
              SUPPORT QUANTUM INFRASTRUCTURE
            </div>
            <p className="text-[11px] text-slate-300 font-sans max-w-xs leading-relaxed">
              &ldquo;Quantum is free. If you find it useful, you can support the project.&rdquo;
            </p>
          </div>

          {/* Scannable UPI QR Code Image */}
          <div className="relative rounded-2xl bg-white p-3 shadow-2xl border border-sky-400/30 transition-all duration-300 hover:border-sky-400/80 hover:shadow-[0_0_35px_rgba(56,189,248,0.35)] flex items-center justify-center group">
            <Image
              src="/assets/images/qr_support.jpg"
              alt="Quantum Support QR Code - Anurag Pandit"
              width={220}
              height={320}
              className="rounded-xl object-contain w-48 sm:w-56 h-auto"
              priority
            />
          </div>

          <div className="text-center font-mono space-y-1">
            <div className="text-xs text-white font-bold">SCAN WITH ANY UPI APP</div>
            <div className="text-[10px] text-slate-400">GPay, PhonePe, Paytm, BHIM</div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg font-mono text-xs text-sky-300 shadow-inner">
            <span className="text-[11px] sm:text-xs">anuragkumar.pandit2000@okicici</span>
            <button
              type="button"
              onClick={handleCopyUPI}
              className="text-slate-400 hover:text-white transition ml-1"
              title="Copy UPI ID"
            >
              {copiedUPI ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        </QuantumTiltCard>

        {/* Contribution Form & Authentication Gate */}
        <QuantumTiltCard className="p-6 sm:p-7 space-y-4 font-mono flex flex-col justify-center">
          {!currentUser && !authLoading ? (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-amber-200 text-xs space-y-4 font-mono shadow-xl">
              <div className="flex items-center gap-2.5 font-bold text-amber-400 tracking-wider text-sm">
                <Lock size={18} className="text-amber-400 shrink-0" />
                <span>AUTHENTICATION REQUIRED TO PLEDGE</span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                To record your sovereign callsign, unlock your verified rank badge, earn +5 XP per ₹1, and post your feedback note to the Community Patron Wall, you must be logged into Quantum.
              </p>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-[11px] text-slate-400 font-mono">
                <div className="text-sky-400 font-bold">BENEFITS OF LOGGED-IN SUPPORT:</div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-emerald-400">✓</span> Username & Verified Rank permanently displayed
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-emerald-400">✓</span> Instant Supporter XP bonus credited to profile
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-emerald-400">✓</span> Gemini TTS Brother voice celebration audio sequence
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button asChild variant="quantum" className="w-full text-xs font-mono py-2.5">
                  <Link href="/login">
                    LOG IN TO PLEDGE
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full text-xs font-mono py-2.5 border-slate-700 bg-slate-900 hover:bg-slate-800 text-white">
                  <Link href="/signup">
                    SIGN UP
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDonateSubmit} className="space-y-4 w-full">
              {currentUser && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-sky-950/40 border border-sky-400/30">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300 font-bold text-xs uppercase">
                      {currentUser.name?.[0] || currentUser.username?.[0] || "C"}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{currentUser.name || currentUser.username}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                          AUTHENTICATED
                        </span>
                      </div>
                      <div className="text-[10px] text-sky-400 font-mono">
                        RANK: {currentUser.profile?.currentClass || `Level ${currentUser.profile?.level || 1}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] font-mono text-slate-400">
                    <div className="text-emerald-300 font-bold">
                      +{Math.round((parseFloat(donationAmount) || 0) * 5)} XP
                    </div>
                    <div className="text-[9px] text-slate-400">SUPPORTER BONUS</div>
                  </div>
                </div>
              )}

              {/* Tier Selection Buttons */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 flex items-center justify-between">
                  <span>SELECT CONTRIBUTION (INR)</span>
                  <span className="text-[10px] text-sky-400 font-mono">₹1 = +5 XP</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {["10", "50", "100", "500", "1000", "10000"].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDonationAmount(amt)}
                      className={cn(
                        "py-2 rounded-lg text-xs font-bold border transition font-mono",
                        donationAmount === amt
                          ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-md shadow-sky-500/20 scale-[1.02]"
                          : "bg-slate-900/90 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                      )}
                    >
                      ₹{parseInt(amt).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">WHATEVER YOU WANT TO GIVE US (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    min="1"
                    placeholder="Whatever you want to give us"
                    className="pl-7 bg-slate-900/80 border-slate-800 text-slate-100 text-xs focus:border-sky-400 font-mono"
                  />
                </div>
              </div>

              {/* Feedback / Encouragement Message */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400 flex items-center justify-between">
                  <span>FEEDBACK / COMMUNITY MESSAGE</span>
                  <span className="text-[10px] text-slate-500">Optional</span>
                </label>
                <textarea
                  rows={2}
                  value={donorFeedback}
                  onChange={(e) => setDonorFeedback(e.target.value)}
                  placeholder="Write your feedback, message, or encouragement for the Quantum community..."
                  className="w-full rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 font-mono resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="quantum"
                disabled={donationSubmitting}
                className="w-full text-xs py-3 font-mono shadow-lg shadow-sky-500/20"
              >
                {donationSubmitting ? "RECORDING PLEDGE..." : "CONFIRM SUPPORT PLEDGE"}
              </Button>

              {donationStatus && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-lg text-center font-sans">
                  {donationStatus}
                </div>
              )}
            </form>
          )}
        </QuantumTiltCard>
      </div>

      {/* Community Patron Wall */}
      {showPatronWall && (
        <div className="pt-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-4 text-left">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                <Award size={14} className="text-sky-400" />
                COMMUNITY PATRON WALL & PLEDGE HISTORY
              </div>
              <div className="text-slate-400 text-xs font-sans mt-0.5">
                Honoring sovereign challengers who reinforce the Winter Arc open-source infrastructure.
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300">
                TOTAL: ₹{patronsTotal.toLocaleString()}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300">
                {recentPatrons.length} PATRONS
              </span>
            </div>
          </div>

          {recentPatrons.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center font-mono space-y-2">
              <div className="text-slate-500 text-xs">NO PLEDGES RECORDED YET TODAY</div>
              <div className="text-slate-400 text-xs font-sans">
                Be the first challenger to claim your permanent spot on the Community Patron Wall!
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-left">
              {recentPatrons.map((patron) => (
                <QuantumTiltCard key={patron.id} className="p-4 space-y-3 font-mono border-slate-800 bg-slate-950/70">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-400/60 flex items-center justify-center text-sky-300 font-bold text-xs shrink-0">
                        {patron.donorName?.[0] || "C"}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate">{patron.donorName}</div>
                        <div className="text-[10px] text-sky-400 truncate">
                          {patron.user?.profile?.currentClass || `Level ${patron.user?.profile?.level || 1}`}
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs shrink-0">
                      ₹{patron.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300 font-sans italic line-clamp-2">
                    &ldquo;{patron.transactionRef || "Supported the Quantum Protocol"}&rdquo;
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-emerald-400" />
                      VERIFIED SUPPORTER
                    </span>
                    <span>
                      {new Date(patron.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </QuantumTiltCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Thank You Celebration Modal */}
      {thankYouModalOpen && lastPledge && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-950 border-2 border-sky-400/70 p-6 sm:p-8 shadow-[0_0_80px_rgba(56,189,248,0.4)] space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setThankYouModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-sky-400 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X size={16} />
            </button>

            <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-500/20 via-cyan-500/30 to-amber-500/20 border-2 border-sky-400/60 flex items-center justify-center shadow-[0_0_45px_rgba(56,189,248,0.5)]">
              <Trophy size={48} className="text-amber-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
                ✓
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-mono text-xs tracking-widest uppercase">
                <Sparkles size={12} className="text-amber-400" />
                SOVEREIGN PLEDGE CONFIRMED
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                THANK YOU BROTHER!
              </h2>
              <p className="text-sky-300 text-sm sm:text-base font-mono font-bold">
                &ldquo;Thank you brother for helping our community!&rdquo;
              </p>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={playThankYouTTS}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-200 text-xs font-mono transition shadow-md"
              >
                <Volume2 size={14} className="text-sky-400 animate-pulse" />
                <span>REPLAY BROTHER VOICE (GEMINI TTS)</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">CHALLENGER:</span>
                <span className="text-white font-bold">{lastPledge.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">VERIFIED RANK:</span>
                <span className="text-sky-300 font-bold">{lastPledge.rank}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">CONTRIBUTION AMOUNT:</span>
                <span className="text-emerald-400 font-extrabold text-sm">
                  ₹{lastPledge.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">SUPPORTER XP BONUS:</span>
                <span className="text-amber-400 font-bold">+{lastPledge.xpEarned} XP AWARDED</span>
              </div>
              {lastPledge.feedback && (
                <div className="pt-1">
                  <span className="text-slate-400 block text-[10px] uppercase mb-1">
                    RECORDED MESSAGE:
                  </span>
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 italic font-sans text-xs">
                    &ldquo;{lastPledge.feedback}&rdquo;
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center pt-2">
              <Button
                variant="quantum"
                onClick={() => setThankYouModalOpen(false)}
                className="w-full font-mono text-xs py-3"
              >
                CONTINUE TRANSFORMATION
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
