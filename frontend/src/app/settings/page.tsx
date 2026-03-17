"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  useToast,
} from "@/components/ui";
import {
  Settings,
  Shield,
  Bell,
  Key,
  Globe,
  Wallet,
  Coins,
  Clock,
  Save,
  RefreshCw,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Users,
  Plus,
  Trash2,
} from "lucide-react";

const contractAddresses = [
  { name: "Token Contract", address: "0x1234...5678", network: "Ethereum Mainnet", verified: true },
  { name: "Vesting Engine", address: "0x2345...6789", network: "Ethereum Mainnet", verified: true },
  { name: "Treasury Contract", address: "0x3456...7890", network: "Ethereum Mainnet", verified: true },
];

const accessControls = [
  { role: "DEFAULT_ADMIN", members: ["0x7a...3d2f", "0x8b...4e3a", "0x9c...5f4b"], description: "Can grant/revoke other roles" },
  { role: "MINTER", members: ["0x7a...3d2f", "0x8b...4e3a"], description: "Can mint new tokens" },
  { role: "BURNER", members: ["0x9c...5f4b", "0x1d...6g5c"], description: "Can burn tokens" },
  { role: "PAUSER", members: ["0x7a...3d2f", "0x2e...7h6d"], description: "Can pause transfers" },
  { role: "VESTING_ADMIN", members: ["0x7a...3d2f", "0x8b...4e3a", "0x9c...5f4b", "0x1d...6g5c"], description: "Can create/modify vesting schedules" },
];

