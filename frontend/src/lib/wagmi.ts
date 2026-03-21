import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { sepolia } from "viem/chains";
import { http } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo_project_id";

const metadata = {
  name: "Token Vesting",
  description: "Token Vesting Dashboard",
  url: "https://localhost:3000",
  icons: [],
};

export const wagmiConfig = defaultWagmiConfig({
  chains: [sepolia],
  projectId,
  metadata,
  transports: {
    [sepolia.id]: http(),
  },
});

export { projectId };
