"use client";

import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { formatLongDateId, formatTimeWib } from "@/lib/format";
import { ModalBackdrop } from "../common/ModalBackdrop";

interface PaymentSuccessModalProps {
  open: boolean;
  movieTitle: string;
  startsAt: string;
  bookingId: string;
  seatNumber: string;
}

export function PaymentSuccessModal({
  open,
  movieTitle,
  startsAt,
  bookingId,
  seatNumber,
}: PaymentSuccessModalProps) {
  return (
    <ModalBackdrop
      open={open}
      label="Pembayaran Berhasil"
      closeOnBackdrop={false}
    >
      <div className="w-full max-w-[460px] rounded-2xl border border-[#334155] bg-[#161F30] p-7 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#14532D] text-[#86EFAC]">
          <Check className="h-7 w-7 stroke-[2.5]" />
        </div>

        <h3 className="mt-5 text-2xl font-bold text-[#F8FAFC]">
          Pembayaran Berhasil!
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
          Tiket {movieTitle} untuk {formatLongDateId(startsAt)} pukul{" "}
          {formatTimeWib(startsAt)} telah dikonfirmasi.
        </p>

        <div className="mt-5 flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#0B1120] px-5 py-4 text-left">
          <div>
            <p className="text-xs text-[#94A3B8]">Kode Booking</p>
            <p className="mt-0.5 text-xl font-bold text-[#F8FAFC]">
              {bookingId}
            </p>
          </div>
          <p className="text-sm font-semibold text-[#F8FAFC]">
            Kursi {seatNumber}
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-5 text-sm font-semibold text-[#0B1120] transition hover:bg-[#16A34A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </ModalBackdrop>
  );
}
