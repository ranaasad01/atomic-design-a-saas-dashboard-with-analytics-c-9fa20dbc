"use client";

import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, TrendingDown, Users, MousePointerClick, Globe, ArrowUpRight, ArrowDownRight, Calendar, Filter, Download, RefreshCw, Activity, Eye, Clock, Zap } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DAU_30 = [
  { date: "Jun 1", users: 4200 },
  { date: "Jun 2", users: 3800 },
  { date: "Jun 3", users: 5100 },
  { date: "Jun 4", users: 4700 },
  { date: "Jun 5", users: 5300 },
  { date: "Jun 6", users: 4900 },
  { date: "Jun 7", users: 6100 },
  { date: "Jun 8", users: 6400 },
  { date: "Jun 9", users: 5900 },
  { date: "Jun 10", users: 6700 },
  { date: "Jun 11", users: 7200 },
  { date: "Jun 12", users: 6800 },
  { date: "Jun 13", users: 7500 },
  { date: "Jun 14", users: 8100 },
  { date: "Jun 15", users: 7800 },
  { date: "Jun 16", users: 8400 },
  { date: "Jun 17", users: 9100 },
  { date: "Jun 18", users: 8700 },
  { date: "Jun 19", users: 9400 },
  { date: "Jun 20", users: 10200 },
  { date: "Jun 21", users: 9800 },
  { date: "Jun 22", users: 10500 },
  { date: "Jun 23", users: 11100 },
  { date: "Jun 24", users: 10700 },
  { date: "Jun 25", users: 11400 },
  { date: "Jun 26", users: 12000 },
  { date: "Jun 27", users: 11600 },
  { date: "Jun 28", users: 12300 },
  { date: "Jun 29", users: 13100 },
  { date: "Jun 30", users: 12800 },
];

const DAU_7 = DAU_30.slice(-7);
const DAU_14 = DAU_30.slice(-14);

const TRAFFIC_SOURCES = [
  { name: "Organic Search", value: 38, color: "#6366f1" },
  { name: "Paid Ads", value: 27, color: "#8b5cf6" },
  { name: "Referral", value: 19, color: "#06b6d4" },
  { name: "Direct", value: 16, color: "#10b981" },
];

const WEEKLY_SESSIONS = [
  { week: "W1", sessions: 18400, bounced: 5200 },
  { week: "W2", sessions: 21300, bounced: 5800 },
  { week: "W3", sessions: 19700, bounced: 4900 },
  { week: "W4", sessions: 24100, bounced: 6100 },
  { week: "W5", sessions: 27600, bounced: 6700 },
  { week: "W6", sessions: 25900, bounced: 5900 },
  { week: "W7", sessions: 30200, bounced: 7100 },
  { week: "W8", sessions: 33500, bounced: 7800 },
];

const TOP_PAGES = [
  { path: "/dashboard", views: 48320, sessions: 31200, bounce: "22%", avgTime: "4m 12s" },
  { path: "/analytics", views: 34110, sessions: 22800, bounce: "18%", avgTime: "5m 47s" },
  { path: "/revenue", views: 27650, sessions: 18400, bounce: "25%", avgTime: "3m 58s" },
  { path: "/users", views: 21980, sessions: 14700, bounce: "30%", avgTime: "3m 21s" },
  { path: "/settings", views: 15430, sessions: 10200, bounce: "41%", avgTime: "2m 05s" },
  { path: "/onboarding", views: 12870, sessions: 9100, bounce: "15%", avgTime: "6m 33s" },
  { path: "/integrations", views: 9340, sessions: 6500, bounce: "35%", avgTime: "2m 48s" },
];

