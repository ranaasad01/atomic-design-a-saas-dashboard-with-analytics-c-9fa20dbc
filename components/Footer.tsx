"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, Code2 as Github, MessageCircle as Twitter, Briefcase as Linkedin } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, footerLinks } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Twitter, label: "Twitter / X", href: "https://twitter.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer className="relative border-t border-slate-800/60 bg-slate-950 overflow-hidden">
      {/* Subtle gradient glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-32 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {/* Brand column */}
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="flex flex-col gap-4"
          >
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors duration-200">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              {APP_TAGLINE} Real-time analytics and KPI dashboards for modern SaaS teams.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-2 mt-1">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.12, y: shouldReduceMotion ? 0 : -2 }}
                  whileTap={{ scale: 0.93 }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 border border-slate-800 hover:border-indigo-500/30 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Nav links */}
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="flex flex-col gap-3"
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
              Product
            </h3>
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-indigo-300 transition-colors duration-200 w-fit"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>

          {/* Legal + status */}
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="flex flex-col gap-3"
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
              Legal
            </h3>
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-400 hover:text-indigo-300 transition-colors duration-200 w-fit"
              >
                {link.label}
              </a>
            ))}
            {/* Status badge */}
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">All systems operational</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-slate-700">
            Built with Next.js 14 · TypeScript · Tailwind CSS · Recharts
          </p>
        </motion.div>
      </div>
    </footer>
  );
}