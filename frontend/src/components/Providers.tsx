"use client";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WagmiProvider, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AppProgressBar } from "next-nprogress-bar";
import { wagmiConfig, projectId } from "@/lib/wagmi";

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableOnramp: false,   // requires paid WalletConnect cloud plan
  enableAnalytics: false, // requires valid cloud project ID
});

function WrongNetworkBanner() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  if (chainId === sepolia.id || chainId === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-orange-500 text-white text-center py-2 px-4 text-sm font-medium">
      Wrong network — please switch to Sepolia.{" "}
      <button
        className="underline font-semibold"
        onClick={() => switchChain({ chainId: sepolia.id })}
      >
        Switch now
      </button>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  // reconnectOnMount=false: prevents wagmi calling eth_requestAccounts on page load
  // which conflicts with MetaMask when user manually clicks Connect (-32002 error)
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <AppProgressBar
          height="3px"
          color="#10B981"
          options={{ showSpinner: false }}
          shallowRouting
        />
        <WrongNetworkBanner />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
