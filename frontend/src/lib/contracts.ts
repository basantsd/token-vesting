// frontend/src/lib/contracts.ts
import { VestingVaultABI } from "./abis/VestingVault";
import { VestingTokenABI } from "./abis/VestingToken";

function requireAddress(envVar: string | undefined, name: string): `0x${string}` {
  if (!envVar || !envVar.startsWith("0x")) {
    throw new Error(`Missing or invalid env var: ${name}. Must be a 0x address.`);
  }
  return envVar as `0x${string}`;
}

export const VESTING_VAULT_ADDRESS = requireAddress(
  process.env.NEXT_PUBLIC_VESTING_VAULT_ADDRESS,
  "NEXT_PUBLIC_VESTING_VAULT_ADDRESS"
);
export const VESTING_TOKEN_ADDRESS = requireAddress(
  process.env.NEXT_PUBLIC_VESTING_TOKEN_ADDRESS,
  "NEXT_PUBLIC_VESTING_TOKEN_ADDRESS"
);

export const vestingVaultContract = {
  address: VESTING_VAULT_ADDRESS,
  abi: VestingVaultABI,
} as const;

export const vestingTokenContract = {
  address: VESTING_TOKEN_ADDRESS,
  abi: VestingTokenABI,
} as const;
