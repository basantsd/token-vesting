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
} from "@/components/ui";
import {
  Wallet,
  Plus,
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  Users,
  FileText,
  DollarSign,
  Activity,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Copy,
} from "lucide-react";

const treasuryAssets = [
  { name: "TVT Token", symbol: "TVT", balance: "1,250,000", value: "$125,000", change: "+5.2%", changeType: "positive" },
  { name: "Ethereum", symbol: "ETH", balance: "45.5", value: "$68,250", change: "+12.8%", changeType: "positive" },
  { name: "USDC", symbol: "USDC", balance: "50,000", value: "$50,000", change: "0%", changeType: "neutral" },
  { name: "Wrapped BTC", symbol: "WBTC", balance: "2.5", value: "$112,500", change: "-2.1%", changeType: "negative" },
];

const signers = [
  { name: "Alice Johnson", address: "0x7a...3d2f", status: "active", proposals: 12 },
  { name: "Bob Smith", address: "0x8b...4e3a", status: "active", proposals: 8 },
  { name: "Carol Williams", address: "0x9c...5f4b", status: "active", proposals: 15 },
  { name: "David Brown", address: "0x1d...6g5c", status: "inactive", proposals: 3 },
  { name: "Eve Davis", address: "0x2e...7h6d", status: "active", proposals: 10 },
];

const initialProposals = [
  {
    id: "1",
    title: "Allocate 50,000 TVT for team bonus",
    description: "Q1 performance bonus for core team members",
    amount: "50,000 TVT",
    proposer: "Alice Johnson",
    votesFor: 4,
    votesAgainst: 1,
    status: "active",
    expiresIn: "2 days",
  },
  {
    id: "2",
    title: "Add new signer: Frank Miller",
    description: "Add Frank Miller as 6th multi-sig signer",
    amount: "N/A",
    proposer: "Bob Smith",
    votesFor: 5,
    votesAgainst: 0,
    status: "active",
    expiresIn: "5 days",
  },
  {
    id: "3",
    title: "Bridge 10 ETH to Arbitrum",
    description: "Move ETH to Arbitrum for DeFi yield",
    amount: "10 ETH",
    proposer: "Carol Williams",
    votesFor: 3,
    votesAgainst: 2,
    status: "rejected",
    expiresIn: "Expired",
  },
];

