"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, Eye, ShoppingCart, Star, Clock, CheckCircle, AlertCircle, MoreHorizontal, Download, RefreshCw, Filter, ChevronDown } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jan", revenue: 42000, expenses: 28000, profit: 14000 },
  { month: "Feb", revenue: 48500, expenses: 30000, profit: 18500 },
  { month: "Mar", revenue: 55200, expenses: 32000, profit: 23200 },
  { month: "Apr", revenue: 51800, expenses: 29500, profit: 22300 },
  { month: "May", revenue: 63400, expenses: 34000, profit: 29400 },
  { month: "Jun", revenue: 71200, expenses: 36500, profit: 34700 },
  { month: "Jul", revenue: 68900, expenses: 35000, profit: 33900 },
  { month: "Aug", revenue: 79500, expenses: 38000, profit: 41500 },
  { month: "Sep", revenue: 85300, expenses: 40000, profit: 45300 },
  { month: "Oct", revenue: 91200, expenses: 42000, profit: 49200 },
  { month: "Nov", revenue: 98700, expenses: 44500, profit: 54200 },
  { month: "Dec", revenue: 112400, expenses: 48000, profit: 64400 },
];

const userGrowthData = [
  { week: "W1", active: 4200, new: 820, churned: 140 },
  { week: "W2", active: 4580, new: 960, churned: 180 },
  { week: "W3", active: 5100, new: 1040, churned: 160 },
  { week: "W4", active: 5620, new: 1120, churned: 200 },
  { week: "W5", active: 6080, new: 980, churned: 220 },
  { week: "W6", active: 6540, new: 1200, churned: 190 },
  { week: "W7", active: 7100, new: 1380, churned: 210 },
  { week: "W8", active: 7820, new: 1460, churned: 240 },
];

const trafficSourceData = [
  { name: "Organic Search", value: 38, color: "#6366f1" },
  { name: "Direct", value: 24, color: "#8b5cf6" },
  { name: "Referral", value: 18, color: "#06b6d4" },
  { name: "Social Media", value: 12, color: "#10b981" },
  { name: "Email", value: 8, color: "#f59e0b" },
];

const kpiCards = [
  {
    id: "mrr",
    label: "Monthly Recurring Revenue",
    value: "$112,400",
    rawValue: 112400,
    change: 13.9,
    positive: true,
    icon: DollarSign,
    color: "indigo",
    sub: "vs $98,700 last month",
  },
  {
    id: "users",
    label: "Active Users",
    value: "7,820",
    rawValue: 7820,
    change: 10.1,
    positive: true,
    icon: Users,
    color: "violet",
    sub: "7,100 last week",
  },
  {
    id: "churn",
    label: "Churn Rate",
    value: "3.07%",
    rawValue: 3.07,
    change: -0.4,
    positive: false,
    icon: TrendingDown,
    color: "cyan",
    sub: "3.47% last month",
  },
  {
    id: "arpu",
    label: "Avg Revenue / User",
    value: "$14.37",
    rawValue: 14.37,
    change: 3.4,
    positive: true,
    icon: Activity,
    color: "emerald",
    sub: "vs $13.90 last month",
  },
];

const recentTransactions = [
  {
    id: "txn-001",
    customer: "Acme Corp",
    plan: "Enterprise",
    amount: 2400,
    status: "paid",
    date: "Dec 18, 2024",
    avatar: "AC",
  },
  {
    id: "txn-002",
    customer: "Bright Labs",
    plan: "Pro",
    amount: 490,
    status: "paid",
    date: "Dec 17, 2024",
    avatar: "BL",
  },
  {
    id: "txn-003",
    customer: "Nova Systems",
    plan: "Starter",
    amount: 99,
    status: "pending",
    date: "Dec 17, 2024",
    avatar: "NS",
  },
  {
    id: "txn-004",
    customer: "Vertex AI",
    plan: "Enterprise",
    amount: 2400,
    status: "paid",
    date: "Dec 16, 2024",
    avatar: "VA",
  },
  {
    id: "txn-005",
    customer: "Orbit Media",
    plan: "Pro",
    amount: 490,
    status: "failed",
    date: "Dec 16, 2024",
    avatar: "OM",
  },
  {
    id: "txn-006",
    customer: "Cascade Inc",
    plan: "Pro",
    amount: 490,
    status: "paid",
    date: "Dec 15, 2024",
    avatar: "CI",
  },
  {
    id: "txn-007",
    customer: "Prism Tech",
    plan: "Starter",
    amount: 99,
    status: "paid",
    date: "Dec 15, 2024",
    avatar: "PT",
  },
];

const topPages = [
  { path: "/dashboard", views: 48200, bounce: "24%", duration: "4m 12s" },
  { path: "/analytics", views: 31500, bounce: "31%", duration: "3m 48s" },
  { path: "/users", views: 22800, bounce: "28%", duration: "2m 55s" },
  { path: "/revenue", views: 18400, bounce: "35%", duration: "3m 10s" },
  { path: "/settings", views: 9200, bounce: "42%", duration: "1m 44s" },
];

