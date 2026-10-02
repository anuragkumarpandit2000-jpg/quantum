"use client";

import React, { forwardRef, useState, useEffect } from "react";
import QRCode from "qrcode";

export interface QuantumCertificateData {
  name: string;
  username?: string;
  primaryGoal: string;
  secondaryGoal: string;
  totalXP: number;
  consistency: number;
  completedDays: number;
  arcId: string;
  completionDate: string;
  startDate?: string;
}

export interface QuantumCompletionCertificateProps {
  data: QuantumCertificateData;
  className?: string;
}

/**
 * High-resolution HTML5 Canvas PNG Downloader for Certificate
 * Generates an exact 1491 x 1055 px stamped certificate with live QR code
 */
export async function downloadCertificateImage(data: QuantumCertificateData): Promise<void> {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1491;
    canvas.height = 1055;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      window.print();
      return;
    }

    // 1. Load official certificate template image
    const bgImg = new window.Image();
    bgImg.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      bgImg.onload = () => resolve();
      bgImg.onerror = () => reject(new Error("Failed to load certificate template image"));
      bgImg.src = "/assets/images/document/certificate.png";
    });
    ctx.drawImage(bgImg, 0, 0, 1491, 1055);

    // 2. Cleanly mask "YOUR NAME HERE" with white and draw user's name
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(350, 410, 790, 48);

    ctx.font = "bold 32px 'Times New Roman', serif";
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const nameStr = (data.name || "CHALLENGER").toUpperCase();
    ctx.fillText(nameStr, 1491 / 2, 434);

    // 3. Draw Total XP (above "TOTAL XP EARNED")
    ctx.font = "bold 24px 'Inter', monospace, sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const xpStr = `${(data.totalXP || 4320).toLocaleString()} XP`;
    ctx.fillText(xpStr, 665, 652);

    // 4. Draw Consistency (cover lone "%" then draw percentage)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(1065, 638, 55, 30);

    ctx.font = "bold 24px 'Inter', monospace, sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const consistencyStr = `${data.consistency || 94}%`;
    ctx.fillText(consistencyStr, 1060, 652);

    // 5. Draw Primary Goal inside box (x: 247, y: 798, w: 487, h: 42)
    ctx.font = "500 13px 'Inter', sans-serif";
    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const primGoal = data.primaryGoal.length > 55 ? data.primaryGoal.slice(0, 52) + "..." : data.primaryGoal;
    ctx.fillText(primGoal, 258, 798 + 42 / 2);

    // 6. Draw Secondary Goal inside box (x: 758, y: 798, w: 487, h: 42)
    const secGoal = data.secondaryGoal.length > 55 ? data.secondaryGoal.slice(0, 52) + "..." : data.secondaryGoal;
    ctx.fillText(secGoal, 769, 798 + 42 / 2);

    // 7. Draw Date Completed inside box (x: 95, y: 914, w: 218, h: 30)
    ctx.font = "bold 13px 'Inter', monospace, sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const compDateStr = (data.completionDate || new Date().toLocaleDateString("en-GB")).toUpperCase();
    ctx.fillText(compDateStr, 105, 914 + 30 / 2);

    // 8. Draw Arc ID inside box (x: 892, y: 915, w: 172, h: 30)
    ctx.font = "bold 13px 'Inter', monospace, sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(data.arcId || "Q-CERT-90ARC", 892 + 172 / 2, 915 + 30 / 2);

    // 9. Generate & Draw Live QR Code over verification square (x: 525, y: 885, w: 60, h: 60)
    try {
      const verifyUrl = `${window.location.origin}/verify/${data.arcId}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        margin: 1,
        width: 120,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });

      const qrImg = new window.Image();
      await new Promise<void>((res, rej) => {
        qrImg.onload = () => res();
        qrImg.onerror = () => rej();
        qrImg.src = qrDataUrl;
      });
      ctx.drawImage(qrImg, 524, 884, 62, 62);
    } catch (e) {
      console.warn("QR code drawing fallback:", e);
    }

    // Trigger instant download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `QUANTUM_90DAY_CERTIFICATE_${nameStr.replace(/\s+/g, "_")}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Error exporting certificate image:", err);
    window.print();
  }
}

export const QuantumCompletionCertificate = forwardRef<
  HTMLDivElement,
  QuantumCompletionCertificateProps
