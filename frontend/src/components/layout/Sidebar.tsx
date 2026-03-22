"use client";

import * as React from "react";
import Link from "next/link"; // used in nav items
import { usePathname, useRouter } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import {
  LayoutDashboard,
  Settings,
  FileText,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from "@/components/ui";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useIsAdmin } from "@/hooks/useIsAdmin";

/* Logo mark — clean V + lock pin */
function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#10B981" />
      <path d="M8 9L16 23L24 9" stroke="#080D13" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="23" r="2.5" fill="#080D13" />
    </svg>
  );
}

// Treasury, Team, Settings pages use mock data — hidden until contract integration is added
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, requiresWallet: false },
  { name: "Vesting",   href: "/vesting",   icon: FileText,        requiresWallet: true  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isConnected } = useAccount();

  const visibleNav = navigation.filter((item) => !item.requiresWallet || isConnected);

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen w-64"
      style={{ background: "var(--color-bg-surface)", borderRight: "1px solid var(--color-border-1)" }}
    >
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div
          className="flex h-16 items-center gap-3 px-5"
          style={{ borderBottom: "1px solid var(--color-border-1)" }}
        >
          <LogoMark size={28} />
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-text-1)", letterSpacing: "-0.02em" }}>
              TokenVest
            </span>
            <span style={{ display: "block", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-emerald)", fontWeight: 600, marginTop: "1px" }}>
              Pro
            </span>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-5 px-3">
          <div style={{ marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "var(--color-text-3)", padding: "0 0.625rem 0.625rem" }}>
              Navigation
            </div>
            <div className="space-y-1">
              {visibleNav.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      padding: "0.5625rem 0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "var(--color-emerald)" : "var(--color-text-2)",
                      background: isActive ? "var(--color-emerald-subtle)" : "transparent",
                      border: isActive ? "1px solid var(--color-border-e)" : "1px solid transparent",
                      transition: "all 150ms",
                    }}
                  >
                    <item.icon
                      size={16}
                      style={{ color: isActive ? "var(--color-emerald)" : "var(--color-text-3)", flexShrink: 0 }}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Wallet */}
        <div style={{ borderTop: "1px solid var(--color-border-1)", padding: "1rem" }}>
          <ConnectWallet />
        </div>
      </div>
    </aside>
  );
}

export function Header() {
  const { address, isConnected } = useAccount();
  const { isAdmin } = useIsAdmin();
  const router = useRouter();
  const { disconnect } = useDisconnect();

  const displayAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Not connected";

  const displayRole = !isConnected ? "Wallet not connected" : isAdmin ? "Admin" : "Member";

  return (
    <header
      className="fixed right-0 top-0 z-30 h-16 w-[calc(100%-16rem)]"
      style={{ background: "rgba(8,13,19,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--color-border-1)" }}
    >
      <div className="flex h-full items-center justify-end px-6">
        {/* Search bar removed — no backend integration */}
        {/* Notification bell removed — no on-chain notification system */}

        <div className="flex items-center gap-2">
          <Dropdown>
            <DropdownTrigger asChild>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.375rem 0.5rem",
                  borderRadius: "0.5rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 150ms",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-bg-card)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "none")}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: isConnected
                      ? "linear-gradient(135deg, var(--color-emerald), var(--color-emerald-dark))"
                      : "var(--color-bg-card)",
                    border: isConnected ? "none" : "1px solid var(--color-border-1)",
                  }}
                />
                <ChevronDown size={14} style={{ color: "var(--color-text-3)" }} />
              </button>
            </DropdownTrigger>
            <DropdownContent align="end">
              <div style={{ padding: "0.625rem 0.75rem 0.5rem" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-1)", fontFamily: "monospace" }}>
                  {displayAddress}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>{displayRole}</div>
              </div>
              <DropdownSeparator />
              <DropdownItem icon={<User size={14} />} onClick={() => router.push("/settings")}>
                Profile
              </DropdownItem>
              <DropdownItem icon={<Settings size={14} />} onClick={() => router.push("/settings")}>
                Settings
              </DropdownItem>
              {isConnected && (
                <>
                  <DropdownSeparator />
                  <DropdownItem icon={<LogOut size={14} />} danger onClick={() => disconnect()}>
                    Disconnect
                  </DropdownItem>
                </>
              )}
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

export function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-base)" }}>
      <Sidebar />
      <Header />
      <main style={{ marginLeft: "16rem", paddingTop: "4rem", minHeight: "100vh" }}>
        <div style={{ padding: "1.75rem" }}>{children}</div>
      </main>
    </div>
  );
}
