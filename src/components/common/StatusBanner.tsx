"use client";

import { AlertTriangle, RefreshCw, X } from "lucide-react";

interface StatusBannerProps {
  variant: "warning" | "error";
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function StatusBanner({
  variant,
  message,
  onRetry,
  onDismiss,
}: StatusBannerProps) {
  const isError = variant === "error";

  return (
    <div
      role="alert"
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs sm:text-sm ${
        isError
          ? "border-[#7A271A] bg-[#7A271A]/25 text-[#FECACA]"
          : "border-[#7A2E0E] bg-[#7A2E0E]/25 text-[#FEDF89]"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle
          className={`mt-0.5 h-4 w-4 shrink-0 ${
            isError ? "text-[#EF4444]" : "text-[#F59E0B]"
          }`}
        />
        <span>{message}</span>
      </div>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-lg border border-current/25 bg-[#0B1120]/50 px-3 py-1.5 text-xs font-medium transition hover:bg-[#0B1120]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Coba Koneksi Live API
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Tutup pesan"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
