"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Settings,
  FileText,
  LogOut,
  ChevronDown,
  Bell,
  Search,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from "@/components/ui";
import { formatAddress } from "@/lib/utils";

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

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Vesting",   href: "/vesting",   icon: FileText },
  { name: "Treasury",  href: "/treasury",  icon: Wallet },
  { name: "Team",      href: "/team",      icon: Users },
  { name: "Settings",  href: "/settings",  icon: Settings },
];

interface SidebarProps {
  connected?: boolean;
  address?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function Sidebar({ connected, address, onConnect, onDisconnect }: SidebarProps) {
  const pathname = usePathname();

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
              {navigation.map((item) => {
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
          {connected ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem", borderRadius: "0.5rem", background: "var(--color-bg-card)", border: "1px solid var(--color-border-1)" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "var(--color-emerald-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Wallet size={14} style={{ color: "var(--color-emerald)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.625rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-3)", fontWeight: 600 }}>Connected</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {formatAddress(address)}
                  </div>
                </div>
              </div>
              <button
                onClick={onDisconnect}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.625rem", borderRadius: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-3)", fontWeight: 500, transition: "color 150ms", background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-red)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
              >
                <LogOut size={14} />
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                height: "2.375rem",
                borderRadius: "0.5rem",
                background: "var(--color-emerald)",
                color: "#080D13",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                transition: "background 150ms",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-emerald-dark)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-emerald)")}
            >
              <Wallet size={15} />
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export function Header() {
  const [notifCount] = React.useState(3);

  return (
    <header
      className="fixed right-0 top-0 z-30 h-16 w-[calc(100%-16rem)]"
      style={{ background: "rgba(8,13,19,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--color-border-1)" }}
    >
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={15}
              style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-3)" }}
            />
            <input
              type="text"
              placeholder="Search..."
              style={{
                height: "2.125rem",
                width: "220px",
                borderRadius: "0.5rem",
                border: "1px solid var(--color-border-1)",
                background: "var(--color-bg-card)",
                paddingLeft: "2.25rem",
                paddingRight: "1rem",
                fontSize: "0.875rem",
                color: "var(--color-text-1)",
                outline: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-emerald)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border-1)")}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            style={{ position: "relative", padding: "0.375rem", borderRadius: "0.5rem", color: "var(--color-text-2)", background: "none", border: "none", cursor: "pointer", transition: "color 150ms" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-1)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-2)")}
          >
            <Bell size={18} />
            {notifCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  minWidth: "16px",
                  height: "16px",
                  borderRadius: "8px",
                  background: "var(--color-emerald)",
                  border: "1.5px solid var(--color-bg-base)",
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  color: "#080D13",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 3px",
                }}
              >
                {notifCount}
              </span>
            )}
          </button>

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
                    background: "linear-gradient(135deg, var(--color-emerald), var(--color-emerald-dark))",
                  }}
                />
                <ChevronDown size={14} style={{ color: "var(--color-text-3)" }} />
              </button>
            </DropdownTrigger>
            <DropdownContent align="end">
              <div style={{ padding: "0.625rem 0.75rem 0.5rem" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-1)" }}>Admin</div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>admin@tokenvest.io</div>
              </div>
              <DropdownSeparator />
              <DropdownItem icon={<User size={14} />}>
                <Link href="/settings" style={{ color: "inherit", textDecoration: "none" }}>Profile</Link>
              </DropdownItem>
              <DropdownItem icon={<Settings size={14} />}>
                <Link href="/settings" style={{ color: "inherit", textDecoration: "none" }}>Settings</Link>
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem icon={<LogOut size={14} />} danger>
                Sign Out
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

export function MainLayout({
  children,
  connected,
  address,
  onConnect,
  onDisconnect,
}: {
  children: React.ReactNode;
  connected?: boolean;
  address?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-base)" }}>
      <Sidebar connected={connected} address={address} onConnect={onConnect} onDisconnect={onDisconnect} />
      <Header />
      <main style={{ marginLeft: "16rem", paddingTop: "4rem", minHeight: "100vh" }}>
        <div style={{ padding: "1.75rem" }}>{children}</div>
      </main>
    </div>
  );
}
