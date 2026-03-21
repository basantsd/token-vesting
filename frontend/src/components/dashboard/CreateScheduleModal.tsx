"use client";
import * as React from "react";
import { useCreateVestingSchedule } from "@/hooks/useVestingActions";
import { Button } from "@/components/ui";

interface CreateScheduleModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateScheduleModal({ open, onClose }: CreateScheduleModalProps) {
  const [beneficiary, setBeneficiary] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [cliffDays, setCliffDays] = React.useState("180");
  const [vestingDays, setVestingDays] = React.useState("365");
  const { createVestingSchedule, isPending, isConfirming, isSuccess, error } = useCreateVestingSchedule();

  React.useEffect(() => {
    if (isSuccess) onClose();
  }, [isSuccess, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneficiary.startsWith("0x") || beneficiary.length !== 42) return;
    if (!amount || Number(amount) <= 0) return;
    createVestingSchedule(
      beneficiary as `0x${string}`,
      amount,
      Number(cliffDays),
      Number(vestingDays)
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-background-secondary p-6 shadow-xl">
        <h2 className="text-display-xs font-display font-semibold text-text-primary mb-6">
          Create Vesting Schedule
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-body-sm text-text-secondary mb-1">Beneficiary Address</label>
            <input
              className="w-full rounded-lg border border-border-primary bg-background-tertiary px-3 py-2 text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-primary"
              placeholder="0x..."
              value={beneficiary}
              onChange={e => setBeneficiary(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-body-sm text-text-secondary mb-1">Amount (VTK)</label>
            <input
              className="w-full rounded-lg border border-border-primary bg-background-tertiary px-3 py-2 text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-primary"
              placeholder="e.g. 1000"
              type="number"
              min="1"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-body-sm text-text-secondary mb-1">Cliff (days)</label>
              <input
                className="w-full rounded-lg border border-border-primary bg-background-tertiary px-3 py-2 text-body-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                type="number"
                min="0"
                value={cliffDays}
                onChange={e => setCliffDays(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-body-sm text-text-secondary mb-1">Vesting (days)</label>
              <input
                className="w-full rounded-lg border border-border-primary bg-background-tertiary px-3 py-2 text-body-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                type="number"
                min="1"
                value={vestingDays}
                onChange={e => setVestingDays(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <p className="text-body-sm text-error">{(error as Error).message.slice(0, 120)}</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isConfirming}>
              {isPending ? "Confirm in wallet..." : isConfirming ? "Confirming..." : "Create Schedule"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
