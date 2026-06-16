"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { APP_NAME, navLinks } from "@/lib/data";
import { Activity, Bell, Menu, X, User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.22, ease: "easeIn" },
    },
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60 shadow-lg shadow-slate-950/40"
          : "bg-slate-950/70 backdrop-blur-md border-b border-slate-800/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.08, rotate: shouldReduceMotion ? 0 : 8 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
            >
              <Activity className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors duration-200">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    whileHover={{ scale: shouldReduceMotion ? 1 : 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "text-indigo-300 bg-indigo-500/10"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.08 }}
              whileTap={{ scale: 0.93 }}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 transition-colors duration-200"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
            </motion.button>

            {/* User avatar */}
            <motion.button
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
              aria-label="User menu"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-300">Alex Kim</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 transition-colors duration-200"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="md:hidden overflow-hidden border-t border-slate-800/50 bg-slate-950/95 backdrop-blur-xl"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <span
                      className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "text-indigo-300 bg-indigo-500/10 border border-indigo-500/20"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                );
              })}
              <div className="mt-2 pt-3 border-t border-slate-800/50 flex items-center gap-3 px-3 pb-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Alex Kim</p>
                  <p className="text-xs text-slate-500">alex@pulseanalytics.io</p>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}