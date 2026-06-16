"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, UserMinus, Search, ChevronUp, ChevronDown, ArrowUpDown, Mail, Calendar, Shield, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const userGrowthData = [
  { month: "Jul", newUsers: 312, churned: 28 },
  { month: "Aug", newUsers: 428, churned: 34 },
  { month: "Sep", newUsers: 391, churned: 41 },
  { month: "Oct", newUsers: 512, churned: 29 },
  { month: "Nov", newUsers: 634, churned: 52 },
  { month: "Dec", newUsers: 589, churned: 47 },
  { month: "Jan", newUsers: 721, churned: 38 },
  { month: "Feb", newUsers: 803, churned: 61 },
  { month: "Mar", newUsers: 876, churned: 55 },
  { month: "Apr", newUsers: 944, churned: 43 },
  { month: "May", newUsers: 1021, churned: 67 },
  { month: "Jun", newUsers: 1148, churned: 72 },
];

type Plan = "Free" | "Pro" | "Enterprise";
type Status = "Active" | "Inactive" | "Churned";

interface User {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  status: Status;
  joined: string;
  avatar: string;
  location: string;
}

const mockUsers: User[] = [
  { id: "u1", name: "Sophia Hartwell", email: "sophia.hartwell@acme.io", plan: "Enterprise", status: "Active", joined: "2024-01-12", avatar: "SH", location: "San Francisco, CA" },
  { id: "u2", name: "Marcus Chen", email: "m.chen@techbridge.com", plan: "Pro", status: "Active", joined: "2024-02-03", avatar: "MC", location: "Austin, TX" },
  { id: "u3", name: "Priya Nair", email: "priya@nairventures.in", plan: "Pro", status: "Active", joined: "2024-02-18", avatar: "PN", location: "Bangalore, IN" },
  { id: "u4", name: "James Okafor", email: "james.okafor@growthly.co", plan: "Free", status: "Active", joined: "2024-03-05", avatar: "JO", location: "Lagos, NG" },
  { id: "u5", name: "Elena Vasquez", email: "elena.v@pixelcraft.es", plan: "Pro", status: "Inactive", joined: "2024-03-22", avatar: "EV", location: "Madrid, ES" },
  { id: "u6", name: "Liam Thornton", email: "liam@thorntondev.uk", plan: "Enterprise", status: "Active", joined: "2024-04-01", avatar: "LT", location: "London, UK" },
  { id: "u7", name: "Aisha Kamara", email: "aisha.k@dataflow.io", plan: "Free", status: "Churned", joined: "2024-04-14", avatar: "AK", location: "Nairobi, KE" },
  { id: "u8", name: "Noah Bergström", email: "noah.b@nordic.se", plan: "Pro", status: "Active", joined: "2024-04-29", avatar: "NB", location: "Stockholm, SE" },
  { id: "u9", name: "Chloe Dupont", email: "chloe.dupont@lumiere.fr", plan: "Enterprise", status: "Active", joined: "2024-05-07", avatar: "CD", location: "Paris, FR" },
  { id: "u10", name: "Raj Patel", email: "raj.patel@cloudnine.in", plan: "Pro", status: "Active", joined: "2024-05-15", avatar: "RP", location: "Mumbai, IN" },
  { id: "u11", name: "Fatima Al-Rashid", email: "fatima@alrashid.ae", plan: "Free", status: "Inactive", joined: "2024-05-28", avatar: "FA", location: "Dubai, AE" },
  { id: "u12", name: "Tyler Brooks", email: "tyler@brooksanalytics.com", plan: "Pro", status: "Active", joined: "2024-06-02", avatar: "TB", location: "Chicago, IL" },
  { id: "u13", name: "Ingrid Larsen", email: "ingrid.l@fjordtech.no", plan: "Enterprise", status: "Active", joined: "2024-06-10", avatar: "IL", location: "Oslo, NO" },
  { id: "u14", name: "Carlos Mendez", email: "carlos.m@solarspark.mx", plan: "Free", status: "Churned", joined: "2024-06-18", avatar: "CM", location: "Mexico City, MX" },
  { id: "u15", name: "Yuki Tanaka", email: "yuki.t@zenith.jp", plan: "Pro", status: "Active", joined: "2024-06-25", avatar: "YT", location: "Tokyo, JP" },
];