>(({ data, className }, ref) => {
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined" && data.arcId) {
      const targetUrl = `${window.location.origin}/verify/${data.arcId}`;
      QRCode.toDataURL(targetUrl, {
        margin: 1,
        width: 150,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      })
        .then((url) => setQrUrl(url))
        .catch((err) => console.error("QR Code generation error:", err));
    }
  }, [data.arcId]);

  const nameStr = (data.name || "Challenger").toUpperCase();
  const xpStr = `${(data.totalXP || 4320).toLocaleString()} XP`;
  const consistencyStr = `${data.consistency || 94}%`;
  const compDateStr = (data.completionDate || new Date().toLocaleDateString("en-GB")).toUpperCase();

  return (
    <div
      ref={ref}
      id="quantum-certificate-printable"
      className={`relative w-full max-w-[960px] mx-auto select-none bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:border-none print:m-0 print:p-0 print:w-full print:max-w-none print:rounded-none ${
        className || ""
      }`}
      style={{
        aspectRatio: "1491 / 1055",
        containerType: "inline-size",
        colorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
      }}
    >
      {/* Official Certificate Background Template Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/images/document/certificate.png"
        alt="Quantum 90-Day Arc Official Certificate of Completion"
        className="w-full h-full object-fill pointer-events-none block"
      />

      {/* ========================================================
          1. PARTICIPANT NAME OVERLAY
          (Masks "YOUR NAME HERE" and displays live participant name)
          ======================================================== */}
      <div
        style={{
          left: "22%",
          top: "38.5%",
          width: "56%",
          height: "5.5%",
        }}
        className="absolute bg-white flex items-center justify-center font-serif font-black text-slate-950 tracking-[0.12em] overflow-hidden whitespace-nowrap text-center"
      >
        <span style={{ fontSize: "2.1cqw" }}>{nameStr}</span>
      </div>

      {/* ========================================================
          2. TOTAL XP EARNED OVERLAY
          (Positioned next to XP star icon, above TOTAL XP EARNED label)
          ======================================================== */}
      <div
        style={{
          left: "44.6%",
          top: "60.4%",
          width: "15%",
          height: "3.4%",
        }}
        className="absolute flex items-center font-mono font-black text-slate-900 overflow-hidden whitespace-nowrap"
      >
        <span style={{ fontSize: "1.6cqw" }}>{xpStr}</span>
      </div>

      {/* ========================================================
          3. CONSISTENCY PERCENTAGE OVERLAY
          (Masks solitary "%" and displays live consistency)
          ======================================================== */}
      <div
        style={{
          left: "70.8%",
          top: "60.4%",
          width: "8%",
          height: "3.4%",
        }}
        className="absolute bg-white flex items-center font-mono font-black text-slate-900 overflow-hidden whitespace-nowrap"
      >
        <span style={{ fontSize: "1.6cqw" }}>{consistencyStr}</span>
      </div>

      {/* ========================================================
          4. PRIMARY GOAL BOX OVERLAY
          ======================================================== */}
      <div
        style={{
          left: "16.57%",
          top: "75.64%",
          width: "32.66%",
          height: "3.98%",
        }}
        className="absolute flex items-center px-[0.8cqw] font-sans font-medium text-slate-800 overflow-hidden"
      >
        <span style={{ fontSize: "0.95cqw" }} className="truncate">
          {data.primaryGoal}
        </span>
      </div>

      {/* ========================================================
          5. SECONDARY GOAL BOX OVERLAY
          ======================================================== */}
      <div
        style={{
          left: "50.84%",
          top: "75.64%",
          width: "32.66%",
          height: "3.98%",
        }}
        className="absolute flex items-center px-[0.8cqw] font-sans font-medium text-slate-800 overflow-hidden"
      >
        <span style={{ fontSize: "0.95cqw" }} className="truncate">
          {data.secondaryGoal}
        </span>
      </div>

      {/* ========================================================
          6. DATE COMPLETED BOX OVERLAY
          ======================================================== */}
      <div
        style={{
          left: "6.37%",
          top: "86.64%",
          width: "14.62%",
          height: "2.84%",
        }}
        className="absolute flex items-center px-[0.6cqw] font-mono font-bold text-slate-900 overflow-hidden whitespace-nowrap"
      >
        <span style={{ fontSize: "0.92cqw" }}>{compDateStr}</span>
      </div>

      {/* ========================================================
          7. ARC ID BOX OVERLAY
          ======================================================== */}
      <div
        style={{
          left: "59.83%",
          top: "86.73%",
          width: "11.54%",
          height: "2.84%",
        }}
        className="absolute flex items-center justify-center font-mono font-bold text-slate-900 overflow-hidden whitespace-nowrap"
      >
        <span style={{ fontSize: "0.92cqw" }}>{data.arcId}</span>
      </div>

      {/* ========================================================
          8. DYNAMIC QR CODE OVERLAY
          (Links directly to public verification page)
          ======================================================== */}
      {qrUrl && (
        <div
          style={{
            left: "35.15%",
            top: "83.8%",
            width: "4.15%",
            height: "5.88%",
          }}
          className="absolute bg-white flex items-center justify-center p-[0.1cqw] rounded-sm overflow-hidden"
          title={`Verify Arc: ${data.arcId}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt={`QR Verification for ${data.arcId}`}
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
});

QuantumCompletionCertificate.displayName = "QuantumCompletionCertificate";

export default QuantumCompletionCertificate;
