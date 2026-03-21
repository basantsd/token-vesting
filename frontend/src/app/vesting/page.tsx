"use client";
import * as React from "react";
import { useAccount } from "wagmi";
import { useVestingSchedule } from "@/hooks/useVestingSchedule";
import { useClaim } from "@/hooks/useVestingActions";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Progress } from "@/components/ui";
import { ConnectWallet } from "@/components/ConnectWallet";

export default function VestingPage() {
  const { address, isConnected } = useAccount();
  const { schedule, isLoading, refetch } = useVestingSchedule(address);
  const { claim, isPending, isConfirming, isSuccess, error } = useClaim();

  React.useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess, refetch]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center">
          <h1 className="text-display-md font-display font-bold text-text-primary mb-2">My Vesting</h1>
          <p className="text-body-lg text-text-secondary">Connect your wallet to view your vesting schedule</p>
        </div>
        <ConnectWallet />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-display-md font-display font-bold text-text-primary">My Vesting</h1>
        <p className="text-text-muted">Loading schedule...</p>
      </div>
    );
  }

  if (!schedule || schedule.totalAmountRaw === 0n) {
    return (
      <div className="space-y-4">
        <h1 className="text-display-md font-display font-bold text-text-primary">My Vesting</h1>
        <Card>
          <CardContent>
            <p className="text-body-lg text-text-secondary py-8 text-center">
              No vesting schedule found for your address.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const total = Number(schedule.totalAmount);
  const claimed = Number(schedule.claimedAmount);
  const claimable = Number(schedule.claimableNow);
  const progressPct = schedule.totalAmountRaw > 0n
    ? Number((schedule.claimedAmountRaw * 10000n) / schedule.totalAmountRaw) / 100
    : 0;
  const now = Date.now();
  const cliffPassed = now > schedule.cliffEndsAt.getTime();
  const fullyVested = now > schedule.vestingEndsAt.getTime();

  return (
    <div className="space-y-8">
      <h1 className="text-display-md font-display font-bold text-text-primary">My Vesting</h1>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <p className="text-body-sm text-text-secondary mb-1">Total Allocation</p>
            <p className="text-display-sm font-bold text-text-primary">{total.toLocaleString("en-US")} VTK</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-body-sm text-text-secondary mb-1">Already Claimed</p>
            <p className="text-display-sm font-bold text-success">{claimed.toLocaleString("en-US")} VTK</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-body-sm text-text-secondary mb-1">Available to Claim</p>
            <p className="text-display-sm font-bold text-accent-primary">{claimable.toLocaleString("en-US")} VTK</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress + claim */}
      <Card>
        <CardHeader>
          <CardTitle>Vesting Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progressPct} max={100} showValue />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-body-sm">
            <div>
              <p className="text-text-muted">Cliff End</p>
              <p className="text-text-primary">{schedule.cliffEndsAt.toLocaleDateString()}</p>
              <Badge variant={cliffPassed ? "success" : "warning"} className="mt-1">
                {cliffPassed ? "Passed" : "Pending"}
              </Badge>
            </div>
            <div>
              <p className="text-text-muted">Vesting End</p>
              <p className="text-text-primary">{schedule.vestingEndsAt.toLocaleDateString()}</p>
              <Badge variant={fullyVested ? "success" : "info"} className="mt-1">
                {fullyVested ? "Complete" : "In Progress"}
              </Badge>
            </div>
            <div>
              <p className="text-text-muted">Status</p>
              <Badge variant={schedule.isRevoked ? "error" : "success"} className="mt-1">
                {schedule.isRevoked ? "Revoked" : "Active"}
              </Badge>
            </div>
          </div>

          {error && (
            <p className="text-body-sm text-error">{(error as Error).message.slice(0, 150)}</p>
          )}

          <Button
            onClick={claim}
            disabled={isPending || isConfirming || schedule.claimableNowRaw === 0n || schedule.isRevoked}
            className="w-full"
          >
            {isPending
              ? "Confirm in wallet..."
              : isConfirming
              ? "Claiming..."
              : `Claim ${claimable.toLocaleString("en-US")} VTK`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
