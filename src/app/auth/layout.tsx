import React from "react";
import { Header } from "./_components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Header />

      <div className="h-full flex items-center justify-center">{children}</div>
    </div>
  );
}
