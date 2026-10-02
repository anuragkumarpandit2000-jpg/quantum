import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, Calendar, Zap, CheckCircle2, Lock, ArrowLeft, ExternalLink } from "lucide-react";
import prisma from "@/lib/prisma";

interface VerifyPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function VerifyArcPage({ params }: VerifyPageProps) {
  const { id } = await Promise.resolve(params);

  const certificate = await prisma.certificate.findFirst({
    where: {
      certificateNumber: id ? id.toUpperCase().trim() : "",
    },
    include: {
      user: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  });

  let payload: any = {};
  if (certificate?.contractData) {
    try {
      payload = JSON.parse(certificate.contractData);
    } catch {}
  }

  const isVerified = !!certificate;
  const participantName = certificate?.userName || certificate?.user.name || "Unknown Challenger";
  const username = certificate?.user.username || "CHALLENGER";
  const totalXP = payload.totalXP || 4320;
  const consistency = payload.consistency ? `${payload.consistency}%` : "94%";
  const completionDate = certificate?.endDate
    ? new Date(certificate.endDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB");

  return (
    <div className="min-h-screen bg-[#02050f] text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-slate-950 font-sans relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-500/5 blur-[100px] pointer-events-none rounded-full" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-sky-400/40 bg-slate-950/60 p-0.5 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(56,189,248,0.25)] shrink-0">
            <Image
              src="/assets/images/logo/logo.png"
              alt="Quantum Logo"
              width={34}
              height={34}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="font-mono font-black text-sm tracking-widest text-white">QUANTUM</div>
            <div className="font-mono text-[9px] text-sky-400 tracking-wider">SOVEREIGN PROTOCOL</div>
          </div>
        </Link>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>CRYPTOGRAPHIC REGISTRY LIVE</span>
        </div>
      </header>

      {/* Main Verification Card */}
      <main className="relative z-10 w-full max-w-xl mx-auto px-4 py-12 flex flex-col items-center">
        {isVerified ? (
          <div className="w-full bg-slate-950/70 border border-sky-500/30 rounded-2xl p-6 sm:p-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(56,189,248,0.15)] space-y-8 text-center">
            {/* Verification Badge */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border-2 border-emerald-400/60 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                <ShieldCheck size={36} />
              </div>
              <div className="space-y-1">
                <div className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
                  OFFICIAL VALIDATION
                </div>
                <h1 className="font-mono text-3xl font-black tracking-widest text-white uppercase">
                  ARC VERIFIED
                </h1>
                <p className="font-sans text-xs text-slate-400 max-w-sm mx-auto">
                  This 90-Day Arc completion has been authenticated and cryptographically sealed on the QUANTUM registry.
                </p>
              </div>
            </div>

            {/* Verification Details Table */}
            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 text-left font-mono space-y-3.5 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-slate-400 uppercase text-[11px]">PARTICIPANT</span>
                <span className="font-bold text-white text-sm uppercase">{participantName}</span>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-slate-400 uppercase text-[11px]">USERNAME</span>
                <span className="text-sky-300 font-semibold">@{username}</span>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-slate-400 uppercase text-[11px]">ARC PROTOCOL</span>
                <span className="text-white font-bold">90-Day Winter Arc</span>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-slate-400 uppercase text-[11px]">STATUS</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 text-[10px]">
                  COMPLETED
                </span>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-slate-400 uppercase text-[11px]">EXECUTION DAYS</span>
                <span className="text-white font-bold">90 / 90 CONSECUTIVE</span>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-slate-400 uppercase text-[11px]">TOTAL XP EARNED</span>
                <span className="text-amber-300 font-bold">{totalXP.toLocaleString()} XP</span>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-slate-400 uppercase text-[11px]">CONSISTENCY RATE</span>
                <span className="text-sky-400 font-bold">{consistency}</span>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-slate-400 uppercase text-[11px]">COMPLETION DATE</span>
                <span className="text-slate-300">{completionDate}</span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400 uppercase text-[11px]">ARC ID</span>
                <span className="font-bold text-sky-400 font-mono tracking-wider">{certificate?.certificateNumber}</span>
              </div>
            </div>

            {/* Authority Signoff */}
            <div className="pt-2 text-center space-y-1">
              <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                CERTIFIED SOVEREIGN ISSUER
              </div>
              <div className="font-serif italic text-base text-red-400 font-semibold">
                Anurag Kumar
              </div>
              <div className="font-mono text-[10px] text-slate-400">
                CEO, QUANTUM PROTOCOL AUTHORITY
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full bg-slate-950/70 border border-red-500/30 rounded-2xl p-8 backdrop-blur-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <Lock size={28} />
            </div>
            <h1 className="font-mono text-2xl font-black text-white">RECORD NOT FOUND</h1>
            <p className="font-sans text-xs text-slate-400 max-w-sm mx-auto">
              The Arc ID <code className="text-red-400 font-mono font-bold">{id}</code> could not be located in the official registry. Please check the ID or contact support.
            </p>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-sky-400 transition-colors"
          >
            <ArrowLeft size={14} /> RETURN TO QUANTUM
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 text-center font-mono text-[10px] text-slate-600 border-t border-white/5">
        QUANTUM OPERATING SYSTEM • UNALTERABLE 90-DAY PROTOCOL CERTIFICATION REGISTRY
      </footer>
    </div>
  );
}
