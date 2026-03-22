import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { mainnet, sepolia } from "viem/chains";
import { http } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo_project_id";

const metadata = {
  name: "Token Vesting",
  description: "Token Vesting Dashboard",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://localhost:3000",
  icons: [],
};

export const wagmiConfig = defaultWagmiConfig({
  // mainnet is required by Web3Modal for ENS name resolution (syncProfile)
  chains: [sepolia, mainnet],
  projectId,
  metadata,
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});

export { projectId };
