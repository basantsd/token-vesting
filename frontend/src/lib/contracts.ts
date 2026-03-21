// frontend/src/lib/contracts.ts
import { VestingVaultABI } from "./abis/VestingVault";
import { VestingTokenABI } from "./abis/VestingToken";

export const VESTING_VAULT_ADDRESS = process.env.NEXT_PUBLIC_VESTING_VAULT_ADDRESS as `0x${string}`;
export const VESTING_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_VESTING_TOKEN_ADDRESS as `0x${string}`;

export const vestingVaultContract = {
  address: VESTING_VAULT_ADDRESS,
  abi: VestingVaultABI,
} as const;

export const vestingTokenContract = {
  address: VESTING_TOKEN_ADDRESS,
  abi: VestingTokenABI,
} as const;