const initialTransactions = [
  { id: "1", type: "outgoing", to: "0x7a...3d2f", from: "", amount: "25,000 TVT", date: "Mar 15, 2025", status: "completed", hash: "0xabc123def456" },
  { id: "2", type: "incoming", to: "", from: "0x8b...4e3a", amount: "100,000 TVT", date: "Mar 14, 2025", status: "completed", hash: "0xdef456ghi789" },
  { id: "3", type: "outgoing", to: "0x9c...5f4b", from: "", amount: "5 ETH", date: "Mar 12, 2025", status: "completed", hash: "0xghi789jkl012" },
  { id: "4", type: "outgoing", to: "0x1d...6g5c", from: "", amount: "15,000 TVT", date: "Mar 10, 2025", status: "pending", hash: "0xjkl012mno345" },
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

function StyledTextarea({
  placeholder,
  value,
  onChange,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      style={{
        width: "100%",
        padding: "0.625rem 0.875rem",
        borderRadius: "0.5rem",
        border: "1px solid var(--color-border-1)",
        background: "var(--color-bg-elevated)",
        fontSize: "0.875rem",
        color: "var(--color-text-1)",
        outline: "none",
        resize: "vertical",
        boxSizing: "border-box",
        fontFamily: "inherit",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-emerald)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border-1)")}
    />
  );
}

export default function TreasuryPage() {
  const { add: toast } = useToast();
  const [proposals, setProposals] = React.useState(initialProposals);
  const [proposalOpen, setProposalOpen] = React.useState(false);
  const [transferOpen, setTransferOpen] = React.useState(false);

  const [proposalForm, setProposalForm] = React.useState({
    title: "",
    description: "",
    amount: "",
    token: "",
  });

  const [transferForm, setTransferForm] = React.useState({
    to: "",
    amount: "",
    token: "",
    note: "",
  });

  function handleVote(id: string, type: "for" | "against") {
    setProposals((ps) =>
      ps.map((p) =>
        p.id === id
          ? {
              ...p,
              votesFor: type === "for" ? p.votesFor + 1 : p.votesFor,
              votesAgainst: type === "against" ? p.votesAgainst + 1 : p.votesAgainst,
            }
          : p
      )
    );
    toast({
      type: "success",
      title: `Voted ${type === "for" ? "For" : "Against"}`,
      message: `Your vote has been recorded.`,
    });
  }

  function handleCreateProposal() {
    if (!proposalForm.title || !proposalForm.description) {
      toast({ type: "error", title: "Missing fields", message: "Please fill in title and description." });
      return;
    }
    setProposalOpen(false);
    setProposalForm({ title: "", description: "", amount: "", token: "" });
    toast({ type: "success", title: "Proposal created", message: `"${proposalForm.title}" submitted for voting.` });
  }

  function handleTransfer() {
    if (!transferForm.to || !transferForm.amount || !transferForm.token) {
      toast({ type: "error", title: "Missing fields", message: "Please fill in all required fields." });
      return;
    }
    setTransferOpen(false);
    setTransferForm({ to: "", amount: "", token: "", note: "" });
    toast({ type: "success", title: "Transfer initiated", message: `${transferForm.amount} ${transferForm.token} to ${transferForm.to.slice(0, 10)}...` });
  }

  function handleViewOnExplorer(hash: string) {
    toast({ type: "info", title: "Opening Explorer", message: `Tx: ${hash}` });
  }

  function handleCopyHash(hash: string) {
    navigator.clipboard.writeText(hash).catch(() => {});
    toast({ type: "success", title: "Copied!", message: "Transaction hash copied to clipboard." });
  }

  const statCards = [
    { icon: Wallet, color: "var(--color-emerald)", bg: "var(--color-emerald-subtle)", label: "Total Balance", value: "$355,750" },
    { icon: DollarSign, color: "var(--color-green)", bg: "rgba(16,185,129,0.08)", label: "This Month In", value: "+$125,000", valueColor: "var(--color-green)" },
    { icon: ArrowUpRight, color: "var(--color-red)", bg: "rgba(239,68,68,0.08)", label: "This Month Out", value: "-$45,000", valueColor: "var(--color-red)" },
    { icon: Activity, color: "var(--color-blue)", bg: "rgba(59,130,246,0.08)", label: "Active Proposals", value: "5" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-display font-bold text-text-primary">Treasury</h1>
          <p className="text-body-lg text-text-secondary mt-1">
            Multi-signature treasury management and governance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setTransferOpen(true)}>
            <Send className="h-4 w-4 mr-2" />
            Transfer
          </Button>
          <Button onClick={() => setProposalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Proposal
          </Button>
        </div>
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
                  <p
                    className="text-display-xs font-display font-bold"
                    style={{ color: (s as any).valueColor ?? "var(--color-text-1)" }}
                  >
                    {s.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Assets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-accent-primary" />
                Treasury Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {treasuryAssets.map((asset, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-background-tertiary border border-border-primary"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "var(--color-emerald-subtle)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            color: "var(--color-emerald)",
                          }}
                        >
                          {asset.symbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-body-md font-semibold text-text-primary">{asset.name}</p>
                        <p className="text-body-sm text-text-secondary">
                          {asset.balance} {asset.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-body-md font-semibold text-text-primary">{asset.value}</p>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color:
                            asset.changeType === "positive"
                              ? "var(--color-green)"
                              : asset.changeType === "negative"
                              ? "var(--color-red)"
                              : "var(--color-text-2)",
                        }}
                      >
                        {asset.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-info" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {initialTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-background-tertiary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          padding: "0.5rem",
                          borderRadius: "0.5rem",
                          background:
                            tx.type === "outgoing"
                              ? "rgba(239,68,68,0.08)"
                              : "rgba(16,185,129,0.08)",
                        }}
                      >
                        {tx.type === "outgoing" ? (
                          <ArrowUpRight size={16} style={{ color: "var(--color-red)" }} />
                        ) : (
                          <ArrowDownLeft size={16} style={{ color: "var(--color-green)" }} />
                        )}
                      </div>
                      <div>
                        <p className="text-body-sm font-mono text-text-primary">
                          {tx.type === "outgoing" ? `To: ${tx.to}` : `From: ${tx.from}`}
                        </p>
                        <p className="text-body-xs text-text-muted">{tx.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: tx.type === "outgoing" ? "var(--color-red)" : "var(--color-green)",
                        }}
                      >
                        {tx.type === "outgoing" ? "-" : "+"}{tx.amount}
                      </span>
                      <Badge variant={tx.status === "completed" ? "success" : "warning"}>
                        {tx.status}
                      </Badge>
                      <Dropdown>
                        <DropdownTrigger asChild>
                          <button
                            style={{
                              padding: "0.25rem",
                              borderRadius: "4px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "var(--color-text-3)",
                              transition: "color 150ms",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
                          >
                            <MoreHorizontal size={14} />
                          </button>
                        </DropdownTrigger>
                        <DropdownContent align="end">
                          <DropdownItem
                            icon={<ExternalLink size={14} />}
                            onClick={() => handleViewOnExplorer(tx.hash)}
                          >
                            View on Explorer
                          </DropdownItem>
                          <DropdownItem
                            icon={<Copy size={14} />}
                            onClick={() => handleCopyHash(tx.hash)}
                          >
                            Copy Hash
                          </DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Signers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent-primary" />
                Multi-Sig Signers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {signers.map((signer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-background-tertiary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "var(--color-emerald-subtle)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-emerald)" }}>
                          {signer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-body-sm font-semibold text-text-primary">{signer.name}</p>
                        <p className="text-body-xs text-text-muted font-mono">{signer.address}</p>
                      </div>
                    </div>
                    <Badge variant={signer.status === "active" ? "success" : "default"}>
                      {signer.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--color-border-1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.875rem",
                }}
              >
                <span style={{ color: "var(--color-text-2)" }}>Threshold</span>
                <span style={{ color: "var(--color-text-1)", fontWeight: 600 }}>4 of 5</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Proposals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-warning" />
                Active Proposals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proposals
                  .filter((p) => p.status === "active")
                  .map((proposal) => (
                    <div
                      key={proposal.id}
                      style={{
                        padding: "1rem",
                        borderRadius: "0.75rem",
                        background: "var(--color-bg-elevated)",
                        border: "1px solid var(--color-border-1)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <h4 className="text-body-sm font-semibold text-text-primary" style={{ flex: 1, paddingRight: "0.5rem" }}>
                          {proposal.title}
                        </h4>
                        <Badge variant="warning">Active</Badge>
                      </div>
                      <p className="text-body-xs text-text-secondary" style={{ marginBottom: "0.75rem" }}>
                        {proposal.description}
                      </p>
                      <div style={{ marginBottom: "0.75rem" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "0.375rem",
                            fontSize: "0.75rem",
                          }}
                        >
                          <span style={{ color: "var(--color-text-2)" }}>Votes</span>
                          <span style={{ color: "var(--color-text-1)" }}>
                            {proposal.votesFor}/{proposal.votesFor + proposal.votesAgainst}
                          </span>
                        </div>
                        <Progress
                          value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>
                          Expires in {proposal.expiresIn}
                        </span>
                        <div style={{ display: "flex", gap: "0.375rem" }}>
                          <button
                            onClick={() => handleVote(proposal.id, "for")}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              padding: "0.25rem 0.625rem",
                              borderRadius: "6px",
                              border: "1px solid rgba(16,185,129,0.3)",
                              background: "rgba(16,185,129,0.08)",
                              color: "var(--color-green)",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 120ms",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(16,185,129,0.16)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "rgba(16,185,129,0.08)";
                            }}
                          >
                            <ThumbsUp size={11} />
                            For
                          </button>
                          <button
                            onClick={() => handleVote(proposal.id, "against")}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              padding: "0.25rem 0.625rem",
                              borderRadius: "6px",
                              border: "1px solid rgba(239,68,68,0.3)",
                              background: "rgba(239,68,68,0.08)",
                              color: "var(--color-red)",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 120ms",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(239,68,68,0.16)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                            }}
                          >
                            <ThumbsDown size={11} />
                            Against
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Proposal Modal */}
      <Modal open={proposalOpen} onClose={() => setProposalOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>New Treasury Proposal</ModalTitle>
          <ModalDescription>
            Submit a proposal for multi-sig signers to vote on.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              {fieldLabel("Title *")}
              <StyledInput
                placeholder="e.g. Allocate tokens for Q2 bonus"
                value={proposalForm.title}
                onChange={(v) => setProposalForm((f) => ({ ...f, title: v }))}
              />
            </div>
            <div>
              {fieldLabel("Description *")}
              <StyledTextarea
                placeholder="Describe the purpose and rationale..."
                value={proposalForm.description}
                onChange={(v) => setProposalForm((f) => ({ ...f, description: v }))}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                {fieldLabel("Amount")}
                <StyledInput
                  placeholder="e.g. 50000"
                  value={proposalForm.amount}
                  onChange={(v) => setProposalForm((f) => ({ ...f, amount: v }))}
                />
              </div>
              <div>
                {fieldLabel("Token")}
                <StyledInput
                  placeholder="e.g. TVT"
                  value={proposalForm.token}
                  onChange={(v) => setProposalForm((f) => ({ ...f, token: v }))}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setProposalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateProposal}>Submit Proposal</Button>
        </ModalFooter>
      </Modal>

      {/* Transfer Modal */}
      <Modal open={transferOpen} onClose={() => setTransferOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>Transfer Funds</ModalTitle>
          <ModalDescription>
            Initiate a treasury transfer. This will require multi-sig approval.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              {fieldLabel("To Address *")}
              <StyledInput
                placeholder="0x..."
                value={transferForm.to}
                onChange={(v) => setTransferForm((f) => ({ ...f, to: v }))}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                {fieldLabel("Amount *")}
                <StyledInput
                  placeholder="e.g. 10000"
                  value={transferForm.amount}
                  onChange={(v) => setTransferForm((f) => ({ ...f, amount: v }))}
                />
              </div>
              <div>
                {fieldLabel("Token *")}
                <StyledInput
                  placeholder="e.g. TVT"
                  value={transferForm.token}
                  onChange={(v) => setTransferForm((f) => ({ ...f, token: v }))}
                />
              </div>
            </div>
            <div>
              {fieldLabel("Note (optional)")}
              <StyledTextarea
                placeholder="Purpose of transfer..."
                value={transferForm.note}
                onChange={(v) => setTransferForm((f) => ({ ...f, note: v }))}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setTransferOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleTransfer}>
            <Send className="h-4 w-4 mr-2" />
            Initiate Transfer
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