const kpiCards = [
  {
    label: "Total Users",
    value: "12,847",
    change: "+18.4%",
    positive: true,
    icon: Users,
    color: "from-indigo-500 to-violet-600",
    glow: "shadow-indigo-500/20",
  },
  {
    label: "New This Month",
    value: "1,148",
    change: "+12.1%",
    positive: true,
    icon: UserPlus,
    color: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
  },
  {
    label: "Churned",
    value: "72",
    change: "+7.5%",
    positive: false,
    icon: UserMinus,
    color: "from-rose-500 to-pink-600",
    glow: "shadow-rose-500/20",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const planColors: Record<Plan, string> = {
  Free: "bg-slate-700/60 text-slate-300 border border-slate-600/40",
  Pro: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  Enterprise: "bg-violet-500/15 text-violet-300 border border-violet-500/30",
};

const statusColors: Record<Status, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Inactive: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  Churned: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
};

const avatarColors = [
  "from-indigo-500 to-violet-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-blue-600",
  "from-fuchsia-500 to-purple-600",
];

function getAvatarColor(id: string): string {
  const index = id.charCodeAt(1) % avatarColors.length;
  return avatarColors[index] ?? "from-indigo-500 to-violet-600";
}

type SortKey = "name" | "email" | "plan" | "status" | "joined";
type SortDir = "asc" | "desc";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 shadow-2xl shadow-slate-950/60">
      <p className="text-xs font-semibold text-slate-400 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-300 capitalize">{entry.name}:</span>
          <span className="font-semibold text-white">{(entry.value ?? 0).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<Plan | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("joined");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filteredUsers = useMemo(() => {
    let list = [...mockUsers];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.location.toLowerCase().includes(q)
      );
    }

    if (planFilter !== "All") {
      list = list.filter((u) => u.plan === planFilter);
    }

    if (statusFilter !== "All") {
      list = list.filter((u) => u.status === statusFilter);
    }

    list.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [search, planFilter, statusFilter, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-600" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
    );
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-600/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* ── Page Header ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>
            </div>
            <p className="text-slate-400 text-sm">
              Manage and monitor your user base — growth, activity, and plan distribution.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow duration-200"
          >
            <UserPlus className="w-4 h-4" />
            Invite User
          </motion.button>
        </motion.div>

        {/* ── KPI Cards ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={scaleIn}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`relative overflow-hidden rounded-2xl bg-slate-900/70 border border-slate-800/60 p-6 shadow-xl ${card.glow} backdrop-blur-sm`}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      card.positive
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                        : "bg-rose-500/15 text-rose-400 border border-rose-500/25"
                    }`}
                  >
                    {card.change}
                  </span>
                </div>
                <p className="text-3xl font-bold text-white tracking-tight mb-1">{card.value}</p>
                <p className="text-sm text-slate-400">{card.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Growth Chart ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="rounded-2xl bg-slate-900/70 border border-slate-800/60 p-6 shadow-xl backdrop-blur-sm"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">User Growth</h2>
                <p className="text-xs text-slate-500">New signups vs. churned — last 12 months</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" />
                New Users
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
                Churned
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={userGrowthData} barGap={4} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
              <Bar dataKey="newUsers" name="newUsers" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="churned" name="churned" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Table Section ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="rounded-2xl bg-slate-900/70 border border-slate-800/60 shadow-xl backdrop-blur-sm overflow-hidden"
        >
          {/* Table Header / Filters */}
          <div className="px-6 py-5 border-b border-slate-800/60 flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">All Users</h2>
                <p className="text-xs text-slate-500">{filteredUsers.length} of {mockUsers.length} users</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search users…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 w-full sm:w-52 transition-all duration-200"
                />
              </div>

              {/* Plan filter */}
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value as Plan | "All")}
                className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-200"
              >
                <option value="All">All Plans</option>
                <option value="Free">Free</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status | "All")}
                className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-200"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Churned">Churned</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60">
                  {(
                    [
                      { key: "name", label: "User" },
                      { key: "email", label: "Email" },
                      { key: "plan", label: "Plan" },
                      { key: "status", label: "Status" },
                      { key: "joined", label: "Joined" },
                    ] as { key: SortKey; label: string }[]
                  ).map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors duration-150 select-none"
                    >
                      <span className="flex items-center gap-1.5">
                        {col.label}
                        <SortIcon col={col.key} />
                      </span>
                    </th>
                  ))}
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <motion.tbody
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-slate-500 text-sm">
                      No users match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      variants={fadeIn}
                      whileHover={{ backgroundColor: "rgba(99,102,241,0.04)" }}
                      className="border-b border-slate-800/40 last:border-0 transition-colors duration-150 cursor-pointer"
                    >
                      {/* Avatar + Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(user.id)} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md`}
                          >
                            {user.avatar}
                          </div>
                          <span className="font-medium text-slate-200 whitespace-nowrap">{user.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Mail className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                          <span className="truncate max-w-[180px]">{user.email}</span>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${planColors[user.plan]}`}>
                          <Shield className="w-3 h-3" />
                          {user.plan}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[user.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            user.status === "Active"
                              ? "bg-emerald-400"
                              : user.status === "Inactive"
                              ? "bg-amber-400"
                              : "bg-rose-400"
                          }`} />
                          {user.status}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                          <span className="whitespace-nowrap">{user.joined}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                        {user.location}
                      </td>
                    </motion.tr>
                  ))
                )}
              </motion.tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-slate-800/60 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing <span className="text-slate-300 font-medium">{filteredUsers.length}</span> users
            </p>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all duration-150 disabled:opacity-40"
                disabled
              >
                Previous
              </motion.button>
              <span className="px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-xs text-indigo-300 font-semibold">
                1
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all duration-150"
              >
                Next
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}