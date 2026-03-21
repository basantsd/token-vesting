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
