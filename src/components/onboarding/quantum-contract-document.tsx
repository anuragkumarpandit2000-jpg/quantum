"use client";

import React, { forwardRef } from "react";
import { ContractDocumentResult } from "@/lib/ai/quantum-core";

export interface QuantumContractDocumentProps {
  participant: {
    name: string;
    age?: number | string;
    academicStatus?: string;
    username?: string;
  };
  contract: ContractDocumentResult;
  signatureUrl?: string | null;
}

/**
 * Downloads the contract directly as a high-resolution 1024x1536 PNG stamped image.
 */
export async function downloadContractImage({
  participant,
  contract,
  signatureUrl,
}: QuantumContractDocumentProps): Promise<void> {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1536;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      window.print();
      return;
    }

    // 1. Load the official contract template image
    const bgImg = new window.Image();
    bgImg.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      bgImg.onload = () => resolve();
      bgImg.onerror = () => reject(new Error("Failed to load contract template image"));
      bgImg.src = "/assets/images/contract/contract.png";
    });
    ctx.drawImage(bgImg, 0, 0, 1024, 1536);

    // 2. White fill Date of Commitment box to cleanly mask placeholder DD / MM / YYYY
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(395, 1462, 232, 41, 6);
    ctx.fill();

    const formattedDateNumeric =
      contract.generatedDate && contract.generatedDate.includes("/")
        ? contract.generatedDate
        : new Date()
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\./g, " / ")
            .replace(/\//g, " / ");

    ctx.font = "bold 15px 'Courier New', monospace, sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(formattedDateNumeric, 394 + 234 / 2, 1461 + 43 / 2);

    // 3. Participant details
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "bold 14px 'Inter', sans-serif";
    ctx.fillStyle = "#0f172a";
    const nameStr = (participant.name || "CHALLENGER").toUpperCase();
    ctx.fillText(nameStr, 210, 388 + 39 / 2);
    ctx.fillText("WINTER ARC 90", 710, 388 + 38 / 2);

    const userStr = participant.username
      ? participant.username.startsWith("@")
        ? participant.username
        : `@${participant.username}`
      : `@${nameStr.replace(/\s+/g, "_")}`;
    ctx.font = "600 13px 'Inter', sans-serif";
    ctx.fillText(userStr, 210, 438 + 39 / 2);

    ctx.font = "bold 13px 'Inter', sans-serif";
    ctx.fillText("90 CONSECUTIVE DAYS", 710, 437 + 39 / 2);

    const startDateStr =
      contract.generatedDate ||
      new Date()
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .toUpperCase();
    ctx.fillText(startDateStr, 210, 489 + 40 / 2);

    // Helper for multiline wrapping
    const drawWrapped = (
      text: string,
      x: number,
      y: number,
      maxW: number,
      lineH: number,
      maxLines = 4
    ) => {
      ctx.font = "12px 'Inter', sans-serif";
      ctx.fillStyle = "#1e293b";
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      const words = (text || "").split(" ");
      let line = "";
      let linesDrawn = 0;
      let currY = y + 18;

      for (let n = 0; n < words.length; n++) {
        const test = line + words[n] + " ";
        if (ctx.measureText(test).width > maxW && n > 0) {
          ctx.fillText(line.trim(), x, currY);
          line = words[n] + " ";
          currY += lineH;
          linesDrawn++;
          if (linesDrawn >= maxLines - 1) {
            const rem = words.slice(n).join(" ");
            ctx.fillText(
              rem.length > 50 ? rem.slice(0, 47) + "..." : rem,
              x,
              currY
            );
            return;
          }
        } else {
          line = test;
        }
      }
      ctx.fillText(line.trim(), x, currY);
    };

    // Q1
    drawWrapped(
      `Primary: ${contract.primaryGoalText} | Secondary: ${contract.secondaryGoalText}`,
      42,
      673,
      435,
      18,
      4
    );

    // Q2
    drawWrapped(contract.proofMethodText, 536, 678, 435, 18, 4);

    // Q3
    drawWrapped(contract.arcCommitmentText, 42, 899, 435, 18, 4);

    // Q4
    drawWrapped(contract.badDayProtocolText, 536, 910, 435, 18, 4);

    // Q5
    drawWrapped(contract.distractionStrategyText, 42, 1121, 435, 18, 4);

    // Q6
    drawWrapped(contract.consistencyCheckpointText, 536, 1123, 435, 18, 4);

    // Q7
    drawWrapped(contract.continuationPlanText, 42, 1329, 435, 18, 3);

    // Q8 Signature
    if (signatureUrl) {
      try {
        const sigImg = new window.Image();
        sigImg.crossOrigin = "anonymous";
        await new Promise<void>((res, rej) => {
          sigImg.onload = () => res();
          sigImg.onerror = () => rej();
          sigImg.src = signatureUrl;
        });
        const maxSigW = 320;
        const maxSigH = 62;
        let sw = sigImg.width;
        let sh = sigImg.height;
        const ratio = Math.min(maxSigW / sw, maxSigH / sh, 1);
        sw = sw * ratio;
        sh = sh * ratio;
        const sx = 525 + (459 - sw) / 2;
        const sy = 1329 + (75 - sh) / 2;
        ctx.drawImage(sigImg, sx, sy, sw, sh);
      } catch {
        ctx.font = "italic 26px 'Brush Script MT', cursive, serif";
        ctx.fillStyle = "#0f172a";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(participant.name, 525 + 459 / 2, 1329 + 75 / 2);
      }
    } else {
      ctx.font = "italic 26px 'Brush Script MT', cursive, serif";
      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(participant.name, 525 + 459 / 2, 1329 + 75 / 2);
    }

    // Trigger instant download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `QUANTUM_WINTER_ARC_CONTRACT_${nameStr.replace(/\s+/g, "_")}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Error generating contract image:", err);
    window.print();
  }
}

