"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Progress,
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
} from "@/components/ui";
import {
  Users,
  Plus,
  Search,
  Crown,
  Shield,
  Code,
  Palette,
  Megaphone,
  Briefcase,
  MoreHorizontal,
  Mail,
  Wallet,
  Calendar,
  TrendingUp,
  UserMinus,
  Eye,
  Pencil,
} from "lucide-react";

const initialTeamMembers = [
  {
    id: "1",
    name: "Alex Thompson",
    role: "CEO & Co-Founder",
    department: "Leadership",
    address: "0x7a...3d2f",
    email: "alex@tokenvest.io",
    allocated: "1,500,000 TVT",
    vested: "65",
    status: "active",
    avatar: "AT",
    joinDate: "Jan 2024",
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "CTO & Co-Founder",
    department: "Engineering",
    address: "0x8b...4e3a",
    email: "sarah@tokenvest.io",
    allocated: "1,200,000 TVT",
    vested: "65",
    status: "active",
    avatar: "SC",
    joinDate: "Jan 2024",
  },
  {
    id: "3",
    name: "Michael Roberts",
    role: "VP of Engineering",
    department: "Engineering",
    address: "0x9c...5f4b",
    email: "michael@tokenvest.io",
    allocated: "800,000 TVT",
    vested: "45",
    status: "active",
    avatar: "MR",
    joinDate: "Mar 2024",
  },
  {
    id: "4",
    name: "Emily Zhang",
    role: "Head of Design",
    department: "Design",
    address: "0x1d...6g5c",
    email: "emily@tokenvest.io",
    allocated: "500,000 TVT",
    vested: "35",
    status: "active",
    avatar: "EZ",
    joinDate: "May 2024",
  },
  {
    id: "5",
    name: "James Wilson",
    role: "Marketing Director",
    department: "Marketing",
    address: "0x2e...7h6d",
    email: "james@tokenvest.io",
    allocated: "400,000 TVT",
    vested: "25",
    status: "active",
    avatar: "JW",
    joinDate: "Jul 2024",
  },
  {
    id: "6",
    name: "Lisa Park",
    role: "Operations Manager",
    department: "Operations",
    address: "0x3f...8i7e",
    email: "lisa@tokenvest.io",
    allocated: "300,000 TVT",
    vested: "15",
    status: "active",
    avatar: "LP",
    joinDate: "Sep 2024",
  },
];

const departments = [
  { name: "Leadership", members: 2, allocation: "2,700,000 TVT", pct: 33 },
  { name: "Engineering", members: 8, allocation: "3,200,000 TVT", pct: 39 },
  { name: "Design", members: 3, allocation: "900,000 TVT", pct: 11 },
  { name: "Marketing", members: 4, allocation: "800,000 TVT", pct: 10 },
  { name: "Operations", members: 3, allocation: "600,000 TVT", pct: 7 },
];

const deptColors: Record<string, string> = {
  Leadership: "var(--color-amber)",
  Engineering: "var(--color-blue)",
  Design: "var(--color-green)",
  Marketing: "var(--color-red)",
  Operations: "#8B5CF6",
};

const roleIcons: Record<string, React.ElementType> = {
  Leadership: Crown,
  Engineering: Code,
  Design: Palette,
  Marketing: Megaphone,
  Operations: Briefcase,
};

const deptOptions = [
  { value: "Leadership", label: "Leadership" },
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Marketing", label: "Marketing" },
  { value: "Operations", label: "Operations" },
];

