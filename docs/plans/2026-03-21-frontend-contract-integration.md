# Frontend Contract Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire up the deployed VestingVault and VestingToken contracts into the existing Next.js frontend using wagmi v3 + viem v2 + web3modal.

**Architecture:** Extract ABI arrays into static files, configure wagmi for Sepolia, create reusable hooks for contract reads/writes, then replace mock data in existing dashboard components with live on-chain data. Role-based UI: admin (contract owner) sees create/revoke controls; users see their own schedule + claim button.

**Tech Stack:** Next.js 16, React 19, wagmi v3, viem v2, @web3modal/wagmi v5, Tailwind v4, TypeScript

**Contracts (Sepolia):**
- VestingToken: `0xFeE790B4d3E3a9A63cab4c61e8386BC0a6a030b3`
- VestingVault: `0xB0549319672b4d4AEc46354D0421838A8Eb81eA0`

---

## Task 1: Add ABI files

**Files:**
- Create: `frontend/src/lib/abis/VestingVault.ts`
- Create: `frontend/src/lib/abis/VestingToken.ts`

**Step 1: Create VestingVault ABI**

```typescript
// frontend/src/lib/abis/VestingVault.ts
export const VestingVaultABI = [
  {
    "inputs": [{"internalType": "address","name": "_token","type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "uint256","name": "cliffEndsAt","type": "uint256"},{"internalType": "uint256","name": "currentTime","type": "uint256"}],
    "name": "CliffNotReached","type": "error"
  },
  {
    "inputs": [{"internalType": "uint256","name": "requested","type": "uint256"},{"internalType": "uint256","name": "available","type": "uint256"}],
    "name": "InsufficientVaultBalance","type": "error"
  },
  {"inputs": [],"name": "NothingToClaim","type": "error"},
  {"inputs": [],"name": "ReentrancyGuardReentrantCall","type": "error"},
  {
    "inputs": [{"internalType": "address","name": "beneficiary","type": "address"}],
    "name": "ScheduleAlreadyExists","type": "error"
  },
  {
    "inputs": [{"internalType": "address","name": "beneficiary","type": "address"}],
    "name": "ScheduleNotFound","type": "error"
  },
  {
    "inputs": [{"internalType": "address","name": "beneficiary","type": "address"}],
    "name": "ScheduleRevokedCheck","type": "error"
  },
  {"inputs": [],"name": "ZeroAddress","type": "error"},
  {"inputs": [],"name": "ZeroAmount","type": "error"},
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true,"internalType": "address","name": "beneficiary","type": "address"},
      {"indexed": false,"internalType": "uint256","name": "totalAmount","type": "uint256"},
      {"indexed": false,"internalType": "uint256","name": "cliffDuration","type": "uint256"},
      {"indexed": false,"internalType": "uint256","name": "vestingDuration","type": "uint256"},
      {"indexed": false,"internalType": "uint256","name": "startTime","type": "uint256"}
    ],
    "name": "ScheduleCreated","type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true,"internalType": "address","name": "beneficiary","type": "address"},
      {"indexed": false,"internalType": "uint256","name": "unclaimedAmount","type": "uint256"}
    ],
    "name": "ScheduleRevoked","type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true,"internalType": "address","name": "beneficiary","type": "address"},
      {"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"},
      {"indexed": false,"internalType": "uint256","name": "remainingAmount","type": "uint256"}
    ],
    "name": "TokensClaimed","type": "event"
  },
  {
    "inputs": [],"name": "claim","outputs": [],"stateMutability": "nonpayable","type": "function"
  },
  {
    "inputs": [
      {"internalType": "address","name": "beneficiary","type": "address"},
      {"internalType": "uint256","name": "totalAmount","type": "uint256"},
      {"internalType": "uint256","name": "cliffDuration","type": "uint256"},
      {"internalType": "uint256","name": "vestingDuration","type": "uint256"}
    ],
    "name": "createVestingSchedule","outputs": [],"stateMutability": "nonpayable","type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "beneficiary","type": "address"}],
    "name": "getClaimableAmount",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view","type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "beneficiary","type": "address"}],
    "name": "getScheduleDetails",
    "outputs": [
      {"internalType": "uint256","name": "totalAmount","type": "uint256"},
      {"internalType": "uint256","name": "claimedAmount","type": "uint256"},
      {"internalType": "uint256","name": "claimableNow","type": "uint256"},
      {"internalType": "uint256","name": "vestedSoFar","type": "uint256"},
      {"internalType": "uint256","name": "cliffEndsAt","type": "uint256"},
      {"internalType": "uint256","name": "vestingEndsAt","type": "uint256"},
      {"internalType": "bool","name": "isRevoked","type": "bool"}
    ],
    "stateMutability": "view","type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "beneficiary","type": "address"}],
    "name": "getVestedAmount",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view","type": "function"
  },
  {
    "inputs": [],"name": "owner",
    "outputs": [{"internalType": "address","name": "","type": "address"}],
    "stateMutability": "view","type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "beneficiary","type": "address"}],
    "name": "revokeSchedule","outputs": [],"stateMutability": "nonpayable","type": "function"
  },
  {
    "inputs": [],"name": "token",
    "outputs": [{"internalType": "address","name": "","type": "address"}],
    "stateMutability": "view","type": "function"
  },
  {
    "inputs": [],"name": "totalLockedTokens",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view","type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "","type": "address"}],
    "name": "vestingSchedules",
    "outputs": [
      {"internalType": "uint256","name": "totalAmount","type": "uint256"},
      {"internalType": "uint256","name": "claimedAmount","type": "uint256"},
      {"internalType": "uint256","name": "startTime","type": "uint256"},
      {"internalType": "uint256","name": "cliffDuration","type": "uint256"},
      {"internalType": "uint256","name": "vestingDuration","type": "uint256"},
      {"internalType": "bool","name": "revoked","type": "bool"},
      {"internalType": "bool","name": "exists","type": "bool"}
    ],
    "stateMutability": "view","type": "function"
  }
] as const;
```

