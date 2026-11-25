"use client";

import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { ModalBackdrop } from "../common/ModalBackdrop";

interface PaymentFailureModalProps {
  message: string | null;
  onRetry: () => void;
}

export function PaymentFailureModal({
  message,
  onRetry,
}: PaymentFailureModalProps) {
  return (
    <ModalBackdrop
      open={Boolean(message)}
      label="Pembayaran Gagal"
      onClose={onRetry}
    >
      <div className="w-full max-w-[460px] rounded-2xl border border-[#334155] bg-[#161F30] p-7 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#7A271A] text-[#FECACA]">
          <X className="h-7 w-7 stroke-[2.5]" />
        </div>

        <h3 className="mt-5 text-2xl font-bold text-[#F8FAFC]">
          Pembayaran Gagal
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{message}</p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#22C55E] px-5 text-sm font-semibold text-[#0B1120] transition hover:bg-[#16A34A]"
          >
            Coba Lagi
          </button>

          <Link
            href="/"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#334155] bg-[#0B1120] px-5 text-sm font-semibold text-[#F8FAFC] transition hover:border-[#475569]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </ModalBackdrop>
  );
}
