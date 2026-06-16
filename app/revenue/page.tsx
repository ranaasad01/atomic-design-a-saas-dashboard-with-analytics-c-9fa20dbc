"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, RefreshCcw, ArrowUpRight, ArrowDownRight, Filter, Download } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mrrArrData = [
  { month: "Jan", MRR: 42000, ARR: 504000 },
  { month: "Feb", MRR: 47500, ARR: 570000 },
  { month: "Mar", MRR: 51200, ARR: 614400 },
  { month: "Apr", MRR: 49800, ARR: 597600 },
  { month: "May", MRR: 55300, ARR: 663600 },
  { month: "Jun", MRR: 61000, ARR: 732000 },
  { month: "Jul", MRR: 67400, ARR: 808800 },
  { month: "Aug", MRR: 72100, ARR: 865200 },
  { month: "Sep", MRR: 78500, ARR: 942000 },
  { month: "Oct", MRR: 84200, ARR: 1010400 },
  { month: "Nov", MRR: 91000, ARR: 1092000 },
  { month: "Dec", MRR: 98700, ARR: 1184400 },
];

const planData = [
  { name: "Starter", value: 18400, color: "#6366f1" },
  { name: "Pro", value: 47200, color: "#8b5cf6" },
  { name: "Enterprise", value: 33100, color: "#a78bfa" },
];

interface Transaction {
  id: string;
  customer: string;
  email: string;
  plan: string;
  amount: number;
  date: string;
  status: "paid" | "refunded" | "pending";
}

const transactions: Transaction[] = [
  { id: "TXN-001", customer: "Acme Corp", email: "billing@acme.com", plan: "Enterprise", amount: 2400, date: "2024-12-15", status: "paid" },
  { id: "TXN-002", customer: "Bright Labs", email: "admin@brightlabs.io", plan: "Pro", amount: 490, date: "2024-12-14", status: "paid" },
  { id: "TXN-003", customer: "Nova Systems", email: "finance@novasys.com", plan: "Enterprise", amount: 2400, date: "2024-12-14", status: "paid" },
  { id: "TXN-004", customer: "Pixel Studio", email: "hello@pixelstudio.co", plan: "Starter", amount: 99, date: "2024-12-13", status: "paid" },
  { id: "TXN-005", customer: "Drift Analytics", email: "ops@driftanalytics.com", plan: "Pro", amount: 490, date: "2024-12-13", status: "refunded" },
  { id: "TXN-006", customer: "Cascade AI", email: "billing@cascadeai.dev", plan: "Enterprise", amount: 2400, date: "2024-12-12", status: "paid" },
  { id: "TXN-007", customer: "Lunar Media", email: "accounts@lunarmedia.net", plan: "Starter", amount: 99, date: "2024-12-12", status: "paid" },
  { id: "TXN-008", customer: "Forge Digital", email: "pay@forgedigital.com", plan: "Pro", amount: 490, date: "2024-12-11", status: "pending" },
  { id: "TXN-009", customer: "Apex Ventures", email: "finance@apexvc.com", plan: "Enterprise", amount: 2400, date: "2024-12-11", status: "paid" },
  { id: "TXN-010", customer: "Bloom Health", email: "billing@bloomhealth.io", plan: "Pro", amount: 490, date: "2024-12-10", status: "paid" },
  { id: "TXN-011", customer: "Spark Commerce", email: "ops@sparkcommerce.co", plan: "Starter", amount: 99, date: "2024-12-10", status: "refunded" },
  { id: "TXN-012", customer: "Vertex Cloud", email: "admin@vertexcloud.io", plan: "Enterprise", amount: 2400, date: "2024-12-09", status: "paid" },
];

