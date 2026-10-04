"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Shield, ChevronLeft, AtSign, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FloatingPaths from "@/components/ui/floating-paths";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fast pre-check: if challenger is already logged in, redirect directly to command center
  useEffect(() => {
    let isMounted = true;
    const checkActiveSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const data = await res.json();
        if (data?.user && isMounted) {
          if (!data.user.emailVerified) {
            router.push(`/verify-email?email=${encodeURIComponent(data.user.email || "")}`);
          } else if (!data.user.profile?.onboardingDone) {
            router.push("/onboarding");
          } else {
            router.push("/dashboard");
          }
        }
      } catch {
        // Unauthenticated or network issue, user stays on login page
      }
    };
    checkActiveSession();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
        setIsLoading(false);
        return;
      }

      if (!data.user.emailVerified) {
        router.push(`/verify-email?email=${encodeURIComponent(data.user.email || "")}`);
        return;
      }

      if (!data.user.onboardingDone) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Network or server connection failed.");
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen grid lg:grid-cols-2 bg-[#02050e] text-slate-100 overflow-hidden select-none">
      {/* Left Obsidian Hero Pillar */}
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
            WINTER ARC
          </span>
        </div>

        <div className="z-10 max-w-md space-y-4">
          <blockquote className="space-y-2">
            <p className="text-xl sm:text-2xl font-serif text-slate-200 leading-snug italic">
              &ldquo;The 90-day Winter Arc structure makes consistency feel like an actual mission. The whole Quantum experience feels different from a normal tracker.&rdquo;
            </p>
            <footer className="font-mono text-xs text-sky-400">
              — Kabir, Arc Challenger
            </footer>
          </blockquote>
        </div>

        <div className="z-10 font-mono text-[11px] text-slate-500">
          SYSTEM TELEMETRY • SECURE ENCLAVE 256-BIT PBKDF2 ENCRYPTION
        </div>
      </div>

      {/* Right Login Form */}
      <div className="relative flex flex-col justify-center items-center p-6 sm:p-12">
        <Button asChild variant="ghost" size="sm" className="absolute top-8 left-8 gap-1.5 font-mono text-xs text-slate-400 hover:text-white">
          <Link href="/">
            <ChevronLeft size={16} /> RETURN HOME
          </Link>
        </Button>

        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              CHALLENGER SIGN IN
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Enter your callsign to access the Command Center.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">EMAIL OR USERNAME</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="challenger@quantum.system"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="ps-10"
                  required
                />
                <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">SECURITY PASSPHRASE</label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ps-10"
                  required
                />
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <Button
              type="submit"
              variant="quantum"
              size="lg"
              disabled={isLoading}
              className="w-full mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  INITIALIZE SESSION <ArrowRight size={16} className="ml-1" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Login Preset Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setIdentifier("demo@quantum.system");
                setPassword("quantum90");
              }}
              className="w-full p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-300 font-mono text-[11px] hover:bg-sky-900/40 transition text-center"
            >
              ⚡ AUTO-FILL SEED DEMO CHALLENGER
            </button>
          </div>

          <div className="text-center font-mono text-xs text-slate-400">
            Unregistered challenger?{" "}
            <Link href="/signup" className="text-sky-400 hover:underline font-bold">
              Begin Induction
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
