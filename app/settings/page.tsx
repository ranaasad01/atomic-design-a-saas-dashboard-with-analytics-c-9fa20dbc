"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { User, Mail, Bell, CreditCard, Shield, Camera, Check, AlertCircle, Star, Zap, ArrowRight, Save, Eye, EyeOff, Smartphone, Globe, Lock } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { BRAND } from "@/lib/data";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ToggleState {
  emailDigest: boolean;
  productUpdates: boolean;
  securityAlerts: boolean;
  usageReports: boolean;
  teamActivity: boolean;
  marketingEmails: boolean;
  smsAlerts: boolean;
  browserPush: boolean;
}

interface ProfileState {
  name: string;
  email: string;
  role: string;
  company: string;
  website: string;
  bio: string;
}

// ─── Sub-components (inline) ─────────────────────────────────────────────────

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm shadow-xl shadow-slate-950/30 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-indigo-400" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-100">{title}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  hint = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-200"
      />
      {hint && <p className="text-xs text-slate-600">{hint}</p>}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2 focus:ring-offset-slate-900 ${
        checked ? "bg-indigo-500" : "bg-slate-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function NotificationRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-slate-800/50 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ─── Plan data ────────────────────────────────────────────────────────────────

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    period: "/ month",
    description: "For individuals and small projects",
    features: ["Up to 3 dashboards", "7-day data retention", "Basic charts", "Email support"],
    badge: null,
    current: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    period: "/ month",
    description: "For growing SaaS teams",
    features: [
      "Unlimited dashboards",
      "90-day data retention",
      "Advanced analytics",
      "Priority support",
      "Custom alerts",
      "API access",
    ],
    badge: "Current Plan",
    current: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$199",
    period: "/ month",
    description: "For large-scale operations",
    features: [
      "Everything in Pro",
      "Unlimited data retention",
      "SSO & SAML",
      "Dedicated CSM",
      "SLA guarantee",
      "Custom integrations",
    ],
    badge: "Most Popular",
    current: false,
  },
];

