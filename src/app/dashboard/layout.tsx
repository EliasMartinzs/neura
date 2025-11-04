import React from "react";
import Header from "./_components/header";
import { ModalProvider } from "@/providers/modal-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <Header />

      <div className="pt-28 m-2 md:m-4 lg:m-6 xl:m-10">{children}</div>
      <ModalProvider />
    </div>
  );
}
