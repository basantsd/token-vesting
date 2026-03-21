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
    address.toLowerCase() === owner.toLowerCase();

  return {
    isAdmin,
    owner,
  };
}
