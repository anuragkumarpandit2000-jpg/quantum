"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Shield, ChevronLeft, AtSign, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FloatingPaths from "@/components/ui/floating-paths";
import ProfileAvatarUploader from "@/components/ui/profile-avatar-uploader";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password, avatar }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setIsLoading(false);
        return;
      }

      router.push(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}&sent=true`);
    } catch {
      setError("Network or server connection failed.");
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen grid lg:grid-cols-2 bg-[#02050e] text-slate-100 overflow-hidden select-none">
      {/* Left Column */}
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
              &ldquo;The 90-day concept is simple but powerful. Having a visual record of your daily effort, XP and progress makes the entire transformation journey much more meaningful.&rdquo;
            </p>
            <footer className="font-mono text-xs text-sky-400">
              — Reyansh, Arc Challenger
            </footer>
          </blockquote>
        </div>

        <div className="z-10 font-mono text-[11px] text-slate-500">
          INDUCTION PROTOCOL • 90 DAYS • 10,000 TARGET XP • HABIT MATRIX
        </div>
      </div>

      {/* Right Signup Form */}
      <div className="relative flex flex-col justify-center items-center p-6 sm:p-12">
        <Button asChild variant="ghost" size="sm" className="absolute top-8 left-8 gap-1.5 font-mono text-xs text-slate-400 hover:text-white">
          <Link href="/">
            <ChevronLeft size={16} /> RETURN HOME
          </Link>
        </Button>

        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              COMMENCE ARC INDUCTION
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Create your challenger credentials to enter Quantum.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 font-mono text-xs">
            {/* Challenger Profile Photo Upload with Drag-Crop */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center justify-center space-y-2 text-center">
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                PROFILE PHOTO (OPTIONAL)
              </span>
              <ProfileAvatarUploader
                currentAvatar={avatar}
                onAvatarChange={(newUrl) => setAvatar(newUrl)}
                size="md"
              />
              <span className="text-[10px] text-slate-500 font-sans">
                Upload image • Drag to reposition face inside circle
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">FULL NAME</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g. Arun Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ps-10"
                  required
                />
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">CALLSIGN / USERNAME</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g. shadow_arc"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="ps-10"
                  required
                />
                <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">COMMUNICATION EMAIL</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="challenger@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Minimum 6 characters"
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
                  INITIALIZING INDUCTION...
                </>
              ) : (
                <>
                  COMMENCE PROTOCOL <ArrowRight size={16} className="ml-1" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center font-mono text-xs text-slate-400">
            Already enrolled?{" "}
            <Link href="/login" className="text-sky-400 hover:underline font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
