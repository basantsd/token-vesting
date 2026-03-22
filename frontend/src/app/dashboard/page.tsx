"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { StatsGrid, VestingScheduleList, RecentActivity } from "@/components/dashboard/AdminDashboard";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/components/ui";
import { Plus, FileText, Wallet } from "lucide-react";
import { CreateScheduleModal } from "@/components/dashboard/CreateScheduleModal";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useVaultStats } from "@/hooks/useVestingSchedule";

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const { isAdmin } = useIsAdmin();
  const { stats, isLoading } = useVaultStats();
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-display font-bold text-text-primary">
            Dashboard
          </h1>
          <p className="text-body-lg text-text-secondary mt-1">
            Overview of your token vesting and treasury
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          )}
        </div>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VestingScheduleList />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-accent-primary" />
              Vault Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border-primary">
                <span className="text-body-sm text-text-secondary">Vault Balance</span>
                <span className="text-body-lg font-semibold text-text-primary">
                  {isLoading ? "..." : `${Number(stats?.vaultBalance ?? 0).toLocaleString()} VTK`}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border-primary">
                <span className="text-body-sm text-text-secondary">Total Locked</span>
                <span className="text-body-lg font-semibold text-accent-primary">
                  {isLoading ? "..." : `${Number(stats?.totalLockedTokens ?? 0).toLocaleString()} VTK`}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-body-sm text-text-secondary">Owner</span>
                <span className="text-body-sm font-mono text-text-primary">
                  {isLoading || !stats?.owner
                    ? "..."
                    : `${stats.owner.slice(0, 6)}...${stats.owner.slice(-4)}`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-success" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => setModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-3" />
                  Create Vesting Schedule
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => router.push("/vesting")}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  View My Vesting
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => router.push("/settings")}
                >
                  <Wallet className="h-4 w-4 mr-3" />
                  Contract Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {isAdmin && (
        <CreateScheduleModal open={modalOpen} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
