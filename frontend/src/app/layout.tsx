import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui";

export const metadata: Metadata = {
  title: "TokenVest — Enterprise Token Vesting & Treasury",
  description:
    "Secure, transparent token distribution with cliff + linear vesting, multi-signature treasury management, and real-time analytics.",
  keywords: ["token vesting", "treasury management", "web3", "blockchain", "smart contracts", "DeFi"],
  authors: [{ name: "TokenVest" }],
  openGraph: {
    title: "TokenVest — Enterprise Token Vesting & Treasury",
    description: "Secure, transparent token distribution for Web3 projects.",
    type: "website",
    locale: "en_US",
    siteName: "TokenVest",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
