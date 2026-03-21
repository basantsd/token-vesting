"use client";
import { useReadContract, useReadContracts } from "wagmi";
import { formatEther } from "viem";
import { vestingVaultContract, vestingTokenContract, VESTING_VAULT_ADDRESS } from "@/lib/contracts";

export function useVestingSchedule(beneficiary?: `0x${string}`) {
  const { data, isLoading, refetch } = useReadContract({
    ...vestingVaultContract,
    functionName: "getScheduleDetails",
    args: [beneficiary as `0x${string}`],
    query: { enabled: !!beneficiary },
  });

  if (!data) return { schedule: null, isLoading, refetch };

  const [totalAmount, claimedAmount, claimableNow, vestedSoFar, cliffEndsAt, vestingEndsAt, isRevoked] = data;

  return {
    schedule: {
      totalAmount: formatEther(totalAmount),
      claimedAmount: formatEther(claimedAmount),
      claimableNow: formatEther(claimableNow),
      vestedSoFar: formatEther(vestedSoFar),
      cliffEndsAt: new Date(Number(cliffEndsAt) * 1000),
      vestingEndsAt: new Date(Number(vestingEndsAt) * 1000),
      isRevoked,
      // Raw bigints for comparison
      totalAmountRaw: totalAmount,
      claimedAmountRaw: claimedAmount,
      claimableNowRaw: claimableNow,
      vestedSoFarRaw: vestedSoFar,
    },
    isLoading,
    refetch,
  };
}

export function useVaultStats() {
  const { data, isLoading } = useReadContracts({
    contracts: [
      { ...vestingVaultContract, functionName: "totalLockedTokens" },
      { ...vestingVaultContract, functionName: "owner" },
      { ...vestingTokenContract, functionName: "balanceOf", args: [VESTING_VAULT_ADDRESS] },
      { ...vestingTokenContract, functionName: "totalSupply" },
    ],
  });

  if (!data) return { stats: null, isLoading };

  const [totalLocked, owner, vaultBalance, totalSupply] = data.map(d => d.result);

  return {
    stats: {
      totalLockedTokens: totalLocked ? formatEther(totalLocked as bigint) : "0",
      owner: owner as `0x${string}` | undefined,
      vaultBalance: vaultBalance ? formatEther(vaultBalance as bigint) : "0",
      totalSupply: totalSupply ? formatEther(totalSupply as bigint) : "0",
    },
    isLoading,
  };
}
