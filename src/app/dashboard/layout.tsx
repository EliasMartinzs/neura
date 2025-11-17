import { ModalProvider } from "@/providers/modal-provider";
import React from "react";
import { Header } from "./_components/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-2 lg:px-6">
      <Header />

      <div>{children}</div>
      <ModalProvider />
    </div>
  );
}
