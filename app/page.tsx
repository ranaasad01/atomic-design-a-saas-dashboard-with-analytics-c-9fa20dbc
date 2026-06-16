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
  LineChart,
  Line,
} from "recharts";
import { Activity, ArrowRight, TrendingUp, Users, DollarSign, Zap, Shield, BarChart as BarChartIcon, Star, Check, ArrowUp, ArrowDown, Sparkles, Eye, Bell } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from "@/lib/data";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
  slideInLeft,
  slideInRight,
} from "@/lib/motion";

// ─── Inline mock data ────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jan", revenue: 42000, users: 1200 },
  { month: "Feb", revenue: 51000, users: 1450 },
  { month: "Mar", revenue: 47000, users: 1380 },
  { month: "Apr", revenue: 63000, users: 1720 },
  { month: "May", revenue: 71000, users: 1950 },
  { month: "Jun", revenue: 68000, users: 1870 },
  { month: "Jul", revenue: 82000, users: 2210 },
  { month: "Aug", revenue: 91000, users: 2480 },
  { month: "Sep", revenue: 87000, users: 2350 },
  { month: "Oct", revenue: 104000, users: 2790 },
  { month: "Nov", revenue: 118000, users: 3100 },
  { month: "Dec", revenue: 132000, users: 3450 },
];

const conversionData = [
  { week: "W1", rate: 3.2 },
  { week: "W2", rate: 3.8 },
  { week: "W3", rate: 3.5 },
  { week: "W4", rate: 4.1 },
  { week: "W5", rate: 4.6 },
  { week: "W6", rate: 4.3 },
  { week: "W7", rate: 5.0 },
  { week: "W8", rate: 5.4 },
];

const channelData = [
  { channel: "Organic", value: 38 },
  { channel: "Paid", value: 27 },
  { channel: "Referral", value: 19 },
  { channel: "Social", value: 11 },
  { channel: "Email", value: 5 },
];

const kpis = [
  {
    label: "Monthly Revenue",
    value: "$132,400",
    change: +18.4,
    icon: DollarSign,
    color: "from-indigo-500 to-violet-600",
    glow: "shadow-indigo-500/25",
  },
  {
    label: "Active Users",
    value: "3,450",
    change: +11.2,
    icon: Users,
    color: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/25",
  },
  {
    label: "Conversion Rate",
    value: "5.4%",
    change: +2.1,
    icon: TrendingUp,
    color: "from-sky-500 to-indigo-500",
    glow: "shadow-sky-500/25",
  },
  {
    label: "Avg. Session",
    value: "8m 42s",
    change: -3.7,
    icon: Activity,
    color: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/25",
  },
];