const SUMMARY_STATS = [
  {
    label: "Daily Active Users",
    value: "12,847",
    change: 14.2,
    icon: Users,
    color: "indigo",
    sub: "vs last 30 days",
  },
  {
    label: "Avg. Session Duration",
    value: "4m 38s",
    change: 6.8,
    icon: Clock,
    color: "violet",
    sub: "vs last 30 days",
  },
  {
    label: "Page Views",
    value: "169,700",
    change: 21.4,
    icon: Eye,
    color: "cyan",
    sub: "vs last 30 days",
  },
  {
    label: "Bounce Rate",
    value: "26.4%",
    change: -3.1,
    icon: MousePointerClick,
    color: "emerald",
    sub: "vs last 30 days",
  },
  {
    label: "New Visitors",
    value: "8,312",
    change: 18.9,
    icon: Globe,
    color: "indigo",
    sub: "vs last 30 days",
  },
  {
    label: "Conversion Rate",
    value: "3.74%",
    change: 0.9,
    icon: Zap,
    color: "violet",
    sub: "vs last 30 days",
  },
];

const DATE_RANGES = ["Last 7 days", "Last 14 days", "Last 30 days"] as const;
type DateRange = (typeof DATE_RANGES)[number];

// ─── Color helpers ────────────────────────────────────────────────────────────

const colorMap: Record<string, string> = {
  indigo: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 text-indigo-400",
  violet: "from-violet-500/20 to-violet-600/5 border-violet-500/20 text-violet-400",
  cyan: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400",
  emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
};

const iconBgMap: Record<string, string> = {
  indigo: "bg-indigo-500/15 text-indigo-400",
  violet: "bg-violet-500/15 text-violet-400",
  cyan: "bg-cyan-500/15 text-cyan-400",
  emerald: "bg-emerald-500/15 text-emerald-400",
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomAreaTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 shadow-2xl shadow-slate-950/60">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-base font-bold text-indigo-300">
        {(payload[0]?.value ?? 0).toLocaleString()} <span className="text-xs font-normal text-slate-400">users</span>
      </p>
    </div>
  );
}

function CustomBarTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 shadow-2xl shadow-slate-950/60">
      <p className="text-xs text-slate-400 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-semibold text-slate-200">
          {(p.value ?? 0).toLocaleString()} <span className="text-xs font-normal text-slate-400">{p.name}</span>
        </p>
      ))}
    </div>
  );
}

