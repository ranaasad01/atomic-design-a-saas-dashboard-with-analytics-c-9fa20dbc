export const APP_NAME = "Pulse Analytics";
export const APP_TAGLINE = "Clarity at the speed of your business.";
export const APP_DESCRIPTION =
  "Monitor revenue, users, and growth metrics with beautiful real-time dashboards built for modern SaaS teams.";

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const navLinks: NavLink[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Users", href: "/users" },
  { label: "Revenue", href: "/revenue" },
  { label: "Settings", href: "/settings" },
];

export const sidebarLinks: NavLink[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Users", href: "/users" },
  { label: "Revenue", href: "/revenue" },
  { label: "Settings", href: "/settings" },
];

export interface KpiCard {
  label: string;
  value: string;
  change: number;
  unit?: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export const footerLinks: FooterLink[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Users", href: "/users" },
  { label: "Revenue", href: "/revenue" },
  { label: "Settings", href: "/settings" },
];

export const BRAND = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  dark: "#1e1b4b",
  light: "#f8fafc",
  border: "#e2e8f0",
} as const;