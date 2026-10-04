"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Shield,
  Zap,
  Flame,
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Search,
  Plus,
  Star,
  Check,
  CheckCircle2,
  X,
  Layers,
  Copy,
  QrCode,
  Heart,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import QuantumTiltCard from "@/components/ui/quantum-tilt-card";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  callsign: string;
  avatar: string;
  stars: number;
  date: string;
  category: "Habits" | "Physical" | "Skills" | "AI" | "Vanguard";
  verified: boolean;
  text: string;
  isDonation?: boolean;
  donationAmount?: number | null;
  donationCurrency?: string;
}

// Initial Admin Baseline: Exactly 1 vote from Admin (Anurag Pandit) with 5.0 stars
const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-anurag",
    name: "Anurag Pandit",
    role: "Lead Architect (Admin)",
    callsign: "ARCHITECT_01",
    avatar: "/assets/images/logo/logo.png",
    stars: 5,
    date: "ADMIN • FOUNDER VERIFIED",
    category: "Vanguard",
    verified: true,
    text: "The real-time telemetry, 90-day matrix, and live proof feed in Quantum are second to none. Pure discipline execution.",
    isDonation: false,
    donationAmount: null,
    donationCurrency: "INR",
  },
];

export const ExperiencesReviewSection: React.FC = () => {
  // Navigation State
  const [viewState, setViewState] = useState<"archive" | "cards" | "chain">("archive");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Live Star Rating & Votes Telemetry
  // Defaults to 1 Vote with 5.0 Stars (Admin)
  const [totalVotes, setTotalVotes] = useState<number>(1);
  const [averageRating, setAverageRating] = useState<number>(5.0);
  const [userVotedRating, setUserVotedRating] = useState<number | null>(null);
  const [isVotingSubmitting, setIsVotingSubmitting] = useState<boolean>(false);

  // Modals
  const [isAddFeedbackOpen, setIsAddFeedbackOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isQuickVoteModalOpen, setIsQuickVoteModalOpen] = useState(false);

  // Feedback Composer Form State
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState<
    "Habits" | "Physical" | "Skills" | "AI" | "Vanguard"
  >("Habits");
  const [feedbackQuote, setFeedbackQuote] = useState("");
  const [isDonationSupporter, setIsDonationSupporter] = useState(false);
  const [donationAmount, setDonationAmount] = useState<string>("500");

  // Donate Modal State
  const [donateName, setDonateName] = useState("");
  const [donateTitle, setDonateTitle] = useState("Quantum Royal Patron");
  const [donateAmount, setDonateAmount] = useState("500");
  const [donateMessage, setDonateMessage] = useState("");
  const [copiedUPI, setCopiedUPI] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText("anuragkumar.pandit2000@okicici");
    setCopiedUPI(true);
    showToast("UPI ID copied to clipboard: anuragkumar.pandit2000@okicici");
    setTimeout(() => setCopiedUPI(false), 2500);
  };

  // Fetch live reviews and computed aggregates on mount
  const fetchLiveReviews = () => {
    fetch("/api/reviews?limit=250")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const dbItems: ReviewItem[] = data.reviews.map((r: any, idx: number) => {
            const textLower = (r.quote || "").toLowerCase();
            let category: "Habits" | "Physical" | "Skills" | "AI" | "Vanguard" = "Habits";
            if (
              textLower.includes("physical") ||
              textLower.includes("workout") ||
              textLower.includes("calisthenics") ||
              textLower.includes("mass") ||
              idx % 5 === 1
            ) {
              category = "Physical";
            } else if (
              textLower.includes("skill") ||
              textLower.includes("focus") ||
              textLower.includes("coding") ||
              idx % 5 === 2
            ) {
              category = "Skills";
            } else if (
              textLower.includes("ai") ||
              textLower.includes("coaching") ||
              textLower.includes("quantum core") ||
              idx % 5 === 3
            ) {
              category = "AI";
            } else if (
              textLower.includes("vanguard") ||
              textLower.includes("winter arc") ||
              idx % 5 === 4
            ) {
              category = "Vanguard";
            }

            return {
              id: r.id,
              name: r.authorName || "Verified Challenger",
              role: r.authorTitle || (r.isDonation ? "Royal Patron" : "Arc Challenger"),
              callsign: r.isDonation
                ? `PATRON_${r.id.substring(0, 4).toUpperCase()}`
                : `CHALLENGER_${r.id.substring(0, 4).toUpperCase()}`,
              avatar: r.avatarUrl || "/assets/images/avatars/default_avatar.svg",
              stars: r.rating || 5,
              date: r.createdAt
                ? new Date(r.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })
                : "VERIFIED ENTRY",
              category,
              verified: true,
              text: r.quote,
              isDonation: Boolean(r.isDonation || (r.donationAmount && r.donationAmount > 0)),
              donationAmount: r.donationAmount ? Number(r.donationAmount) : null,
              donationCurrency: r.donationCurrency || "INR",
            };
          });

          setReviews(dbItems);
          setTotalVotes(data.totalVotes || dbItems.length);
          setAverageRating(
            typeof data.averageRating === "number"
              ? data.averageRating
              : Number(
                  (dbItems.reduce((acc, it) => acc + it.stars, 0) / dbItems.length).toFixed(1)
                )
          );
        } else {
          // Default to 1 vote from admin
          setTotalVotes(1);
          setAverageRating(5.0);
        }
      })
      .catch((err) => console.error("Failed to load live reviews:", err));
  };

  useEffect(() => {
    fetchLiveReviews();
  }, []);

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      let matchesCat = true;
      if (selectedCategory === "patrons") {
        matchesCat = Boolean(r.isDonation);
      } else if (selectedCategory !== "all") {
        matchesCat = r.category === selectedCategory;
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q) ||
        r.callsign.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [reviews, selectedCategory, searchQuery]);

  // Count of donation backers
  const patronsCount = useMemo(() => {
    return reviews.filter((r) => r.isDonation).length;
  }, [reviews]);

  // Instant Quick Vote (1 to 5 Stars)
  const handleQuickVote = async (stars: number) => {
    if (isVotingSubmitting) return;
    setIsVotingSubmitting(true);
    setUserVotedRating(stars);

    // Optimistic Calculation
    const newVotes = totalVotes + 1;
    const currentSum = averageRating * totalVotes;
    const newAverage = Number(((currentSum + stars) / newVotes).toFixed(1));

    setTotalVotes(newVotes);
    setAverageRating(newAverage);

    // Confetti celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#38bdf8", "#fbbf24", "#34d399"],
      });
    } catch {}

    showToast(`✓ Your ${stars}★ vote has been recorded live! Total votes: ${newVotes}`);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: "Verified Voter",
          authorTitle: "Challenger Vote",
          rating: stars,
          quote: `Rated ${stars} Stars in the Quantum Winter Arc. Unbroken daily focus.`,
        }),
      });
      const data = await res.json();
      if (data.totalVotes && data.averageRating) {
        setTotalVotes(data.totalVotes);
        setAverageRating(data.averageRating);
      }
      fetchLiveReviews();
    } catch (err) {
      console.error("Vote sync error:", err);
    } finally {
      setIsVotingSubmitting(false);
    }
  };

  // Submit Feedback (Regular or with Donation Support)
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !feedbackQuote.trim()) return;

    const parsedDonation = isDonationSupporter ? parseFloat(donationAmount) || 500 : null;

    const tempItem: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: authorName.trim(),
      role: authorRole.trim() || (isDonationSupporter ? "Quantum Royal Patron" : "Arc Challenger"),
      callsign: isDonationSupporter
        ? `PATRON_${Math.floor(Math.random() * 900 + 100)}`
        : `CHALLENGER_${Math.floor(Math.random() * 900 + 100)}`,
      avatar: "/assets/images/avatars/default_avatar.svg",
      stars: feedbackRating,
      date: "JUST NOW • VERIFIED",
      category: feedbackCategory,
      verified: true,
      text: feedbackQuote.trim(),
      isDonation: isDonationSupporter,
      donationAmount: parsedDonation,
      donationCurrency: "INR",
    };

    // Optimistic update
    setReviews([tempItem, ...reviews]);
    const newVotes = totalVotes + 1;
    const newAvg = Number(
      ((averageRating * totalVotes + feedbackRating) / newVotes).toFixed(1)
    );
    setTotalVotes(newVotes);
    setAverageRating(newAvg);

    setIsAddFeedbackOpen(false);
    setAuthorName("");
    setAuthorRole("");
    setFeedbackQuote("");
    setIsDonationSupporter(false);

    try {
      confetti({
        particleCount: isDonationSupporter ? 100 : 40,
        spread: 70,
        origin: { y: 0.7 },
        colors: isDonationSupporter ? ["#fbbf24", "#f59e0b", "#38bdf8"] : ["#38bdf8", "#34d399"],
      });
    } catch {}

    showToast(
      isDonationSupporter
        ? "👑 Royal Patron Feedback added with Special Premium Card!"
        : "Feedback submitted to live Quantum Archive!"
    );

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: tempItem.name,
          authorTitle: tempItem.role,
          rating: feedbackRating,
          quote: tempItem.text,
          donationAmount: parsedDonation,
          donationCurrency: "INR",
          isDonation: isDonationSupporter,
        }),
      });
      fetchLiveReviews();
    } catch (err) {
      console.error("Live feedback sync error:", err);
    }
  };

  // Submit Dedicated Patron Donation Feedback
  const handleDonateFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donateName.trim() || !donateMessage.trim()) return;

    const parsedDonation = parseFloat(donateAmount) || 500;

    const tempItem: ReviewItem = {
      id: `patron-${Date.now()}`,
      name: donateName.trim(),
      role: donateTitle.trim() || "Quantum Royal Patron",
      callsign: `PATRON_${Math.floor(Math.random() * 900 + 100)}`,
      avatar: "/assets/images/avatars/default_avatar.svg",
      stars: 5,
      date: "JUST NOW • ROYAL PATRON",
      category: "Vanguard",
      verified: true,
      text: donateMessage.trim(),
      isDonation: true,
      donationAmount: parsedDonation,
      donationCurrency: "INR",
    };

    setReviews([tempItem, ...reviews]);
    const newVotes = totalVotes + 1;
    const newAvg = Number(((averageRating * totalVotes + 5) / newVotes).toFixed(1));
    setTotalVotes(newVotes);
    setAverageRating(newAvg);

    setIsDonateModalOpen(false);
    setDonateName("");
    setDonateMessage("");

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#f59e0b", "#38bdf8", "#ffffff"],
      });
    } catch {}

    showToast(`👑 Thank you! Special Royal Patron card created with ₹${parsedDonation} support!`);

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: tempItem.name,
          authorTitle: tempItem.role,
          rating: 5,
          quote: tempItem.text,
          donationAmount: parsedDonation,
          donationCurrency: "INR",
          isDonation: true,
        }),
      });
      fetchLiveReviews();
    } catch (err) {
      console.error("Donation feedback sync error:", err);
    }
  };

  return (
    <section
      id="reviews"
      className="py-24 px-4 sm:px-6 relative border-t border-slate-900 bg-transparent text-slate-100 overflow-hidden"
    >
      {/* Background Radial Ambient Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(251,191,36,0.05),transparent_60%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-12">
        {/* ====================================================================
            HEADER
            ==================================================================== */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-[11px] tracking-widest uppercase shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <Sparkles size={12} className="text-sky-400 animate-pulse" />
            <span>05 — COMMUNITY TELEMETRY & FEEDBACK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            CHALLENGER EXPERIENCES
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed font-sans">
            Real 90-day transformation logs, live community star voting, and verified feedback from
            challengers and supporters across the globe.
          </p>

          {/* View Mode Switcher */}
          <div className="pt-2 flex items-center justify-center gap-2 font-mono text-xs">
            <button
              onClick={() => setViewState("archive")}
              className={cn(
                "px-3.5 py-1.5 rounded-full border transition flex items-center gap-1.5",
                viewState === "archive"
                  ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)] font-bold"
                  : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white"
              )}
            >
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span>Live Star Ratings & Feedback</span>
            </button>

            <button
              onClick={() => setViewState("cards")}
              className={cn(
                "px-3 py-1.5 rounded-full border transition flex items-center gap-1.5",
                viewState === "cards"
                  ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)] font-bold"
                  : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white"
              )}
            >
              <Layers size={13} className="text-sky-400" />
              <span>4 Core Pillars</span>
            </button>

            <button
              onClick={() => setViewState("chain")}
              className={cn(
                "px-3 py-1.5 rounded-full border transition flex items-center gap-1.5",
                viewState === "chain"
                  ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)] font-bold"
                  : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>3-Node Architecture</span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            LIVE STAR RATING & VOTING CONSOLE (ALWAYS PROMINENT)
            ==================================================================== */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-slate-950/90 border border-sky-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(56,189,248,0.12)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Star Score & Dynamic Votes Display */}
            <div className="md:col-span-6 space-y-4 border-b md:border-b-0 md:border-r border-slate-800/80 pb-6 md:pb-0 md:pr-8">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-[11px] font-mono tracking-widest text-amber-300 uppercase font-semibold">
                  LIVE COMMUNITY SCORE
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                  REAL-TIME CALCULATION
                </span>
              </div>

              {/* Big Star Score + Stars */}
              <div className="flex items-baseline gap-4 flex-wrap">
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-sky-300">
                  {averageRating.toFixed(1)}
                </div>
                <div className="space-y-1">
                  {/* Visual 5 Stars filled according to average rating */}
                  <div className="flex items-center text-amber-400 text-2xl drop-shadow-[0_0_12px_rgba(251,191,36,0.65)]">
                    {[1, 2, 3, 4, 5].map((starIdx) => {
                      const fillPercentage = Math.max(
                        0,
                        Math.min(100, (averageRating - (starIdx - 1)) * 100)
                      );
                      return (
                        <div key={starIdx} className="relative inline-block mr-1">
                          <span className="text-slate-800">★</span>
                          <span
                            className="absolute top-0 left-0 overflow-hidden text-amber-400"
                            style={{ width: `${fillPercentage}%` }}
                          >
                            ★
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Out of 5.0 Global Rating
                  </div>
                </div>
              </div>

              {/* Dynamic Votes Count Display */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 font-mono">
                <div className="flex items-center gap-2.5">
                  <Shield size={16} className="text-sky-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Total Votes:</span>
                      <span className="text-sky-300 px-2 py-0.5 rounded bg-sky-500/20 border border-sky-400/40 font-mono font-extrabold text-sm">
                        {totalVotes.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {totalVotes === 1
                        ? "1 Vote (Admin Verified Baseline)"
                        : `${totalVotes} verified community votes recorded`}
                    </div>
                  </div>
                </div>

                {patronsCount > 0 && (
                  <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    <span>👑 {patronsCount} Patrons</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Instant 1-Click Interactive Star Voting */}
            <div className="md:col-span-6 space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-2">
                  <TrendingUp size={14} />
                  <span>VOTE LIVE • CLICK TO RATE</span>
                </div>
                <p className="text-xs text-slate-400 font-sans">
                  Tap any star below to instantly register your live rating and update the overall
                  Quantum score.
                </p>
              </div>

              {/* 5 Big Clickable Star Buttons */}
              <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => handleQuickVote(starVal)}
                    disabled={isVotingSubmitting}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl border font-mono transition-all duration-200 flex flex-col items-center justify-center gap-1 group/btn",
                      userVotedRating === starVal
                        ? "bg-amber-400/25 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-105"
                        : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-amber-400/60 hover:text-amber-300 hover:scale-105"
                    )}
                    title={`Rate ${starVal} Stars`}
                  >
                    <Star
                      size={20}
                      className={cn(
                        "transition-transform group-hover/btn:scale-110",
                        userVotedRating && userVotedRating >= starVal
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-600 group-hover/btn:text-amber-400"
                      )}
                    />
                    <span className="text-[10px] font-bold">{starVal}★</span>
                  </button>
                ))}
              </div>

              {/* Quick Action Sub-buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => setIsAddFeedbackOpen(true)}
                  className="flex-1 py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                >
                  <Plus size={14} />
                  <span>+ Leave Written Feedback</span>
                </button>

                <button
                  onClick={() => setIsDonateModalOpen(true)}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono font-extrabold text-xs flex items-center justify-center gap-1.5 transition shadow-[0_0_25px_rgba(251,191,36,0.4)] group"
                >
                  <span className="text-sm">👑</span>
                  <span>Donate & Get Royal Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            STATE 1: 3-NODE CHAIN (When viewState === "chain")
            ==================================================================== */}
        {viewState === "chain" && (
          <div className="py-6 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
            <QuantumTiltCard
              maxTilt={4}
              liftDistance={6}
              onClick={() => setViewState("archive")}
              className="relative w-full max-w-3xl flex items-center justify-center py-12 px-6 cursor-pointer group shadow-2xl transition-all duration-300"
              role="button"
              tabIndex={0}
              title="Click to view full feedback archive"
            >
              <div className="flex flex-col sm:flex-row items-center justify-around w-full gap-8 z-10 font-mono text-center">
                <div className="space-y-2 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
                    <Zap size={24} />
                  </div>
                  <div className="text-xs font-bold text-white">90-Day Habits</div>
                  <div className="text-[10px] text-slate-400">Zero Checkbox Drift</div>
                </div>

                <div className="space-y-2 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.25)]">
                    <Star size={24} className="fill-amber-400 text-amber-400" />
                  </div>
                  <div className="text-xs font-bold text-white">Live Star Rating</div>
                  <div className="text-[10px] text-amber-300">{averageRating.toFixed(1)} ★ ({totalVotes} Votes)</div>
                </div>

                <div className="space-y-2 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                    <Brain size={24} />
                  </div>
                  <div className="text-xs font-bold text-white">Core AI & Proof</div>
                  <div className="text-[10px] text-slate-400">Verified Execution</div>
                </div>
              </div>

              <div className="absolute bottom-3 text-[10px] font-mono text-sky-400 flex items-center gap-1 group-hover:underline">
                <span>Click to view live feedback & royal cards</span>
                <ArrowRight size={12} />
              </div>
            </QuantumTiltCard>
          </div>
        )}

        {/* ====================================================================
            STATE 2: 4-CARDS GRID (When viewState === "cards")
            ==================================================================== */}
        {viewState === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
            <QuantumTiltCard className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                <Zap size={20} />
              </div>
              <h3 className="text-base font-bold text-white">90-Day Habit Matrix</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Day 01 to Day 90 horizontal matrix with double-click audit controls.
              </p>
            </QuantumTiltCard>

            <QuantumTiltCard className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Flame size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Physical Recomp</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Progressive overload and lean mass hypertrophy protocols.
              </p>
            </QuantumTiltCard>

            <QuantumTiltCard className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <Brain size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Quantum Core AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Autonomous task breakdown, study blueprints, and cognitive pacing.
              </p>
            </QuantumTiltCard>

            <QuantumTiltCard
              onClick={() => setViewState("archive")}
              className="p-6 space-y-4 cursor-pointer border-amber-400/40 bg-amber-950/20 hover:border-amber-400"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Star size={20} className="fill-amber-400 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-white">Live Feedback Archive</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {reviews.length} authentic challenger reviews & verified Royal Patron cards.
              </p>
              <div className="text-xs font-mono text-amber-300 flex items-center gap-1">
                <span>Open Archive</span>
                <ArrowRight size={12} />
              </div>
            </QuantumTiltCard>
          </div>
        )}

        {/* ====================================================================
            STATE 3 / DEFAULT: LIVE REVIEWS & EXPERIENCE ARCHIVE FEED
            ==================================================================== */}
        {viewState === "archive" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Filter & Live Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {[
                  { id: "all", label: "All Feedback", count: reviews.length },
                  {
                    id: "patrons",
                    label: "👑 Royal Patrons",
                    count: patronsCount,
                    highlight: true,
                  },
                  {
                    id: "Habits",
                    label: "Habits",
                    count: reviews.filter((r) => r.category === "Habits").length,
                  },
                  {
                    id: "Physical",
                    label: "Physical",
                    count: reviews.filter((r) => r.category === "Physical").length,
                  },
                  {
                    id: "Skills",
                    label: "Skills",
                    count: reviews.filter((r) => r.category === "Skills").length,
                  },
                  {
                    id: "AI",
                    label: "AI Core",
                    count: reviews.filter((r) => r.category === "AI").length,
                  },
                  {
                    id: "Vanguard",
                    label: "Vanguard",
                    count: reviews.filter((r) => r.category === "Vanguard").length,
                  },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border transition text-xs flex items-center gap-1.5",
                      selectedCategory === cat.id
                        ? cat.highlight
                          ? "bg-amber-400/20 border-amber-400 text-amber-300 font-bold shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                          : "bg-sky-500/20 border-sky-400 text-sky-300 font-bold shadow-sm"
                        : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200"
                    )}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[10px] opacity-75">({cat.count})</span>
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[240px]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  placeholder="Search reviews & patrons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Dynamic Feedback Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.slice(0, visibleCount).map((r) => {
                // SPECIAL PREMIUM CARD FOR DONATIONS / MONEY SUPPORTERS
                if (r.isDonation || (r.donationAmount && r.donationAmount > 0)) {
                  return (
                    <QuantumTiltCard
                      key={r.id}
                      maxTilt={6}
                      liftDistance={8}
                      className={cn(
                        "p-6 sm:p-7 flex flex-col justify-between space-y-4 group relative overflow-hidden",
                        "rounded-2xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-950/50 via-slate-950/95 to-amber-900/30",
                        "shadow-[0_0_40px_rgba(251,191,36,0.22)] hover:border-amber-400 hover:shadow-[0_0_50px_rgba(251,191,36,0.35)]",
                        "transition-all duration-300"
                      )}
                    >
                      {/* Holographic animated glow orb */}
                      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-36 h-36 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

                      <div className="space-y-3.5 relative z-10">
                        {/* Top Royal Patron Banner */}
                        <div className="flex items-center justify-between gap-2 border-b border-amber-400/30 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.4)]">
                              👑
                            </span>
                            <div>
                              <div className="text-[11px] font-mono font-bold tracking-wider text-amber-300 uppercase flex items-center gap-1">
                                <span>QUANTUM ROYAL PATRON</span>
                                <Sparkles size={11} className="text-amber-400 animate-pulse" />
                              </div>
                              <div className="text-[9px] font-mono text-amber-200/70">
                                SPECIAL SUPPORTER BACKED
                              </div>
                            </div>
                          </div>

                          {/* Donation Amount Pill */}
                          <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/30 to-amber-600/30 border border-amber-400/60 text-amber-200 font-mono text-[11px] font-extrabold tracking-wide shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center gap-1 shrink-0">
                            <span>₹{r.donationAmount?.toLocaleString() || "500"}</span>
                            <span className="text-[9px] text-amber-400 font-normal">DONATED</span>
                          </div>
                        </div>

                        {/* Stars in Gold Shimmer */}
                        <div className="flex items-center justify-between">
                          <div className="flex text-amber-400 text-sm tracking-widest drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                            {"★".repeat(r.stars)}
                            {"☆".repeat(5 - r.stars)}
                          </div>
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-500/30">
                            {r.date}
                          </span>
                        </div>

                        {/* Quote in Emphasized Typography */}
                        <p className="text-xs text-amber-100/90 leading-relaxed font-sans italic font-medium">
                          &ldquo;{r.text}&rdquo;
                        </p>
                      </div>

                      {/* Supporter Footer */}
                      <div className="pt-3 border-t border-amber-400/25 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full border-2 border-amber-400/70 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.35)]">
                            <Image
                              src={r.avatar}
                              alt={r.name}
                              fill
                              sizes="40px"
                              className="object-cover object-center"
                            />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                              <span>{r.name}</span>
                              <CheckCircle2
                                size={13}
                                className="text-amber-400 fill-amber-400/20"
                              />
                            </div>
                            <div className="text-[10px] font-mono text-amber-200/80">{r.role}</div>
                            <div className="text-[9px] font-mono text-amber-400/90">{r.callsign}</div>
                          </div>
                        </div>

                        <div className="text-[9px] font-mono text-amber-300 border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 rounded">
                          IMMUTABLE PROOF
                        </div>
                      </div>
                    </QuantumTiltCard>
                  );
                }

                // REGULAR CHALLENGER REVIEW CARD
                return (
                  <QuantumTiltCard
                    key={r.id}
                    className="p-6 flex flex-col justify-between space-y-4 group bg-slate-950/80 border-slate-800/80 hover:border-sky-400/50"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex text-amber-400 text-xs tracking-widest">
                          {"★".repeat(r.stars)}
                          {"☆".repeat(5 - r.stars)}
                        </div>
                        <span className="text-[10px] font-mono text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-500/20">
                          {r.date}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
                        &ldquo;{r.text}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-900 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full border border-sky-400/40 overflow-hidden shrink-0 aspect-square shadow-sm">
                        <Image
                          src={r.avatar}
                          alt={r.name}
                          fill
                          sizes="40px"
                          className="object-cover object-center"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                          <span>{r.name}</span>
                          {r.verified && (
                            <CheckCircle2 size={12} className="text-emerald-400" />
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">{r.role}</div>
                        <div className="text-[9px] font-mono text-sky-400/80">{r.callsign}</div>
                      </div>
                    </div>
                  </QuantumTiltCard>
                );
              })}
            </div>

            {/* Pagination / Load More */}
            {visibleCount < filteredReviews.length && (
              <div className="flex flex-col items-center justify-center gap-2 pt-4">
                <span className="text-xs font-mono text-slate-500">
                  Displaying {Math.min(visibleCount, filteredReviews.length)} of{" "}
                  {filteredReviews.length} experiences
                </span>
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-400 text-xs font-mono text-sky-300 transition"
                >
                  Load More Experiences
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ====================================================================
          MODAL 1: ADD NEW FEEDBACK / REVIEW COMPOSER
          ==================================================================== */}
      {isAddFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-950 border border-sky-400/40 shadow-[0_0_50px_rgba(56,189,248,0.2)] text-left font-mono space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddFeedbackOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare size={18} className="text-sky-400" />
                <span>Submit Challenger Feedback</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Document your 90-day progress, habits matrix review, or protocol reflection.
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">YOUR NAME / CALLSIGN</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">ROLE / CALLSIGN TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Student & Calisthenics Athlete"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">STAR RATING</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFeedbackRating(s)}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg border text-xs transition",
                        feedbackRating >= s
                          ? "bg-amber-400/20 border-amber-400 text-amber-300 font-bold"
                          : "bg-slate-900 border-slate-800 text-slate-500"
                      )}
                    >
                      {s} ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">CATEGORY</label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="Habits">Habits Matrix</option>
                  <option value="Physical">Physical Recomposition</option>
                  <option value="Skills">Skill Decomposer</option>
                  <option value="AI">Quantum Core AI</option>
                  <option value="Vanguard">Vanguard Squad</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">YOUR FEEDBACK / REVIEW</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail your consistency rate, XP compounding, or transformation milestones..."
                  value={feedbackQuote}
                  onChange={(e) => setFeedbackQuote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-400 font-sans"
                />
              </div>

              {/* SPECIAL DONATION / PATRON UPGRADE TOGGLE */}
              <div className="p-3.5 rounded-xl border border-amber-400/40 bg-amber-950/20 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDonationSupporter}
                    onChange={(e) => setIsDonationSupporter(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-400"
                  />
                  <div className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                    <span>👑 Support with a Contribution (Get Special Royal Card)</span>
                  </div>
                </label>

                {isDonationSupporter && (
                  <div className="space-y-3 pt-2 border-t border-amber-400/20 text-xs animate-in fade-in duration-200">
                    <p className="text-[11px] text-amber-200/80 font-sans">
                      Your feedback will be showcased in the exclusive golden Royal Patron card.
                    </p>

                    <div className="flex gap-2">
                      {["100", "250", "500", "1000"].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDonationAmount(amt)}
                          className={cn(
                            "flex-1 py-1 rounded-lg border text-xs font-mono transition",
                            donationAmount === amt
                              ? "bg-amber-400 text-slate-950 font-bold border-amber-400"
                              : "bg-slate-900 text-amber-300 border-amber-400/40"
                          )}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-amber-500/30 text-[11px]">
                      <span className="text-slate-400 font-mono">UPI: anuragkumar.pandit2000@okicici</span>
                      <button
                        type="button"
                        onClick={handleCopyUPI}
                        className="text-amber-300 hover:text-white flex items-center gap-1 text-[10px]"
                      >
                        {copiedUPI ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copiedUPI ? "COPIED" : "COPY"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={cn(
                  "w-full py-2.5 rounded-xl font-bold text-xs transition shadow-md",
                  isDonationSupporter
                    ? "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                    : "bg-sky-500 hover:bg-sky-400 text-slate-950"
                )}
              >
                {isDonationSupporter
                  ? "SUBMIT AS ROYAL PATRON (SPECIAL CARD)"
                  : "SUBMIT FEEDBACK TO LIVE ARCHIVE"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: DEDICATED DONATE & GET ROYAL PATRON CARD
          ==================================================================== */}
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-950 border-2 border-amber-400/60 shadow-[0_0_60px_rgba(251,191,36,0.3)] text-left font-mono space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsDonateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <div className="space-y-1 text-center">
              <div className="inline-flex p-3 rounded-2xl bg-amber-400/20 border border-amber-400/50 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.4)] mb-2">
                <span className="text-2xl">👑</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">Quantum Royal Patron</h3>
              <p className="text-xs text-amber-200/80 font-sans">
                Support the project and have your feedback permanently immortalized in the Special
                Royal Card.
              </p>
            </div>

            {/* Scannable UPI QR Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-amber-400/40 flex flex-col items-center gap-3">
              <div className="relative w-36 h-36 bg-white p-2 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/assets/images/qr_support.jpg"
                  alt="Quantum Support QR Code"
                  fill
                  sizes="150px"
                  className="object-contain"
                />
              </div>
              <div className="text-center space-y-1">
                <div className="text-[11px] text-white font-bold">SCAN WITH ANY UPI APP</div>
                <button
                  type="button"
                  onClick={handleCopyUPI}
                  className="px-3 py-1 rounded-full bg-slate-950 border border-amber-400/40 text-[10px] text-amber-300 hover:text-white flex items-center gap-1.5 mx-auto"
                >
                  <span>anuragkumar.pandit2000@okicici</span>
                  {copiedUPI ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            {/* Donation Feedback Form */}
            <form onSubmit={handleDonateFeedbackSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-amber-300">SELECT CONTRIBUTION AMOUNT</label>
                <div className="flex gap-2">
                  {["100", "250", "500", "1000"].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDonateAmount(amt)}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition",
                        donateAmount === amt
                          ? "bg-amber-400 text-slate-950 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]"
                          : "bg-slate-900 text-amber-300 border-slate-800 hover:border-amber-400/40"
                      )}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">YOUR NAME / CALLSIGN</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya"
                  value={donateName}
                  onChange={(e) => setDonateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">PATRON TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Founding Patron • Calisthenics Squad"
                  value={donateTitle}
                  onChange={(e) => setDonateTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">YOUR SUPPORTER MESSAGE / REVIEW</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Leave your immortal words for the Quantum Vanguard..."
                  value={donateMessage}
                  onChange={(e) => setDonateMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-extrabold text-xs transition shadow-[0_0_30px_rgba(251,191,36,0.5)]"
              >
                PUBLISH SPECIAL ROYAL PATRON CARD 👑
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          TOAST FEEDBACK NOTICE
          ==================================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-950 border border-emerald-500/50 text-emerald-300 font-mono text-xs shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
};

export default ExperiencesReviewSection;
