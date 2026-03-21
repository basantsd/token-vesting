"use client";
import { useAccount, useReadContract } from "wagmi";
import { vestingVaultContract } from "@/lib/contracts";

export function useIsAdmin() {
  const { address } = useAccount();
  const { data: owner } = useReadContract({
    ...vestingVaultContract,
    functionName: "owner",
  });

  const isAdmin =
    !!address &&
    !!owner &&
    address.toLowerCase() === (owner as string).toLowerCase();

  return {
    isAdmin,
    owner: owner as `0x${string}` | undefined,
  };
}
