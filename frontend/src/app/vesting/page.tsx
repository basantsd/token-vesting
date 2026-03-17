"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Progress,
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
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  Select,
  Input,
} from "@/components/ui";
import {
  Plus,
  Search,
  Clock,
  CheckCircle,
  Users,
  TrendingUp,
  Calendar,
  MoreHorizontal,
} from "lucide-react";

const vestingSchedules = [
  {
    id: "1",
    beneficiary: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    beneficiaryShort: "0x7a...488D",
    amount: "500,000 TVT",
    startDate: "Jan 15, 2025",
    endDate: "Jan 15, 2027",
    cliff: "6 months",
    vested: 65,
    status: "active",
  },
  {
    id: "2",
    beneficiary: "0x8b4A12c3B91f02e54C17D6F3E6E5C8D9A7B3F4E2",
    beneficiaryShort: "0x8b...4E2",
    amount: "250,000 TVT",
    startDate: "Feb 1, 2025",
    endDate: "Feb 1, 2028",
    cliff: "12 months",
    vested: 35,
    status: "active",
  },
  {
    id: "3",
    beneficiary: "0x9cD5e6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3",
    beneficiaryShort: "0x9c...C2D3",
    amount: "1,000,000 TVT",
    startDate: "Mar 1, 2025",
    endDate: "Mar 1, 2030",
    cliff: "24 months",
    vested: 15,
    status: "active",
  },
  {
    id: "4",
    beneficiary: "0x1dE4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2",
    beneficiaryShort: "0x1d...D1E2",
    amount: "750,000 TVT",
    startDate: "Apr 1, 2025",
    endDate: "Apr 1, 2028",
    cliff: "6 months",
    vested: 0,
    status: "pending",
  },
  {
    id: "5",
    beneficiary: "0x2eF3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1",
    beneficiaryShort: "0x2e...E0F1",
    amount: "300,000 TVT",
    startDate: "Dec 1, 2024",
    endDate: "Dec 1, 2026",
    cliff: "3 months",
    vested: 100,
    status: "completed",
  },
];

const cliffOptions = [
  { value: "3mo", label: "3 Months" },
  { value: "6mo", label: "6 Months" },
  { value: "12mo", label: "12 Months" },
  { value: "24mo", label: "24 Months" },
];

const durationOptions = [
  { value: "1yr", label: "1 Year" },
  { value: "2yr", label: "2 Years" },
  { value: "3yr", label: "3 Years" },
  { value: "4yr", label: "4 Years" },
  { value: "5yr", label: "5 Years" },
];

function fieldLabel(text: string) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "var(--color-text-2)",
        marginBottom: "0.5rem",
      }}
    >
      {text}
    </label>
  );
}

