"use client";
import * as React from "react";
import { StatsGrid, VestingScheduleList, RecentActivity } from "@/components/dashboard/AdminDashboard";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/components/ui";
import { Plus, FileText, Wallet } from "lucide-react";
import { CreateScheduleModal } from "@/components/dashboard/CreateScheduleModal";

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = React.useState(false);

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
          <Button variant="secondary">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Schedule
          </Button>
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
              Treasury Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border-primary">
                <span className="text-body-sm text-text-secondary">Treasury Balance</span>
                <span className="text-body-lg font-semibold text-text-primary">1,250,000 TVT</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border-primary">
                <span className="text-body-sm text-text-secondary">Pending Proposals</span>
                <span className="text-body-lg font-semibold text-accent-primary">3</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-body-sm text-text-secondary">Active Signers</span>
                <span className="text-body-lg font-semibold text-text-primary">5 of 7</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-success" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-3" />
                Add Beneficiary
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-3" />
                Create Vesting Schedule
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Wallet className="h-4 w-4 mr-3" />
                Submit Treasury Proposal
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-3" />
                View All Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateScheduleModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
