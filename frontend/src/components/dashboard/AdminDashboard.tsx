"use client";

import * as React from "react";
import { ArrowUpRight, ArrowDownRight, Clock, TrendingUp, Users, Wallet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Badge, Progress, Button } from "@/components/ui";
import { cn, formatNumber, formatDateTime } from "@/lib/utils";
import { useVaultStats, useVestingSchedule } from "@/hooks/useVestingSchedule";
import { useRevokeSchedule } from "@/hooks/useVestingActions";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  iconColor?: string;
}

function StatCard({ title, value, change, icon: Icon, iconColor = "text-accent-primary" }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-body-sm text-text-secondary">{title}</p>
          <p className="mt-2 text-display-sm font-display font-bold text-text-primary">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
          {change !== undefined && (
            <div className={cn(
              "mt-2 flex items-center gap-1 text-body-sm",
              change >= 0 ? "text-success" : "text-error"
            )}>
              {change >= 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span>{Math.abs(change).toFixed(1)}%</span>
              <span className="text-text-muted">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          "bg-background-tertiary"
        )}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
    </Card>
  );
}

interface VestingSchedule {
  id: string;
  beneficiary: string;
  totalAmount: number;
  claimedAmount: number;
  startTime: number;
  endTime: number;
  cliffTime: number;
  status: "active" | "completed" | "pending" | "revoked";
}

interface VestingScheduleCardProps {
  schedule: VestingSchedule;
  onRevoke?: () => void;
  isRevoking?: boolean;
}

function VestingScheduleCard({ schedule, onRevoke, isRevoking }: VestingScheduleCardProps) {
  const statusColors = {
    active: { bg: "bg-success/10", text: "text-success", label: "Active" },
    completed: { bg: "bg-info/10", text: "text-info", label: "Completed" },
    pending: { bg: "bg-warning/10", text: "text-warning", label: "Pending" },
    revoked: { bg: "bg-error/10", text: "text-error", label: "Revoked" },
  };

  const status = statusColors[schedule.status];

  return (
    <Card hover>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-mono text-body-sm text-text-primary">
            {schedule.beneficiary.slice(0, 6)}...{schedule.beneficiary.slice(-4)}
          </p>
          <p className="mt-1 text-display-xs font-semibold text-text-primary">
            {formatNumber(schedule.totalAmount)} TVT
          </p>
        </div>
        <Badge
          variant={schedule.status === "active" ? "success" : schedule.status === "completed" ? "info" : schedule.status === "revoked" ? "error" : "warning"}
          dot
        >
          {status.label}
        </Badge>
      </div>

      <Progress
        value={schedule.claimedAmount}
        max={schedule.totalAmount}
        showValue
        className="mb-4"
      />

      <div className="grid grid-cols-2 gap-4 text-body-sm">
        <div>
          <p className="text-text-muted">Cliff End</p>
          <p className="text-text-primary">{formatDateTime(schedule.cliffTime)}</p>
        </div>
        <div>
          <p className="text-text-muted">End Date</p>
          <p className="text-text-primary">{formatDateTime(schedule.endTime)}</p>
        </div>
      </div>

      {onRevoke && (
        <div className="mt-4">
          <Button
            variant="danger"
            size="sm"
            onClick={onRevoke}
            disabled={isRevoking}
          >
            {isRevoking ? "Revoking..." : "Revoke"}
          </Button>
        </div>
      )}
    </Card>
  );
}

export function StatsGrid() {
  const { stats, isLoading } = useVaultStats();
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Locked" value={isLoading ? "..." : `${Number(stats?.totalLockedTokens ?? 0).toLocaleString()} VTK`} icon={TrendingUp} iconColor="text-accent-primary" />
      <StatCard title="Vault Balance" value={isLoading ? "..." : `${Number(stats?.vaultBalance ?? 0).toLocaleString()} VTK`} icon={Wallet} iconColor="text-success" />
      <StatCard title="Total Supply" value={isLoading ? "..." : `${Number(stats?.totalSupply ?? 0).toLocaleString()} VTK`} icon={Clock} iconColor="text-info" />
      <StatCard title="Contract Owner" value={stats?.owner ? `${stats.owner.slice(0,6)}...${stats.owner.slice(-4)}` : "..."} icon={Users} iconColor="text-warning" />
    </div>
  );
}

export function VestingScheduleList() {
  const [inputValue, setInputValue] = React.useState("");
  const [lookupAddress, setLookupAddress] = React.useState<`0x${string}` | undefined>();
  const { schedule, isLoading } = useVestingSchedule(lookupAddress);
  const { revokeSchedule, isPending: isRevoking } = useRevokeSchedule();

  const handleLookup = () => {
    if (inputValue.startsWith("0x") && inputValue.length === 42) {
      setLookupAddress(inputValue as `0x${string}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-display-sm font-display font-semibold text-text-primary">
          Lookup Vesting Schedule
        </h2>
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border border-border-primary bg-background-secondary px-3 py-2 text-body-sm text-text-primary placeholder:text-text-muted"
          placeholder="0x... beneficiary address"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <Button onClick={handleLookup} disabled={!inputValue.startsWith("0x") || inputValue.length !== 42}>
          Lookup
        </Button>
      </div>
      {isLoading && <p className="text-text-muted text-body-sm">Loading...</p>}
      {lookupAddress && !isLoading && !schedule && (
        <p className="text-text-muted text-body-sm">No schedule found for this address.</p>
      )}
      {schedule && lookupAddress && (
        <VestingScheduleCard
          schedule={{
            id: lookupAddress,
            beneficiary: lookupAddress,
            totalAmount: Number(schedule.totalAmount),
            claimedAmount: Number(schedule.claimedAmount),
            startTime: 0,
            endTime: schedule.vestingEndsAt.getTime(),
            cliffTime: schedule.cliffEndsAt.getTime(),
            status: schedule.isRevoked
              ? "revoked"
              : (schedule.claimedAmountRaw >= schedule.totalAmountRaw && schedule.totalAmountRaw > 0n)
                ? "completed"
                : schedule.claimableNowRaw > 0n
                  ? "active"
                  : "pending",
          }}
          onRevoke={() => revokeSchedule(lookupAddress)}
          isRevoking={isRevoking}
        />
      )}
    </div>
  );
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
      <CardContent>
        <p className="text-body-sm text-text-muted">On-chain activity requires an indexer. Coming soon.</p>
      </CardContent>
    </Card>
  );
}
