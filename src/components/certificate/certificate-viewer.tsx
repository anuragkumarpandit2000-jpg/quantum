"use client";

import React, { useRef } from "react";
import { Download, Printer, ShieldCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface CertificateViewerProps {
  userName: string;
  certificateNumber?: string;
  startDate?: Date;
  endDate?: Date;
  pledge?: string;
}

export const CertificateViewer: React.FC<CertificateViewerProps> = ({
  userName,
  certificateNumber = "QNTM-ARC-90-2025",
  startDate = new Date(),
  endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  pledge = "I solemnly commit to 90 consecutive days of unwavering focus, intense execution, and relentless self-discipline under the Quantum Winter Arc protocol.",
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none">
      {/* Printable Certificate Frame */}
      <div
        ref={certRef}
        className="relative bg-[#040814] text-white p-8 sm:p-14 rounded-2xl border-4 border-double border-sky-400/40 shadow-[0_0_50px_rgba(56,189,248,0.2)] overflow-hidden"
      >
        {/* Subtle background geometry watermark */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <Award size={450} className="text-sky-400" />
        </div>

        {/* Ambient Corner Accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-sky-400" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-sky-400" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-sky-400" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-sky-400" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Logo & Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sky-400 font-mono text-xs tracking-[0.4em] uppercase">
              <ShieldCheck size={16} /> Official Protocol Induction
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-white to-cyan-300 drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]">
              QUANTUM
            </h1>
            <h2 className="text-lg sm:text-xl font-mono tracking-widest text-sky-300">
              WINTER ARC — 90-DAY COMMITMENT
            </h2>
          </div>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

          {/* Recipient */}
          <div className="space-y-2">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              THIS CERTIFIES THAT CHALLENGER
            </p>
            <div className="text-2xl sm:text-4xl font-bold font-serif text-white tracking-wider border-b border-sky-500/40 pb-2 px-8 inline-block">
              {userName || "Arun V."}
            </div>
          </div>

          {/* Commitment Statement */}
          <p className="max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed font-sans italic px-4">
            &ldquo;{pledge}&rdquo;
          </p>

          {/* Dates & Verification Grid */}
          <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-left font-mono">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">START DATE</div>
              <div className="text-xs text-sky-300 font-bold">{format(startDate, "dd MMM yyyy")}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">CULMINATION</div>
              <div className="text-xs text-sky-300 font-bold">{format(endDate, "dd MMM yyyy")}</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-500 uppercase">CERTIFICATE ID</div>
              <div className="text-xs text-slate-400 truncate">{certificateNumber}</div>
            </div>
          </div>

          {/* Signatures / Seal */}
          <div className="w-full max-w-xl flex justify-between items-end pt-6">
            <div className="text-left font-mono">
              <div className="font-serif italic text-base text-sky-300 tracking-wider">
                Quantum System
              </div>
              <div className="w-32 h-px bg-slate-700 my-1" />
              <div className="text-[10px] text-slate-500 uppercase">PROTOCOL VALIDATOR</div>
            </div>

            {/* Hologram Emblem */}
            <div className="w-16 h-16 rounded-full border-2 border-sky-400/60 bg-sky-950/60 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              <span className="text-[8px] font-mono text-sky-400 font-bold">ARC 90</span>
              <span className="text-[7px] font-mono text-slate-400">VERIFIED</span>
            </div>

            <div className="text-right font-mono">
              <div className="font-serif italic text-base text-white tracking-wider">
                {userName.split(" ")[0]}
              </div>
              <div className="w-32 h-px bg-slate-700 my-1 ml-auto" />
              <div className="text-[10px] text-slate-500 uppercase">CHALLENGER SIGNATURE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 print:hidden">
        <Button onClick={handleDownload} variant="quantum" size="lg" className="gap-2">
          <Download size={18} /> DOWNLOAD CERTIFICATE
        </Button>
        <Button onClick={handlePrint} variant="outline" size="lg" className="gap-2">
          <Printer size={18} /> PRINT CERTIFICATE
        </Button>
      </div>
    </div>
  );
};

export default CertificateViewer;