const vestingDurationOptions = [
  { value: "1yr", label: "1 Year" },
  { value: "2yr", label: "2 Years" },
  { value: "3yr", label: "3 Years" },
  { value: "4yr", label: "4 Years" },
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

function StyledInput({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
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
  );
}

export default function TeamPage() {
  const { add: toast } = useToast();
  const [teamMembers, setTeamMembers] = React.useState(initialTeamMembers);
  const [search, setSearch] = React.useState("");
  const [addOpen, setAddOpen] = React.useState(false);
  const [removeOpen, setRemoveOpen] = React.useState(false);
  const [removeTarget, setRemoveTarget] = React.useState<string | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    name: "",
    role: "",
    department: "",
    address: "",
    email: "",
    allocation: "",
    vestingDuration: "",
  });

  const filtered = teamMembers.filter((m) => {
    const q = search.toLowerCase();
    return (
      q === "" ||
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q)
    );
  });

  function handleAdd() {
    if (!form.name || !form.role || !form.department || !form.address) {
      toast({ type: "error", title: "Missing fields", message: "Please fill in all required fields." });
      return;
    }
    const initials = form.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    setTeamMembers((ms) => [
      ...ms,
      {
        id: String(Date.now()),
        name: form.name,
        role: form.role,
        department: form.department,
        address: form.address,
        email: form.email,
        allocated: form.allocation ? `${form.allocation} TVT` : "0 TVT",
        vested: "0",
        status: "active",
        avatar: initials,
        joinDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      },
    ]);
    setAddOpen(false);
    setForm({ name: "", role: "", department: "", address: "", email: "", allocation: "", vestingDuration: "" });
    toast({ type: "success", title: "Member added", message: `${form.name} has been added to the team.` });
  }

  function handleRemove() {
    setTeamMembers((ms) => ms.filter((m) => m.id !== removeTarget));
    setRemoveOpen(false);
    const target = teamMembers.find((m) => m.id === removeTarget);
    toast({ type: "warning", title: "Member removed", message: `${target?.name ?? "Member"} has been removed from the team.` });
    setRemoveTarget(null);
  }

  function handleViewSchedule(id: string) {
    const m = teamMembers.find((x) => x.id === id);
    toast({ type: "info", title: "View Schedule", message: `Opening vesting schedule for ${m?.name ?? id}` });
  }

  function handleEditMember(id: string) {
    setEditTarget(id);
    setEditOpen(true);
    toast({ type: "info", title: "Edit Member", message: "Edit functionality coming soon." });
    setEditOpen(false);
  }

  const statCards = [
    { icon: Users, color: "var(--color-emerald)", bg: "var(--color-emerald-subtle)", label: "Total Team", value: "20" },
    { icon: TrendingUp, color: "var(--color-green)", bg: "rgba(16,185,129,0.08)", label: "Total Allocated", value: "8.2M TVT" },
    { icon: Shield, color: "var(--color-blue)", bg: "rgba(59,130,246,0.08)", label: "Total Vested", value: "3.1M TVT" },
    { icon: Crown, color: "var(--color-amber)", bg: "rgba(245,158,11,0.08)", label: "Departments", value: "5" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-display font-bold text-text-primary">
            Team Allocation
          </h1>
          <p className="text-body-lg text-text-secondary mt-1">
            Manage team token allocations and vesting schedules
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Stats */}
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
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
                    placeholder="Search by name, role, dept..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      height: "2.25rem",
                      width: "220px",
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
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-primary">
                      <th className="text-left py-4 px-4 text-body-sm font-semibold text-text-secondary">Member</th>
                      <th className="text-left py-4 px-4 text-body-sm font-semibold text-text-secondary">Role</th>
                      <th className="text-left py-4 px-4 text-body-sm font-semibold text-text-secondary">Department</th>
                      <th className="text-left py-4 px-4 text-body-sm font-semibold text-text-secondary">Allocated</th>
                      <th className="text-left py-4 px-4 text-body-sm font-semibold text-text-secondary">Vested</th>
                      <th className="text-left py-4 px-4 text-body-sm font-semibold text-text-secondary">Status</th>
                      <th className="text-right py-4 px-4 text-body-sm font-semibold text-text-secondary"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-3)", fontSize: "0.875rem" }}
                        >
                          No team members found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((member) => {
                        const RoleIcon = roleIcons[member.department] || Users;
                        return (
                          <tr
                            key={member.id}
                            className="border-b border-border-primary hover:bg-background-tertiary/50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    background: "var(--color-emerald-subtle)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "0.875rem",
                                      fontWeight: 700,
                                      color: "var(--color-emerald)",
                                    }}
                                  >
                                    {member.avatar}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-body-md font-semibold text-text-primary">{member.name}</p>
                                  <p className="text-body-xs text-text-muted font-mono">{member.address}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-body-sm text-text-primary">{member.role}</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <RoleIcon
                                  size={14}
                                  style={{ color: deptColors[member.department] ?? "var(--color-text-3)" }}
                                />
                                <span className="text-body-sm text-text-secondary">{member.department}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-body-sm font-semibold text-text-primary">{member.allocated}</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Progress value={parseInt(member.vested)} className="w-16" />
                                <span className="text-body-xs text-text-secondary">{member.vested}%</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant={member.status === "active" ? "success" : "default"}>
                                {member.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-right">
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
                                  <DropdownItem
                                    icon={<Pencil size={14} />}
                                    onClick={() => handleEditMember(member.id)}
                                  >
                                    Edit Member
                                  </DropdownItem>
                                  <DropdownItem
                                    icon={<Eye size={14} />}
                                    onClick={() => handleViewSchedule(member.id)}
                                  >
                                    View Schedule
                                  </DropdownItem>
                                  <DropdownSeparator />
                                  <DropdownItem
                                    icon={<UserMinus size={14} />}
                                    danger
                                    onClick={() => {
                                      setRemoveTarget(member.id);
                                      setRemoveOpen(true);
                                    }}
                                  >
                                    Remove from Team
                                  </DropdownItem>
                                </DropdownContent>
                              </Dropdown>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: deptColors[dept.name] ?? "var(--color-text-3)",
                            flexShrink: 0,
                          }}
                        />
                        <span className="text-body-sm text-text-primary">{dept.name}</span>
                      </div>
                      <span className="text-body-xs text-text-secondary">{dept.members} members</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Progress value={dept.pct} className="flex-1 mr-3" />
                      <span className="text-body-xs font-mono text-text-muted">{dept.allocation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start" onClick={() => setAddOpen(true)}>
                  <Users className="h-4 w-4 mr-3" />
                  Invite Team Member
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <Wallet className="h-4 w-4 mr-3" />
                  Create Vesting Schedule
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-3" />
                  Send Notification
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-3" />
                  Schedule Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>Add Team Member</ModalTitle>
          <ModalDescription>
            Add a new member to the team and configure their token allocation.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                {fieldLabel("Name *")}
                <StyledInput
                  placeholder="Full name"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                />
              </div>
              <div>
                {fieldLabel("Role *")}
                <StyledInput
                  placeholder="e.g. Senior Engineer"
                  value={form.role}
                  onChange={(v) => setForm((f) => ({ ...f, role: v }))}
                />
              </div>
            </div>
            <Select
              label="Department *"
              value={form.department}
              onChange={(v) => setForm((f) => ({ ...f, department: v }))}
              options={deptOptions}
              placeholder="Select department..."
            />
            <div>
              {fieldLabel("Wallet Address *")}
              <StyledInput
                placeholder="0x..."
                value={form.address}
                onChange={(v) => setForm((f) => ({ ...f, address: v }))}
              />
            </div>
            <div>
              {fieldLabel("Email")}
              <StyledInput
                type="email"
                placeholder="name@company.io"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                {fieldLabel("Token Allocation")}
                <StyledInput
                  placeholder="e.g. 500000"
                  value={form.allocation}
                  onChange={(v) => setForm((f) => ({ ...f, allocation: v }))}
                />
              </div>
              <Select
                label="Vesting Duration"
                value={form.vestingDuration}
                onChange={(v) => setForm((f) => ({ ...f, vestingDuration: v }))}
                options={vestingDurationOptions}
                placeholder="Select duration..."
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setAddOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add Member</Button>
        </ModalFooter>
      </Modal>

      {/* Remove Confirm Modal */}
      <Modal open={removeOpen} onClose={() => setRemoveOpen(false)} size="sm">
        <ModalHeader>
          <ModalTitle>Remove Team Member</ModalTitle>
          <ModalDescription>
            Are you sure you want to remove{" "}
            <strong style={{ color: "var(--color-text-1)" }}>
              {teamMembers.find((m) => m.id === removeTarget)?.name ?? "this member"}
            </strong>{" "}
            from the team? Their vesting schedule will be paused pending review.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setRemoveOpen(false)}>
            Cancel
          </Button>
          <button
            onClick={handleRemove}
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
            Remove Member
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