export default function VestingPage() {
  const { add: toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [revokeOpen, setRevokeOpen] = React.useState(false);
  const [revokeTarget, setRevokeTarget] = React.useState<string | null>(null);

  // Create form state
  const [form, setForm] = React.useState({
    beneficiary: "",
    amount: "",
    startDate: "",
    cliff: "",
    duration: "",
  });

  const filtered = vestingSchedules.filter((s) => {
    const matchSearch =
      search === "" ||
      s.beneficiary.toLowerCase().includes(search.toLowerCase()) ||
      s.beneficiaryShort.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      activeTab === "all" ||
      s.status === activeTab;
    return matchSearch && matchTab;
  });

  function handleCreate() {
    if (!form.beneficiary || !form.amount || !form.startDate || !form.cliff || !form.duration) {
      toast({ type: "error", title: "Missing fields", message: "Please fill in all required fields." });
      return;
    }
    setCreateOpen(false);
    setForm({ beneficiary: "", amount: "", startDate: "", cliff: "", duration: "" });
    toast({ type: "success", title: "Schedule created", message: `Vesting schedule for ${form.beneficiary.slice(0, 10)}... created successfully.` });
  }

  function handleRevoke() {
    setRevokeOpen(false);
    toast({ type: "warning", title: "Schedule revoked", message: `Vesting schedule #${revokeTarget} has been revoked.` });
    setRevokeTarget(null);
  }

  function handleViewDetails(id: string) {
    toast({ type: "info", title: "View Details", message: `Opening details for schedule #${id}` });
  }

  function handleEdit(id: string) {
    toast({ type: "info", title: "Edit Schedule", message: `Opening editor for schedule #${id}` });
  }

  const statCards = [
    { icon: Users, color: "var(--color-emerald)", bg: "var(--color-emerald-subtle)", label: "Total Beneficiaries", value: "24" },
    { icon: CheckCircle, color: "var(--color-green)", bg: "rgba(16,185,129,0.08)", label: "Active Schedules", value: "18" },
    { icon: Clock, color: "var(--color-amber)", bg: "rgba(245,158,11,0.08)", label: "Pending Start", value: "4" },
    { icon: TrendingUp, color: "var(--color-blue)", bg: "rgba(59,130,246,0.08)", label: "Total Distributed", value: "2.4M" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-display font-bold text-text-primary">
            Vesting Schedules
          </h1>
          <p className="text-body-lg text-text-secondary mt-1">
            Manage token vesting schedules and allocations
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Schedule
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div style={{ padding: "0.75rem", borderRadius: "0.75rem", background: s.bg, flexShrink: 0 }}>
                  <s.icon size={24} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-body-sm text-text-secondary">{s.label}</p>
                  <p className="text-display-xs font-display font-bold text-text-primary">{s.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs + table */}
      <Tabs defaultValue="all" className="space-y-6" onChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Schedules</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-3">
            <div style={{ position: "relative" }}>
              <Search
                size={15}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-3)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search by address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  height: "2.25rem",
                  width: "240px",
                  paddingLeft: "2.25rem",
                  paddingRight: "1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--color-border-1)",
                  background: "var(--color-bg-card)",
                  fontSize: "0.875rem",
                  color: "var(--color-text-1)",
                  outline: "none",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-emerald)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border-1)")}
              />
            </div>
          </div>
        </div>

        {["all", "active", "pending", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-primary">
                        <th className="text-left py-4 px-6 text-body-sm font-semibold text-text-secondary">Beneficiary</th>
                        <th className="text-left py-4 px-6 text-body-sm font-semibold text-text-secondary">Amount</th>
                        <th className="text-left py-4 px-6 text-body-sm font-semibold text-text-secondary">Period</th>
                        <th className="text-left py-4 px-6 text-body-sm font-semibold text-text-secondary">Cliff</th>
                        <th className="text-left py-4 px-6 text-body-sm font-semibold text-text-secondary">Vested</th>
                        <th className="text-left py-4 px-6 text-body-sm font-semibold text-text-secondary">Status</th>
                        <th className="text-right py-4 px-6 text-body-sm font-semibold text-text-secondary"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-3)", fontSize: "0.875rem" }}
                          >
                            No schedules found
                          </td>
                        </tr>
                      ) : (
                        filtered.map((schedule) => (
                          <tr
                            key={schedule.id}
                            className="border-b border-border-primary hover:bg-background-tertiary/50 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div>
                                <p className="text-body-md font-mono text-text-primary">{schedule.beneficiaryShort}</p>
                                <p className="text-body-xs text-text-muted">ID: #{schedule.id}</p>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-body-md font-semibold text-text-primary">{schedule.amount}</span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2 text-body-sm text-text-secondary">
                                <Calendar className="h-4 w-4" />
                                {schedule.startDate} – {schedule.endDate}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-body-sm text-text-secondary">{schedule.cliff}</span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <Progress value={schedule.vested} className="w-24" />
                                <span className="text-body-sm font-mono text-text-primary w-12">
                                  {schedule.vested}%
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <Badge
                                variant={
                                  schedule.status === "active"
                                    ? "success"
                                    : schedule.status === "pending"
                                    ? "warning"
                                    : "default"
                                }
                              >
                                {schedule.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <Dropdown>
                                <DropdownTrigger asChild>
                                  <button
                                    style={{
                                      padding: "0.375rem",
                                      borderRadius: "6px",
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      color: "var(--color-text-3)",
                                      transition: "color 150ms",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-1)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
                                  >
                                    <MoreHorizontal size={16} />
                                  </button>
                                </DropdownTrigger>
                                <DropdownContent align="end">
                                  <DropdownItem onClick={() => handleViewDetails(schedule.id)}>
                                    View Details
                                  </DropdownItem>
                                  <DropdownItem onClick={() => handleEdit(schedule.id)}>
                                    Edit Schedule
                                  </DropdownItem>
                                  <DropdownSeparator />
                                  <DropdownItem
                                    danger
                                    onClick={() => {
                                      setRevokeTarget(schedule.id);
                                      setRevokeOpen(true);
                                    }}
                                  >
                                    Revoke
                                  </DropdownItem>
                                </DropdownContent>
                              </Dropdown>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>Create Vesting Schedule</ModalTitle>
          <ModalDescription>
            Set up a new token vesting schedule for a beneficiary.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              {fieldLabel("Beneficiary Address *")}
              <input
                type="text"
                placeholder="0x..."
                value={form.beneficiary}
                onChange={(e) => setForm((f) => ({ ...f, beneficiary: e.target.value }))}
                style={{
                  width: "100%",
                  height: "2.5rem",
                  padding: "0 0.875rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--color-border-1)",
                  background: "var(--color-bg-elevated)",
                  fontSize: "0.875rem",
                  color: "var(--color-text-1)",
                  outline: "none",
                  fontFamily: "var(--font-mono)",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-emerald)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border-1)")}
              />
            </div>
            <div>
              {fieldLabel("Token Amount *")}
              <input
                type="text"
                placeholder="e.g. 500000"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                style={{
                  width: "100%",
                  height: "2.5rem",
                  padding: "0 0.875rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--color-border-1)",
                  background: "var(--color-bg-elevated)",
                  fontSize: "0.875rem",
                  color: "var(--color-text-1)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-emerald)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border-1)")}
              />
            </div>
            <div>
              {fieldLabel("Start Date *")}
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                style={{
                  width: "100%",
                  height: "2.5rem",
                  padding: "0 0.875rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--color-border-1)",
                  background: "var(--color-bg-elevated)",
                  fontSize: "0.875rem",
                  color: "var(--color-text-1)",
                  outline: "none",
                  colorScheme: "dark",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-emerald)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border-1)")}
              />
            </div>
            <Select
              label="Cliff Period *"
              value={form.cliff}
              onChange={(v) => setForm((f) => ({ ...f, cliff: v }))}
              options={cliffOptions}
              placeholder="Select cliff period..."
            />
            <Select
              label="Vesting Duration *"
              value={form.duration}
              onChange={(v) => setForm((f) => ({ ...f, duration: v }))}
              options={durationOptions}
              placeholder="Select vesting duration..."
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setCreateOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create Schedule</Button>
        </ModalFooter>
      </Modal>

      {/* Revoke Confirm Modal */}
      <Modal open={revokeOpen} onClose={() => setRevokeOpen(false)} size="sm">
        <ModalHeader>
          <ModalTitle>Revoke Vesting Schedule</ModalTitle>
          <ModalDescription>
            Are you sure you want to revoke schedule #{revokeTarget}? This action cannot be undone. Unvested tokens will be returned to the treasury.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setRevokeOpen(false)}>
            Cancel
          </Button>
          <button
            onClick={handleRevoke}
            style={{
              height: "2.25rem",
              padding: "0 1rem",
              borderRadius: "0.5rem",
              background: "var(--color-red)",
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "opacity 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Revoke Schedule
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
