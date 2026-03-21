"use client";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { vestingVaultContract } from "@/lib/contracts";

export function useClaim() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claim = () => {
    writeContract({
      ...vestingVaultContract,
      functionName: "claim",
    });
  };

  return { claim, isPending, isConfirming, isSuccess, error, hash };
}

export function useCreateVestingSchedule() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createVestingSchedule = (
    beneficiary: `0x${string}`,
    totalAmountEther: string,
    cliffDays: number,
    vestingDays: number
  ) => {
    writeContract({
      ...vestingVaultContract,
      functionName: "createVestingSchedule",
      args: [
        beneficiary,
        parseEther(totalAmountEther),
        BigInt(cliffDays * 24 * 60 * 60),
        BigInt(vestingDays * 24 * 60 * 60),
      ],
    });
  };

  return { createVestingSchedule, isPending, isConfirming, isSuccess, error, hash };
}

export function useRevokeSchedule() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const revokeSchedule = (beneficiary: `0x${string}`) => {
    writeContract({
      ...vestingVaultContract,
      functionName: "revokeSchedule",
      args: [beneficiary],
    });
  };

  return { revokeSchedule, isPending, isConfirming, isSuccess, error, hash };
}
