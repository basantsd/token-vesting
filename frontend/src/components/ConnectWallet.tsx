"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { useState } from "react";
import { Button } from "@/components/ui";

export function ConnectWallet() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const [pending, setPending] = useState(false);

  async function handleConnect() {
    if (pending) return;
    setPending(true);
    try {
      await open();
    } catch (err: unknown) {
      // MetaMask -32002: already processing a request — user needs to open MetaMask
      const code = (err as { code?: number })?.code;
      if (code === -32002) {
        alert("MetaMask has a pending request. Open MetaMask and approve or reject it first.");
      }
    } finally {
      setPending(false);
    }
  }

  if (isConnected && address) {
    return (
      <Button variant="secondary" onClick={handleConnect} disabled={pending}>
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={pending}>
      {pending ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
