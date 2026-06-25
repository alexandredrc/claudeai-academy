"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Re-runs the server component (re-fetches the live queue) every `intervalMs`,
 * and immediately on tab focus. Shows a small "live" pulse + seconds since refresh.
 */
export function AutoRefresh({ intervalMs = 20000 }: { intervalMs?: number }) {
  const router = useRouter();
  const [secsAgo, setSecsAgo] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => setSecsAgo((s) => s + 1), 1000);
    const refresh = setInterval(() => {
      router.refresh();
      setSecsAgo(0);
    }, intervalMs);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
        setSecsAgo(0);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(tick);
      clearInterval(refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router, intervalMs]);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[12px] text-muted">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
      </span>
      Auto-actualisé · il y a {secsAgo}s
    </span>
  );
}
