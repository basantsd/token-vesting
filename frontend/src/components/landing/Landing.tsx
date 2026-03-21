"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Lock,
  BarChart3,
  Shield,
  Clock,
  Users,
  ChevronRight,
  Check,
  Menu,
  X,
  TrendingUp,
  Zap,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   LOGO MARK — a clean "V" with lock pin, no AI aesthetics
   ============================================================ */
function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#10B981" />
      <path d="M8 9L16 23L24 9" stroke="#080D13" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="23" r="2.5" fill="#080D13" />
    </svg>
  );
}

/* ============================================================
   NAVBAR
   ============================================================ */
function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(8,13,19,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <nav className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={32} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, color: "var(--color-text-1)", letterSpacing: "-0.02em" }}>
            TokenVest
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Vesting", href: "/vesting" },
            { label: "Treasury", href: "/treasury" },
            { label: "Team", href: "/team" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: "0.375rem 0.875rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--color-text-2)",
                transition: "color 150ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-1)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-2)")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              height: "2.25rem",
              padding: "0 1rem",
              borderRadius: "0.5rem",
              background: "var(--color-emerald)",
              color: "#080D13",
              fontSize: "0.875rem",
              fontWeight: 600,
              transition: "background 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-emerald-dark)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-emerald)")}
          >
            Launch App <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{ color: "var(--color-text-2)", padding: "0.25rem" }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "var(--color-bg-surface)", borderTop: "1px solid var(--color-border-1)", padding: "1rem 1.5rem 1.5rem" }}>
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Vesting", href: "/vesting" },
            { label: "Treasury", href: "/treasury" },
            { label: "Team", href: "/team" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ display: "block", padding: "0.625rem 0", fontSize: "0.9375rem", color: "var(--color-text-2)", fontWeight: 500 }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              marginTop: "1rem",
              height: "2.5rem",
              padding: "0 1.25rem",
              borderRadius: "0.5rem",
              background: "var(--color-emerald)",
              color: "#080D13",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            Launch App <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </header>
  );
}

/* ============================================================
   HERO TERMINAL GRID VISUAL
   ============================================================ */
