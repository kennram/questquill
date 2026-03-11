"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Extend window interface
declare global {
  interface Window {
    logQuestEvent: (eventType: string, metadata?: any) => Promise<void>;
  }
}

export default function ActivityTracker() {
  const pathname = usePathname();
  const lastPathname = useRef<string>("");

  useEffect(() => {
    // Expose global tracker
    window.logQuestEvent = async (eventType: string, metadata: any = {}) => {
      await logActivity(eventType, window.location.pathname, metadata);
    };

    // 1. Log Page View whenever path changes
    if (pathname !== lastPathname.current) {
      logActivity("page_view", pathname);
      lastPathname.current = pathname;
    }

    // 2. Set up Heartbeat (every 60 seconds)
    const interval = setInterval(() => {
      logActivity("heartbeat", pathname);
    }, 60000);

    return () => clearInterval(interval);
  }, [pathname]);

  async function logActivity(eventType: string, path: string, metadata: any = {}) {
    try {
      await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          path,
          metadata: {
            ...metadata,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        }),
      });
    } catch (err) {
      // Fail silently
      console.error("Tracking failed:", err);
    }
  }

  return null;
}