const invoices = [
  { id: "INV-2024-012", date: "Dec 1, 2024", amount: "$49.00", status: "Paid" },
  { id: "INV-2024-011", date: "Nov 1, 2024", amount: "$49.00", status: "Paid" },
  { id: "INV-2024-010", date: "Oct 1, 2024", amount: "$49.00", status: "Paid" },
  { id: "INV-2024-009", date: "Sep 1, 2024", amount: "$49.00", status: "Paid" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const shouldReduceMotion = useReducedMotion();

  // Active tab
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "billing" | "security">(
    "profile"
  );

  // Profile form state
  const [profile, setProfile] = useState<ProfileState>({
    name: "Alex Rivera",
    email: "alex.rivera@acme.io",
    role: "Product Manager",
    company: "Acme Corp",
    website: "https://acme.io",
    bio: "Building data-driven products at Acme. Passionate about analytics and user experience.",
  });

  const [profileSaved, setProfileSaved] = useState(false);

  const handleProfileSave = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  // Notification toggles
  const [notifications, setNotifications] = useState<ToggleState>({
    emailDigest: true,
    productUpdates: true,
    securityAlerts: true,
    usageReports: false,
    teamActivity: true,
    marketingEmails: false,
    smsAlerts: false,
    browserPush: true,
  });

  const setToggle = (key: keyof ToggleState) => (val: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: val }));
  };

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
  ] as const;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Page header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={shouldReduceMotion ? {} : fadeInUp}
        className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Manage your account, notifications, and billing preferences.
          </p>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar tabs */}
          <motion.aside
            initial="hidden"
            animate="visible"
            variants={shouldReduceMotion ? {} : slideInLeft}
            className="lg:w-52 flex-shrink-0"
          >
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {tabs.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <motion.button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 lg:w-full text-left ${
                      isActive
                        ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {label}
                  </motion.button>
                );
              })}
            </nav>
          </motion.aside>

          {/* Content area */}
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={shouldReduceMotion ? {} : fadeIn}
            className="flex-1 min-w-0"
          >
            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <motion.div
                variants={shouldReduceMotion ? {} : staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-6"
              >
                {/* Avatar section */}
                <motion.div variants={shouldReduceMotion ? {} : fadeInUp}>
                  <SectionCard>
                    <SectionHeader
                      icon={User}
                      title="Profile Information"
                      description="Update your personal details and public profile."
                    />
                    {/* Avatar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6 pb-6 border-b border-slate-800/50">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/30">
                          {(profile.name ?? "U").charAt(0).toUpperCase()}
                        </div>
                        <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all duration-200">
                          <Camera className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{profile.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{profile.email}</p>
                        <button className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          Upload new photo
                        </button>
                        <p className="text-xs text-slate-600 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                      </div>
                    </div>

                    {/* Form fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="Full Name"
                        value={profile.name}
                        onChange={(v) => setProfile((p) => ({ ...p, name: v }))}
                        placeholder="Your full name"
                      />
                      <InputField
                        label="Email Address"
                        value={profile.email}
                        onChange={(v) => setProfile((p) => ({ ...p, email: v }))}
                        type="email"
                        placeholder="you@company.com"
                      />
                      <InputField
                        label="Job Title"
                        value={profile.role}
                        onChange={(v) => setProfile((p) => ({ ...p, role: v }))}
                        placeholder="e.g. Product Manager"
                      />
                      <InputField
                        label="Company"
                        value={profile.company}
                        onChange={(v) => setProfile((p) => ({ ...p, company: v }))}
                        placeholder="Your company name"
                      />
                      <div className="sm:col-span-2">
                        <InputField
                          label="Website"
                          value={profile.website}
                          onChange={(v) => setProfile((p) => ({ ...p, website: v }))}
                          placeholder="https://yoursite.com"
                          hint="Optional — shown on your public profile."
                        />
                      </div>
                      <div className="sm:col-span-2 flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                          Bio
                        </label>
                        <textarea
                          value={profile.bio}
                          onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                          rows={3}
                          placeholder="A short bio about yourself…"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-200 resize-none"
                        />
                        <p className="text-xs text-slate-600">
                          {(profile.bio ?? "").length}/200 characters
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-800/50">
                      <motion.button
                        onClick={handleProfileSave}
                        whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          profileSaved
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25"
                        }`}
                      >
                        {profileSaved ? (
                          <>
                            <Check className="w-4 h-4" />
                            Saved!
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </motion.button>
                      <button className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all duration-200">
                        Cancel
                      </button>
                    </div>
                  </SectionCard>
                </motion.div>

                {/* Danger zone */}
                <motion.div variants={shouldReduceMotion ? {} : fadeInUp}>
                  <SectionCard>
                    <div className="flex items-start gap-3 mb-4">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h2 className="text-base font-semibold text-red-400">Danger Zone</h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                          Irreversible actions — proceed with caution.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-500/15 bg-red-500/5">
                      <div>
                        <p className="text-sm font-medium text-slate-200">Delete Account</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Permanently delete your account and all associated data.
                        </p>
                      </div>
                      <button className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all duration-200">
                        Delete Account
                      </button>
                    </div>
                  </SectionCard>
                </motion.div>
              </motion.div>
            )}

            {/* ── NOTIFICATIONS TAB ── */}
            {activeTab === "notifications" && (
              <motion.div
                variants={shouldReduceMotion ? {} : staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-6"
              >
                <motion.div variants={shouldReduceMotion ? {} : fadeInUp}>
                  <SectionCard>
                    <SectionHeader
                      icon={Mail}
                      title="Email Notifications"
                      description="Choose which emails you'd like to receive from Pulse Analytics."
                    />
                    <div className="flex flex-col">
                      <NotificationRow
                        label="Weekly Digest"
                        description="A summary of your key metrics and highlights every Monday."
                        checked={notifications.emailDigest}
                        onChange={setToggle("emailDigest")}
                      />
                      <NotificationRow
                        label="Product Updates"
                        description="New features, improvements, and release notes."
                        checked={notifications.productUpdates}
                        onChange={setToggle("productUpdates")}
                      />
                      <NotificationRow
                        label="Security Alerts"
                        description="Notifications about suspicious activity or login attempts."
                        checked={notifications.securityAlerts}
                        onChange={setToggle("securityAlerts")}
                      />
                      <NotificationRow
                        label="Usage Reports"
                        description="Monthly reports on your team's dashboard usage and API calls."
                        checked={notifications.usageReports}
                        onChange={setToggle("usageReports")}
                      />
                      <NotificationRow
                        label="Team Activity"
                        description="When teammates join, leave, or make significant changes."
                        checked={notifications.teamActivity}
                        onChange={setToggle("teamActivity")}
                      />
                      <NotificationRow
                        label="Marketing & Promotions"
                        description="Occasional offers, tips, and news from the Pulse team."
                        checked={notifications.marketingEmails}
                        onChange={setToggle("marketingEmails")}
                      />
                    </div>
                  </SectionCard>
                </motion.div>

                <motion.div variants={shouldReduceMotion ? {} : fadeInUp}>
                  <SectionCard>
                    <SectionHeader
                      icon={Smartphone}
                      title="Push & SMS Notifications"
                      description="Real-time alerts delivered directly to your device."
                    />
                    <div className="flex flex-col">
                      <NotificationRow
                        label="Browser Push Notifications"
                        description="Instant alerts in your browser for critical threshold breaches."
                        checked={notifications.browserPush}
                        onChange={setToggle("browserPush")}
                      />
                      <NotificationRow
                        label="SMS Alerts"
                        description="Text message alerts for P0 incidents and downtime events."
                        checked={notifications.smsAlerts}
                        onChange={setToggle("smsAlerts")}
                      />
                    </div>
                    {notifications.smsAlerts && (
                      <div className="mt-4 pt-4 border-t border-slate-800/50">
                        <InputField
                          label="Phone Number"
                          value="+1 (555) 000-0000"
                          onChange={() => {}}
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          hint="US numbers only. Standard messaging rates may apply."
                        />
                      </div>
                    )}
                  </SectionCard>
                </motion.div>

                <motion.div variants={shouldReduceMotion ? {} : fadeInUp}>
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200"
                    >
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ── BILLING TAB ── */}
            {activeTab === "billing" && (
              <motion.div
                variants={shouldReduceMotion ? {} : staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-6"
              >
                {/* Current plan */}
                <motion.div variants={shouldReduceMotion ? {} : fadeInUp}>
                  <SectionCard>
                    <SectionHeader
                      icon={CreditCard}
                      title="Subscription Plan"
                      description="Manage your current plan and upgrade for more features."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {plans.map((plan) => (
                        <motion.div
                          key={plan.id}
                          whileHover={{ scale: shouldReduceMotion ? 1 : 1.02, y: shouldReduceMotion ? 0 : -2 }}
                          className={`relative rounded-2xl border p-5 cursor-pointer transition-all duration-200 ${
                            plan.current
                              ? "border-indigo-500/50 bg-indigo-500/8 shadow-lg shadow-indigo-500/10"
                              : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600/60"
                          }`}
                        >
                          {plan.badge && (
                            <span
                              className={`absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                plan.current
                                  ? "bg-indigo-500 text-white"
                                  : "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                              }`}
                            >
                              {plan.badge}
                            </span>
                          )}
                          <div className="flex items-center gap-2 mb-1">
                            {plan.id === "starter" && <Star className="w-4 h-4 text-slate-400" />}
                            {plan.id === "pro" && <Zap className="w-4 h-4 text-indigo-400" />}
                            {plan.id === "enterprise" && <Shield className="w-4 h-4 text-violet-400" />}
                            <span className="text-sm font-semibold text-slate-200">{plan.name}</span>
                          </div>
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-2xl font-bold text-white">{plan.price}</span>
                            <span className="text-xs text-slate-500">{plan.period}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-3">{plan.description}</p>
                          <ul className="flex flex-col gap-1.5">
                            {(plan.features ?? []).map((f) => (
                              <li key={f} className="flex items-start gap-1.5 text-xs text-slate-400">
                                <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                                {f}
                              </li>
                            ))}
                          </ul>
                          {!plan.current && (
                            <button className="mt-4 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-700/60 text-slate-300 hover:border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-500/8 transition-all duration-200">
                              Upgrade <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </SectionCard>
                </motion.div>

                {/* Payment method */}
                <motion.div variants={shouldReduceMotion ? {} : fadeInUp}>
                  <SectionCard>
                    <SectionHeader
                      icon={CreditCard}
                      title="Payment Method"
                      description="Your current payment method on file."
                    />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">VISA</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">Visa ending in 4242</p>
                          <p className="text-xs text-slate-500">Expires 08 / 2026</p>
                        </div>
                      </div>
                      <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-medium">
                        Update card
                      </button>
                    </div>
                  </SectionCard>
                </motion.div>

                {/* Billing history */}
                <motion.div variants={shouldReduceMotion ? {} : fadeInUp}>
                  <SectionCard>
                    <SectionHeader
                      icon={Globe}
                      title="Billing History"
                      description="Download past invoices for your records."
                    />
                    <div className="overflow-x-auto -mx-1">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-800/60">
                            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 px-1">
                              Invoice
                            </th>
                            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 px-1">
                              Date
                            </th>
                            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 px-1">
                              Amount
                            </th>
                            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 px-1">
                              Status
                            </th>
                            <th className="pb-3 px-1" />
                          </tr>
                        </thead>
                        <tbody>
                          {(invoices ?? []).map((inv) => (
                            <tr
                              key={inv.id}
                              className="border-b border-slate-800/40 last:border-0 hover:bg-slate-800/20 transition-colors duration-150"
                            >
                              <td className="py-3 px-1 text-slate-300 font-mono text-xs">{inv.id}</td>
                              <td className="py-3 px-1 text-slate-400 text-xs">{inv.date}</td>
                              <td className="py-3 px-1 text-slate-200 font-medium text-xs">{inv.amount}</td>
                              <td className="py-3 px-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                                  <Check className="w-2.5 h-2.5" />
                                  {inv.status}
                                </span>
                              </td>
                              <td className="py-3 px-1 text-right">
                                <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                                  Download
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SectionCard>
                </motion.div>
              </motion.div>
            )}

            {/* ── SECURITY TAB ── */}
            {activeTab === "security" && (
              <motion.div
                variants={shouldReduceMotion ? {} : staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-6"
              >
                {/* Change password */}
                <motion.div variants={shouldReduceMotion ? {} : fadeInUp}>
                  <SectionCard>
                    <SectionHeader
                      icon={Lock}
                      title="Change Password"
                      description="Use a strong, unique password to keep your account secure."
                    />
                    <div className="flex flex-col gap-4">
                      {/* Current password */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrent((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-200"
                          >
                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* New password */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 12 characters"
                            className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNew((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-200"
                          >
                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {/* Strength bar */}
                        {newPassword.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                  newPassword.length >= i * 3
                                    ? i <= 1
                                      ? "bg-red-500"
                                      : i <= 2
                                      ? "bg-amber-500"
                                      : i <= 3
                                      ? "bg-yellow-400"
                                      : "bg-emerald-500"
                                    : "bg-slate-700"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Confirm password */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-200"
                        />
                        {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                          <p className="text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Passwords do not match.
                          </p>
                        )}
                      </div>

                      <div className="pt-2">
                        <motion.button
                          whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200"
                        >
                          <Lock className="w-4 h-4" />
                          Update Password
                        </motion.button>
                      </div>
                    </div>
                  </SectionCard>
                </motion.div>

                {/* 2FA */}
                <motion.div variants={shouldReduceMotion ? {} : fadeInUp}>
                  <SectionCard>
                    <SectionHeader
                      icon={Smartphone}
                      title="Two-Factor Authentication"
                      description="Add an extra layer of security to your account."
                    />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            twoFAEnabled
                              ? "bg-emerald-500/15 border border-emerald-500/25"
                              : "bg-slate-700/50 border border-slate-700"
                          }`}
                        >
                          <Shield
                            className={`w-4 h-4 ${twoFAEnabled ? "text-emerald-400" : "text-slate-500"}`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">
                            Authenticator App
                            {twoFAEnabled && (
                              <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                                <Check className="w-2.5 h-2.5" /> Active
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Use an authenticator app like Google Authenticator or Authy.
                          </p>
                        </div>
                      </div>
                      <Toggle checked={twoFAEnabled} onChange={setTwoFAEnabled} />
                    </div>
                  </SectionCard>
                </motion.div>

                {/* Session settings */}
                <motion.div variants={shouldReduceMotion ? {} : fadeInUp}>
                  <SectionCard>
                    <SectionHeader
                      icon={Globe}
                      title="Session & Access"
                      description="Control how and when your sessions expire."
                    />
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                          Session Timeout
                        </label>
                        <select
                          value={sessionTimeout}
                          onChange={(e) => setSessionTimeout(e.target.value)}
                          className="w-full sm:w-64 px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-200 appearance-none cursor-pointer"
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="240">4 hours</option>
                          <option value="480">8 hours</option>
                          <option value="0">Never</option>
                        </select>
                        <p className="text-xs text-slate-600">
                          You'll be signed out after {sessionTimeout === "0" ? "never" : `${sessionTimeout} minutes`} of inactivity.
                        </p>
                      </div>

                      {/* Active sessions */}
                      <div className="mt-2">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                          Active Sessions
                        </p>
                        <div className="flex flex-col gap-2">
                          {[
                            { device: "MacBook Pro — Chrome", location: "San Francisco, CA", current: true, time: "Now" },
                            { device: "iPhone 15 — Safari", location: "San Francisco, CA", current: false, time: "2 hours ago" },
                            { device: "Windows PC — Edge", location: "New York, NY", current: false, time: "Yesterday" },
                          ].map((session) => (
                            <div
                              key={session.device}
                              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-700/40 bg-slate-800/20"
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${session.current ? "bg-emerald-400" : "bg-slate-600"}`} />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-slate-200 truncate">{session.device}</p>
                                  <p className="text-xs text-slate-500">{session.location} · {session.time}</p>
                                </div>
                              </div>
                              {session.current ? (
                                <span className="text-xs text-emerald-400 font-medium flex-shrink-0">Current</span>
                              ) : (
                                <button className="text-xs text-red-400 hover:text-red-300 transition-colors duration-200 flex-shrink-0">
                                  Revoke
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SectionCard>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

// Needed for slideInLeft used above
function slideInLeft(shouldReduceMotion: boolean | null) {
  return shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, x: -24 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
      };
}