function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 shadow-2xl shadow-slate-950/60">
      <p className="text-sm font-semibold text-slate-200">{payload[0]?.name}</p>
      <p className="text-base font-bold text-indigo-300">{payload[0]?.value ?? 0}%</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const shouldReduceMotion = useReducedMotion();
  const [dateRange, setDateRange] = useState<DateRange>("Last 30 days");

  const dauData = useMemo(() => {
    if (dateRange === "Last 7 days") return DAU_7;
    if (dateRange === "Last 14 days") return DAU_14;
    return DAU_30;
  }, [dateRange]);

  const motionProps = (variants: object) =>
    shouldReduceMotion ? {} : { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-80px" }, variants };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── Page header ── */}
      <section className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <motion.div {...motionProps(fadeInUp)}>
            <h1 className="text-2xl font-bold tracking-tight text-white">Analytics</h1>
            <p className="text-sm text-slate-400 mt-0.5">Deep-dive into user behaviour, traffic, and engagement.</p>
          </motion.div>

          {/* Controls */}
          <motion.div {...motionProps(fadeIn)} className="flex items-center gap-2 flex-wrap">
            {/* Date range pills */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
              {DATE_RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    dateRange === r
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200"
            >
              <Filter className="w-3.5 h-3.5" />
              Filter
            </motion.button>

            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </motion.button>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* ── Summary stat cards ── */}
        <motion.div
          {...(shouldReduceMotion ? {} : { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-80px" }, variants: staggerContainer })}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
        >
          {SUMMARY_STATS.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.change >= 0;
            return (
              <motion.div
                key={stat.label}
                variants={shouldReduceMotion ? {} : scaleIn}
                whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.02 }}
                className={`relative rounded-2xl border bg-gradient-to-br p-4 flex flex-col gap-3 cursor-default ${colorMap[stat.color] ?? colorMap["indigo"]}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBgMap[stat.color] ?? iconBgMap["indigo"]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 leading-tight">{stat.label}</p>
                  <p className="text-xl font-bold text-white mt-0.5">{stat.value}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                  {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {isPositive ? "+" : ""}{stat.change}%
                  <span className="text-slate-500 font-normal ml-0.5">{stat.sub}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── DAU Area Chart ── */}
        <motion.div
          {...motionProps(fadeInUp)}
          className="rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                Daily Active Users
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Unique users who performed at least one action — {dateRange.toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 border border-slate-700/40 rounded-xl px-3 py-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              {dateRange}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dauData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={dateRange === "Last 7 days" ? 0 : dateRange === "Last 14 days" ? 1 : 4}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#dauGradient)"
                dot={false}
                activeDot={{ r: 5, fill: "#6366f1", stroke: "#1e1b4b", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Pie + Bar row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Traffic Source Donut */}
          <motion.div
            {...motionProps(slideInLeftVariant)}
            className="rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm p-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-violet-400" />
                Traffic Source Breakdown
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">Where your visitors are coming from this period</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={TRAFFIC_SOURCES}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {TRAFFIC_SOURCES.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex flex-col gap-3 flex-1 w-full">
                {TRAFFIC_SOURCES.map((src) => (
                  <div key={src.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: src.color }} />
                      <span className="text-sm text-slate-300">{src.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${src.value}%`, backgroundColor: src.color }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-white w-8 text-right">{src.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Weekly Sessions Bar */}
          <motion.div
            {...motionProps(slideInRightVariant)}
            className="rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm p-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Weekly Sessions vs Bounced
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">Total sessions and bounce volume over the last 8 weeks</p>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={WEEKLY_SESSIONS} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="sessions" name="Sessions" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="bounced" name="Bounced" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>

            <div className="flex items-center gap-5 mt-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" />
                Sessions
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-violet-500 inline-block" />
                Bounced
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Top Pages Table ── */}
        <motion.div
          {...motionProps(fadeInUp)}
          className="rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                Top Pages by Views
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">Most visited routes ranked by total page views</p>
            </div>
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 border border-slate-700/40 hover:border-slate-600 transition-all duration-200 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60">
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Page</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Views</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Sessions</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Bounce</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Avg. Time</th>
                </tr>
              </thead>
              <tbody>
                {(TOP_PAGES ?? []).map((page, i) => (
                  <motion.tr
                    key={page.path}
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -12 }}
                    whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                    whileHover={shouldReduceMotion ? {} : { backgroundColor: "rgba(99,102,241,0.04)" }}
                    className="border-b border-slate-800/40 last:border-0 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                          {i + 1}
                        </span>
                        <span className="font-mono text-indigo-300 text-sm">{page.path}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-white">
                      {(page.views ?? 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right text-slate-300">
                      {(page.sessions ?? 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          parseFloat(page.bounce) < 25
                            ? "bg-emerald-500/10 text-emerald-400"
                            : parseFloat(page.bounce) < 35
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {page.bounce}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400 font-mono text-xs">{page.avgTime}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Insight callout row ── */}
        <motion.div
          {...(shouldReduceMotion ? {} : { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-80px" }, variants: staggerContainer })}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            {
              icon: TrendingUp,
              color: "indigo",
              title: "Growth Momentum",
              body: "DAU grew 204% over the last 30 days, driven by a successful onboarding campaign and product-led virality.",
            },
            {
              icon: Users,
              color: "violet",
              title: "Retention Signal",
              body: "Returning visitors account for 64% of all sessions — a strong indicator of product stickiness and user satisfaction.",
            },
            {
              icon: Zap,
              color: "cyan",
              title: "Conversion Opportunity",
              body: "Organic search converts at 4.1%, outperforming paid channels. Doubling SEO investment could yield significant ROI.",
            },
          ].map((insight) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={insight.title}
                variants={shouldReduceMotion ? {} : fadeInUp}
                whileHover={shouldReduceMotion ? {} : { y: -3 }}
                className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 flex flex-col gap-3"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    insight.color === "indigo"
                      ? "bg-indigo-500/15 text-indigo-400"
                      : insight.color === "violet"
                      ? "bg-violet-500/15 text-violet-400"
                      : "bg-cyan-500/15 text-cyan-400"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{insight.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{insight.body}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </main>
  );
}

// ─── Local slide variants (avoid importing from motion.ts to stay self-contained) ──

const slideInLeftVariant = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const slideInRightVariant = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};