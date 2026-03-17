"use client";

import * as React from "react";
import { ArrowUpRight, ArrowDownRight, Clock, TrendingUp, Users, Wallet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Badge, Progress } from "@/components/ui";
import { cn, formatNumber, formatDateTime } from "@/lib/utils";

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
  status: "active" | "completed" | "pending";
}

const mockSchedules: VestingSchedule[] = [
  {
    id: "1",
    beneficiary: "0x742d35Cc6634C0532925a3b844Bc9e7595f8bD92",
    totalAmount: 100000,
    claimedAmount: 35000,
    startTime: Date.now() - 90 * 24 * 60 * 60 * 1000,
    endTime: Date.now() + 275 * 24 * 60 * 60 * 1000,
    cliffTime: Date.now() - 60 * 24 * 60 * 60 * 1000,
    status: "active",
  },
  {
    id: "2",
    beneficiary: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    totalAmount: 50000,
    claimedAmount: 50000,
    startTime: Date.now() - 365 * 24 * 60 * 60 * 1000,
    endTime: Date.now() - 10 * 24 * 60 * 60 * 1000,
    cliffTime: Date.now() - 335 * 24 * 60 * 60 * 1000,
    status: "completed",
  },
  {
    id: "3",
    beneficiary: "0x1234567890123456789012345678901234567890",
    totalAmount: 75000,
    claimedAmount: 0,
    startTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
    endTime: Date.now() + 372 * 24 * 60 * 60 * 1000,
    cliffTime: Date.now() + 37 * 24 * 60 * 60 * 1000,
    status: "pending",
  },
];

function VestingScheduleCard({ schedule }: { schedule: VestingSchedule }) {
  const vestedPercentage = (schedule.claimedAmount / schedule.totalAmount) * 100;
  
  const statusColors = {
    active: { bg: "bg-success/10", text: "text-success", label: "Active" },
    completed: { bg: "bg-info/10", text: "text-info", label: "Completed" },
    pending: { bg: "bg-warning/10", text: "text-warning", label: "Pending" },
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
          variant={schedule.status === "active" ? "success" : schedule.status === "completed" ? "info" : "warning"}
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
          <p className="text-text-muted">Start Date</p>
          <p className="text-text-primary">{formatDateTime(schedule.startTime)}</p>
        </div>
        <div>
          <p className="text-text-muted">End Date</p>
          <p className="text-text-primary">{formatDateTime(schedule.endTime)}</p>
        </div>
      </div>
    </Card>
  );
}

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Vested"
        value="2,450,000"
        change={12.5}
        icon={TrendingUp}
        iconColor="text-accent-primary"
      />
      <StatCard
        title="Total Claimed"
        value="845,000"
        change={8.3}
        icon={Wallet}
        iconColor="text-success"
      />
      <StatCard
        title="Active Schedules"
        value={24}
        change={5.2}
        icon={Clock}
        iconColor="text-info"
      />
      <StatCard
        title="Total Beneficiaries"
        value={156}
        change={3.1}
        icon={Users}
        iconColor="text-warning"
      />
    </div>
  );
}

export function VestingScheduleList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-display-sm font-display font-semibold text-text-primary">
          Vesting Schedules
        </h2>
        <div className="flex items-center gap-2">
          <button className="text-body-sm text-text-secondary hover:text-text-primary transition-colors">
            All
          </button>
          <button className="text-body-sm text-text-secondary hover:text-text-primary transition-colors">
            Active
          </button>
          <button className="text-body-sm text-text-secondary hover:text-text-primary transition-colors">
            Completed
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {mockSchedules.map((schedule) => (
          <VestingScheduleCard key={schedule.id} schedule={schedule} />
        ))}
      </div>
    </div>
  );
}

export function RecentActivity() {
  const activities = [
    {
      type: "claim",
      amount: "5,000 TVT",
      address: "0x742d...D92",
      time: "2 hours ago",
    },
    {
      type: "created",
      amount: "100,000 TVT",
      address: "0x8ba1...A72",
      time: "5 hours ago",
    },
    {
      type: "claim",
      amount: "12,500 TVT",
      address: "0x1234...7890",
      time: "1 day ago",
    },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  activity.type === "claim" ? "bg-success/10" : "bg-info/10"
                )}>
                  {activity.type === "claim" ? (
                    <ArrowDownRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-info" />
                  )}
                </div>
                <div>
                  <p className="text-body-sm font-medium text-text-primary">
                    {activity.type === "claim" ? "Tokens Claimed" : "Schedule Created"}
                  </p>
                  <p className="text-body-xs text-text-muted">
                    {activity.address} • {activity.time}
                  </p>
                </div>
              </div>
              <p className="text-body-sm font-medium text-text-primary">
                {activity.amount}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
