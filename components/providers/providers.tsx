"use client";

import type React from "react";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { IdleProvider } from "./idle-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange={false}
      >
        <IdleProvider>
          {children}
          <Toaster position="top-right" />
        </IdleProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