function TerminalGrid() {
  const rows = 8;
  const cols = 12;
  const highlighted = [
    [1,2],[1,5],[1,9],[2,1],[2,4],[2,7],[2,10],
    [3,3],[3,6],[3,8],[4,2],[4,5],[4,9],[4,11],
    [5,1],[5,4],[5,7],[6,3],[6,6],[6,10],[7,2],[7,5],[7,8],
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "6px", opacity: 0.5 }}>
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const isLit = highlighted.some(([hr, hc]) => hr === r && hc === c);
        return (
          <div
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "1px",
              background: isLit ? "var(--color-emerald)" : "rgba(255,255,255,0.06)",
              boxShadow: isLit ? "0 0 6px rgba(16,185,129,0.6)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}

/* Dashboard preview card */
function DashboardPreview() {
  const schedules = [
    { label: "Team Allocation", pct: 65, color: "#10B981" },
    { label: "Investor Round A", pct: 42, color: "#3B82F6" },
    { label: "Advisors Pool", pct: 28, color: "#F59E0B" },
    { label: "Ecosystem Fund", pct: 15, color: "#8B5CF6" },
  ];
  return (
    <div
      style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border-1)",
        borderRadius: "12px",
        padding: "20px",
        width: "100%",
        maxWidth: "440px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <div style={{ fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-3)", fontWeight: 600 }}>Total Vesting Pool</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text-1)", letterSpacing: "-0.025em", marginTop: "2px" }}>4,800,000 TVT</div>
        </div>
        <div style={{ background: "var(--color-emerald-subtle)", border: "1px solid var(--color-border-e)", borderRadius: "6px", padding: "4px 10px", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-emerald)" }}>
          Live
        </div>
      </div>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
        {[
          { v: "24", l: "Schedules" },
          { v: "156", l: "Beneficiaries" },
          { v: "38%", l: "Claimed" },
        ].map((s) => (
          <div key={s.l} style={{ background: "var(--color-bg-elevated)", borderRadius: "8px", padding: "10px 12px" }}>
            <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-text-1)" }}>{s.v}</div>
            <div style={{ fontSize: "0.6875rem", color: "var(--color-text-3)", marginTop: "2px" }}>{s.l}</div>
          </div>
        ))}
      </div>
      {/* Schedule bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {schedules.map((s) => (
          <div key={s.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-2)", fontWeight: 500 }}>{s.label}</span>
              <span style={{ fontSize: "0.75rem", color: s.color, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{s.pct}%</span>
            </div>
            <div style={{ height: "4px", background: "var(--color-bg-elevated)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: "2px", boxShadow: `0 0 8px ${s.color}50` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   HERO SECTION
   ============================================================ */
export function HeroSection() {
  const stats = [
    { value: "$45M+", label: "Value Locked" },
    { value: "120+", label: "Projects" },
    { value: "15K+", label: "Beneficiaries" },
    { value: "8", label: "Chains" },
  ];

  return (
    <section style={{ position: "relative", paddingTop: "7rem", paddingBottom: "5rem", overflow: "hidden", background: "var(--color-bg-base)" }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
      {/* Emerald glow */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: "50%", background: "radial-gradient(ellipse at center top, rgba(16,185,129,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="relative mx-auto max-w-7xl px-6">
        <div style={{  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", alignItems: "center", justifyItems:"center" }}>
          {/* Left column */}
          <div style={{ maxWidth: "640px" }}>
            {/* Eyebrow */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--color-emerald-subtle)", border: "1px solid var(--color-border-e)", borderRadius: "99px", padding: "0.25rem 0.875rem 0.25rem 0.5rem", marginBottom: "1.75rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-emerald)", display: "inline-block", boxShadow: "0 0 6px var(--color-emerald)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-emerald)", letterSpacing: "0.04em" }}>Now live on mainnet</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.06, fontWeight: 700, letterSpacing: "-0.04em", color: "var(--color-text-1)", marginBottom: "1.25rem" }}>
              Token vesting{" "}
              <span style={{ color: "var(--color-emerald)" }}>built</span>
              {" "}for serious teams
            </h1>

            {/* Sub */}
            <p style={{ fontSize: "1.125rem", lineHeight: 1.65, color: "var(--color-text-2)", marginBottom: "2.5rem", maxWidth: "520px" }}>
              Cliff + linear vesting schedules, multi-sig treasury governance, and real-time analytics — all on-chain.
            </p>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "3.5rem" }}>
              <Link
                href="/dashboard"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  height: "2.75rem", padding: "0 1.5rem",
                  borderRadius: "0.5rem",
                  background: "var(--color-emerald)",
                  color: "#080D13", fontSize: "0.9375rem", fontWeight: 600,
                  boxShadow: "0 0 20px rgba(16,185,129,0.2)",
                  transition: "all 150ms",
                }}
              >
                Launch App <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  height: "2.75rem", padding: "0 1.5rem",
                  borderRadius: "0.5rem",
                  background: "transparent",
                  border: "1px solid var(--color-border-2)",
                  color: "var(--color-text-1)", fontSize: "0.9375rem", fontWeight: 500,
                  transition: "border-color 150ms",
                }}
              >
                View Dashboard
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--color-text-1)" }}>{s.value}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)", marginTop: "2px", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
              
            </div>
          </div>

          {/* Right column — dashboard preview */}
          <div>
            <DashboardPreview />
            
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   TRUSTED BY TICKER
   ============================================================ */
