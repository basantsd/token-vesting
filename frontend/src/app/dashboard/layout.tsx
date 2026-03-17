"use client";

import { Header, Sidebar, MainLayout } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout
      connected={false}
      onConnect={() => {
        console.log("Connect wallet");
      }}
      onDisconnect={() => {
        console.log("Disconnect wallet");
      }}
    >
      {children}
    </MainLayout>
  );
}
