"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, CreditCard, RefreshCw, MoreHorizontal, CheckCircle, Clock, XCircle } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mrrData = [
  { month: "Jan", mrr: 42000 },
  { month: "Feb", mrr: 47500 },
  { month: "Mar", mrr: 51200 },
  { month: "Apr", mrr: 49800 },
  { month: "May", mrr: 55600 },
  { month: "Jun", mrr: 61200 },
  { month: "Jul", mrr: 67400 },
  { month: "Aug", mrr: 72100 },
  { month: "Sep", mrr: 78900 },
  { month: "Oct", mrr: 84300 },
  { month: "Nov", mrr: 91700 },
  { month: "Dec", mrr: 98400 },
];

const signupData = [
  { day: "Mon", signups: 124 },
  { day: "Tue", signups: 198 },
  { day: "Wed", signups: 167 },
  { day: "Thu", signups: 243 },
  { day: "Fri", signups: 312 },
  { day: "Sat", signups: 89 },
  { day: "Sun", signups: 76 },
];

interface Transaction {
  id: string;
  customer: string;
  email: string;
  plan: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
}

const transactions: Transaction[] = [
  { id: "TXN-8821", customer: "Acme Corp", email: "billing@acme.io", plan: "Enterprise", amount: 1299, status: "completed", date: "Dec 18, 2024" },
  { id: "TXN-8820", customer: "Stripe Inc", email: "finance@stripe.com", plan: "Pro", amount: 299, status: "completed", date: "Dec 18, 2024" },
  { id: "TXN-8819", customer: "Notion Labs", email: "accounts@notion.so", plan: "Pro", amount: 299, status: "pending", date: "Dec 17, 2024" },
  { id: "TXN-8818", customer: "Linear App", email: "billing@linear.app", plan: "Starter", amount: 79, status: "completed", date: "Dec 17, 2024" },
  { id: "TXN-8817", customer: "Vercel Inc", email: "billing@vercel.com", plan: "Enterprise", amount: 1299, status: "failed", date: "Dec 16, 2024" },
  { id: "TXN-8816", customer: "Figma Inc", email: "finance@figma.com", plan: "Pro", amount: 299, status: "completed", date: "Dec 16, 2024" },
  { id: "TXN-8815", customer: "Loom Video", email: "billing@loom.com", plan: "Starter", amount: 79, status: "completed", date: "Dec 15, 2024" },
  { id: "TXN-8814", customer: "Miro Board", email: "accounts@miro.com", plan: "Pro", amount: 299, status: "pending", date: "Dec 15, 2024" },
];