const kpiCards = [
  {
    label: "Total Revenue",
    value: "$98,700",
    subValue: "MRR this month",
    change: 8.5,
    icon: DollarSign,
    color: "from-indigo-500 to-violet-600",
    glow: "shadow-indigo-500/20",
  },
  {
    label: "Avg Deal Size",
    value: "$1,246",
    subValue: "Per customer",
    change: 3.2,
    icon: Users,
    color: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
  },
  {
    label: "Refunds",
    value: "$588",
    subValue: "2 transactions",
    change: -1.4,
    icon: RefreshCcw,
    color: "from-rose-500 to-pink-600",
    glow: "shadow-rose-500/20",
  },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomLineTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 shadow-2xl shadow-slate-950/60 min-w-[160px]">
      <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: entry.color }} />
            {entry.name}
          </span>
          <span className="text-xs font-bold text-white">
            ${(entry.value ?? 0).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Active Donut Shape ───────────────────────────────────────────────────────

function renderActiveShape(props: {
  cx?: number; cy?: number; innerRadius?: number; outerRadius?: number;
  startAngle?: number; endAngle?: number; fill?: string; payload?: { name: string }; percent?: number; value?: number;
}) {
  const {
    cx = 0, cy = 0, innerRadius = 0, outerRadius = 0,
    startAngle = 0, endAngle = 0, fill = "#6366f1",
    payload, percent = 0, value = 0,
  } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#f1f5f9" className="text-sm" fontSize={14} fontWeight={700}>
        {payload?.name ?? ""}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#94a3b8" fontSize={12}>
        ${(value ?? 0).toLocaleString()}
      </text>
      <text x={cx} y={cy + 32} textAnchor="middle" fill="#64748b" fontSize={11}>
        {((percent ?? 0) * 100).toFixed(1)}%
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 12} outerRadius={outerRadius + 16} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const styles: Record<Transaction["status"], string> = {
    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    refunded: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Plan Badge ───────────────────────────────────────────────────────────────

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    Starter: "bg-slate-700/50 text-slate-300 border-slate-600/40",
    Pro: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    Enterprise: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  };
  const cls = styles[plan] ?? "bg-slate-700/50 text-slate-300 border-slate-600/40";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {plan}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RevenuePage() {
  const shouldReduceMotion = useReducedMotion();
  const [activeDonutIndex, setActiveDonutIndex] = useState(0);
  const [filterPlan, setFilterPlan] = useState<string>("All");

  const filteredTransactions = filterPlan === "All"
    ? transactions
    : (transactions ?? []).filter((tx) => tx.plan === filterPlan);

  const totalRevenue = (transactions ?? [])
    .filter((tx) => tx.status === "paid")
    .reduce((sum, tx) => sum + (tx.amount ?? 0), 0);

  const motionProps = (variants: object) =>
    shouldReduceMotion
      ? {}
      : { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-80px" }, variants };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── Page Header ── */}
      <section className="relative border-b border-slate-800/60 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-48 bg-indigo-600/8 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-64 h-32 bg-violet-600/6 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div {...motionProps(fadeInUp)} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">Revenue</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Revenue Overview
              </h1>
              <p className="mt-2 text-slate-400 text-sm max-w-xl">
                Track MRR, ARR, plan distribution, and individual transactions in one place.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-colors duration-200 self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </motion.button>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── KPI Cards ── */}
        <motion.div
          {...motionProps(staggerContainer)}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {kpiCards.map((card) => {
            const Icon = card.icon;
            const isPositive = card.change >= 0;
            return (
              <motion.div
                key={card.label}
                variants={shouldReduceMotion ? {} : scaleIn}
                whileHover={{ y: shouldReduceMotion ? 0 : -4, scale: shouldReduceMotion ? 1 : 1.01 }}
                className={`relative bg-slate-900/70 border border-slate-800/60 rounded-2xl p-5 overflow-hidden shadow-xl ${card.glow}`}
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-full blur-2xl`} />
                </div>
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">{card.label}</p>
                    <p className="text-2xl font-extrabold text-white tracking-tight">{card.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{card.subValue}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="relative mt-3 flex items-center gap-1.5">
                  {isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  <span className={`text-xs font-semibold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                    {isPositive ? "+" : ""}{card.change}%
                  </span>
                  <span className="text-xs text-slate-600">vs last month</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── MRR vs ARR Line Chart ── */}
        <motion.div
          {...motionProps(fadeInUp)}
          className="bg-slate-900/70 border border-slate-800/60 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">MRR vs ARR Trend</h2>
              <p className="text-xs text-slate-500 mt-0.5">Monthly Recurring Revenue compared to Annualized Run Rate</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-indigo-400 inline-block rounded-full" />
                MRR
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-violet-400 inline-block rounded-full" />
                ARR
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mrrArrData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient id="arrGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a78bfa" />
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
                width={52}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Line
                type="monotone"
                dataKey="MRR"
                stroke="url(#mrrGrad)"
                strokeWidth={2.5}
                dot={{ fill: "#6366f1", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="ARR"
                stroke="url(#arrGrad)"
                strokeWidth={2.5}
                dot={{ fill: "#8b5cf6", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#8b5cf6", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Donut + Plan Breakdown ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut Chart */}
          <motion.div
            {...motionProps(fadeInUp)}
            className="bg-slate-900/70 border border-slate-800/60 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-white mb-1">Revenue by Plan</h2>
            <p className="text-xs text-slate-500 mb-4">Distribution across Starter, Pro, and Enterprise tiers</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  activeIndex={activeDonutIndex}
                  activeShape={renderActiveShape}
                  data={planData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveDonutIndex(index)}
                >
                  {planData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex items-center justify-center gap-5 mt-2">
              {planData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: entry.color }} />
                  <span className="text-xs text-slate-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Plan Stats */}
          <motion.div
            {...motionProps(fadeInUp)}
            className="bg-slate-900/70 border border-slate-800/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Plan Breakdown</h2>
              <p className="text-xs text-slate-500 mb-5">Revenue contribution per pricing tier</p>
            </div>
            <div className="space-y-4">
              {planData.map((plan) => {
                const total = planData.reduce((s, p) => s + p.value, 0);
                const pct = total > 0 ? ((plan.value / total) * 100).toFixed(1) : "0.0";
                return (
                  <div key={plan.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-300">{plan.name}</span>
                      <span className="text-sm font-bold text-white">${(plan.value ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: plan.color }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{pct}% of total revenue</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total MRR</span>
              <span className="text-lg font-extrabold text-white">
                ${planData.reduce((s, p) => s + p.value, 0).toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Transactions Table ── */}
        <motion.div
          {...motionProps(fadeInUp)}
          className="bg-slate-900/70 border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-5 border-b border-slate-800/60">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
              <p className="text-xs text-slate-500 mt-0.5">{filteredTransactions.length} transactions shown</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="bg-slate-800 border border-slate-700/60 text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              >
                <option value="All">All Plans</option>
                <option value="Starter">Starter</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-6 py-3">Transaction</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">Customer</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">Plan</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">Amount</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">Date</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {(filteredTransactions ?? []).map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -8 }}
                    whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.3, ease: "easeOut" }}
                    className="border-b border-slate-800/40 hover:bg-slate-800/30 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">{tx.id}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="font-medium text-slate-200 text-sm">{tx.customer}</p>
                        <p className="text-xs text-slate-600">{tx.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <PlanBadge plan={tx.plan} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`font-bold text-sm ${tx.status === "refunded" ? "text-rose-400 line-through" : "text-white"}`}>
                        ${(tx.amount ?? 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-slate-500">{tx.date}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={tx.status} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-xs text-slate-600">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Paid total:</span>
              <span className="text-sm font-bold text-emerald-400">
                ${(filteredTransactions ?? [])
                  .filter((tx) => tx.status === "paid")
                  .reduce((s, tx) => s + (tx.amount ?? 0), 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}