import React, { Suspense } from "react";

export default function LayoutDeck({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<></>}>{children}</Suspense>;
}