interface KpiItem {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
  prefix?: string;
  suffix?: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const kpiCards: KpiItem[] = [
  {
    label: "Total Revenue",
    value: "1,284,320",
    change: 18.4,
    icon: DollarSign,
    prefix: "$",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    label: "Monthly Recurring Revenue",
    value: "98,400",
    change: 7.3,
    icon: TrendingUp,
    prefix: "$",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
  {
    label: "Active Users",
    value: "24,891",
    change: 12.1,
    icon: Users,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
  },
  {
    label: "Churn Rate",
    value: "2.4",
    change: -0.6,
    icon: Activity,
    suffix: "%",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
  },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomMrrTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  const val = payload[0]?.value ?? 0;
  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 shadow-xl shadow-slate-950/60">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-base font-bold text-indigo-300">${val.toLocaleString()}</p>
    </div>
  );
}

function CustomBarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  const val = payload[0]?.value ?? 0;
  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 shadow-xl shadow-slate-950/60">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-base font-bold text-violet-300">{val.toLocaleString()} signups</p>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Transaction["status"] }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <CheckCircle className="w-3 h-3" />
        Completed
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
      <XCircle className="w-3 h-3" />
      Failed
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<"mrr" | "signups">("mrr");

  const motionProps = (variants: object) =>
    shouldReduceMotion ? {} : { initial: "hidden", animate: "visible", variants };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Page header */}
      <div className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            {...(shouldReduceMotion ? {} : { initial: "hidden", animate: "visible", variants: staggerContainer })}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <motion.div variants={shouldReduceMotion ? {} : fadeInUp}>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Dashboard Overview
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Welcome back — here&apos;s what&apos;s happening with Pulse Analytics today.
              </p>
            </motion.div>
            <motion.div
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="flex items-center gap-3"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live data
              </span>
              <motion.button
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all duration-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </motion.button>
              <Link href="/analytics">
                <motion.span
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 cursor-pointer"
                >
                  Full Analytics
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* KPI Cards */}
        <motion.div
          initial={shouldReduceMotion ? undefined : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
          variants={shouldReduceMotion ? {} : staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
        >
          {kpiCards.map((card) => {
            const Icon = card.icon;
            const isPositive = card.change >= 0;
            const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
            const trendColor = card.label === "Churn Rate"
              ? (card.change < 0 ? "text-emerald-400" : "text-rose-400")
              : (isPositive ? "text-emerald-400" : "text-rose-400");

            return (
              <motion.div
                key={card.label}
                variants={shouldReduceMotion ? {} : scaleIn}
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.02, y: shouldReduceMotion ? 0 : -2 }}
                className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800/60 p-6 backdrop-blur-sm hover:border-slate-700/60 transition-all duration-300 group"
              >
                {/* Subtle glow */}
                <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${card.bgColor} blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-300`} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${card.bgColor} border ${card.borderColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
                      <TrendIcon className="w-3.5 h-3.5" />
                      {Math.abs(card.change)}%
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-white tracking-tight">
                    {card.prefix ?? ""}{card.value}{card.suffix ?? ""}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-500">
                    {isPositive ? "↑" : "↓"} vs last month
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={shouldReduceMotion ? undefined : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
          variants={shouldReduceMotion ? {} : fadeInUp}
          className="rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm overflow-hidden"
        >
          {/* Chart header with tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 pt-6 pb-4 border-b border-slate-800/60">
            <div>
              <h2 className="text-base font-semibold text-white">
                {activeTab === "mrr" ? "Monthly Recurring Revenue" : "Weekly User Signups"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === "mrr" ? "MRR growth over the past 12 months" : "New user registrations this week"}
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/60 border border-slate-700/40 w-fit">
              <button
                onClick={() => setActiveTab("mrr")}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === "mrr"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                MRR Trend
              </button>
              <button
                onClick={() => setActiveTab("signups")}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === "signups"
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Signups
              </button>
            </div>
          </div>

          <div className="px-2 py-6">
            {activeTab === "mrr" ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mrrData} margin={{ top: 5, right: 24, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomMrrTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="mrr"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#818cf8", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={signupData} margin={{ top: 5, right: 24, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="signups"
                    fill="url(#barGradient)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={52}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Bottom grid: Transactions + Quick Stats */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Recent Transactions Table */}
          <motion.div
            initial={shouldReduceMotion ? undefined : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, margin: "-80px" }}
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="xl:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60">
              <div>
                <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
                <p className="text-xs text-slate-500 mt-0.5">Latest billing activity across all plans</p>
              </div>
              <Link href="/revenue">
                <motion.span
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200 cursor-pointer"
                >
                  View all
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </motion.span>
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/40">
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Plan</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <motion.tbody
                  initial={shouldReduceMotion ? undefined : "hidden"}
                  whileInView={shouldReduceMotion ? undefined : "visible"}
                  viewport={{ once: true, margin: "-40px" }}
                  variants={shouldReduceMotion ? {} : staggerContainer}
                >
                  {(transactions ?? []).map((tx) => (
                    <motion.tr
                      key={tx.id}
                      variants={shouldReduceMotion ? {} : fadeInUp}
                      whileHover={{ backgroundColor: "rgba(99,102,241,0.04)" }}
                      className="border-b border-slate-800/30 last:border-0 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-indigo-400">
                              {tx.customer?.charAt(0) ?? "?"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate">{tx.customer}</p>
                            <p className="text-xs text-slate-500 truncate hidden sm:block">{tx.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-xs font-medium text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/40">
                          {tx.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-white">
                          ${(tx.amount ?? 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-xs text-slate-500">{tx.date}</span>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Stats Sidebar */}
          <motion.div
            initial={shouldReduceMotion ? undefined : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, margin: "-80px" }}
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="flex flex-col gap-5"
          >
            {/* Plan Distribution */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Plan Distribution</h3>
              <div className="space-y-3">
                {[
                  { plan: "Enterprise", count: 142, pct: 12, color: "bg-indigo-500" },
                  { plan: "Pro", count: 891, pct: 48, color: "bg-violet-500" },
                  { plan: "Starter", count: 743, pct: 40, color: "bg-slate-500" },
                ].map((item) => (
                  <div key={item.plan}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-400">{item.plan}</span>
                      <span className="text-xs font-semibold text-slate-300">{item.count.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Metrics */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Performance Snapshot</h3>
              <div className="space-y-4">
                {[
                  { label: "Avg. Revenue / User", value: "$51.60", icon: CreditCard, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                  { label: "Trial Conversions", value: "34.2%", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { label: "Support Tickets", value: "18 open", icon: Activity, color: "text-amber-400", bg: "bg-amber-500/10" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 truncate">{item.label}</p>
                        <p className="text-sm font-semibold text-white">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 backdrop-blur-sm p-6">
              <h3 className="text-sm font-semibold text-white mb-1">Upgrade your plan</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Unlock advanced cohort analysis, custom reports, and priority support.
              </p>
              <motion.button
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200"
              >
                Explore Enterprise
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}