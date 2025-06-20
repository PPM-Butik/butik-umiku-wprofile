"use client";

import type React from "react";

import { useIdleTimer } from "@/hooks/use-idle-timer";
import { useSession } from "next-auth/react";

export function IdleProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  // Only activate idle timer if user is logged in
  useIdleTimer({
    timeout: 25 * 60 * 1000, // 25 minutes
    onIdle: () => {
      console.log("User is idle - will logout soon");
    },
    onActive: () => {
      console.log("User is active again");
    },
  });

  return <>{children}</>;
}