export const QuantumContractDocument = forwardRef<
  HTMLDivElement,
  QuantumContractDocumentProps
>(({ participant, contract, signatureUrl }, ref) => {
  const formattedDate =
    contract.generatedDate ||
    new Date()
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();

  const formattedDateNumeric =
    contract.generatedDate && contract.generatedDate.includes("/")
      ? contract.generatedDate
      : new Date()
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\./g, " / ")
          .replace(/\//g, " / ");

  const participantName = (participant.name || "Challenger").toUpperCase();
  const participantUsername = participant.username
    ? participant.username.startsWith("@")
      ? participant.username
      : `@${participant.username}`
    : `@${participantName.replace(/\s+/g, "_")}`;

  return (
    <div
      ref={ref}
      id="quantum-contract-printable"
      className="relative w-full max-w-[860px] mx-auto select-none bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:border-none print:m-0 print:p-0 print:w-full print:max-w-none print:rounded-none"
      style={{
        aspectRatio: "1024 / 1536",
        containerType: "inline-size",
        colorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
      }}
    >
      {/* Base Template Image from /assets/images/contract/contract.png */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/images/contract/contract.png"
        alt="Quantum Winter Arc Official Contract"
        className="w-full h-full object-fill pointer-events-none block"
      />

      {/* ========================================================
          PARTICIPANT INFORMATION OVERLAYS
          ======================================================== */}
      {/* NAME */}
      <div
        style={{
          left: "19.34%",
          top: "25.26%",
          width: "30.37%",
          height: "2.54%",
        }}
        className="absolute flex items-center px-[1.2cqw] font-sans font-bold text-slate-900 tracking-wide overflow-hidden whitespace-nowrap"
      >
        <span style={{ fontSize: "1.35cqw" }}>{participantName}</span>
      </div>

      {/* ARC TYPE */}
      <div
        style={{
          left: "68.26%",
          top: "25.26%",
          width: "26.95%",
          height: "2.47%",
        }}
        className="absolute flex items-center px-[1.2cqw] font-sans font-bold text-slate-900 tracking-wide overflow-hidden whitespace-nowrap"
      >
        <span style={{ fontSize: "1.35cqw" }}>WINTER ARC 90</span>
      </div>

      {/* USERNAME */}
      <div
        style={{
          left: "19.43%",
          top: "28.52%",
          width: "30.27%",
          height: "2.54%",
        }}
        className="absolute flex items-center px-[1.2cqw] font-sans font-semibold text-slate-800 tracking-wide overflow-hidden whitespace-nowrap"
      >
        <span style={{ fontSize: "1.25cqw" }}>{participantUsername}</span>
      </div>

      {/* DURATION */}
      <div
        style={{
          left: "68.26%",
          top: "28.45%",
          width: "26.95%",
          height: "2.54%",
        }}
        className="absolute flex items-center px-[1.2cqw] font-sans font-bold text-slate-900 tracking-wide overflow-hidden whitespace-nowrap"
      >
        <span style={{ fontSize: "1.3cqw" }}>90 CONSECUTIVE DAYS</span>
      </div>

      {/* ARC START */}
      <div
        style={{
          left: "19.34%",
          top: "31.84%",
          width: "30.37%",
          height: "2.60%",
        }}
        className="absolute flex items-center px-[1.2cqw] font-sans font-bold text-slate-900 tracking-wide overflow-hidden whitespace-nowrap"
      >
        <span style={{ fontSize: "1.3cqw" }}>{formattedDate}</span>
      </div>

      {/* ========================================================
          QUESTION BOX OVERLAYS (01 - 08)
          ======================================================== */}
      {/* 01: PRIMARY & SECONDARY GOALS */}
      <div
        style={{
          left: "3.03%",
          top: "43.82%",
          width: "44.73%",
          height: "6.64%",
        }}
        className="absolute p-[1.1cqw] flex flex-col justify-center font-sans text-slate-900 overflow-hidden leading-[1.25]"
      >
        <div style={{ fontSize: "1.05cqw" }} className="line-clamp-2">
          <strong className="text-black uppercase tracking-wider text-[0.9em]">
            Primary:{" "}
          </strong>
          {contract.primaryGoalText}
        </div>
        <div
          style={{ fontSize: "1.05cqw" }}
          className="line-clamp-2 mt-[0.3cqw]"
        >
          <strong className="text-black uppercase tracking-wider text-[0.9em]">
            Secondary:{" "}
          </strong>
          {contract.secondaryGoalText}
        </div>
      </div>

      {/* 02: PROOF OF PROGRESS */}
      <div
        style={{
          left: "51.27%",
          top: "44.14%",
          width: "44.82%",
          height: "6.45%",
        }}
        className="absolute p-[1.1cqw] flex items-center font-sans text-slate-900 overflow-hidden leading-[1.3]"
      >
        <p style={{ fontSize: "1.12cqw" }} className="line-clamp-3">
          {contract.proofMethodText}
        </p>
      </div>

      {/* 03: WHAT WILL IT COST YOU / COMMITMENT */}
      <div
        style={{
          left: "3.03%",
          top: "58.53%",
          width: "44.63%",
          height: "6.84%",
        }}
        className="absolute p-[1.1cqw] flex items-center font-sans text-slate-900 overflow-hidden leading-[1.3]"
      >
        <p style={{ fontSize: "1.12cqw" }} className="line-clamp-3">
          {contract.arcCommitmentText}
        </p>
      </div>

      {/* 04: DIFFICULT / UNPRODUCTIVE DAY */}
      <div
        style={{
          left: "51.27%",
          top: "59.24%",
          width: "44.82%",
          height: "6.25%",
        }}
        className="absolute p-[1.1cqw] flex items-center font-sans text-slate-900 overflow-hidden leading-[1.3]"
      >
        <p style={{ fontSize: "1.12cqw" }} className="line-clamp-3">
          {contract.badDayProtocolText}
        </p>
      </div>

      {/* 05: WHEN YOU GET DISTRACTED */}
      <div
        style={{
          left: "3.03%",
          top: "72.98%",
          width: "44.63%",
          height: "6.64%",
        }}
        className="absolute p-[1.1cqw] flex items-center font-sans text-slate-900 overflow-hidden leading-[1.3]"
      >
        <p style={{ fontSize: "1.12cqw" }} className="line-clamp-3">
          {contract.distractionStrategyText}
        </p>
      </div>

      {/* 06: CONSISTENCY CHECKPOINT */}
      <div
        style={{
          left: "51.27%",
          top: "73.11%",
          width: "44.82%",
          height: "6.51%",
        }}
        className="absolute p-[1.1cqw] flex items-center font-sans text-slate-900 overflow-hidden leading-[1.3]"
      >
        <p style={{ fontSize: "1.12cqw" }} className="line-clamp-3">
          {contract.consistencyCheckpointText}
        </p>
      </div>

      {/* 07: WILL YOU CONTINUE AFTER 90 DAYS */}
      <div
        style={{
          left: "3.03%",
          top: "86.52%",
          width: "44.73%",
          height: "4.88%",
        }}
        className="absolute p-[1.1cqw] flex items-center font-sans text-slate-900 overflow-hidden leading-[1.3]"
      >
        <p style={{ fontSize: "1.1cqw" }} className="line-clamp-2">
          {contract.continuationPlanText}
        </p>
      </div>

      {/* 08: PARTICIPANT DIGITAL SIGNATURE */}
      <div
        style={{
          left: "51.27%",
          top: "86.52%",
          width: "44.82%",
          height: "4.88%",
        }}
        className="absolute flex items-center justify-center p-[0.4cqw] overflow-hidden"
      >
        {signatureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={signatureUrl}
            alt="Participant Signature"
            className="max-h-[85%] max-w-[90%] object-contain contrast-125"
          />
        ) : (
          <span
            style={{ fontSize: "2.4cqw" }}
            className="font-serif italic text-slate-900 tracking-wide"
          >
            {participant.name}
          </span>
        )}
      </div>

      {/* ========================================================
          DATE OF COMMITMENT
          (White fill to cleanly cover placeholder DD / MM / YYYY)
          ======================================================== */}
      <div
        style={{
          left: "38.6%",
          top: "95.12%",
          width: "22.6%",
          height: "2.80%",
        }}
        className="absolute bg-white rounded flex items-center justify-center font-mono font-bold text-slate-900 tracking-wider shadow-none"
      >
        <span style={{ fontSize: "1.2cqw" }}>{formattedDateNumeric}</span>
      </div>
    </div>
  );
});

QuantumContractDocument.displayName = "QuantumContractDocument";

export default QuantumContractDocument;
