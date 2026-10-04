"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, RefreshCw, Home, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error securely for telemetry
    console.error("[QUANTUM ERROR BOUNDARY CAPTURED]:", error);
  }, [error]);

  const handleLogoutAndReset = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#02050f] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full p-8 rounded-3xl bg-slate-950/80 border border-sky-500/30 backdrop-blur-2xl shadow-[0_0_60px_rgba(56,189,248,0.15)] text-center space-y-6">
        {/* Header Icon & Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.3)]">
            <AlertCircle size={32} />
          </div>
          <div>
            <div className="text-[10px] tracking-[0.25em] text-sky-400 uppercase font-bold">
              QUANTUM TELEMETRY ANOMALY
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              SESSION RE-INITIALIZATION REQUIRED
            </h1>
          </div>
        </div>

        {/* Informative message */}
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          The quantum subsystem caught a telemetry synchronization gap. Your data and progress logs are safely persisted in the immutable ledger.
        </p>

        {/* Error Digest (if available) */}
        {error?.digest && (
          <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 text-[10px] text-slate-500 truncate">
            TRACE CODE: {error.digest}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            variant="quantum"
            size="lg"
            onClick={() => reset()}
            className="w-full text-xs font-bold gap-2 shadow-lg"
          >
            <RefreshCw size={15} />
            RE-INITIALIZE TELEMETRY
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full text-xs border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 gap-1.5"
            >
              <Link href="/">
                <Home size={13} />
                COMMAND HOME
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogoutAndReset}
              className="w-full text-xs border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-amber-300 gap-1.5"
            >
              <LogOut size={13} />
              RE-AUTHENTICATE
            </Button>
          </div>
        </div>

        <div className="pt-2 text-[10px] text-slate-600">
          QUANTUM v1.1.1 • RESILIENT SYSTEM RUNTIME
        </div>
      </div>
    </div>
  );
}