const features = [
  {
    icon: BarChartIcon,
    title: "Real-Time Analytics",
    description:
      "Watch your metrics update live as events stream in. No more waiting for nightly batch jobs — see what's happening right now.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description:
      "Set threshold-based alerts for any metric. Get notified via Slack, email, or webhook the moment something needs your attention.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified. All data encrypted at rest and in transit. Role-based access control keeps sensitive metrics private.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  {
    icon: Eye,
    title: "Custom Dashboards",
    description:
      "Drag-and-drop widgets to build dashboards tailored to every team. Share read-only views with stakeholders in one click.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Comment on charts, annotate anomalies, and tag teammates. Turn data discoveries into action items without leaving the dashboard.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description:
      "Our AI surfaces trends, detects anomalies, and writes plain-English summaries so you spend less time digging and more time deciding.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Growth, Luma AI",
    avatar: "/images/sarah-chen-headshot.jpg",
    quote:
      "Pulse Analytics replaced three separate tools for us. The real-time revenue chart alone saved our team hours of manual reporting every week.",
    stars: 5,
  },
  {
    name: "Marcus Webb",
    role: "CTO, Stackline",
    avatar: "/images/marcus-webb-headshot.jpg",
    quote:
      "The AI anomaly detection caught a billing bug before our customers did. That single alert paid for a year of subscription in one afternoon.",
    stars: 5,
  },
  {
    name: "Priya Nair",
    role: "VP Product, Orbit SaaS",
    avatar: "/images/priya-nair-headshot.jpg",
    quote:
      "Custom dashboards per team was a game-changer. Engineering, marketing, and finance all see exactly what they need — nothing more, nothing less.",
    stars: 5,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    period: "/mo",
    description: "Perfect for early-stage startups tracking core metrics.",
    features: [
      "Up to 5 dashboards",
      "3 team members",
      "30-day data retention",
      "Email alerts",
      "Standard integrations",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$149",
    period: "/mo",
    description: "For scaling teams that need depth, speed, and collaboration.",
    features: [
      "Unlimited dashboards",
      "15 team members",
      "1-year data retention",
      "Slack + webhook alerts",
      "AI-powered insights",
      "Custom metrics & events",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Dedicated infrastructure, SLAs, and white-glove onboarding.",
    features: [
      "Unlimited everything",
      "Unlimited team members",
      "Unlimited data retention",
      "SSO / SAML",
      "SOC 2 compliance reports",
      "Dedicated success manager",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-slate-400 mb-1.5">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name === "revenue"
            ? `$${(entry.value ?? 0).toLocaleString()}`
            : entry.name === "rate"
            ? `${entry.value}%`
            : (entry.value ?? 0).toLocaleString()}
        </p>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [activePlan, setActivePlan] = useState("Growth");

  return (
    <main className="bg-slate-950 text-white overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-600/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-sky-600/8 rounded-full blur-[100px]" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-sm font-medium mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Now with AI-powered anomaly detection
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
          >
            <span className="text-white" style={{ color: "#d24646" }}>Analytics that move</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
              as fast as you do
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {APP_DESCRIPTION}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <motion.span
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-base shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow duration-300 cursor-pointer"
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
            <Link href="/analytics">
              <motion.span
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 font-semibold text-base hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                Live demo
              </motion.span>
            </Link>
          </motion.div>

          {/* Social proof micro */}
          <motion.p
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="mt-8 text-sm text-slate-500"
          >
            Trusted by{" "}
            <span className="text-slate-300 font-medium">2,400+ SaaS teams</span> · No credit card
            required · 14-day free trial
          </motion.p>
        </motion.div>

        {/* Hero dashboard preview */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={shouldReduceMotion ? {} : scaleIn}
          className="relative z-10 mt-16 w-full max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm shadow-2xl shadow-slate-950/60 overflow-hidden">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800/60 bg-slate-900/90">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-amber-500/70" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="ml-4 text-xs text-slate-500 font-mono">
                app.pulseanalytics.io/dashboard
              </span>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4">
              {kpis.map((kpi) => {
                const Icon = kpi.icon;
                const isPositive = kpi.change >= 0;
                return (
                  <div
                    key={kpi.label}
                    className={`rounded-xl bg-slate-800/60 border border-slate-700/40 p-3.5 shadow-lg ${kpi.glow}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400 font-medium">{kpi.label}</span>
                      <div
                        className={`w-7 h-7 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center`}
                      >
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <p className="text-xl font-bold text-white">{kpi.value}</p>
                    <p
                      className={`text-xs font-medium mt-0.5 flex items-center gap-0.5 ${
                        isPositive ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {Math.abs(kpi.change)}% vs last month
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Revenue chart */}
            <div className="px-4 pb-4">
              <div className="rounded-xl bg-slate-800/40 border border-slate-700/30 p-4">
                <p className="text-sm font-semibold text-slate-300 mb-4">Revenue Overview — 2024</p>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="heroRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fill="url(#heroRevGrad)"
                      dot={false}
                      activeDot={{ r: 5, fill: "#6366f1", stroke: "#1e1b4b", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3"
            >
              Everything you need
            </motion.p>
            <motion.h2
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-5"
            >
              Built for teams who move fast
            </motion.h2>
            <motion.p
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="text-lg text-slate-400 max-w-2xl mx-auto"
            >
              From real-time event streams to AI-generated summaries, {APP_NAME} gives your team
              the full picture — without the data-engineering overhead.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  variants={shouldReduceMotion ? {} : fadeInUp}
                  whileHover={{ y: shouldReduceMotion ? 0 : -4, scale: shouldReduceMotion ? 1 : 1.01 }}
                  className={`rounded-2xl bg-slate-900/70 border ${feat.border} p-6 flex flex-col gap-4 hover:bg-slate-900 transition-colors duration-200`}
                >
                  <div className={`w-11 h-11 rounded-xl ${feat.bg} border ${feat.border} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${feat.color}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5">{feat.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Analytics Showcase ── */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3"
            >
              Charts that tell stories
            </motion.p>
            <motion.h2
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-5"
            >
              Every metric, beautifully visualized
            </motion.h2>
            <motion.p
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="text-lg text-slate-400 max-w-2xl mx-auto"
            >
              Conversion funnels, cohort retention, revenue attribution — all rendered in
              pixel-perfect charts that update the moment data arrives.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion rate line chart */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={shouldReduceMotion ? {} : slideInLeft}
              className="rounded-2xl bg-slate-900 border border-slate-700/50 p-6"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-slate-200">Conversion Rate Trend</h3>
                <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +2.2pp this quarter
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-5">Weekly free-to-paid conversion (%)</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={conversionData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
                    tickFormatter={(v) => `${v}%`}
                    domain={[2, 6]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#8b5cf6", stroke: "#0f172a", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#0f172a", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Channel bar chart */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={shouldReduceMotion ? {} : slideInRight}
              className="rounded-2xl bg-slate-900 border border-slate-700/50 p-6"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-slate-200">Acquisition by Channel</h3>
                <span className="text-xs text-indigo-400 font-medium bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  Last 30 days
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-5">New users per acquisition source (%)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={channelData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="channel"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* User growth area chart — full width */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-700/50 p-6"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-slate-200">User Growth — 2024</h3>
                <span className="text-xs text-sky-400 font-medium bg-sky-500/10 px-2 py-0.5 rounded-full">
                  +187% YoY
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-5">Monthly active users across all plans</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Y