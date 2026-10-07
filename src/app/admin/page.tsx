"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  ShieldAlert,
  Users,
  Radio,
  Zap,
  Flame,
  Award,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Lock,
  Globe,
  Star,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Activity,
  UserCheck,
  UserX,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  lastActiveAt: string;
  createdAt: string;
  isLiveNow: boolean;
  profile?: {
    avatar: string;
    level: number;
    totalXP: number;
    currentClass: string;
    onboardingDone: boolean;
  };
  streak?: {
    currentStreak: number;
    longestStreak: number;
    consistencyRate: number;
  };
}

interface AdminProof {
  id: string;
  dayNumber: number;
  caption: string;
  fileUrl: string;
  isPublic: boolean;
  createdAt: string;
  user: {
    name: string;
    username: string;
    email: string;
    profile?: { avatar: string };
  };
}

interface AdminFeedback {
  id: string;
  authorName: string;
  authorTitle: string;
  rating: number;
  quote: string;
  isApproved: boolean;
  isSample: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [proofs, setProofs] = useState<AdminProof[]>([]);
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);

  // Navigation & Search State
  const [activeTab, setActiveTab] = useState<"users" | "proofs" | "feedbacks">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [presenceFilter, setPresenceFilter] = useState<"all" | "live" | "verified" | "admin">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Grant XP Modal state
  const [grantModalUser, setGrantModalUser] = useState<AdminUser | null>(null);
  const [grantXpAmount, setGrantXpAmount] = useState("500");
  const [grantXpReason, setGrantXpReason] = useState("Administrative Merit Award");

  const notify = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const fetchAdminData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/overview");
      if (res.status === 403 || res.status === 401) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.users) {
        setAuthorized(true);
        setAdminEmail(data.adminEmail || "anuragkumar.pandit2000@gmail.com");
        setStats(data.stats);
        setUsers(data.users);
        setProofs(data.recentProofs || []);
        setFeedbacks(data.recentFeedbacks || []);
      } else {
        setAuthorized(false);
      }
    } catch (err) {
      console.error("Admin fetch error:", err);
      setAuthorized(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    // Auto refresh live data every 15 seconds
    const interval = setInterval(fetchAdminData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (presenceFilter === "live") return u.isLiveNow;
      if (presenceFilter === "verified") return u.emailVerified;
      if (presenceFilter === "admin") return u.role === "ADMIN";

      return true;
    });
  }, [users, searchQuery, presenceFilter]);

  // Admin Actions execution
  const executeAdminAction = async (action: string, payload: any) => {
    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      const data = await res.json();
      if (res.ok) {
        notify(data.message || "Action executed successfully.");
        fetchAdminData();
      } else {
        notify(data.error || "Action failed.");
      }
    } catch {
      notify("Network error during action dispatch.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 font-mono space-y-4">
        <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
        <p className="tracking-widest uppercase text-sm">INITIALIZING QUANTUM COMMAND MATRIX...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
          <ShieldAlert size={40} />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase font-mono">
            ACCESS RESTRICTED // 403
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed font-mono">
            Super-Admin clearance required. Only verified administrator accounts with elevated clearance can access the Quantum Control Matrix.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition shadow-lg shadow-cyan-500/20"
          >
            LOGIN AS ADMIN
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-xs transition"
          >
            BACK TO HOME
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30">
      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-mono text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <CheckCircle2 size={16} />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* ====================================================================
          TOP BAR
          ==================================================================== */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Return to Challenger Dashboard"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-cyan-400/40 bg-slate-900 p-0.5 flex items-center justify-center">
              <Shield size={18} className="text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-widest text-white font-mono">
                  QUANTUM OMNI-CONTROL
                </span>
                <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold uppercase">
                  SOVEREIGN ROOT
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span>Account:</span>
                <span className="text-cyan-300 font-bold">{adminEmail}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Prisma Postgres Online
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            disabled={refreshing}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-xs flex items-center gap-2 transition"
          >
            <RefreshCw size={13} className={cn(refreshing && "animate-spin text-cyan-400")} />
            <span>{refreshing ? "SYNCING..." : "REFRESH TELEMETRY"}</span>
          </button>

          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center gap-1.5 transition"
          >
            <span>LIVE SITE</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </header>

      {/* ====================================================================
          METRICS OVERVIEW
          ==================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>CHALLENGERS</span>
                <Users size={12} className="text-sky-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{stats.totalUsers}</div>
              <div className="text-[11px] font-mono text-slate-500">Total in Database</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/30 space-y-1 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center justify-between">
                <span>LIVE NOW</span>
                <Radio size={12} className="text-emerald-400 animate-pulse" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {stats.liveUsersNow}
              </div>
              <div className="text-[11px] font-mono text-emerald-500/80">Active in last 15m</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>VERIFIED</span>
                <UserCheck size={12} className="text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {stats.verifiedUsers}
              </div>
              <div className="text-[11px] font-mono text-cyan-500/80">
                {Math.round((stats.verifiedUsers / Math.max(stats.totalUsers, 1)) * 100)}% Ratified
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>SYSTEM XP</span>
                <Zap size={12} className="text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-300 font-mono">
                {stats.totalCumulativeXP?.toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-slate-500">Cumulative Earned</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>PROOFS</span>
                <Globe size={12} className="text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{stats.totalProofs}</div>
              <div className="text-[11px] font-mono text-slate-500">
                {stats.publicProofs} Public • {stats.privateProofs} Private
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>REVIEWS</span>
                <Star size={12} className="text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {stats.totalFeedbacks}
              </div>
              <div className="text-[11px] font-mono text-slate-500">Community Reviews</div>
            </div>
          </div>
        )}

        {/* ====================================================================
            NAVIGATION TABS
            ==================================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("users")}
              className={cn(
                "px-4 py-2 rounded-xl font-mono text-xs transition flex items-center gap-2",
                activeTab === "users"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
              )}
            >
              <Users size={14} />
              <span>CHALLENGERS & REAL-TIME PRESENCE ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("proofs")}
              className={cn(
                "px-4 py-2 rounded-xl font-mono text-xs transition flex items-center gap-2",
                activeTab === "proofs"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
              )}
            >
              <Globe size={14} />
              <span>VISUAL PROOF MODERATION ({proofs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("feedbacks")}
              className={cn(
                "px-4 py-2 rounded-xl font-mono text-xs transition flex items-center gap-2",
                activeTab === "feedbacks"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
              )}
            >
              <Star size={14} />
              <span>COMMUNITY REVIEWS ({feedbacks.length})</span>
            </button>
          </div>

          {activeTab === "users" && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name, email, @user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono w-64 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <select
                value={presenceFilter}
                onChange={(e: any) => setPresenceFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="all">Filter: All Challengers</option>
                <option value="live">🟢 Live Now Only</option>
                <option value="verified">🛡️ Verified Only</option>
                <option value="admin">👑 Admins Only</option>
              </select>
            </div>
          )}
        </div>

        {/* ====================================================================
            TAB 1: USERS & REAL-TIME PRESENCE TABLE
            ==================================================================== */}
        {activeTab === "users" && (
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Challenger</th>
                    <th className="py-3.5 px-4">Live Email</th>
                    <th className="py-3.5 px-4">Presence</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Streak & XP</th>
                    <th className="py-3.5 px-4 text-right">Super Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No challengers match current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const avatar = u.profile?.avatar || "/assets/images/avatars/default_avatar.svg";
                      const totalXP = u.profile?.totalXP || 0;
                      const level = u.profile?.level || 1;
                      const currentStreak = u.streak?.currentStreak || 0;

                      return (
                        <tr key={u.id} className="hover:bg-slate-900/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-700 shrink-0">
                                <Image src={avatar} alt={u.name} fill className="object-cover" />
                              </div>
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  {u.role === "ADMIN" && (
                                    <span className="px-1.5 py-0.2 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[9px] font-bold">
                                      ADMIN
                                    </span>
                                  )}
                                </div>
                                <div className="text-slate-500 text-[11px]">@{u.username}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-cyan-300 font-mono font-medium">{u.email}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            {u.isLiveNow ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold text-[11px] shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                <span>LIVE NOW</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-500 text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                <span>
                                  {u.lastActiveAt
                                    ? new Date(u.lastActiveAt).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "Offline"}
                                </span>
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {u.emailVerified ? (
                              <span className="inline-flex items-center gap-1 text-cyan-400">
                                <CheckCircle2 size={13} />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-400">
                                <XCircle size={13} />
                                <span>Pending</span>
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <div className="text-amber-300 font-bold flex items-center gap-1">
                                <Zap size={11} />
                                <span>{totalXP.toLocaleString()} XP (LVL {level})</span>
                              </div>
                              <div className="text-slate-400 text-[11px] flex items-center gap-1">
                                <Flame size={11} className="text-amber-500" />
                                <span>{currentStreak} Day Streak</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => setGrantModalUser(u)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold transition"
                                title="Grant Custom XP"
                              >
                                +XP
                              </button>

                              <button
                                onClick={() =>
                                  executeAdminAction("toggle_role", {
                                    targetUserId: u.id,
                                    newRole: u.role === "ADMIN" ? "USER" : "ADMIN",
                                  })
                                }
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                                title="Toggle Role"
                              >
                                {u.role === "ADMIN" ? "Demote" : "Promote"}
                              </button>

                              {u.email !== adminEmail && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Purge challenger ${u.name} (${u.email}) permanently?`)) {
                                      executeAdminAction("delete_user", { targetUserId: u.id });
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition"
                                  title="Delete Challenger"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 2: VISUAL PROOFS MODERATION (9:16 Format)
            ==================================================================== */}
        {activeTab === "proofs" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {proofs.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 font-mono">
                No visual proofs uploaded yet.
              </div>
            ) : (
              proofs.map((p) => {
                const isVid =
                  p.fileUrl.endsWith(".mp4") ||
                  p.fileUrl.startsWith("data:video");
                return (
                  <div
                    key={p.id}
                    className="rounded-2xl bg-slate-900/60 border border-slate-800 p-3 space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white font-bold truncate max-w-[100px]">{p.user.name}</span>
                      <span className="text-cyan-400 text-[11px] font-bold">Day {p.dayNumber}</span>
                    </div>

                    <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-black border border-slate-800">
                      {isVid ? (
                        <video
                          src={p.fileUrl}
                          loop
                          muted
                          playsInline
                          autoPlay
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image src={p.fileUrl} alt={p.caption} fill className="object-cover" />
                      )}
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono text-cyan-300">
                        9:16
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-sans line-clamp-2">
                      &ldquo;{p.caption}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-xs">
                      <span className={cn(p.isPublic ? "text-emerald-400" : "text-amber-400", "text-[11px]")}>
                        {p.isPublic ? "🌐 Public" : "🔒 Private"}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            executeAdminAction("toggle_proof_visibility", {
                              proofId: p.id,
                              isPublic: !p.isPublic,
                            })
                          }
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                        >
                          {p.isPublic ? "Private" : "Public"}
                        </button>

                        <button
                          onClick={() => {
                            if (confirm("Delete this proof item?")) {
                              executeAdminAction("delete_proof", { proofId: p.id });
                            }
                          }}
                          className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ====================================================================
            TAB 3: REVIEWS MODERATION
            ==================================================================== */}
        {activeTab === "feedbacks" && (
          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono">
                No feedback entries submitted yet.
              </div>
            ) : (
              feedbacks.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{f.authorName}</span>
                      <span className="text-slate-500">({f.authorTitle})</span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: f.rating }).map((_, i) => (
                          <Star key={i} size={11} className="fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300 font-sans text-sm">&ldquo;{f.quote}&rdquo;</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        executeAdminAction("approve_feedback", {
                          feedbackId: f.id,
                          isApproved: !f.isApproved,
                        })
                      }
                      className={cn(
                        "px-3 py-1.5 rounded-xl border text-xs font-bold transition",
                        f.isApproved
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                          : "bg-amber-500/20 border-amber-500/40 text-amber-300"
                      )}
                    >
                      {f.isApproved ? "Approved ✓" : "Hidden ✕"}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Delete feedback review permanently?")) {
                          executeAdminAction("delete_feedback", { feedbackId: f.id });
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* ====================================================================
          MODAL: GRANT XP
          ==================================================================== */}
      {grantModalUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setGrantModalUser(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/40 p-6 space-y-4 shadow-2xl font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Zap size={16} />
                <span>SOVEREIGN XP INJECTION</span>
              </div>
              <button
                onClick={() => setGrantModalUser(null)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 font-sans">
              Award direct XP to <strong className="text-white">{grantModalUser.name}</strong> (@
              {grantModalUser.username}). XP will be recorded in PostgreSQL ledger and update their
              leaderboard rank.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 uppercase">XP Amount</label>
                <input
                  type="number"
                  value={grantXpAmount}
                  onChange={(e) => setGrantXpAmount(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 uppercase">Audit Directive Reason</label>
                <input
                  type="text"
                  value={grantXpReason}
                  onChange={(e) => setGrantXpReason(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setGrantModalUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  executeAdminAction("grant_xp", {
                    targetUserId: grantModalUser.id,
                    amount: grantXpAmount,
                    reason: grantXpReason,
                  });
                  setGrantModalUser(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Inject XP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
