"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Lightbulb, Mic, Globe, Paperclip, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PLACEHOLDERS = [
  "Make my 90-day study plan...",
  "I want to master 3D Blender modelling...",
  "I missed yesterday. How do I recover my streak?",
  "Optimize my daily routine for maximum focus...",
  "Break down Python backend engineering into daily micro-tasks...",
  "How can I maintain unwavering consistency during the Arc?",
];

interface AIChatInputProps {
  onSendMessage?: (message: string, options: { thinkActive: boolean; deepSearchActive: boolean }) => void;
  isLoading?: boolean;
  className?: string;
}

export const AIChatInput: React.FC<AIChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  className,
}) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [thinkActive, setThinkActive] = useState(false);
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || inputValue) return;

    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 3200);

    return () => clearInterval(interval);
  }, [isActive, inputValue]);

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!inputValue) setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue]);

  const handleActivate = () => setIsActive(true);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSendMessage?.(inputValue.trim(), { thinkActive, deepSearchActive });
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const containerVariants = {
    collapsed: {
      height: 50,
      boxShadow: "0 4px 20px -2px rgba(0,0,0,0.5), 0 0 15px rgba(56,189,248,0.1)",
      transition: { type: "spring", stiffness: 140, damping: 18 },
    },
    expanded: {
      height: 96,
      boxShadow: "0 10px 35px -4px rgba(0,0,0,0.7), 0 0 25px rgba(56,189,248,0.2)",
      transition: { type: "spring", stiffness: 140, damping: 18 },
    },
  };

  const placeholderContainerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.02 } },
    exit: { transition: { staggerChildren: 0.01, staggerDirection: -1 } },
  };

  const letterVariants = {
    initial: {
      opacity: 0,
      filter: "blur(8px)",
      y: 8,
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        opacity: { duration: 0.2 },
        filter: { duration: 0.3 },
        y: { type: "spring", stiffness: 90, damping: 20 },
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(8px)",
      y: -8,
      transition: {
        opacity: { duration: 0.15 },
        filter: { duration: 0.25 },
        y: { type: "spring", stiffness: 90, damping: 20 },
      },
    },
  };

  return (
    <div className={cn("w-full flex justify-center items-center", className)}>
      <motion.div
        ref={wrapperRef}
        className="w-full max-w-3xl border border-sky-500/25 bg-slate-950/90 backdrop-blur-xl rounded-[28px] overflow-hidden"
        variants={containerVariants}
        animate={isActive || inputValue ? "expanded" : "collapsed"}
        initial="collapsed"
        onClick={handleActivate}
      >
        <form onSubmit={handleSubmit} className="flex flex-col items-stretch w-full h-full p-1.5">
          {/* Input Row */}
          <div className="flex items-center gap-2 px-2 py-0.5 w-full">
            <button
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-sky-300 transition"
              title="Attach context or daily log"
              type="button"
              tabIndex={-1}
            >
              <Paperclip size={16} />
            </button>

            {/* Text Input & Animated Placeholder */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border-0 outline-0 rounded-md py-1 text-sm bg-transparent w-full font-normal text-white placeholder:text-transparent"
                style={{ position: "relative", zIndex: 1 }}
                onFocus={handleActivate}
              />
              <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-1 py-2">
                <AnimatePresence mode="wait">
                  {showPlaceholder && !isActive && !inputValue && (
                    <motion.span
                      key={placeholderIndex}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 select-none pointer-events-none text-sm sm:text-base font-normal"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        zIndex: 0,
                      }}
                      variants={placeholderContainerVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {PLACEHOLDERS[placeholderIndex].split("").map((char, i) => (
                        <motion.span
                          key={i}
                          variants={letterVariants}
                          style={{ display: "inline-block" }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </motion.span>
                      ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              className="p-2.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-sky-300 transition"
              title="Voice interface"
              type="button"
              tabIndex={-1}
            >
              <Mic size={18} />
            </button>

            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="flex items-center gap-1 bg-gradient-to-r from-sky-500 to-cyan-400 hover:brightness-110 disabled:opacity-40 text-slate-950 p-2.5 rounded-full font-semibold justify-center transition shadow-md shadow-sky-500/30"
              title="Execute Quantum Directive"
              tabIndex={-1}
            >
              <Send size={16} />
            </button>
          </div>

          {/* Expanded Controls */}
          <motion.div
            className="w-full flex justify-between px-3 items-center text-xs"
            variants={{
              hidden: {
                opacity: 0,
                y: 15,
                pointerEvents: "none" as const,
                transition: { duration: 0.2 },
              },
              visible: {
                opacity: 1,
                y: 0,
                pointerEvents: "auto" as const,
                transition: { duration: 0.3, delay: 0.05 },
              },
            }}
            initial="hidden"
            animate={isActive || inputValue ? "visible" : "hidden"}
            style={{ marginTop: 4 }}
          >
            <div className="flex gap-2.5 items-center">
              {/* Think Toggle */}
              <button
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all font-medium text-xs group border",
                  thinkActive
                    ? "bg-sky-500/20 border-sky-400/60 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                )}
                title="Synthesize Strategic Arc Reasoning"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setThinkActive((a) => !a);
                }}
              >
                <Lightbulb
                  className={cn(
                    "transition-all",
                    thinkActive ? "text-sky-300 fill-sky-300" : "group-hover:text-amber-400"
                  )}
                  size={14}
                />
                Think
              </button>

              {/* Deep Search Toggle */}
              <motion.button
                className={cn(
                  "flex items-center px-3 gap-1.5 py-1.5 rounded-full transition font-medium whitespace-nowrap overflow-hidden justify-start border text-xs",
                  deepSearchActive
                    ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                )}
                title="Deep Arc Knowledge Search"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeepSearchActive((a) => !a);
                }}
                initial={false}
                animate={{
                  width: deepSearchActive ? 120 : 36,
                  paddingLeft: deepSearchActive ? 8 : 9,
                }}
              >
                <div className="flex-1">
                  <Globe size={14} />
                </div>
                <motion.span
                  className="pb-[1px]"
                  initial={false}
                  animate={{
                    opacity: deepSearchActive ? 1 : 0,
                  }}
                >
                  Deep Arc
                </motion.span>
              </motion.button>
            </div>

            <div className="text-[11px] font-mono text-slate-500">
              QUANTUM CORE v2.5 AI
            </div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default AIChatInput;
