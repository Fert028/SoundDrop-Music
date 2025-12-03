"use client";

import { SessionProvider } from "next-auth/react";

interface Providers {
  children: React.ReactNode
}

export default function Providers({ children }:Providers) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}