**Step 2: Create VestingToken ABI**

```typescript
// frontend/src/lib/abis/VestingToken.ts
export const VestingTokenABI = [
  {
    "inputs": [],"name": "balanceOf",
    "inputs": [{"internalType": "address","name": "account","type": "address"}],
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view","type": "function"
  },
  {
    "inputs": [],"name": "totalSupply",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view","type": "function"
  },
  {
    "inputs": [],"name": "maxSupply",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view","type": "function"
  },
  {
    "inputs": [],"name": "name",
    "outputs": [{"internalType": "string","name": "","type": "string"}],
    "stateMutability": "view","type": "function"
  },
  {
    "inputs": [],"name": "symbol",
    "outputs": [{"internalType": "string","name": "","type": "string"}],
    "stateMutability": "view","type": "function"
  },
  {
    "inputs": [],"name": "paused",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "view","type": "function"
  },
  {
    "inputs": [
      {"internalType": "address","name": "to","type": "address"},
      {"internalType": "uint256","name": "amount","type": "uint256"}
    ],
    "name": "mint","outputs": [],"stateMutability": "nonpayable","type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "amount","type": "uint256"}],
    "name": "burn","outputs": [],"stateMutability": "nonpayable","type": "function"
  },
  {
    "inputs": [],"name": "pause","outputs": [],"stateMutability": "nonpayable","type": "function"
  },
  {
    "inputs": [],"name": "unpause","outputs": [],"stateMutability": "nonpayable","type": "function"
  },
  {
    "inputs": [],"name": "owner",
    "outputs": [{"internalType": "address","name": "","type": "address"}],
    "stateMutability": "view","type": "function"
  }
] as const;
```

**Step 3: Commit**

```bash
git add frontend/src/lib/abis/
git commit -m "feat: add contract ABI files for VestingVault and VestingToken"
```

---

## Task 2: Wagmi config + Web3Modal setup

**Files:**
- Create: `frontend/src/lib/wagmi.ts`
- Modify: `frontend/src/app/layout.tsx`

**Step 1: Create wagmi config**