export function TrustBar() {
  const names = ["Aave", "Uniswap DAO", "Compound", "Gnosis Safe", "MakerDAO", "Lido", "Synthetix", "Curve"];
  return (
    <section style={{ borderTop: "1px solid var(--color-border-1)", borderBottom: "1px solid var(--color-border-1)", padding: "1.125rem 0", background: "var(--color-bg-surface)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ flexShrink: 0, padding: "0 1.5rem", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "var(--color-text-3)", whiteSpace: "nowrap" }}>
          Trusted by
        </div>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div className="animate-ticker" style={{ display: "flex", gap: "3rem", width: "max-content" }}>
            {[...names, ...names].map((n, i) => (
              <span key={i} style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-2)", whiteSpace: "nowrap", opacity: 0.7 }}>
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FEATURES SECTION
   ============================================================ */
const FEATURES = [
  {
    icon: Lock,
    title: "Cliff + Linear Vesting",
    desc: "Define exact cliff periods before linear distribution begins. Fully configurable per-beneficiary with on-chain enforcement.",
    color: "#10B981",
  },
  {
    icon: Shield,
    title: "Multi-Sig Treasury",
    desc: "Governance-grade multi-signature control. Set custom approval thresholds and manage signers with transparent proposals.",
    color: "#3B82F6",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Live token flow dashboards, vesting progress tracking, and treasury asset allocation — all in one view.",
    color: "#F59E0B",
  },
  {
    icon: Zap,
    title: "Instant Claims",
    desc: "Beneficiaries claim vested tokens in a single transaction. No third-party custody. Gas-optimised contracts.",
    color: "#8B5CF6",
  },
  {
    icon: Globe,
    title: "Multi-Chain Ready",
    desc: "Deploy across Ethereum, Arbitrum, Polygon, Optimism, and more. Unified dashboard for all chains.",
    color: "#EC4899",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    desc: "Granular permission system with MINTER, BURNER, VESTING_ADMIN roles — managed on-chain.",
    color: "#14B8A6",
  },
];

export function FeaturesSection() {
  return (
    <section style={{ padding: "5rem 0", background: "var(--color-bg-base)" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-block", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "var(--color-emerald)", marginBottom: "1rem" }}>
            Platform Features
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--color-text-1)", marginBottom: "0.875rem" }}>
            Everything a serious project needs
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "var(--color-text-2)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.65 }}>
            Built for DAOs, VC-backed startups, and enterprise Web3 teams who can't afford mistakes in token distribution.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "var(--color-border-1)", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--color-border-1)" }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                style={{
                  background: "var(--color-bg-card)",
                  padding: "2rem",
                  transition: "background 150ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bg-elevated)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-bg-card)")}
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${f.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                  <Icon size={20} style={{ color: f.color }} />
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-text-1)", letterSpacing: "-0.01em", marginBottom: "0.625rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-2)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOW IT WORKS
   ============================================================ */
export function HowItWorksSection() {
  const steps = [
    {
      n: "01",
      title: "Deploy your token",
      desc: "Launch an ERC-20 with built-in roles: minter, burner, pauser. One transaction.",
    },
    {
      n: "02",
      title: "Create schedules",
      desc: "Set cliff period, linear duration, and total amount per beneficiary. Fully on-chain.",
    },
    {
      n: "03",
      title: "Configure treasury",
      desc: "Add multi-sig signers and set the approval threshold for all treasury actions.",
    },
    {
      n: "04",
      title: "Monitor & distribute",
      desc: "Track vesting progress in real-time. Beneficiaries self-serve their claims.",
    },
  ];

  return (
    <section style={{ padding: "5rem 0", background: "var(--color-bg-surface)", borderTop: "1px solid var(--color-border-1)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-block", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "var(--color-emerald)", marginBottom: "1rem" }}>
            How it works
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--color-text-1)" }}>
            Set up in under 10 minutes
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ position: "relative" }}>
              <div style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border-1)", borderRadius: "12px", padding: "1.75rem", height: "100%" }}>
                <div style={{ fontSize: "0.6875rem", letterSpacing: "0.08em", fontWeight: 700, color: "var(--color-emerald)", opacity: 0.7, marginBottom: "0.75rem" }}>{s.n}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-text-1)", letterSpacing: "-0.01em", marginBottom: "0.625rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-2)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block" style={{ position: "absolute", top: "50%", right: "-0.875rem", transform: "translateY(-50%)", zIndex: 10 }}>
                  <ChevronRight size={16} style={{ color: "var(--color-text-3)" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TESTIMONIALS
   ============================================================ */
const TESTIMONIALS = [
  {
    quote: "We vested tokens for 48 team members across 3 countries. TokenVest made the whole process transparent and auditable — no spreadsheets, no manual tracking.",
    name: "Ravi Krishnan",
    title: "CTO, Meridian Protocol",
    initials: "RK",
  },
  {
    quote: "The multi-sig treasury combined with vesting in one platform is exactly what we needed for our Series A. Our investors love the on-chain transparency.",
    name: "Sofia Müller",
    title: "CEO, Nexus Labs",
    initials: "SM",
  },
  {
    quote: "After evaluating five platforms, TokenVest had the cleanest smart contract architecture and the only team that understood enterprise compliance requirements.",
    name: "James Okafor",
    title: "Head of Tokenomics, Horizon DAO",
    initials: "JO",
  },
];

export function TestimonialsSection() {
  return (
    <section style={{ padding: "5rem 0", background: "var(--color-bg-base)", borderTop: "1px solid var(--color-border-1)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-block", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "var(--color-emerald)", marginBottom: "1rem" }}>
            Testimonials
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--color-text-1)" }}>
            Trusted by teams who ship
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-border-1)",
                borderRadius: "12px",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: "3px" }}>
                {Array.from({ length: 5 }).map((_, si) => (
                  <svg key={si} width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L8.545 5.09H13L9.5 7.41L10.91 11.5L7 9.18L3.09 11.5L4.5 7.41L1 5.09H5.455L7 1Z" fill="#F59E0B" />
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: "0.9375rem", color: "var(--color-text-2)", lineHeight: 1.65, flex: 1 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border-1)" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--color-emerald-subtle)", border: "1px solid var(--color-border-e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-emerald)" }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-1)" }}>{t.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA SECTION
   ============================================================ */
export function CTASection() {
  const items = [
    "No custody, fully on-chain",
    "Audit-ready smart contracts",
    "Multi-chain deployment",
    "RBAC permission system",
  ];
  return (
    <section style={{ padding: "5rem 0", background: "var(--color-bg-surface)", borderTop: "1px solid var(--color-border-1)" }}>
      <div className="mx-auto max-w-4xl px-6">
        <div style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border-e)",
          borderRadius: "16px",
          padding: "3.5rem",
          textAlign: "center",
          boxShadow: "0 0 48px rgba(16,185,129,0.06)",
        }}>
          <div style={{ display: "inline-block", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "var(--color-emerald)", marginBottom: "1.25rem" }}>
            Get started today
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--color-text-1)", marginBottom: "1rem" }}>
            Ready to distribute your tokens?
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "var(--color-text-2)", marginBottom: "2rem", lineHeight: 1.65 }}>
            Join 120+ projects using TokenVest for secure, transparent token distribution.
          </p>
          {/* Checklist */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.75rem 2rem", marginBottom: "2.5rem" }}>
            {items.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-2)" }}>
                <Check size={14} style={{ color: "var(--color-emerald)", flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.875rem", flexWrap: "wrap" }}>
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                height: "2.75rem", padding: "0 1.75rem",
                borderRadius: "0.5rem",
                background: "var(--color-emerald)",
                color: "#080D13", fontSize: "0.9375rem", fontWeight: 600,
                boxShadow: "0 0 20px rgba(16,185,129,0.2)",
              }}
            >
              Launch App <ArrowRight size={16} />
            </Link>
            <Link
              href="/vesting"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                height: "2.75rem", padding: "0 1.75rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--color-border-2)",
                background: "transparent",
                color: "var(--color-text-1)", fontSize: "0.9375rem", fontWeight: 500,
              }}
            >
              View Vesting Schedules
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
export function Footer() {
  return (
    <footer style={{ background: "var(--color-bg-base)", borderTop: "1px solid var(--color-border-1)", padding: "3.5rem 0 2rem" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
              <LogoMark size={28} />
              <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-text-1)", letterSpacing: "-0.02em" }}>TokenVest</span>
            </Link>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-3)", lineHeight: 1.65, maxWidth: "260px" }}>
              Enterprise-grade token vesting and treasury management for Web3 teams.
            </p>
          </div>

          {/* Platform — only working pages */}
          <div>
            <div style={{ fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, color: "var(--color-text-3)", marginBottom: "1.125rem" }}>Platform</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Vesting Schedules", href: "/vesting" },
                { label: "Treasury", href: "/treasury" },
                { label: "Team Allocation", href: "/team" },
                { label: "Settings", href: "/settings" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{ fontSize: "0.875rem", color: "var(--color-text-3)", transition: "color 150ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{ fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, color: "var(--color-text-3)", marginBottom: "1.125rem" }}>Info</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { label: "How it works", href: "#how" },
                { label: "Features", href: "#features" },
                { label: "Testimonials", href: "#testimonials" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{ fontSize: "0.875rem", color: "var(--color-text-3)", transition: "color 150ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: "1.5rem", borderTop: "1px solid var(--color-border-1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-3)" }}>
            © 2025 TokenVest. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-emerald)", display: "inline-block" }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--color-text-3)" }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Navbar };
