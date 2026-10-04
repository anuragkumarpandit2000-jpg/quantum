"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GLOBAL SYSTEM ERROR]:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#02050f] text-slate-100 min-h-screen flex items-center justify-center p-6 font-mono">
        <div className="max-w-md w-full p-8 rounded-2xl bg-slate-950 border border-sky-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 mx-auto rounded-xl bg-sky-500/10 border border-sky-400/40 flex items-center justify-center text-sky-400 text-xl font-bold">
            Q
          </div>
          <h1 className="text-xl font-black text-white">SYSTEM RECOVERY INITIATED</h1>
          <p className="text-xs text-slate-400">
            A root runtime exception was mitigated. Click below to restore normal protocol operation.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 transition shadow-lg"
          >
            RESTORE SESSION
          </button>
        </div>
      </body>
    </html>
  );
}