```typescript
// frontend/src/lib/wagmi.ts
import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const metadata = {
  name: "Token Vesting",
  description: "Token Vesting Dashboard",
  url: "https://localhost:3000",
  icons: [],
};

export const config = defaultWagmiConfig({
  chains: [sepolia],
  projectId,
  metadata,
  transports: {
    [sepolia.id]: http(),
  },
});

createWeb3Modal({ wagmiConfig: config, projectId });
```

**Step 2: Add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to frontend/.env**

```
NEXT_PUBLIC_VESTING_TOKEN_ADDRESS=0xFeE790B4d3E3a9A63cab4c61e8386BC0a6a030b3
NEXT_PUBLIC_VESTING_VAULT_ADDRESS=0xB0549319672b4d4AEc46354D0421838A8Eb81eA0
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

Note: Get a free project ID from cloud.walletconnect.com.

**Step 3: Wrap app in WagmiProvider**

Read `frontend/src/app/layout.tsx` first, then add:

```typescript
// frontend/src/app/layout.tsx  — add at top
"use client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/wagmi";

const queryClient = new QueryClient();

// Wrap children:
<WagmiProvider config={config}>
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
</WagmiProvider>
```

**Step 4: Install @tanstack/react-query (wagmi v3 peer dep)**

```bash
cd frontend && npm install @tanstack/react-query
```

**Step 5: Commit**

```bash
git add frontend/src/lib/wagmi.ts frontend/src/app/layout.tsx frontend/.env frontend/package.json frontend/package-lock.json
git commit -m "feat: configure wagmi + web3modal for Sepolia"
```

---

## Task 3: Contract constants file

**Files:**
- Create: `frontend/src/lib/contracts.ts`

**Step 1: Create contracts.ts**

```typescript
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
```

**Step 2: Commit**

```bash
git add frontend/src/lib/contracts.ts
git commit -m "feat: add contract address + ABI constants"
```

---

## Task 4: useVestingSchedule hook (read-only)

**Files:**
- Create: `frontend/src/hooks/useVestingSchedule.ts`

**Step 1: Create the hook**

```typescript
// frontend/src/hooks/useVestingSchedule.ts
"use client";
import { useReadContract, useReadContracts } from "wagmi";
import { formatEther } from "viem";
import { vestingVaultContract, vestingTokenContract } from "@/lib/contracts";

