"use client";

import { ModalBackdrop } from "../common/ModalBackdrop";

interface CancelOrderModalProps {
  open: boolean;
  seatNumber: string;
  cancelling: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelOrderModal({
  open,
  seatNumber,
  cancelling,
  onClose,
  onConfirm,
}: CancelOrderModalProps) {
  return (
    <ModalBackdrop
      open={open}
      label="Konfirmasi Batalkan Pesanan"
      onClose={cancelling ? undefined : onClose}
    >
      <div className="w-full max-w-[440px] rounded-2xl border border-[#334155] bg-[#161F30] p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-[#F8FAFC]">Batalkan pesanan?</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
          Kursi {seatNumber} akan dilepas. Kamu harus memilih jadwal dan kursi
          lagi jika ingin memesan.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={cancelling}
            onClick={onClose}
            className="h-11 rounded-xl border border-[#334155] bg-[#0B1120] px-4 text-sm font-semibold text-[#F8FAFC] transition hover:border-[#475569] disabled:opacity-60"
          >
            Kembali
          </button>
          <button
            type="button"
            disabled={cancelling}
            onClick={onConfirm}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#7A271A] px-4 text-sm font-semibold text-[#F8FAFC] transition hover:bg-[#991B1B] disabled:opacity-60"
          >
            {cancelling ? "Membatalkan..." : "Batalkan Pesanan"}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}
