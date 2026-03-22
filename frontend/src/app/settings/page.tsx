"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  useToast,
} from "@/components/ui";
import {
  Settings,
  Shield,
  Bell,
  Globe,
  Wallet,
  Coins,
  Save,
  Copy,
  ExternalLink,
  CheckCircle,
  Users,
} from "lucide-react";
import { useVaultStats } from "@/hooks/useVestingSchedule";
import {
  VESTING_VAULT_ADDRESS,
  VESTING_TOKEN_ADDRESS,
} from "@/lib/contracts";

const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io";

const contractAddresses = [
  {
    name: "VestingToken (VTK)",
    address: VESTING_TOKEN_ADDRESS,
    network: "Sepolia Testnet",
    verified: true,
  },
  {
    name: "VestingVault",
    address: VESTING_VAULT_ADDRESS,
    network: "Sepolia Testnet",
    verified: true,
  },
];

const initialNotificationSettings = [
  { id: "1", name: "Vesting Created", description: "When a new vesting schedule is created", email: true, push: true },
  { id: "2", name: "Tokens Claimed", description: "When beneficiary claims vested tokens", email: true, push: true },
  { id: "3", name: "Vesting Revoked", description: "When a vesting schedule is revoked", email: true, push: false },
  { id: "4", name: "Proposal Submitted", description: "When a new treasury proposal is submitted", email: true, push: true },
  { id: "5", name: "Proposal Executed", description: "When a proposal is executed", email: false, push: true },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        width: "40px",
        height: "24px",
        borderRadius: "12px",
        padding: "2px",
        background: checked ? "var(--color-emerald)" : "var(--color-bg-elevated)",
        border: "none",
        cursor: "pointer",
        transition: "background 200ms",
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background: "#fff",
          transform: checked ? "translateX(18px)" : "translateX(0)",
          transition: "transform 200ms",
          flexShrink: 0,
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { add: toast } = useToast();
  const { stats, isLoading: statsLoading } = useVaultStats();
  const [notifications, setNotifications] = React.useState(initialNotificationSettings);

  function handleCopyAddress(address: string) {
    navigator.clipboard.writeText(address).catch(() => {});
    toast({ type: "success", title: "Copied!", message: `${address} copied to clipboard.` });
  }

  function toggleNotification(id: string, field: "email" | "push") {
    setNotifications((ns) =>
      ns.map((n) => (n.id === id ? { ...n, [field]: !n[field] } : n))
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-display-md font-display font-bold text-text-primary">Settings</h1>
        <p className="text-body-lg text-text-secondary mt-1">
          Contract info and notification preferences
        </p>
      </div>

      <Tabs defaultValue="contracts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Contracts */}
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-accent-primary" />
                Deployed Contracts — Sepolia Testnet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contractAddresses.map((contract, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-background-tertiary border border-border-primary"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body-md font-semibold text-text-primary">
                        {contract.name}
                      </span>
                      <Badge variant="success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <code className="text-body-sm font-mono text-text-secondary break-all">
                        {contract.address}
                      </code>
                      <button
                        onClick={() => handleCopyAddress(contract.address)}
                        style={{
                          padding: "0.25rem",
                          borderRadius: "4px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--color-text-3)",
                          transition: "color 150ms",
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-emerald)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
                        title="Copy address"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-body-xs text-text-muted">
                        <Globe className="h-3 w-3" />
                        {contract.network}
                      </div>
                      <a
                        href={`${SEPOLIA_EXPLORER}/address/${contract.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "0.75rem",
                          color: "var(--color-emerald)",
                          textDecoration: "none",
                          transition: "opacity 150ms",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      >
                        <ExternalLink size={12} />
                        View on Etherscan
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Control */}
        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent-primary" />
                Contract Ownership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-body-sm text-text-secondary">
                  VestingVault uses <strong>Ownable</strong> — a single owner address controls admin actions
                  (create/revoke schedules). Ownership can be transferred via the contract directly.
                </p>
                <div className="p-4 rounded-lg bg-background-tertiary border border-border-primary">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-accent-primary" />
                      <span className="text-body-md font-semibold text-text-primary">Contract Owner</span>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  {statsLoading ? (
                    <p className="text-body-sm text-text-muted font-mono">Loading...</p>
                  ) : stats?.owner ? (
                    <div className="flex items-center gap-2">
                      <code className="text-body-sm font-mono text-text-secondary break-all">
                        {stats.owner}
                      </code>
                      <button
                        onClick={() => handleCopyAddress(stats.owner!)}
                        style={{
                          padding: "0.25rem",
                          borderRadius: "4px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--color-text-3)",
                          transition: "color 150ms",
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-emerald)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
                        title="Copy address"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-body-sm text-text-muted">Connect wallet to view</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-accent-primary" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-background-tertiary border border-border-primary"
                  >
                    <div>
                      <p className="text-body-md font-semibold text-text-primary">{setting.name}</p>
                      <p className="text-body-sm text-text-secondary">{setting.description}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span
                          style={{ fontSize: "0.75rem", color: "var(--color-text-3)", userSelect: "none" }}
                        >
                          Email
                        </span>
                        <Toggle
                          checked={setting.email}
                          onChange={() => toggleNotification(setting.id, "email")}
                        />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span
                          style={{ fontSize: "0.75rem", color: "var(--color-text-3)", userSelect: "none" }}
                        >
                          Push
                        </span>
                        <Toggle
                          checked={setting.push}
                          onChange={() => toggleNotification(setting.id, "push")}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    style={{
                      padding: "0.75rem",
                      borderRadius: "0.75rem",
                      background: "rgba(59,130,246,0.08)",
                    }}
                  >
                    <Globe size={24} style={{ color: "var(--color-blue)" }} />
                  </div>
                  <div>
                    <p className="text-body-md font-semibold text-text-primary">Etherscan</p>
                    <p className="text-body-xs text-text-muted">Contract verification</p>
                  </div>
                </div>
                <Badge variant="success" className="mb-3">Connected</Badge>
                <Button variant="secondary" size="sm" className="w-full">
                  Configure
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    style={{
                      padding: "0.75rem",
                      borderRadius: "0.75rem",
                      background: "rgba(139,92,246,0.08)",
                    }}
                  >
                    <Wallet size={24} style={{ color: "#8B5CF6" }} />
                  </div>
                  <div>
                    <p className="text-body-md font-semibold text-text-primary">WalletConnect</p>
                    <p className="text-body-xs text-text-muted">Wallet linking</p>
                  </div>
                </div>
                <Badge variant="success" className="mb-3">Connected</Badge>
                <Button variant="secondary" size="sm" className="w-full">
                  Configure
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    style={{
                      padding: "0.75rem",
                      borderRadius: "0.75rem",
                      background: "rgba(245,158,11,0.08)",
                    }}
                  >
                    <Users size={24} style={{ color: "var(--color-amber)" }} />
                  </div>
                  <div>
                    <p className="text-body-md font-semibold text-text-primary">Discord</p>
                    <p className="text-body-xs text-text-muted">Team notifications</p>
                  </div>
                </div>
                <Badge variant="default" className="mb-3">Not Connected</Badge>
                <Button size="sm" className="w-full">
                  Connect
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
}