const vestingParams = [
  { name: "Min Cliff Period", value: "0 days", description: "Minimum cliff duration for new schedules" },
  { name: "Max Cliff Period", value: "24 months", description: "Maximum cliff duration allowed" },
  { name: "Min Vesting Period", value: "6 months", description: "Minimum total vesting duration" },
  { name: "Max Vesting Period", value: "60 months", description: "Maximum total vesting duration" },
  { name: "Early Exit Penalty", value: "25%", description: "Penalty for early token claim" },
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
  const [notifications, setNotifications] = React.useState(initialNotificationSettings);
  const [accessModalOpen, setAccessModalOpen] = React.useState(false);
  const [activeRole, setActiveRole] = React.useState<(typeof accessControls)[0] | null>(null);
  const [newMemberAddress, setNewMemberAddress] = React.useState("");

  function handleSave() {
    toast({ type: "success", title: "Settings saved", message: "Your changes have been saved successfully." });
  }

  function handleCopyAddress(address: string) {
    navigator.clipboard.writeText(address).catch(() => {});
    toast({ type: "success", title: "Copied!", message: `${address} copied to clipboard.` });
  }

  function toggleNotification(id: string, field: "email" | "push") {
    setNotifications((ns) =>
      ns.map((n) => (n.id === id ? { ...n, [field]: !n[field] } : n))
    );
  }

  function handleManageRole(role: (typeof accessControls)[0]) {
    setActiveRole({ ...role });
    setAccessModalOpen(true);
  }

  function handleAddRoleMember() {
    if (!newMemberAddress) {
      toast({ type: "error", title: "Missing address", message: "Please enter a wallet address." });
      return;
    }
    setActiveRole((r) => r ? { ...r, members: [...r.members, newMemberAddress] } : r);
    toast({ type: "success", title: "Member added", message: `${newMemberAddress} added to ${activeRole?.role}` });
    setNewMemberAddress("");
  }

  function handleRemoveRoleMember(addr: string) {
    setActiveRole((r) => r ? { ...r, members: r.members.filter((m) => m !== addr) } : r);
    toast({ type: "warning", title: "Member removed", message: `${addr} removed from role.` });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-display font-bold text-text-primary">Settings</h1>
          <p className="text-body-lg text-text-secondary mt-1">
            Configure platform parameters and preferences
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="contracts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="vesting">Vesting Params</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Contracts */}
        <TabsContent value="contracts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-accent-primary" />
                  Contract Addresses
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
                        {contract.verified ? (
                          <Badge variant="success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="warning">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Unverified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-body-sm font-mono text-text-secondary">
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
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-emerald)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
                          title="Copy address"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-body-xs text-text-muted">
                        <Globe className="h-3 w-3" />
                        {contract.network}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-info" />
                  Upgrade Contracts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background-tertiary border border-border-primary">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body-md font-semibold text-text-primary">Token Contract</span>
                      <Badge variant="success">Latest</Badge>
                    </div>
                    <p className="text-body-sm text-text-secondary mb-3">Version 1.2.0 deployed</p>
                    <Button variant="secondary" size="sm">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      View on Etherscan
                    </Button>
                  </div>
                  <div className="p-4 rounded-lg bg-background-tertiary border border-border-primary">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body-md font-semibold text-text-primary">Vesting Engine</span>
                      <Badge variant="warning">Upgrade Available</Badge>
                    </div>
                    <p className="text-body-sm text-text-secondary mb-3">
                      Version 1.1.5 — v1.2.0 available
                    </p>
                    <Button size="sm">
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Upgrade to v1.2.0
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Access Control */}
        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent-primary" />
                Role-Based Access Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-primary">
                      <th className="text-left py-4 px-4 text-body-sm font-semibold text-text-secondary">Role</th>
                      <th className="text-left py-4 px-4 text-body-sm font-semibold text-text-secondary">Members</th>
                      <th className="text-left py-4 px-4 text-body-sm font-semibold text-text-secondary">Description</th>
                      <th className="text-right py-4 px-4 text-body-sm font-semibold text-text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessControls.map((role, index) => (
                      <tr
                        key={index}
                        className="border-b border-border-primary hover:bg-background-tertiary/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-accent-primary" />
                            <span className="text-body-md font-semibold text-text-primary">{role.role}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="default">{role.members.length} members</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-body-sm text-text-secondary">{role.description}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleManageRole(role)}
                          >
                            Manage
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vesting Params */}
        <TabsContent value="vesting">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent-primary" />
                  Vesting Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vestingParams.map((param, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-background-tertiary transition-colors"
                    >
                      <div>
                        <p className="text-body-sm font-semibold text-text-primary">{param.name}</p>
                        <p className="text-body-xs text-text-muted">{param.description}</p>
                      </div>
                      <Input defaultValue={param.value} className="w-32 text-right" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-info" />
                  Global Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background-tertiary border border-border-primary">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body-md font-semibold text-text-primary">Revocable Vesting</span>
                      <Badge variant="success">Enabled</Badge>
                    </div>
                    <p className="text-body-sm text-text-secondary">
                      Allow administrators to revoke vesting schedules
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background-tertiary border border-border-primary">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body-md font-semibold text-text-primary">Transferable Claims</span>
                      <Badge variant="warning">Disabled</Badge>
                    </div>
                    <p className="text-body-sm text-text-secondary">
                      Allow vesting beneficiaries to transfer their claims
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background-tertiary border border-border-primary">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body-md font-semibold text-text-primary">Emergency Pause</span>
                      <Badge variant="success">Enabled</Badge>
                    </div>
                    <p className="text-body-sm text-text-secondary">
                      Allow pausers to emergency pause all transfers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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

      {/* Access Control Manage Modal */}
      <Modal open={accessModalOpen} onClose={() => setAccessModalOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>Manage Role: {activeRole?.role}</ModalTitle>
          <ModalDescription>{activeRole?.description}</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--color-text-2)",
                  marginBottom: "0.75rem",
                }}
              >
                Current Members ({activeRole?.members.length ?? 0})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {activeRole?.members.map((addr, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.625rem 0.875rem",
                      borderRadius: "0.5rem",
                      background: "var(--color-bg-elevated)",
                      border: "1px solid var(--color-border-1)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.875rem",
                        color: "var(--color-text-1)",
                      }}
                    >
                      {addr}
                    </span>
                    <button
                      onClick={() => handleRemoveRoleMember(addr)}
                      style={{
                        padding: "0.25rem",
                        borderRadius: "4px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-text-3)",
                        transition: "color 150ms",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-red)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
                      title="Remove member"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid var(--color-border-1)",
                paddingTop: "1rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--color-text-2)",
                  marginBottom: "0.625rem",
                }}
              >
                Add Member
              </p>
              <div style={{ display: "flex", gap: "0.625rem" }}>
                <input
                  type="text"
                  placeholder="0x wallet address..."
                  value={newMemberAddress}
                  onChange={(e) => setNewMemberAddress(e.target.value)}
                  style={{
                    flex: 1,
                    height: "2.5rem",
                    padding: "0 0.875rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--color-border-1)",
                    background: "var(--color-bg-elevated)",
                    fontSize: "0.875rem",
                    color: "var(--color-text-1)",
                    outline: "none",
                    fontFamily: "var(--font-mono)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-emerald)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border-1)")}
                  onKeyDown={(e) => e.key === "Enter" && handleAddRoleMember()}
                />
                <Button onClick={handleAddRoleMember}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setAccessModalOpen(false)}>Done</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
