"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  ArrowRight,
  RefreshCw,
  ChevronLeft,
  Loader2,
  Lock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FloatingPaths from "@/components/ui/floating-paths";

type VerificationState =
  | "IDLE_AWAITING_VERIFICATION"
  | "VERIFYING"
  | "VERIFIED"
  | "ALREADY_VERIFIED"
  | "EXPIRED_TOKEN"
  | "INVALID_TOKEN"
  | "SERVER_ERROR";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenParam = searchParams.get("token");
  const emailParam = searchParams.get("email");
  const sentParam = searchParams.get("sent") === "true";

  const [state, setState] = useState<VerificationState>(
    tokenParam ? "VERIFYING" : "IDLE_AWAITING_VERIFICATION"
  );
  const [emailInput, setEmailInput] = useState<string>(emailParam || "");
  const [targetEmail, setTargetEmail] = useState<string>(emailParam || "");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resendSuccess, setResendSuccess] = useState<string>(
    sentParam ? "Verification link transmitted. Check your inbox and spam folder." : ""
  );
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState<number>(sentParam ? 60 : 0);
  const [verifiedUser, setVerifiedUser] = useState<any>(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Fetch current user if no email param is in URL
  useEffect(() => {
    if (!targetEmail) {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.email) {
            setTargetEmail(data.user.email);
            setEmailInput(data.user.email);
            if (data.user.emailVerified && !tokenParam) {
              setState("ALREADY_VERIFIED");
            }
          }
        })
        .catch(() => {});
    }
  }, [targetEmail, tokenParam]);

  // When token query param is provided, automatically submit to server for verification
  useEffect(() => {
    if (!tokenParam) return;

    let isMounted = true;
    setState("VERIFYING");

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: tokenParam }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!isMounted) return;

        if (res.ok) {
          if (data.status === "ALREADY_VERIFIED") {
            setState("ALREADY_VERIFIED");
            setStatusMessage(data.message || "This Quantum account is already verified.");
          } else {
            setState("VERIFIED");
            setStatusMessage(data.message || "Email verified successfully.");
            setVerifiedUser(data.user);
          }
        } else {
          if (data.status === "EXPIRED_TOKEN") {
            setState("EXPIRED_TOKEN");
            setErrorMessage(data.error || "Verification link has expired.");
            if (data.email) {
              setTargetEmail(data.email);
              setEmailInput(data.email);
            }
          } else if (data.status === "ALREADY_VERIFIED") {
            setState("ALREADY_VERIFIED");
            setStatusMessage(data.message || "This Quantum account has already been ratified.");
          } else {
            setState("INVALID_TOKEN");
            setErrorMessage(data.error || "Invalid or already consumed verification token.");
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setState("SERVER_ERROR");
          setErrorMessage("Failed to establish secure link with Quantum verification server.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [tokenParam]);

  // Handle Resend Verification Email
  const handleResend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    setErrorMessage("");
    setResendSuccess("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput || targetEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.status === "ALREADY_VERIFIED") {
          setState("ALREADY_VERIFIED");
          setStatusMessage("This account is already verified. You may proceed directly to your Arc.");
        } else {
          setResendSuccess(data.message || "A fresh verification link has been transmitted.");
          setCooldown(data.cooldownSeconds || 60);
          if (data.email) {
            setTargetEmail(data.email);
          }
        }
      } else {
        if (res.status === 429) {
          setCooldown(data.secondsRemaining || 60);
          setErrorMessage(data.error || "Rate limit reached. Please wait before requesting another email.");
        } else {
          setErrorMessage(data.error || "Failed to resend verification link.");
        }
      }
    } catch {
      setErrorMessage("Network error while communicating with verification server.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="relative min-h-screen grid lg:grid-cols-2 bg-[#02050e] text-slate-100 overflow-hidden select-none">
      {/* Left Column: Obsidian Aesthetic Brand Pillar */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 border-r border-slate-800 bg-[#040816]/80 overflow-hidden">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />

        <div className="z-10 flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-sky-400/40 bg-slate-950/60 p-0.5 flex items-center justify-center text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.25)] shrink-0">
            <Image
              src="/assets/images/logo/logo.png"
              alt="Quantum Logo"
              width={34}
              height={34}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-extrabold text-xl tracking-widest text-white">QUANTUM</span>
          <span className="text-[10px] font-mono text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-400/20">
            SECURITY DIRECTIVE
          </span>
        </div>

        <div className="z-10 max-w-md space-y-4">
          <blockquote className="space-y-3">
            <div className="flex items-center gap-2 text-sky-400 font-mono text-xs tracking-wider uppercase">
              <Shield size={16} /> Cryptographic Proof of Ownership
            </div>
            <p className="text-xl sm:text-2xl font-serif text-slate-200 leading-snug italic">
              &ldquo;Discipline begins with authentic accountability. No anonymous ghost accounts. Every challenger in the Winter Arc proves their identity.&rdquo;
            </p>
            <footer className="font-mono text-xs text-slate-400">
              — Quantum Security Protocol 2.6
            </footer>
          </blockquote>
        </div>

        <div className="z-10 font-mono text-[11px] text-slate-500">
          SHA-256 SALTED HASH • SINGLE-USE TOKEN • 24H EXPIRATION WINDOW
        </div>
      </div>

      {/* Right Column: Interactive State Container */}
      <div className="relative flex flex-col justify-center items-center p-6 sm:p-12">
        <Link href="/" className="absolute top-8 left-8">
          <Button variant="ghost" size="sm" className="gap-1.5 font-mono text-xs text-slate-400 hover:text-white">
            <ChevronLeft size={16} /> RETURN HOME
          </Button>
        </Link>

        <div className="w-full max-w-md space-y-6">
          {/* Header Brand for Mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-sky-400/40 bg-slate-950 p-0.5 flex items-center justify-center text-sky-400">
              <Image
                src="/assets/images/logo/logo.png"
                alt="Quantum Logo"
                width={26}
                height={26}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-extrabold text-base tracking-widest text-white">QUANTUM</span>
          </div>

          {/* ============================================================
              STATE 1: VERIFYING (Processing token with server)
              ============================================================ */}
          {state === "VERIFYING" && (
            <div className="p-8 rounded-2xl bg-slate-950/70 border border-sky-500/30 backdrop-blur-xl shadow-2xl text-center space-y-5">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin" />
                <Lock size={24} className="text-sky-400 animate-pulse" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-white tracking-wide">
                  RATIFYING SECURITY TOKEN
                </h2>
                <p className="text-xs font-mono text-sky-400">
                  Validating cryptographic SHA-256 hash & expiration window...
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 font-mono text-[11px] text-slate-400">
                Please hold while Quantum Core ratifies your credentials.
              </div>
            </div>
          )}

          {/* ============================================================
              STATE 2: VERIFIED (Success)
              ============================================================ */}
          {state === "VERIFIED" && (
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-950/90 to-emerald-950/30 border border-emerald-500/40 backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.15)] text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-400/50 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 size={32} />
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  IDENTITY RATIFIED
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight mt-2">
                  EMAIL VERIFIED SUCCESSFULLY
                </h2>
                <p className="text-xs font-mono text-slate-300">
                  {statusMessage || "Your Quantum Winter Arc account is now completely unlocked."}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>ACCOUNT STATUS</span>
                  <span className="text-emerald-400 font-bold">ACTIVE & IMMUTABLE</span>
                </div>
                {verifiedUser?.email && (
                  <div className="flex justify-between items-center text-slate-400 text-[11px]">
                    <span>COMMUNICATION EMAIL</span>
                    <span className="text-white truncate max-w-[200px]">{verifiedUser.email}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>ACCESS LEVEL</span>
                  <span className="text-sky-400 font-bold">FULL WINTER ARC 90-DAY ACCESS</span>
                </div>
              </div>

              <Button
                variant="quantum"
                size="lg"
                onClick={() => {
                  if (verifiedUser?.onboardingDone) {
                    router.push("/dashboard");
                  } else {
                    router.push("/onboarding");
                  }
                }}
                className="w-full gap-2 font-mono text-xs font-bold"
              >
                <span>ENTER COMMAND CENTER</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          )}

          {/* ============================================================
              STATE 3: ALREADY VERIFIED
              ============================================================ */}
          {state === "ALREADY_VERIFIED" && (
            <div className="p-8 rounded-2xl bg-slate-950/80 border border-sky-500/40 backdrop-blur-xl shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-sky-500/15 border-2 border-sky-400/50 flex items-center justify-center mx-auto text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                <Shield size={32} />
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                  ALREADY RATIFIED
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight mt-2">
                  ACCOUNT IS ALREADY VERIFIED
                </h2>
                <p className="text-xs font-mono text-slate-300">
                  {statusMessage || "Your email address has already been authenticated. No further verification needed."}
                </p>
              </div>

              <Button
                variant="quantum"
                size="lg"
                onClick={() => router.push("/dashboard")}
                className="w-full gap-2 font-mono text-xs font-bold"
              >
                <span>CONTINUE TO DASHBOARD</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          )}

          {/* ============================================================
              STATE 4: EXPIRED TOKEN
              ============================================================ */}
          {state === "EXPIRED_TOKEN" && (
            <div className="p-8 rounded-2xl bg-slate-950/80 border border-amber-500/40 backdrop-blur-xl shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/15 border-2 border-amber-400/50 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                <Clock size={32} />
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  TOKEN EXPIRED
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight mt-2">
                  VERIFICATION LINK EXPIRED
                </h2>
                <p className="text-xs font-mono text-slate-300">
                  For your security, Quantum single-use verification links expire after 24 hours.
                </p>
              </div>

              {resendSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  {resendSuccess}
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                  {errorMessage}
                </div>
              )}

              <Button
                variant="quantum"
                size="lg"
                disabled={isResending || cooldown > 0}
                onClick={() => handleResend()}
                className="w-full gap-2 font-mono text-xs font-bold"
              >
                {isResending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    TRANSMITTING NEW LINK...
                  </>
                ) : cooldown > 0 ? (
                  `RESEND AVAILABLE IN ${cooldown}s`
                ) : (
                  <>
                    <RefreshCw size={16} />
                    TRANSMIT NEW VERIFICATION LINK
                  </>
                )}
              </Button>
            </div>
          )}

          {/* ============================================================
              STATE 5: INVALID TOKEN OR CONSUMED
              ============================================================ */}
          {(state === "INVALID_TOKEN" || state === "SERVER_ERROR") && (
            <div className="p-8 rounded-2xl bg-slate-950/80 border border-rose-500/40 backdrop-blur-xl shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-rose-500/15 border-2 border-rose-400/50 flex items-center justify-center mx-auto text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]">
                <AlertCircle size={32} />
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                  INVALID TOKEN
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight mt-2">
                  VERIFICATION FAILED
                </h2>
                <p className="text-xs font-mono text-slate-300">
                  {errorMessage || "This link is invalid, corrupted, or has already been consumed."}
                </p>
              </div>

              {resendSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  {resendSuccess}
                </div>
              )}

              {/* Resend input form */}
              <form onSubmit={handleResend} className="space-y-3 font-mono text-xs text-left">
                <label className="text-slate-400 text-[11px]">ENTER YOUR ACCOUNT EMAIL TO RECEIVE A NEW LINK:</label>
                <Input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="challenger@domain.com"
                  required
                  className="bg-slate-900/60"
                />
                <Button
                  type="submit"
                  variant="quantum"
                  size="lg"
                  disabled={isResending || cooldown > 0}
                  className="w-full gap-2 font-mono text-xs font-bold"
                >
                  {isResending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      TRANSMITTING...
                    </>
                  ) : cooldown > 0 ? (
                    `RESEND AVAILABLE IN ${cooldown}s`
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      RESEND VERIFICATION LINK
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* ============================================================
              STATE 6: IDLE / AWAITING VERIFICATION (After signup or unverified login)
              ============================================================ */}
          {state === "IDLE_AWAITING_VERIFICATION" && (
            <div className="p-8 rounded-2xl bg-slate-950/80 border border-sky-500/30 backdrop-blur-xl shadow-2xl text-center space-y-6">
              <div className="relative w-16 h-16 rounded-full bg-sky-500/15 border-2 border-sky-400/40 flex items-center justify-center mx-auto text-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.25)]">
                <Mail size={30} className="animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-400/20">
                  STEP 2 OF INDUCTION
                </span>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  CHECK YOUR INBOX
                </h1>
                <p className="text-xs font-mono text-slate-300 leading-relaxed">
                  A single-use verification link has been transmitted to your email address:
                </p>
                {targetEmail && (
                  <div className="inline-block px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-400/30 font-mono text-xs text-sky-300 font-bold">
                    {targetEmail}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-left font-mono text-[11px] text-slate-300 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sky-400 font-bold mt-0.5">•</span>
                  <span>Open your email client and click the <strong>&ldquo;RATIFY IDENTITY&rdquo;</strong> button.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky-400 font-bold mt-0.5">•</span>
                  <span>Can&apos;t find it? Check your <strong>Spam / Promotions</strong> folder.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky-400 font-bold mt-0.5">•</span>
                  <span>Links expire in <strong>24 hours</strong>. Unverified accounts cannot access the 90-Day Arc.</span>
                </div>
              </div>

              {resendSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  {resendSuccess}
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                  {errorMessage}
                </div>
              )}

              {/* Resend Action Form */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="outline"
                  size="lg"
                  disabled={isResending || cooldown > 0}
                  onClick={() => handleResend()}
                  className="w-full gap-2 font-mono text-xs border-sky-500/30 hover:bg-sky-500/10 text-sky-300 hover:text-white"
                >
                  {isResending ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      DISPATCHING LINK...
                    </>
                  ) : cooldown > 0 ? (
                    `RESEND IN ${cooldown}s`
                  ) : (
                    <>
                      <RefreshCw size={15} />
                      RESEND VERIFICATION EMAIL
                    </>
                  )}
                </Button>

                <div className="text-center font-mono text-[11px] text-slate-500">
                  Wrong address?{" "}
                  <Link href="/login" className="text-sky-400 hover:underline">
                    Sign in with another account
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Footer Directives */}
          <div className="text-center font-mono text-[11px] text-slate-500">
            PROTECTED BY QUANTUM SECURITY ENCLAVE • ZERO COMPROMISE
          </div>
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#02050e] text-white flex flex-col items-center justify-center font-mono space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin" />
          <div className="text-xs tracking-widest text-sky-400">INITIALIZING SECURITY ENCLAVE...</div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
