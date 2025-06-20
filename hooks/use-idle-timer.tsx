"use client";

import { useEffect, useRef, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

interface UseIdleTimerProps {
  timeout?: number; // in milliseconds
  onIdle?: () => void;
  onActive?: () => void;
  events?: string[];
}

export function useIdleTimer({
  timeout = 25 * 60 * 1000, // 25 minutes default
  onIdle,
  onActive,
  events = [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
    "click",
  ],
}: UseIdleTimerProps = {}) {
  const { data: session } = useSession();
  const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined)
const warningTimeoutId = useRef<NodeJS.Timeout | undefined>(undefined)
  const isIdle = useRef(false);

  const handleLogout = useCallback(async () => {
    if (session) {
      toast.error("Sesi berakhir karena tidak ada aktivitas", {
        description: "Anda akan diarahkan ke halaman login",
      });

      setTimeout(() => {
        signOut({
          callbackUrl: "/auth/signin?message=session-expired",
          redirect: true,
        });
      }, 2000);
    }
  }, [session]);

  const showWarning = useCallback(() => {
    if (session) {
      toast.warning("Sesi akan berakhir dalam 5 menit", {
        description: "Lakukan aktivitas untuk memperpanjang sesi",
        duration: 10000,
        action: {
          label: "Perpanjang",
          onClick: () => resetTimer(),
        },
      });
    }
  }, [session]);

  const resetTimer = useCallback(() => {
    if (!session) return;

    // Clear existing timers
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    if (warningTimeoutId.current) {
      clearTimeout(warningTimeoutId.current);
    }

    // Set warning timer (5 minutes before logout)
    warningTimeoutId.current = setTimeout(() => {
      showWarning();
    }, timeout - 5 * 60 * 1000); // 5 minutes before timeout

    // Set logout timer
    timeoutId.current = setTimeout(() => {
      if (!isIdle.current) {
        isIdle.current = true;
        onIdle?.();
        handleLogout();
      }
    }, timeout);

    // Mark as active
    if (isIdle.current) {
      isIdle.current = false;
      onActive?.();
    }
  }, [timeout, onIdle, onActive, session, handleLogout, showWarning]);

  useEffect(() => {
    if (!session) return;

    // Set initial timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, resetTimer, true);
    });

    // Cleanup
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      if (warningTimeoutId.current) {
        clearTimeout(warningTimeoutId.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [session, resetTimer, events]);

  return {
    isIdle: isIdle.current,
    resetTimer,
  };
}
