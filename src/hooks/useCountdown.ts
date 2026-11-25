"use client";

import { useEffect, useState } from "react";

function computeRemainingMs(expiresAt?: string): number {
  if (!expiresAt) return 0;
  const target = Date.parse(expiresAt);
  if (Number.isNaN(target)) return 0;
  return Math.max(0, target - Date.now());
}

export function useCountdown(expiresAt: string | undefined, active: boolean) {
  const [remainingMs, setRemainingMs] = useState<number>(() =>
    computeRemainingMs(expiresAt)
  );

  useEffect(() => {
    if (!expiresAt || !active) return;

    const timer = setInterval(() => {
      setRemainingMs(computeRemainingMs(expiresAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, active]);

  return {
    remainingMs,
    isExpired: active && remainingMs <= 0,
  };
}