export function useVestingSchedule(beneficiary?: `0x${string}`) {
  const { data, isLoading, refetch } = useReadContract({
    ...vestingVaultContract,
    functionName: "getScheduleDetails",
    args: beneficiary ? [beneficiary] : undefined,
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
      totalAmountRaw: totalAmount,
      claimedAmountRaw: claimedAmount,
      claimableNowRaw: claimableNow,
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
      { ...vestingTokenContract, functionName: "balanceOf", args: [vestingVaultContract.address] },
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
```

**Step 2: Commit**

```bash
git add frontend/src/hooks/useVestingSchedule.ts
git commit -m "feat: add useVestingSchedule and useVaultStats hooks"
```

---

## Task 5: useVestingActions hook (write transactions)

**Files:**
- Create: `frontend/src/hooks/useVestingActions.ts`

**Step 1: Create the hook**

```typescript
// frontend/src/hooks/useVestingActions.ts
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

  const createSchedule = (
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

  return { createSchedule, isPending, isConfirming, isSuccess, error, hash };
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
```

**Step 2: Commit**

```bash
git add frontend/src/hooks/useVestingActions.ts
git commit -m "feat: add useClaim, useCreateVestingSchedule, useRevokeSchedule hooks"
```

---

## Task 6: ConnectWallet button component

**Files:**
- Create: `frontend/src/components/ConnectWallet.tsx`

**Step 1: Create component**

```typescript
// frontend/src/components/ConnectWallet.tsx
"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui";

export function ConnectWallet() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();

  if (isConnected && address) {
    return (
      <Button variant="secondary" onClick={() => open()}>
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button onClick={() => open()}>
      Connect Wallet
    </Button>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/components/ConnectWallet.tsx
git commit -m "feat: add ConnectWallet button using web3modal"
```

---

## Task 7: Wire up AdminDashboard with live data

**Files:**
- Modify: `frontend/src/components/dashboard/AdminDashboard.tsx`

**Step 1: Replace mock StatsGrid with live data**

Replace the hardcoded `StatsGrid` export to use `useVaultStats`:

```typescript
// In AdminDashboard.tsx — update StatsGrid
"use client";
import { useAccount } from "wagmi";
import { useVaultStats } from "@/hooks/useVestingSchedule";

export function StatsGrid() {
  const { stats, isLoading } = useVaultStats();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Locked"
        value={isLoading ? "..." : `${Number(stats?.totalLockedTokens ?? 0).toLocaleString()} VTK`}
        icon={TrendingUp}
        iconColor="text-accent-primary"
      />
      <StatCard
        title="Vault Balance"
        value={isLoading ? "..." : `${Number(stats?.vaultBalance ?? 0).toLocaleString()} VTK`}
        icon={Wallet}
        iconColor="text-success"
      />
      <StatCard
        title="Total Supply"
        value={isLoading ? "..." : `${Number(stats?.totalSupply ?? 0).toLocaleString()} VTK`}
        icon={Clock}
        iconColor="text-info"
      />
      <StatCard
        title="Contract Owner"
        value={stats?.owner ? `${stats.owner.slice(0,6)}...${stats.owner.slice(-4)}` : "..."}
        icon={Users}
        iconColor="text-warning"
      />
    </div>
  );
}
```

**Step 2: Remove mock schedules from VestingScheduleList**

Since the contract doesn't have a way to enumerate all schedules (no array), the VestingScheduleList should instead show a "lookup by address" input for admin, and show the result of `getScheduleDetails` for that address.

Update `VestingScheduleList` to include an address input + lookup:

```typescript
export function VestingScheduleList() {
  const [lookupAddress, setLookupAddress] = React.useState<`0x${string}` | undefined>();
  const [inputValue, setInputValue] = React.useState("");
  const { schedule, isLoading } = useVestingSchedule(lookupAddress);
  const { revokeSchedule, isPending } = useRevokeSchedule();

  const handleLookup = () => {
    if (inputValue.startsWith("0x") && inputValue.length === 42) {
      setLookupAddress(inputValue as `0x${string}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-display-sm font-display font-semibold text-text-primary">
          Vesting Schedules
        </h2>
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border border-border-primary bg-background-secondary px-3 py-2 text-body-sm text-text-primary"
          placeholder="0x... beneficiary address"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <Button onClick={handleLookup}>Lookup</Button>
      </div>
      {isLoading && <p className="text-text-muted">Loading...</p>}
      {schedule && lookupAddress && (
        <VestingScheduleCard
          address={lookupAddress}
          schedule={schedule}
          onRevoke={() => revokeSchedule(lookupAddress)}
          isRevoking={isPending}
        />
      )}
      {lookupAddress && !isLoading && !schedule && (
        <p className="text-text-muted text-body-sm">No schedule found for this address.</p>
      )}
    </div>
  );
}
```

Update `VestingScheduleCard` props to accept the live schedule shape.

**Step 3: Commit**

```bash
git add frontend/src/components/dashboard/AdminDashboard.tsx
git commit -m "feat: replace mock data in AdminDashboard with live contract reads"
```

---

## Task 8: Create VestingSchedule form (admin create)

**Files:**
- Create: `frontend/src/components/dashboard/CreateScheduleModal.tsx`
- Modify: `frontend/src/app/dashboard/page.tsx`

**Step 1: Create modal form**

```typescript
// frontend/src/components/dashboard/CreateScheduleModal.tsx
"use client";
import * as React from "react";
import { useCreateVestingSchedule } from "@/hooks/useVestingActions";
import { Button, Modal } from "@/components/ui";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateScheduleModal({ open, onClose }: Props) {
  const [beneficiary, setBeneficiary] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [cliffDays, setCliffDays] = React.useState("180");
  const [vestingDays, setVestingDays] = React.useState("365");
  const { createSchedule, isPending, isConfirming, isSuccess, error } = useCreateVestingSchedule();

  React.useEffect(() => {
    if (isSuccess) onClose();
  }, [isSuccess, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneficiary.startsWith("0x") || beneficiary.length !== 42) return;
    createSchedule(
      beneficiary as `0x${string}`,
      amount,
      Number(cliffDays),
      Number(vestingDays)
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Vesting Schedule">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-body-sm text-text-secondary">Beneficiary Address</label>
          <input
            className="mt-1 w-full rounded-lg border border-border-primary bg-background-secondary px-3 py-2 text-body-sm text-text-primary"
            placeholder="0x..."
            value={beneficiary}
            onChange={e => setBeneficiary(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-body-sm text-text-secondary">Amount (VTK)</label>
          <input
            className="mt-1 w-full rounded-lg border border-border-primary bg-background-secondary px-3 py-2 text-body-sm text-text-primary"
            placeholder="1000"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-body-sm text-text-secondary">Cliff (days)</label>
            <input
              className="mt-1 w-full rounded-lg border border-border-primary bg-background-secondary px-3 py-2 text-body-sm text-text-primary"
              type="number"
              value={cliffDays}
              onChange={e => setCliffDays(e.target.value)}
            />
          </div>
          <div>
            <label className="text-body-sm text-text-secondary">Vesting Duration (days)</label>
            <input
              className="mt-1 w-full rounded-lg border border-border-primary bg-background-secondary px-3 py-2 text-body-sm text-text-primary"
              type="number"
              value={vestingDays}
              onChange={e => setVestingDays(e.target.value)}
            />
          </div>
        </div>
        {error && (
          <p className="text-body-sm text-error">{(error as Error).message.slice(0, 100)}</p>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isPending || isConfirming}>
            {isPending ? "Confirm in wallet..." : isConfirming ? "Confirming..." : "Create Schedule"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

**Step 2: Wire "Create Schedule" button in dashboard page**

In `frontend/src/app/dashboard/page.tsx`, add state for modal open and render `<CreateScheduleModal>`. Import `useAccount` + `useVaultStats` to conditionally show admin controls only for the owner.

**Step 3: Commit**

```bash
git add frontend/src/components/dashboard/CreateScheduleModal.tsx frontend/src/app/dashboard/page.tsx
git commit -m "feat: add CreateScheduleModal with form validation and tx handling"
```

---

## Task 9: User vesting page (claim tokens)

**Files:**
- Modify: `frontend/src/app/vesting/page.tsx`

**Step 1: Replace vesting page with live user data**

```typescript
// frontend/src/app/vesting/page.tsx
"use client";
import { useAccount } from "wagmi";
import { useVestingSchedule } from "@/hooks/useVestingSchedule";
import { useClaim } from "@/hooks/useVestingActions";
import { Card, CardHeader, CardTitle, CardContent, Button, Progress, Badge } from "@/components/ui";
import { ConnectWallet } from "@/components/ConnectWallet";

export default function VestingPage() {
  const { address, isConnected } = useAccount();
  const { schedule, isLoading, refetch } = useVestingSchedule(address);
  const { claim, isPending, isConfirming, isSuccess, error } = useClaim();

  // Refetch after successful claim
  React.useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess, refetch]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-text-secondary">Connect your wallet to view your vesting schedule</p>
        <ConnectWallet />
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-text-muted">Loading schedule...</p>;
  }

  if (!schedule) {
    return (
      <div className="space-y-4">
        <h1 className="text-display-md font-display font-bold text-text-primary">My Vesting</h1>
        <p className="text-text-secondary">No vesting schedule found for your address.</p>
      </div>
    );
  }

  const total = Number(schedule.totalAmount);
  const claimed = Number(schedule.claimedAmount);
  const claimable = Number(schedule.claimableNow);
  const now = Date.now();
  const cliffPassed = now > schedule.cliffEndsAt.getTime();

  return (
    <div className="space-y-8">
      <h1 className="text-display-md font-display font-bold text-text-primary">My Vesting</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <p className="text-body-sm text-text-secondary">Total Allocation</p>
            <p className="text-display-sm font-bold text-text-primary mt-1">{total.toLocaleString()} VTK</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-body-sm text-text-secondary">Claimed</p>
            <p className="text-display-sm font-bold text-success mt-1">{claimed.toLocaleString()} VTK</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-body-sm text-text-secondary">Available to Claim</p>
            <p className="text-display-sm font-bold text-accent-primary mt-1">{claimable.toLocaleString()} VTK</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vesting Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={claimed} max={total} showValue />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-body-sm">
            <div>
              <p className="text-text-muted">Cliff Ends</p>
              <p className="text-text-primary">{schedule.cliffEndsAt.toLocaleDateString()}</p>
              <Badge variant={cliffPassed ? "success" : "warning"}>{cliffPassed ? "Passed" : "Pending"}</Badge>
            </div>
            <div>
              <p className="text-text-muted">Vesting Ends</p>
              <p className="text-text-primary">{schedule.vestingEndsAt.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-text-muted">Status</p>
              <Badge variant={schedule.isRevoked ? "error" : "success"}>
                {schedule.isRevoked ? "Revoked" : "Active"}
              </Badge>
            </div>
          </div>
          {error && (
            <p className="text-body-sm text-error">{(error as Error).message.slice(0, 120)}</p>
          )}
          <Button
            onClick={claim}
            disabled={isPending || isConfirming || claimable === 0 || schedule.isRevoked}
            className="w-full"
          >
            {isPending ? "Confirm in wallet..." : isConfirming ? "Claiming..." : `Claim ${claimable.toLocaleString()} VTK`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/app/vesting/page.tsx
git commit -m "feat: implement user vesting page with live claim functionality"
```

---

## Task 10: Add ConnectWallet to Navbar/Sidebar

**Files:**
- Modify: `frontend/src/components/layout/Sidebar.tsx`

**Step 1: Read Sidebar.tsx, find wallet area, add ConnectWallet**

Import `ConnectWallet` and render it at the bottom of the sidebar (or top nav). Also import `useAccount` to show the connected address.

**Step 2: Commit**

```bash
git add frontend/src/components/layout/Sidebar.tsx
git commit -m "feat: add ConnectWallet button to sidebar"
```

---

## Task 11: Role-based UI guard (admin vs user)

**Files:**
- Create: `frontend/src/hooks/useIsAdmin.ts`
- Modify: `frontend/src/app/dashboard/page.tsx`

**Step 1: Create useIsAdmin hook**

```typescript
// frontend/src/hooks/useIsAdmin.ts
"use client";
import { useAccount, useReadContract } from "wagmi";
import { vestingVaultContract } from "@/lib/contracts";

export function useIsAdmin() {
  const { address } = useAccount();
  const { data: owner } = useReadContract({
    ...vestingVaultContract,
    functionName: "owner",
  });

  return {
    isAdmin: address && owner ? address.toLowerCase() === (owner as string).toLowerCase() : false,
    owner: owner as `0x${string}` | undefined,
  };
}
```

**Step 2: Use in dashboard page**

In `dashboard/page.tsx`, call `useIsAdmin()` and conditionally show "Create Schedule" button and admin controls only when `isAdmin === true`.

**Step 3: Commit**

```bash
git add frontend/src/hooks/useIsAdmin.ts frontend/src/app/dashboard/page.tsx
git commit -m "feat: add role-based UI — admin controls only shown to contract owner"
```

---

## Verification

After all tasks complete, run:

```bash
cd frontend && npm run dev
```

Manual checklist:
- [ ] Landing page loads without errors
- [ ] "Connect Wallet" opens Web3Modal
- [ ] After connecting, dashboard shows live VTK stats from Sepolia
- [ ] Admin wallet sees "Create Schedule" button and modal
- [ ] Non-admin wallet does NOT see admin controls
- [ ] Vesting page shows schedule for connected wallet
- [ ] Claim button is enabled when `claimableNow > 0`
- [ ] Revoke button (admin lookup) triggers MetaMask tx