const alerts = [
  {
    id: "a1",
    type: "success",
    message: "Revenue goal of $100K MRR achieved",
    time: "2 hours ago",
  },
  {
    id: "a2",
    type: "warning",
    message: "Churn spike detected in Enterprise tier",
    time: "5 hours ago",
  },
  {
    id: "a3",
    type: "info",
    message: "New cohort analysis report ready",
    time: "1 day ago",
  },
];

// ─── Color helpers ────────────────────────────────────────────────────────────

const colorMap: Record<string, string> = {
  indigo: "from-indigo-500 to-indigo-600",
  violet: "from-violet-500 to-violet-600",
  cyan: "from-cyan-500 to-cyan-600",
  emerald: "from-emerald-500 to-emerald-600",
};

const colorGlow: Record<string, string> = {
  indigo: "shadow-indigo-500/20",
  violet: "shadow-violet-500/20",
  cyan: "shadow-cyan-500/20",
  emerald: "shadow-emerald-500/20",
};

const colorBg: Record<string, string> = {
  indigo: "bg-indigo-500/10 text-indigo-400",
  violet: "bg-violet-500/10 text-violet-400",
  cyan: "bg-cyan-500/10 text-cyan-400",
  emerald: "bg-emerald-500/10 text-emerald-400",
};

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  failed: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const alertStyles: Record<string, { bg: string; icon: React.ReactNode }> = {
  success: {
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />,
  },
  warning: {
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />,
  },
  info: {
    bg: "bg-indigo-500/10 border-indigo-500/20",
    icon: <Activity className="w-4 h-4 text-indigo-400 shrink-0" />,
  },
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-3 shadow-2xl shadow-slate-950/60 min-w-[140px]">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-300 capitalize">{entry.name}:</span>
          <span className="text-white font-semibold ml-auto pl-3">
            {typeof entry.value === "number"
              ? entry.value >= 1000
                ? `$${(entry.value / 1000).toFixed(1)}k`
                : entry.value.toLocaleString()
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function DashboardOverviewPage() {
  const shouldReduceMotion = useReducedMotion();
  const [activeRange, setActiveRange] = useState<"3m" | "6m" | "12m">("12m");
  const [chartTab, setChartTab] = useState<"revenue" | "users">("revenue");

  const rangeSlice: Record<"3m" | "6m" | "12m", number> = {
    "3m": 3,
    "6m": 6,
    "12m": 12,
  };

  const filteredRevenue = revenueData.slice(
    revenueData.length - rangeSlice[activeRange]
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── Page Header ── */}
      <section className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={shouldReduceMotion ? {} : fadeInUp}
          >
            <h1 className="text-xl font-bold text-white tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              December 2024 · All metrics are live
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={shouldReduceMotion ? {} : fadeIn}
            className="flex items-center gap-2"
          >
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-700/60 transition-all duration-200">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-700/60 transition-all duration-200">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/40 transition-all duration-200 shadow-lg shadow-indigo-500/20">
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── KPI Cards ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={shouldReduceMotion ? {} : staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                variants={shouldReduceMotion ? {} : scaleIn}
                whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.01 }}
                className="relative rounded-2xl bg-slate-900/70 border border-slate-800/60 p-5 overflow-hidden group cursor-pointer"
              >
                {/* Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-2xl" />
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${colorMap[card.color] ?? colorMap.indigo} shadow-lg ${colorGlow[card.color] ?? ""}`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                      card.positive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {card.positive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(card.change)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {card.value}
                </p>
                <p className="text-xs font-medium text-slate-400 mt-1">
                  {card.label}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">{card.sub}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Main Chart ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={shouldReduceMotion ? {} : fadeInUp}
          className="rounded-2xl bg-slate-900/70 border border-slate-800/60 p-6"
        >
          {/* Chart header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">
                {chartTab === "revenue" ? "Revenue Overview" : "User Growth"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {chartTab === "revenue"
                  ? "Monthly revenue, expenses & profit"
                  : "Weekly active, new & churned users"}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Tab toggle */}
              <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/40">
                {(["revenue", "users"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setChartTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 capitalize ${
                      chartTab === tab
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {/* Range selector — only for revenue */}
              {chartTab === "revenue" && (
                <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/40">
                  {(["3m", "6m", "12m"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setActiveRange(r)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                        activeRange === r
                          ? "bg-slate-700 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="h-72">
            {chartTab === "revenue" ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={filteredRevenue}
                  margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#gradRevenue)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#gradProfit)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#10b981", strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    fill="url(#gradExpenses)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userGrowthData}
                  margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => v.toLocaleString()}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="active" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="new" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="churned" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-800/60">
            {chartTab === "revenue" ? (
              <>
                {[
                  { color: "#6366f1", label: "Revenue" },
                  { color: "#10b981", label: "Profit" },
                  { color: "#f59e0b", label: "Expenses" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                    {l.label}
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { color: "#6366f1", label: "Active Users" },
                  { color: "#10b981", label: "New Users" },
                  { color: "#f43f5e", label: "Churned" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                    {l.label}
                  </div>
                ))}
              </>
            )}
          </div>
        </motion.div>

        {/* ── Bottom Grid: Traffic Pie + Alerts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Traffic Sources Pie */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="rounded-2xl bg-slate-900/70 border border-slate-800/60 p-6"
          >
            <h2 className="text-base font-semibold text-white mb-1">
              Traffic Sources
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Acquisition breakdown this month
            </p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {trafficSourceData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Share"]}
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#e2e8f0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {trafficSourceData.map((src) => (
                <div key={src.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: src.color }}
                    />
                    <span className="text-slate-400">{src.name}</span>
                  </div>
                  <span className="text-slate-200 font-semibold">{src.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Alerts + Top Pages */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Alerts */}
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800/60 p-6">
              <h2 className="text-base font-semibold text-white mb-4">
                Recent Alerts
              </h2>
              <div className="space-y-2.5">
                {alerts.map((alert) => {
                  const style = alertStyles[alert.type] ?? alertStyles.info;
                  return (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border ${style.bg} transition-all duration-200`}
                    >
                      {style.icon}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-200 font-medium leading-snug">
                          {alert.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{alert.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Pages */}
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800/60 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Top Pages</h2>
                <Link
                  href="/analytics"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center gap-1"
                >
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-1">
                <div className="grid grid-cols-4 text-xs text-slate-500 font-medium pb-2 border-b border-slate-800/60">
                  <span className="col-span-2">Page</span>
                  <span className="text-right">Views</span>
                  <span className="text-right">Avg Duration</span>
                </div>
                {topPages.map((page, idx) => (
                  <div
                    key={page.path}
                    className="grid grid-cols-4 text-xs py-2 hover:bg-slate-800/30 rounded-lg px-1 transition-colors duration-150 group"
                  >
                    <div className="col-span-2 flex items-center gap-2">
                      <span className="text-slate-600 font-mono w-4 text-right shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-slate-300 font-mono truncate">{page.path}</span>
                    </div>
                    <span className="text-right text-slate-300 font-medium">
                      {page.views.toLocaleString()}
                    </span>
                    <span className="text-right text-slate-400">{page.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Transactions Table ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={shouldReduceMotion ? {} : fadeInUp}
          className="rounded-2xl bg-slate-900/70 border border-slate-800/60 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-6 border-b border-slate-800/60">
            <div>
              <h2 className="text-base font-semibold text-white">
                Recent Transactions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest subscription payments
              </p>
            </div>
            <Link
              href="/revenue"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center gap-1 self-start sm:self-auto"
            >
              View all transactions <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Table — desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60">
                  {["Customer", "Plan", "Amount", "Status", "Date", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-medium text-slate-500 px-6 py-3 first:pl-6 last:pr-6"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx, idx) => (
                  <motion.tr
                    key={tx.id}
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -8 }}
                    whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.04, duration: 0.35, ease: "easeOut" }}
                    className="border-b border-slate-800/40 hover:bg-slate-800/30 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {tx.avatar}
                        </div>
                        <span className="text-slate-200 font-medium text-sm">
                          {tx.customer}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded-md border border-slate-700/40">
                        {tx.plan}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-200 font-semibold">
                      ${(tx.amount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[tx.status] ?? statusStyles.pending}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-400 text-xs">{tx.date}</td>
                    <td className="px-6 py-3.5">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden divide-y divide-slate-800/60">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {tx.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{tx.customer}</p>
                    <p className="text-xs text-slate-500">{tx.plan} · {tx.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-slate-200">
                    ${(tx.amount ?? 0).toLocaleString()}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[tx.status] ?? statusStyles.pending}`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Quick Links ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={shouldReduceMotion ? {} : staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4"
        >
          {[
            { label: "Analytics", href: "/analytics", desc: "Deep-dive reports", color: "indigo" },
            { label: "Users", href: "/users", desc: "Manage accounts", color: "violet" },
            { label: "Revenue", href: "/revenue", desc: "Billing & invoices", color: "cyan" },
            { label: "Settings", href: "/settings", desc: "Configure workspace", color: "emerald" },
          ].map((item) => (
            <motion.div
              key={item.href}
              variants={shouldReduceMotion ? {} : scaleIn}
              whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href={item.href}
                className="flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-900/70 border border-slate-800/60 hover:border-indigo-500/30 hover:bg-slate-800/60 transition-all duration-200 group"
              >
                <span className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors duration-200">
                  {item.label}
                </span>
                <span className="text-xs text-slate-500">{item.desc}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors duration-200 mt-1" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}